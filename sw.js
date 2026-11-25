/* 셀프 042 (아이패드 부스) — 오프라인 캐시.
   앱 내용을 고치고 아이패드에 반영되지 않으면 아래 CACHE 번호를 올리세요. */
const CACHE = "self042-v63";
const SHELL = ["./", "./index.html", "./app.js", "./camera-check.html", "./manifest.json", "./icon-180.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      // 같은 주소(github.io)의 부스 앱 캐시(booth-…)는 지우지 않습니다
      .then((keys) => Promise.all(keys.filter((k) => k.indexOf("self042-") === 0 && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // 이 앱의 파일과 폰트만 다룹니다. 맥의 인화 서버(사진 목록 /photos, 사진, 프린터 상태)는 늘 새로 받아야 합니다.
  // 여기서 캐시하면 처음 받은 옛 목록만 돌려줘서 새 사진이 영영 안 뜹니다.
  const u = new URL(req.url);
  if (u.origin !== self.location.origin && u.hostname !== "fonts.googleapis.com" && u.hostname !== "fonts.gstatic.com") return;

  // 앱 화면 파일(페이지·app.js·manifest)은 인터넷 먼저: 새로 올린 버전이 새로고침 한 번에 바로 나옵니다(사용자 요청).
  // 받으면 캐시도 새것으로 바꿔 두고, 인터넷이 끊겼을 때만 캐시를 씁니다.
  const shell = u.origin === self.location.origin && (req.mode === "navigate" || /\/(index\.html|app\.js|manifest\.json|camera-check\.html)?$/.test(u.pathname));
  if (shell){
    e.respondWith(
      fetch(req, { cache: "no-store" }).then((res) => {
        if (res && res.status === 200){ const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  // 스티커·프레임 그림·폰트는 받아온 뒤 캐시에 쌓아 둡니다 (두 번째부터 오프라인 동작)
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

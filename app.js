(function(){
"use strict";

/* ══════════════════════════════════════════
   설정 — 모든 인화 디자인이 여기 한 덩어리에 들어 있고,
   관리자 화면에서 고친 내용이 그대로 이 구조로 저장됩니다.
   ══════════════════════════════════════════ */
function defaultConfig(){
  return {
    version: 26,
    brand: "STUDIO 042",
    timer: 5,
    filter: "bright",
    blurPx: 17,          // 잡티 흐림 반지름 — 카메라 사진(긴 쪽 1600px) 기준 가우시안 px
    slim: { amount:0, x:50, y:45, size:35 },   // 얼굴 줄이기(유동화) — 세기, 가운데 위치 %, 범위 %
    cameraId: null,
    // 인스탁스는 이 아이패드 부스에서 쓰지 않습니다(사용자 요청). 주소를 비워 두어 인스탁스 화면이 안 나옵니다.
    instax: { relay:"", live:false },
    shootMode: "pick",   // 한 팀 10장 찍고 골라 넣기(사용자 요청)
    theme: "dark",       // 손님 화면 디자인: light 밝음 / vintage 빈티지 / dark 다크 시크 (관리자에서 고름, 사용자 요청)
    filters: defaultFilters(),
    backgrounds: [],     // 배경 목록 {id,name,h,v}
    bgId: null,          // 지금 고른 배경 (모든 인화 방식이 함께 씁니다)
    layouts: [
      /* 포토샵 "인생네컷세로 5x7.jsx" 와 같은 숫자입니다. 5×7 세로(1500 × 2100), 빈티지 필름 띠 2줄 × 정사각형 4칸.
         띠 폭 750, 사진 486, 양옆 띠 132, 칸 사이 30, 위아래 끝 33 (4 × 486 + 3 × 30 = 2034 ≤ 2100).
         8칸에 서로 다른 사진 8장이 들어갑니다(10장 중 8장 고르기, 사용자 요청). 띠 모양은 style "film" 이 그립니다(drawFilm). */
      {
        id: "film8", name: "인생네컷 세로", enabled: true, instax: false, style: "film",
        canvas: { w:1500, h:2100 },
        frame: null,
        slots: [
          {x:132, y:33,   w:486, h:486, shot:0},
          {x:132, y:549,  w:486, h:486, shot:1},
          {x:132, y:1065, w:486, h:486, shot:2},
          {x:132, y:1581, w:486, h:486, shot:3},
          {x:882, y:33,   w:486, h:486, shot:4},
          {x:882, y:549,  w:486, h:486, shot:5},
          {x:882, y:1065, w:486, h:486, shot:6},
          {x:882, y:1581, w:486, h:486, shot:7}
        ],
        texts: [],
        cut: { on:true, x:750, color:"#DE9240" }   // 가운데 절취선, 필름 글씨색 (사용자 요청)
      },
      /* 옛날필름 4컷 — 인생네컷 세로와 같은 필름 띠에서 사진 사이 띠를 없애 위아래로 붙인 판(사용자 요청, 견본 B "세로로 늘림").
         칸 486 × 506, 칸 사이 2px(얇은 테 선만), 위 끝 33 (33 + 4 × 506 + 3 × 2 = 2063 ≤ 2100). 10장 중 서로 다른 8장을 고릅니다. */
      {
        id: "film8t", name: "옛날필름 4컷", enabled: true, instax: false, style: "film", bwPick: true,   // 고르기 화면에서 컬러·흑백
        canvas: { w:1500, h:2100 },
        frame: null,
        slots: [
          {x:132, y:33,   w:486, h:506, shot:0},
          {x:132, y:541,  w:486, h:506, shot:1},
          {x:132, y:1049, w:486, h:506, shot:2},
          {x:132, y:1557, w:486, h:506, shot:3},
          {x:882, y:33,   w:486, h:506, shot:4},
          {x:882, y:541,  w:486, h:506, shot:5},
          {x:882, y:1049, w:486, h:506, shot:6},
          {x:882, y:1557, w:486, h:506, shot:7}
        ],
        texts: [],
        cut: { on:true, x:750, color:"#DE9240" }
      },
      /* 포토샵 "흑백 3컷 띠 5x7.jsx" 와 같은 숫자입니다. 5×7 세로, 검은 띠(#202020) 2줄 × 흑백 사진 3칸.
         띠 폭 750, 사진 644 × 666, 양옆 테 53, 위아래 테 31, 사진 사이 20 (31 + 666×3 + 20×2 + 31 = 2100), 모서리 둥글기 16.
         두 줄에 같은 사진 3장이 들어가서 가운데를 자르면 2.5×7 띠가 두 장 나옵니다. 흑백은 look "bwstrip" 이 입힙니다. */
      {
        id: "bw3", name: "흑백 3컷 띠", enabled: true, instax: false, style: "bw", look: "bwstrip", shots: 6,
        canvas: { w:1500, h:2100 },
        frame: null,
        slots: [
          {x:53,  y:31,   w:644, h:666, shot:0, r:16},
          {x:53,  y:717,  w:644, h:666, shot:1, r:16},
          {x:53,  y:1403, w:644, h:666, shot:2, r:16},
          {x:803, y:31,   w:644, h:666, shot:0, r:16},
          {x:803, y:717,  w:644, h:666, shot:1, r:16},
          {x:803, y:1403, w:644, h:666, shot:2, r:16}
        ],
        texts: [],
        cut: { on:true, x:750, color:"#6A6A6A" }   // 가운데 절취선, 회색 (사용자 요청)
      },
      /* 흑백 3컷 붙임 — 서울숲 빈티지 포토부스 릴스처럼 흑백 사진 3장을 띠에 위아래로 붙인 판(사용자 요청, 견본 A).
         검은 테 40, 사진 670 × 670, 사진 사이 4px 가는 선 (40 + 3 × 670 + 2 × 4 = 2058 ≤ 2100). 필름 입자·어두운 모서리(style "bwv").
         흑백 3컷 띠처럼 3장을 골라 두 줄에 같은 사진이 들어갑니다. */
      {
        id: "bw3s", name: "흑백 3컷 붙임", enabled: true, instax: false, style: "bwv", look: "bwstrip", shots: 6, bg: "#121212",
        canvas: { w:1500, h:2100 },
        frame: null,
        slots: [
          {x:40,  y:40,   w:670, h:670, shot:0},
          {x:40,  y:714,  w:670, h:670, shot:1},
          {x:40,  y:1388, w:670, h:670, shot:2},
          {x:790, y:40,   w:670, h:670, shot:0},
          {x:790, y:714,  w:670, h:670, shot:1},
          {x:790, y:1388, w:670, h:670, shot:2}
        ],
        texts: [],
        cut: { on:true, x:750, color:"#5A5A5A" }
      },
      /* 카메라 8컷 — 사용자가 준 카메라 이미지 7종으로 만든 프레임 그림(frames/camera8.png, 1500×2100, 바탕은 Y2K 블루 체커(사용자 요청), 검정 카메라는 두 번).
         칸은 카메라 화면 구멍 자리(둘레 연한 띠를 6px 더 뚫고 바탕도 4px 더 비움, 칸은 그보다 사방 3px 크게, 프레임 그림이 위에 덮임). 10장 중 서로 다른 8장을 고릅니다(사용자 요청). */
      {
        id: "cam8", name: "카메라 8컷", enabled: true, instax: false, style: "camera", bg: "#BAD8FA",
        canvas: { w:1500, h:2100 },
        frame: null, frameSrc: "frames/camera8.png",
        slots: [
          {x:63, y:120, w:408, h:316, shot:0},
          {x:107, y:705, w:370, h:262, shot:1},
          {x:63, y:1227, w:340, h:259, shot:2},
          {x:77, y:1758, w:335, h:256, shot:3},
          {x:796, y:165, w:359, h:271, shot:4},
          {x:901, y:654, w:299, h:236, shot:5},
          {x:872, y:1205, w:352, h:270, shot:6},
          {x:813, y:1695, w:408, h:316, shot:7}
        ],
        texts: []
      },
      /* 폴라로이드 9컷 — 사용자가 준 9컷 포스터 예시를 글씨·테이프만 빼고 같게(사용자 요청). 프레임 그림 frames/polaroid9.png(1500×2100):
         완전 흰 바탕 위 3×3 카드(416×529, 사이 45). 카드는 인스탁스 와이드 필름을 세로로 세운 모양(둥근 모서리, 한 단 들어간 사진 창,
         왼쪽 두꺼운 여백 73에 "042.s" 볼록 각인). 조명은 예시처럼 왼쪽에서 비춰 그림자가 오른쪽으로 떨어집니다(사용자 요청).
         사진 칸 307×486(세로). 10장 중 서로 다른 9장을 고릅니다. */
      {
        id: "pol9", name: "폴라로이드 9컷", enabled: true, instax: false, style: "frame", bg: "#FFFFFF",
        canvas: { w:1500, h:2100 },
        frame: null, frameSrc: "frames/polaroid9.png",
        slots: [
          {x:154, y:230, w:307, h:486, shot:0},
          {x:615, y:230, w:307, h:486, shot:1},
          {x:1076, y:230, w:307, h:486, shot:2},
          {x:154, y:804, w:307, h:486, shot:3},
          {x:615, y:804, w:307, h:486, shot:4},
          {x:1076, y:804, w:307, h:486, shot:5},
          {x:154, y:1378, w:307, h:486, shot:6},
          {x:615, y:1378, w:307, h:486, shot:7},
          {x:1076, y:1378, w:307, h:486, shot:8}
        ],
        texts: []
      }
    ]
  };
}

/* 보정 한 가지는 숫자 묶음입니다. 같은 숫자로 미리보기(CSS)와
   인화(캔버스)를 똑같이 그리기 때문에 화면에 보이는 게 그대로 나옵니다.
   smooth = 피부 보정, tint = 색감 덧씌우기, fade = 먹색 띄우기 */
function newFilter(over){
  var f = {
    id:"F"+Date.now(), name:"새 보정", enabled:true,
    brightness:100, contrast:100, saturate:100, sepia:0, hue:0,
    smooth:0, detail:70, fade:0, vignette:0, pick:false,
    tint:{ color:"#FFB07A", mode:"soft-light", amount:0 }
  };
  for (var k in (over||{})) f[k]=over[k];
  return f;
}
function defaultFilters(){
  return [
    newFilter({id:"none",   name:"원본"}),
    newFilter({id:"bright", name:"화사하게", brightness:105, contrast:101, saturate:108, smooth:55, detail:72}),
    newFilter({id:"soft",   name:"뽀샤시",   brightness:108, contrast:97,  saturate:104, smooth:85, detail:58, fade:14,
                            tint:{color:"#FFD9C2", mode:"soft-light", amount:18}}),
    newFilter({id:"mono",   name:"흑백",     saturate:0, contrast:110, smooth:48, detail:74}),
    newFilter({id:"film",   name:"필름",     brightness:102, contrast:105, saturate:92, sepia:20,
                            smooth:40, detail:76, fade:16, vignette:22,
                            tint:{color:"#FF9E5E", mode:"soft-light", amount:22}}),
    // 흑백 3컷 띠 프레임 전용(look). 포토샵 "흑백 느낌"(대비 +10, 검은 곳 띄움 12, 흰 곳 235, 푸른빛 4)에 가깝게 맞췄습니다.
    newFilter({id:"bwstrip", name:"흑백 띠", enabled:false, saturate:0, contrast:110, brightness:97, smooth:40, detail:74, fade:10,
                            tint:{color:"#8FB8E8", mode:"soft-light", amount:4}}),
    newFilter({id:"cool",   name:"쿨톤",     brightness:103, contrast:102, saturate:96, smooth:58, detail:70,
                            tint:{color:"#8FB8E8", mode:"soft-light", amount:24}}),
    // 사진 고르기 화면의 색감 버튼(pick). 촬영 화면의 보정 버튼에는 안 나오게 enabled 는 끕니다.
    newFilter({id:"look-color", name:"컬러",  enabled:false, pick:true, smooth:0}),
    newFilter({id:"look-mono",  name:"흑백",  enabled:false, pick:true, smooth:0, saturate:0, contrast:110}),
    newFilter({id:"look-sepia", name:"세피아", enabled:false, pick:true, smooth:0, sepia:85, saturate:92, contrast:104, brightness:102, fade:8})
  ];
}
var BLEND_MODES = [
  {v:"soft-light", n:"은은하게"},
  {v:"overlay",    n:"또렷하게"},
  {v:"multiply",   n:"곱하기"},
  {v:"screen",     n:"밝히기"},
  {v:"color",      n:"색만 입히기"},
  {v:"hard-light", n:"세게"}
];
var TIMERS = [3,5,10];
/* 촬영 방식 — fixed: 칸 수만큼만 찍고 바로 합성 / pick: 여러 장 찍은 뒤 손님이 골라서 합성 */
var SHOOT_MODES = [{id:"fixed", name:"정해진 컷만"}, {id:"pick", name:"많이 찍고 고르기"}];
var PICK_SHOTS = 10;    // 많이 찍고 고르기에서 찍는 장 수 (한 팀 10장, 사용자 요청)
/* 구글 드라이브 QR — drive/Code.gs 를 구글 계정에 올리고 받은 "웹 앱 URL" 을 DRIVE_URL 에 넣습니다(README).
   비어 있으면 QR 을 만들지 않습니다. DRIVE_KEY 는 Code.gs 의 KEY 와 같아야 합니다. */
var DRIVE_URL = "https://script.google.com/macros/s/AKfycbw6wntoNj67kgaV3uMnD_3UoB-w8Eq6c18vqQnuiYfNu10osvVWlUTIS-JW9s3aGoV2bQ/exec";
var DRIVE_KEY = "self042";
var QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";

/* 예전에 저장해둔 설정을 새 기본값에 맞춰 올려줍니다.
   손대지 않은 기본 레이아웃만 바꾸고, 직접 편집했거나 이미지를 올린 것은 그대로 둡니다. */
function migrate(cfg){
  if (!cfg) return cfg;
  // 예전 인화 방식(가로 4컷·세로 4컷·폴라로이드·와이드 2컷)은 쓰지 않아 지웠습니다(사용자 요청).
  // 인스탁스 와이드 프레임 6가지만 남깁니다. 한 번만 지우니, 그 뒤 관리자에서 만든 것은 남습니다.
  if (cfg.version < 17){
    cfg.layouts = (cfg.layouts || []).filter(function(l){ return l.instax; });
    if (!cfg.layouts.length) cfg.layouts = defaultConfig().layouts;
  }
  // 잡티 흐림과 얼굴 줄이기를 나중에 넣었습니다. 없으면 기본값을 채웁니다.
  if (cfg.blurPx === undefined) cfg.blurPx = 17;
  if (!cfg.slim) cfg.slim = defaultConfig().slim;
  // 기본 타이머를 5초로 바꿨습니다. 옛 기본값 3초로 두었던 설정만 올려줍니다.
  if (cfg.version < 9 && cfg.timer === 3) cfg.timer = 5;
  // 인스탁스 부스(설정과 와이드 프레임 6가지)를 나중에 넣었습니다.
  if (!cfg.instax) cfg.instax = defaultConfig().instax;
  if (cfg.version < 11) defaultConfig().layouts.forEach(function(d){
    if (d.instax && !cfg.layouts.some(function(l){ return l.id === d.id; })) cfg.layouts.push(d);
  });
  // 와이드 프레임 6가지를 경계선 없이 꽉 차게, 작은 이름 띠를 넣어 다시 그렸습니다. 프레임 이미지를 올리지 않은 것만 바꿉니다.
  if (cfg.version < 14) defaultConfig().layouts.forEach(function(d){
    if (!d.instax) return;
    cfg.layouts.forEach(function(l){
      if (l.id === d.id && !l.frame){ l.canvas = d.canvas; l.slots = d.slots; l.texts = d.texts; }
    });
  });
  // 이름 띠 글씨를 MEI 부스처럼 굵고 까맣게, 자간을 넓게. 기본 문구 그대로인 글자만 바꿉니다.
  if (cfg.version < 15) cfg.layouts.forEach(function(l){
    if (l.instax) (l.texts||[]).forEach(function(t){
      if (t.content === "042 STUDIO  -  DAEJEON"){ t.size = 20; t.ls = 6; t.weight = 700; t.color = "#111111"; }
    });
  });
  // 대기 화면에서 바로 사진 고르기(맥에서 실시간 받기)를 새로 넣었습니다. 켠 채로 시작합니다(관리자에서 끌 수 있음).
  if (cfg.version < 16 && cfg.instax && cfg.instax.live === undefined) cfg.instax.live = true;
  // 2·4컷 문구를 양 끝으로(가로) · 맨 위와 맨 아래로(세로) 옮겼습니다. 예전 기본 위치 그대로인 것만 바꾸고,
  // 관리자에서 글자를 직접 옮겨 둔 프레임은 그대로 둡니다. 세로는 사진 칸도 예전 기본 크기로 돌립니다.
  if (cfg.version < 19){
    var prevText = {
      wl2: ["26,792,0|1234,792,0"], wl4: ["26,792,0|1234,792,0"],
      wp2: ["70,615,-90|70,1240,-90", "70,1240,-90|775,40,90"],
      wp4: ["70,615,-90|70,1240,-90", "70,1240,-90|775,40,90"]
    };
    defaultConfig().layouts.forEach(function(d){
      if (!prevText[d.id]) return;
      cfg.layouts.forEach(function(l){
        if (l.id !== d.id || l.frame) return;
        var sig = (l.texts || []).map(function(t){ return t.x+","+t.y+","+(t.rot || 0); }).join("|");
        if (prevText[d.id].indexOf(sig) < 0) return;
        l.texts = d.texts;
        if (d.id.charAt(1) === "p") l.slots = d.slots;
      });
    });
  }
  // 사진 고르기 화면의 색감 버튼(컬러·흑백·세피아)을 새로 넣었습니다. 예전 설정에는 없으니 붙여 줍니다.
  if (cfg.version < 20 && Array.isArray(cfg.filters) && cfg.filters.length && !cfg.filters.some(function(f){ return f.pick; })){
    defaultFilters().filter(function(f){ return f.pick; }).forEach(function(f){ cfg.filters.push(f); });
  }
  // 이름 띠를 80→60 으로 줄여 사진을 키우고, 글씨를 20→15 로, 세로 글씨를 위에서 아래로 읽게 바꿨습니다(사용자 요청).
  // 예전 기본값 그대로인 칸·글자만 바꾸고, 관리자에서 직접 옮겨 둔 것과 프레임 이미지를 올린 것은 그대로 둡니다.
  if (cfg.version < 21){
    var old21 = {
      wl1: { s:"0,0,1260,760", t:"26,792,0,20" },
      wl2: { s:"0,0,630,760|630,0,630,760", t:"18,792,0,20|1250,792,0,20" },
      wl4: { s:"0,0,630,380|630,0,630,380|0,380,630,380|630,380,630,380", t:"18,792,0,20|1250,792,0,20" },
      wp1: { s:"80,0,760,1260", t:"70,1240,-90,20" },
      wp2: { s:"80,0,760,630|80,630,760,630", t:"70,1242,-90,20|70,12,-90,20" },
      wp4: { s:"80,0,380,630|460,0,380,630|80,630,380,630|460,630,380,630", t:"70,1242,-90,20|70,12,-90,20" }
    };
    defaultConfig().layouts.forEach(function(d){
      var o = old21[d.id]; if (!o) return;
      cfg.layouts.forEach(function(l){
        if (l.id !== d.id || l.frame) return;
        var ss = (l.slots || []).map(function(a){ return [a.x,a.y,a.w,a.h].join(","); }).join("|");
        var ts = (l.texts || []).map(function(t){ return [t.x,t.y,t.rot || 0,t.size].join(","); }).join("|");
        if (ss === o.s) l.slots = d.slots;
        if (ts === o.t) l.texts = d.texts;
      });
    });
  }
  // 이름 띠를 60→46, 글씨를 15→12 로 한 번 더 줄였습니다(사용자 요청). v21 기본값 그대로인 칸·글자만 바꿉니다.
  if (cfg.version < 22){
    var old22 = {
      wl1: { s:"0,0,1260,780", t:"26,801,0,15" },
      wl2: { s:"0,0,630,780|630,0,630,780", t:"18,801,0,15|1250,801,0,15" },
      wl4: { s:"0,0,630,390|630,0,630,390|0,390,630,390|630,390,630,390", t:"18,801,0,15|1250,801,0,15" },
      wp1: { s:"60,0,780,1260", t:"39,18,90,15" },
      wp2: { s:"60,0,780,630|60,630,780,630", t:"39,18,90,15|39,1250,90,15" },
      wp4: { s:"60,0,390,630|450,0,390,630|60,630,390,630|450,630,390,630", t:"39,18,90,15|39,1250,90,15" }
    };
    defaultConfig().layouts.forEach(function(d){
      var o = old22[d.id]; if (!o) return;
      cfg.layouts.forEach(function(l){
        if (l.id !== d.id || l.frame) return;
        var ss = (l.slots || []).map(function(a){ return [a.x,a.y,a.w,a.h].join(","); }).join("|");
        var ts = (l.texts || []).map(function(t){ return [t.x,t.y,t.rot || 0,t.size].join(","); }).join("|");
        if (ss === o.s) l.slots = d.slots;
        if (ts === o.t) l.texts = d.texts;
      });
    });
  }
  // 셀프042: 프레임마다 찍는 장 수(shots)를 나중에 넣었습니다(흑백 3컷 띠 6장). 저장된 설정에 없으면 기본값을 붙입니다.
  defaultConfig().layouts.forEach(function(d){
    if (!d.shots) return;
    (cfg.layouts || []).forEach(function(l){ if (l.id === d.id && l.shots === undefined) l.shots = d.shots; });
  });
  // 셀프042: 가운데 절취선을 켰습니다. 저장된 설정이 예전 기본값(꺼짐 · #D8D0CA)이면 새 기본값으로 바꿉니다(관리자 화면에서 고친 값은 둠).
  defaultConfig().layouts.forEach(function(d){
    (cfg.layouts || []).forEach(function(l){
      if (l.id === d.id && l.cut && !l.cut.on && l.cut.x === 750 && l.cut.color === "#D8D0CA") l.cut = d.cut;
    });
  });
  // 셀프042: 카메라 8컷 프레임을 나중에 넣었습니다. 한 번만 붙이니, 그 뒤 관리자에서 지우면 다시 생기지 않습니다.
  if (cfg.version < 23 && cfg.layouts && !cfg.layouts.some(function(l){ return l.id === "cam8"; })){
    defaultConfig().layouts.forEach(function(d){ if (d.id === "cam8") cfg.layouts.push(d); });
  }
  // 카메라 8컷 칸은 앱 폴더 프레임 그림(frameSrc)과 짝이라, 관리자가 프레임 그림을 따로 올리지 않았으면 늘 기본값으로 맞춥니다.
  defaultConfig().layouts.forEach(function(d){
    if (!d.frameSrc) return;
    (cfg.layouts || []).forEach(function(l){ if (l.id === d.id && !l.frame){ l.slots = d.slots; l.frameSrc = d.frameSrc; l.bg = d.bg; } });
  });
  // 셀프042: 옛날필름 4컷을 나중에 넣었습니다. 한 번만 인생네컷 바로 뒤에 붙입니다.
  if (cfg.version < 24 && cfg.layouts && !cfg.layouts.some(function(l){ return l.id === "film8t"; })){
    var nd = defaultConfig().layouts.filter(function(d){ return d.id === "film8t"; })[0];
    var at = cfg.layouts.map(function(l){ return l.id; }).indexOf("film8");
    cfg.layouts.splice(at >= 0 ? at+1 : cfg.layouts.length, 0, nd);
  }
  // 옛날필름 4컷의 컬러·흑백 버튼(bwPick)을 나중에 넣었습니다. 저장된 설정에 없으면 붙입니다.
  (cfg.layouts || []).forEach(function(l){ if (l.id === "film8t" && l.bwPick === undefined) l.bwPick = true; });
  // 셀프042: 흑백 3컷 붙임을 나중에 넣었습니다. 한 번만 흑백 3컷 띠 바로 뒤에 붙입니다.
  if (cfg.version < 25 && cfg.layouts && !cfg.layouts.some(function(l){ return l.id === "bw3s"; })){
    var nb = defaultConfig().layouts.filter(function(d){ return d.id === "bw3s"; })[0];
    var bi = cfg.layouts.map(function(l){ return l.id; }).indexOf("bw3");
    cfg.layouts.splice(bi >= 0 ? bi+1 : cfg.layouts.length, 0, nb);
  }
  // 셀프042: 폴라로이드 9컷을 나중에 넣었습니다. 한 번만 맨 뒤에 붙입니다.
  if (cfg.version < 26 && cfg.layouts && !cfg.layouts.some(function(l){ return l.id === "pol9"; })){
    defaultConfig().layouts.forEach(function(d){ if (d.id === "pol9") cfg.layouts.push(d); });
  }
  if (cfg.version >= 8){ cfg.version = 26; return cfg; }

  // 예전 보정은 이름만 있었습니다. 같은 이름의 새 보정으로 바꿔 끼웁니다.
  if (!Array.isArray(cfg.filters) || !cfg.filters.length){
    cfg.filters = defaultFilters();
    var map = { none:"none", bright:"bright", mono:"mono", film:"film" };
    cfg.filter = map[cfg.filter] || "bright";
  }

  // 예전 보정에는 디테일 문턱이 없었습니다. 기본값을 채워 넣습니다.
  (cfg.filters||[]).forEach(function(f){ if (f.detail===undefined) f.detail = 70; });
  // 레이아웃마다 따로 올리던 배경을 공용 목록으로 옮깁니다
  if (!Array.isArray(cfg.backgrounds)) cfg.backgrounds = [];
  cfg.layouts.forEach(function(l, i){
    delete l.bgId;
    if (!l.bg) return;
    var landscape = l.canvas.w > l.canvas.h;
    var e = { id:"B"+Date.now()+i, name: l.name + " 배경", h:null, v:null };
    e[landscape ? "h" : "v"] = l.bg;
    cfg.backgrounds.push(e);
    if (!cfg.bgId) cfg.bgId = e.id;
    delete l.bg;
  });
  if (cfg.bgId === undefined) cfg.bgId = null;
  cfg.version = 22;
  return cfg;
}

var CFG = defaultConfig();
var cur = 0;            // 손님이 고른 레이아웃 index
var admIdx = 0;         // 관리자가 편집 중인 레이아웃 index
var selSlot = -1, selText = -1;

var S = { shots:[], cancelled:false, blob:null, stream:null, facing:"user", wakeLock:null };

var $ = function(id){ return document.getElementById(id); };
var setupEl=$("setup"), shootEl=$("shoot"), pickEl=$("pick"), stickerEl=$("sticker"), resultEl=$("result"), adminEl=$("admin");

/* ── 저장소 (IndexedDB: 설정 + 이미지) ── */
function idb(){
  return new Promise(function(res,rej){
    var r = indexedDB.open("self042", 1);   // 부스 앱(booth)과 같은 주소라 이름을 달리합니다
    r.onupgradeneeded = function(){ r.result.createObjectStore("kv"); };
    r.onsuccess = function(){ res(r.result); };
    r.onerror  = function(){ rej(r.error); };
  });
}
function kv(mode, fn){
  return idb().then(function(db){
    return new Promise(function(res,rej){
      var store = db.transaction("kv", mode).objectStore("kv");
      var req = fn(store);
      req.onsuccess = function(){ res(req.result); };
      req.onerror  = function(){ rej(req.error); };
    });
  });
}
var kvGet = function(k){ return kv("readonly",  function(s){ return s.get(k); }); };
var kvSet = function(k,v){ return kv("readwrite", function(s){ return s.put(v,k); }); };
var kvDel = function(k){ return kv("readwrite", function(s){ return s.delete(k); }); };

function saveConfig(){ return kvSet("config", JSON.parse(JSON.stringify(CFG))).catch(function(){}); }

/* 이미지 캐시: key -> {blob, url, img} */
var imgCache = {};
function putImage(blob){
  var key = "img_" + Date.now() + "_" + Math.random().toString(36).slice(2,8);
  return kvSet(key, blob).then(function(){ return key; });
}
/* 프레임 그림: 관리자가 올린 것(frame, 기기 저장소)이나 앱 폴더에 들어 있는 것(frameSrc, 예: frames/camera8.png) */
function frameImage(L){
  if (L.frame) return getImage(L.frame);
  if (!L.frameSrc) return Promise.resolve(null);
  if (imgCache[L.frameSrc]) return Promise.resolve(imgCache[L.frameSrc]);
  return new Promise(function(res){
    var im = new Image();
    im.onload = function(){ imgCache[L.frameSrc] = {url:L.frameSrc, img:im}; res(imgCache[L.frameSrc]); };
    im.onerror = function(){ res(null); };
    im.src = L.frameSrc;
  });
}
function getImage(key){
  if (!key) return Promise.resolve(null);
  if (imgCache[key]) return Promise.resolve(imgCache[key]);
  return kvGet(key).then(function(blob){
    if (!blob) return null;
    return new Promise(function(res){
      var url = URL.createObjectURL(blob);
      var im = new Image();
      im.onload = function(){ imgCache[key] = {url:url, img:im}; res(imgCache[key]); };
      im.onerror = function(){ res(null); };
      im.src = url;
    });
  });
}

/* ── 알림 / 확인 ──────────────────────── */
var msgT;
function say(t, ms){
  var el=$("msg"); el.textContent=t; el.hidden=false;
  clearTimeout(msgT);
  if (ms!==0) msgT=setTimeout(function(){ el.hidden=true; }, ms||3400);
}
function hush(){ clearTimeout(msgT); $("msg").hidden=true; }

var confirmCb=null;
function ask(text, cb){ $("confirmText").textContent=text; confirmCb=cb; $("confirm").hidden=false; }
$("confirmNo").addEventListener("click", function(){ $("confirm").hidden=true; confirmCb=null; });
$("confirmYes").addEventListener("click", function(){
  $("confirm").hidden=true;
  var cb=confirmCb; confirmCb=null; if (cb) cb();
});

function show(el){ [setupEl,shootEl,pickEl,stickerEl,resultEl,adminEl].forEach(function(s){ s.hidden = s!==el; });
  if (el===setupEl && typeof showStep==="function"){
    frameColorId = null;   // 다음 손님은 예전 색부터
    showStep(1); orientFixed = false; syncIdle();
  }
  // 인스탁스는 고르기·결과 화면을 필름 모양으로 보여주고, 아래에 프린터 상태를 띄웁니다
  var film = instaxOn() && (el===pickEl || el===resultEl);
  pickEl.classList.toggle("instax", film); resultEl.classList.toggle("instax", film);
  $("printerLine").hidden = !film || !relayUrl();
  if (el===resultEl){ syncPrintBtn(); } }
/* 미리보기 필름 방향 — 세로 프레임이면 두꺼운 띠가 옆으로 갑니다 */
function setFilm(L){
  var v = !!L && !isLandscape(L);
  $("pickFilm").classList.toggle("v", v); $("resultFilm").classList.toggle("v", v);
}

function today(){
  var d=new Date(), p=function(n){ return String(n).padStart(2,"0"); };
  return d.getFullYear()+"."+p(d.getMonth()+1)+"."+p(d.getDate());
}
/* 시작 화면에서 손님이 인스탁스 가로("h")·세로("v")를 고르면 그 방향의 와이드 프레임(instax:true)만,
   다른 인화 방식을 고르면 나머지만 씁니다. cur 는 지금 목록 안의 번호입니다. */
var instaxOrient = null;
function instaxOn(){ return !!instaxOrient; }
function isLandscape(l){ return l.canvas.w >= l.canvas.h; }
function instaxFrames(o){
  return CFG.layouts.filter(function(l){ return l.enabled && l.instax && isLandscape(l) === (o === "h"); });
}
function normalLayouts(){ return CFG.layouts.filter(function(l){ return l.enabled && !l.instax; }); }
function enabledLayouts(){ return instaxOn() ? instaxFrames(instaxOrient) : normalLayouts(); }

/* ── 배경 목록 ─────────────────────────────
   배경 하나가 가로(h)·세로(v) 두 장을 갖습니다.
   인화 방식의 방향에 맞는 쪽을 골라 씁니다. */
function allBackgrounds(){
  if (!Array.isArray(CFG.backgrounds)) CFG.backgrounds = [];
  return CFG.backgrounds;
}
function bgById(id){
  var a = allBackgrounds();
  for (var i=0;i<a.length;i++) if (a[i].id===id) return a[i];
  return null;
}
/* 지금 고른 배경에서 이 인화 방식에 쓸 이미지 키를 찾습니다.
   방향에 맞는 게 없으면 있는 쪽을 씁니다. */
function bgKeyFor(L){
  if (!L || !CFG.bgId) return null;
  var e = bgById(CFG.bgId);
  if (!e) return null;
  return (L.canvas.w > L.canvas.h) ? (e.h || e.v) : (e.v || e.h);
}
function shotCount(L){
  var m=0; L.slots.forEach(function(s){ if (s.shot+1>m) m=s.shot+1; });
  return Math.max(1,m);
}
function pickMode(){ return CFG.shootMode === "pick" || instaxOn(); }
/* 인스탁스 부스는 프레임을 찍은 뒤에 고르니, 가장 칸이 많은 프레임만큼은 찍어둡니다 */
function needShots(L){
  return instaxOn() ? Math.max.apply(null, enabledLayouts().map(shotCount)) : shotCount(L);
}
/* 실제로 찍는 장 수. 고르기 방식이면 칸 수보다 넉넉하게 찍습니다. */
// L.shots: 프레임마다 찍는 장 수(흑백 3컷 띠는 3장 고르니 6장, 사용자 요청). 없으면 PICK_SHOTS(10)
function shootTotal(L){ return pickMode() ? Math.max(L.shots || PICK_SHOTS, needShots(L)) : shotCount(L); }
function fontOf(t){
  return (t.font==="display")
    ? t.size+"px Anton, sans-serif"
    : (t.weight||500)+" "+t.size+"px 'IBM Plex Sans KR', sans-serif";   // weight 는 관리자 칸 없는 기본값 전용
}
function resolveText(s){
  return String(s).replace(/\{brand\}/g, CFG.brand).replace(/\{date\}/g, today());
}

/* ══════════════════════════════════════════
   손님 화면
   ══════════════════════════════════════════ */
var MINI_LONG = 300;   // 첫 화면 카드의 프레임 그림 긴 쪽 길이(px). 아이패드 가로에서 크게 보이게 키웠습니다(사용자 요청)
/* 첫 화면 카드에 실제 인화 모양(필름 띠·흑백 띠·절취선)을 작게 그립니다. 사진 칸은 회색으로 비워 둡니다. */
function miniHtml(L){
  var k = MINI_LONG / Math.max(L.canvas.w, L.canvas.h);
  var c = document.createElement("canvas");
  c.width = Math.round(L.canvas.w*k); c.height = Math.round(L.canvas.h*k);
  var ctx = c.getContext("2d");
  ctx.scale(k, k);
  if (L.style === "film") drawFilmBack(ctx, L);
  else if (L.style === "camera") drawCamBack(ctx, L);
  else { ctx.fillStyle = L.style === "bw" ? bwColor(L) : L.style === "bwv" ? L.bg : "#FFFFFF"; ctx.fillRect(0, 0, L.canvas.w, L.canvas.h); }
  ctx.fillStyle = getComputedStyle($("setup")).getPropertyValue("--slot").trim() || "#C9BDB4";   // 빈 사진 칸(밝은 화면은 회색)
  L.slots.forEach(function(s){
    if (s.r){ roundPath(ctx, s.x, s.y, s.w, s.h, s.r); ctx.fill(); } else ctx.fillRect(s.x, s.y, s.w, s.h);
  });
  if (L.style === "film") drawFilmText(ctx, L);
  if (L.cut && L.cut.on){
    ctx.strokeStyle = cutColor(L); ctx.lineWidth = 4; ctx.setLineDash([22, 22]);
    ctx.beginPath(); ctx.moveTo(L.cut.x, 40); ctx.lineTo(L.cut.x, L.canvas.h-40); ctx.stroke();
  }
  var url = c.toDataURL("image/jpeg", 0.9); free(c);
  var size = 'width:'+Math.round(L.canvas.w*k)+'px;height:'+Math.round(L.canvas.h*k)+'px';
  // 앱 폴더 프레임 그림(카메라 8컷, 바탕이 투명한 카메라 그림)은 바탕·회색 칸 그림 위에 얹어 보입니다
  if (L.frameSrc && !L.frame)
    return '<img class="mini" src="'+L.frameSrc+'" alt="" style="background:url('+url+') 0 0/100% 100%;'+size+'">';
  return '<img class="mini" src="'+url+'" alt="" style="'+size+'">';
}
function buildModes(){
  var list = normalLayouts();
  if (!list.length){ $("modes").innerHTML = '<p class="note">보이도록 켜둔 인화 방식이 없습니다. 관리자 화면에서 켜주세요.</p>'; return; }
  instaxOrient = null;
  if (cur >= list.length) cur = 0;
  $("modes").innerHTML = list.map(function(L,i){
    return '<button class="mode" data-i="'+i+'" aria-pressed="'+(i===cur)+'">'+miniHtml(L)+
      '<span style="min-width:0"><span class="mode-name">'+escapeHtml(L.name)+'</span><br>'+
      '<span class="mode-sub">'+shootTotal(L)+'장 찍고 '+shotCount(L)+'장 고르기</span></span></button>';
  }).join("");
  syncLook();
  updateShotNote();
  syncIdle();
}

/* 카메라(인화 방식)에 필름이 정해져 있으면 그 보정을 씁니다.
   손님이 보정을 따로 고르지 않도록 3단계의 보정 버튼을 숨깁니다. */
function lookOf(L){ return (L && L.look) ? filterById(L.look) : null; }
function syncLook(){
  var look = lookOf(enabledLayouts()[cur]);
  $("filters").hidden = !!look;
  $("step3Title").textContent = look ? "필름 · "+look.name : "보정을 골라주세요";
  // 필름이 없는 인화 방식으로 돌아오면, 앞 카메라의 숨긴 필름이 남지 않게 보이는 보정으로 돌립니다
  var id = look ? look.id
    : (shownFilters().some(function(f){ return f.id===CFG.filter; }) ? CFG.filter : shownFilters()[0].id);
  if (CFG.filter!==id){
    CFG.filter = id; pressOnly($("filters"), CFG.filter); saveConfig(); applyPreviewFilter();
  }
}

/* 시작 화면의 배경 고르기 줄 */
function buildBgPick(){
  var L = enabledLayouts()[cur];
  var host = $("bgPick");
  if (!L){ host.innerHTML = ""; return; }
  var list = allBackgrounds();
  // 섬네일을 인화지 비율에 맞춰 크게 보여줍니다
  var ar = L.canvas.w / L.canvas.h, SW_LONG = 118;
  var tw = (ar >= 1) ? SW_LONG : Math.round(SW_LONG*ar);
  var th = (ar >= 1) ? Math.round(SW_LONG/ar) : SW_LONG;
  var size = 'style="width:'+tw+'px;height:'+th+'px"';
  var html = '<button class="sw none" data-b="" '+size+' aria-pressed="'+(!CFG.bgId)+'">'+
             '<span class="nm">없음</span></button>';
  list.forEach(function(e){
    html += '<button class="sw" data-b="'+e.id+'" '+size+' aria-pressed="'+(CFG.bgId===e.id)+'">'+
            '<span class="nm">'+escapeHtml(e.name)+'</span></button>';
  });
  if (!list.length){
    html += '<p class="note" style="align-self:center">관리자 화면에서 배경을 올리면 여기에 나옵니다.</p>';
  }
  host.innerHTML = html;

  // 섬네일 채우기 — 지금 인화 방식 방향에 맞는 쪽을 보여줍니다
  var landscape = L.canvas.w > L.canvas.h;
  list.forEach(function(e){
    var key = landscape ? (e.h || e.v) : (e.v || e.h);
    if (!key) return;
    getImage(key).then(function(b){
      var el = host.querySelector('.sw[data-b="'+e.id+'"]');
      if (el && b) el.style.backgroundImage = 'url('+b.url+')';
    });
  });
}

$("bgPick").addEventListener("click", function(e){
  var b = e.target.closest(".sw"); if (!b) return;
  CFG.bgId = b.dataset.b || null;
  saveConfig();
  buildBgPick();
  showStep(3);
});
/* 시작 화면 3단계의 프레임 색 고르기: 고른 프레임의 색 동그라미와 작은 미리보기 */
function buildFramePick(){
  var L = enabledLayouts()[cur], list = L && FRAME_COLORS[L.id];
  $("fcBox").hidden = !list;
  if (!list) return;
  var fc = frameColor(L);
  $("fcPick").innerHTML = list.map(function(c){
    var bg = c.dot.indexOf("chk:") === 0 ? "repeating-conic-gradient("+c.dot.slice(4)+" 0 25%,#fff 0 50%) 0 0/16px 16px" : c.dot;
    return '<button class="fc-sw" data-c="'+c.id+'" aria-pressed="'+(c===fc)+'"><span class="dot" style="background:'+bg+'"></span>'+escapeHtml(c.name)+'</button>';
  }).join("");
  $("fcPrev").innerHTML = miniHtml(L);
}
$("fcPick").addEventListener("click", function(e){
  var b = e.target.closest(".fc-sw"); if (!b) return;
  frameColorId = b.dataset.c; buildFramePick();
});
function updateShotNote(){
  var L = enabledLayouts()[cur];
  $("shotNote").innerHTML = !L ? '' : instaxOn()
    ? '카메라가 먼저 켜집니다. 촬영 시작을 누르면 <b>'+shootTotal(L)+'장</b>을 이어서 찍고, 다 찍은 뒤 컷 수와 사진을 골라 인스탁스로 인화합니다.'
    : pickMode()
    ? '카메라를 켜면 바로 릴리즈로 <b>'+shootTotal(L)+'장</b>을 찍고, 다 찍은 뒤 마음에 드는 <b>'+shotCount(L)+'장</b>을 골라 인화합니다.'
    : '카메라가 먼저 켜집니다. 얼굴을 맞춘 뒤 촬영 시작을 누르면 <b>'+shotCount(L)+'컷</b>을 이어서 찍습니다.';
}
function buildChips(host, items, current, isTimer){
  host.innerHTML = items.map(function(it){
    var v = isTimer ? it : it.id, label = isTimer ? it+"초" : it.name;
    return '<button class="chip" data-v="'+v+'" aria-pressed="'+(String(current)===String(v))+'">'+label+'</button>';
  }).join("");
}
function pressOnly(host, value){
  Array.prototype.forEach.call(host.children, function(b){
    if (b.dataset.v!==undefined) b.setAttribute("aria-pressed", String(b.dataset.v===String(value)));
  });
}

/* 시작 화면은 한 번에 한 가지만 고르게 합니다: 1 인화 방식 → 2 배경 → 3 보정
   1·2단계는 누르면 바로 넘어가서 "다음" 버튼이 없습니다.
   올려둔 배경이 없으면 2단계(없음 하나뿐)를 건너뜁니다.
   인스탁스는 늘 많이 찍고 고르니 촬영 방식 버튼을 숨깁니다. */
var step = 1;
function showStep(n){
  if (n === 2 && !allBackgrounds().length) n = step < 2 ? 3 : 1;
  step = Math.min(3, Math.max(1, n));
  Array.prototype.forEach.call(document.querySelectorAll('#setup [data-step]'), function(el){
    el.hidden = Number(el.dataset.step) !== step;
  });
  $("shootModes").hidden = $("shootModesTitle").hidden = true;   // 셀프042 는 10장 찍고 고르기만 씁니다
  $("backBtn").hidden  = step === 1;
  $("startBtn").hidden = step !== 3;
  $("shotNote").hidden = step !== 3;
}
$("backBtn").addEventListener("click", function(){ showStep(step-1); });
/* 첫 화면(대기 화면)은 가로·세로 고르기입니다(사용자 요청). 맥에서 실시간으로 받는 중이면 카드를 누르는 순간 그 방향으로
   바로 사진 고르기 화면으로 가고(가로·세로 버튼은 고르기 화면에 두지 않습니다), 아니면 예전처럼 배경·보정·카메라 순서로 갑니다.
   관리자 화면은 이 화면 맨 위 이름 글씨를 길게 눌러 엽니다. */
function syncIdle(){
  $("step1Title").textContent = "프레임 골라주세요.";
}

$("modes").addEventListener("click", function(e){
  var b=e.target.closest(".mode"); if(!b) return;
  instaxOrient = b.dataset.o || null;
  cur = instaxOn() ? 0 : Number(b.dataset.i);
  frameColorId = null;   // 프레임을 새로 고르면 그 프레임의 첫 번째(예전) 색부터
  buildFramePick();
  Array.prototype.forEach.call($("modes").children, function(x){
    x.setAttribute("aria-pressed", String(x === b));
  });
  buildBgPick();
  syncLook();
  updateShotNote();
  showStep(2);
});
$("filters").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  CFG.filter=b.dataset.v; pressOnly($("filters"), CFG.filter); saveConfig(); applyPreviewFilter();
});
$("timers").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  CFG.timer=Number(b.dataset.v); pressOnly($("timers"), CFG.timer); saveConfig();
});
$("shootModes").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  CFG.shootMode=b.dataset.v; pressOnly($("shootModes"), CFG.shootMode); saveConfig(); updateShotNote();
});
$("brandEdit").addEventListener("input", function(e){
  CFG.brand = e.target.value.trim() || "STUDIO 042"; saveConfig();
});

/* 이름 길게 누르면 관리자 */
(function(){
  var t=null;
  var el=$("brandEdit");
  var start=function(){ t=setTimeout(function(){ el.blur(); openAdmin(); }, 750); };
  var stop =function(){ clearTimeout(t); };
  ["pointerdown"].forEach(function(ev){ el.addEventListener(ev,start); });
  ["pointerup","pointerleave","pointercancel"].forEach(function(ev){ el.addEventListener(ev,stop); });
})();

/* ══════════════════════════════════════════
   보정 엔진 — 미리보기와 인화가 같은 숫자를 씁니다
   ══════════════════════════════════════════ */
function allFilters(){
  return (CFG.filters && CFG.filters.length) ? CFG.filters : defaultFilters();
}
function shownFilters(){
  var on = allFilters().filter(function(f){ return f.enabled; });
  return on.length ? on : allFilters().slice(0,1);
}
function filterById(id){
  var all=allFilters();
  for (var i=0;i<all.length;i++) if (all[i].id===id) return all[i];
  return shownFilters()[0] || newFilter({name:"원본"});
}
function activeFilter(){ return filterById(CFG.filter); }

/* 색 보정만 모은 CSS 문자열. 캔버스 ctx.filter 도 같은 문법을 씁니다. */
function colorCss(f){
  var p=[];
  if (f.brightness!==100) p.push("brightness("+(f.brightness/100)+")");
  if (f.contrast  !==100) p.push("contrast("+(f.contrast/100)+")");
  if (f.saturate  !==100) p.push("saturate("+(f.saturate/100)+")");
  if (f.sepia)            p.push("sepia("+(f.sepia/100)+")");
  if (f.hue)              p.push("hue-rotate("+f.hue+"deg)");
  return p.length ? p.join(" ") : "none";
}
/* 잡티 흐림 반지름(가우시안). 관리자가 정한 px 는 카메라 사진 긴 쪽 1600px 기준이라,
   그림 크기에 비례시켜야 작은 미리보기와 인화가 같아집니다. */
function softBlur(W, H){ return Math.max(1, (CFG.blurPx||0) * Math.max(W,H) / 1600); }
/* 피부 보정 세기 → 흐린 그림을 섞는 정도 */
function softAlpha(f){ return (f.smooth/100)*0.92; }
/* 밝기 차 문턱. 이 값보다 차이가 크면 눈·머리카락·윤곽으로 보고 손대지 않습니다.
   디테일 지키기를 올릴수록 문턱이 낮아져 아주 옅은 잡티만 건드립니다.
   가우시안 17px 처럼 흐림이 크면 잡티 자리의 차이도 커지므로 문턱을 넉넉히 둡니다.
   (눈·눈썹은 피부와 밝기 차가 80 이상이라 그대로 남습니다) */
function softThreshold(f){
  var d = (f.detail===undefined) ? 70 : f.detail;
  return 16 + (100 - d) * 0.7;
}
function fadeAlpha(f){ return (f.fade/100)*0.35; }
function vignAlpha(f){ return (f.vignette/100)*0.55; }

/* 미리보기 위에 비네팅만 CSS 로 덮습니다. 인화도 칸마다 따로 겁니다.
   나머지 보정은 drawLook 이 캔버스에 직접 그립니다. */
function paintVignette(el, f){
  el.style.background = f.vignette
    ? "radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,"+vignAlpha(f)+") 100%)"
    : "none";
}
function applyPreviewFilter(){ paintVignette($("vignLayer"), activeFilter()); }

/* 캔버스에 같은 보정을 입힙니다.
   iOS 17 아래 사파리는 ctx.filter 를 무시하므로 색은 직접 계산합니다. */
var _ctxFilterOK = null;
function ctxFilterWorks(){
  if (_ctxFilterOK!==null) return _ctxFilterOK;
  try{
    var c=document.createElement("canvas"); c.width=c.height=1;
    var x=c.getContext("2d");
    if (!("filter" in x)) return (_ctxFilterOK=false);
    x.filter="brightness(0)"; x.fillStyle="#ffffff"; x.fillRect(0,0,1,1);
    _ctxFilterOK = x.getImageData(0,0,1,1).data[0] < 12;
  } catch(e){ _ctxFilterOK=false; }
  return _ctxFilterOK;
}
/* CSS 필터와 같은 순서로 색 행렬을 쌓습니다 (ctx.filter 가 없을 때만 씁니다) */
function colorMatrix(f){
  var m=[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,0];  // 3x3 + 오프셋 3
  function mul(a){
    var r=[0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (var i=0;i<3;i++){
      for (var j=0;j<3;j++){
        r[i*4+j] = a[i*4]*m[j] + a[i*4+1]*m[4+j] + a[i*4+2]*m[8+j];
      }
      r[i*4+3] = a[i*4]*m[3] + a[i*4+1]*m[7] + a[i*4+2]*m[11] + a[i*4+3];
    }
    m=r;
  }
  var b=f.brightness/100, c=f.contrast/100, s=f.saturate/100, se=f.sepia/100;
  if (b!==1) mul([b,0,0,0, 0,b,0,0, 0,0,b,0]);
  if (c!==1){ var o=(0.5-0.5*c)*255; mul([c,0,0,o, 0,c,0,o, 0,0,c,o]); }
  if (s!==1){
    var R=0.213,G=0.715,B=0.072;
    mul([R+(1-R)*s, G-G*s, B-B*s, 0,
         R-R*s, G+(1-G)*s, B-B*s, 0,
         R-R*s, G-G*s, B+(1-B)*s, 0]);
  }
  if (se) mul([0.393+0.607*(1-se), 0.769-0.769*(1-se), 0.189-0.189*(1-se), 0,
               0.349-0.349*(1-se), 0.686+0.314*(1-se), 0.168-0.168*(1-se), 0,
               0.272-0.272*(1-se), 0.534-0.534*(1-se), 0.131+0.869*(1-se), 0]);
  if (f.hue){
    var a=f.hue*Math.PI/180, cs=Math.cos(a), sn=Math.sin(a);
    mul([0.213+cs*0.787-sn*0.213, 0.715-cs*0.715-sn*0.715, 0.072-cs*0.072+sn*0.928, 0,
         0.213-cs*0.213+sn*0.143, 0.715+cs*0.285+sn*0.140, 0.072-cs*0.072-sn*0.283, 0,
         0.213-cs*0.213-sn*0.787, 0.715-cs*0.715+sn*0.715, 0.072+cs*0.928+sn*0.072, 0]);
  }
  return m;
}
function applyMatrix(ctx, w, h, f){
  var m=colorMatrix(f);
  var d=ctx.getImageData(0,0,w,h), p=d.data;
  for (var i=0;i<p.length;i+=4){
    var r=p[i], g=p[i+1], bl=p[i+2];
    p[i]   = m[0]*r + m[1]*g + m[2]*bl + m[3];
    p[i+1] = m[4]*r + m[5]*g + m[6]*bl + m[7];
    p[i+2] = m[8]*r + m[9]*g + m[10]*bl + m[11];
  }
  ctx.putImageData(d,0,0);
}
function free(c){ if (c && c.width){ c.width=0; c.height=0; } }

/* 피부 보정: 줄였다 늘리면 부드러운 흐림이 됩니다.
   ctx.filter 가 없어도 동작하고 큰 그림에서도 빠릅니다. */
/* 잡티만 다듬기.
   흐린 복사본을 만든 뒤, 원본과 밝기 차가 작은 자리에만 섞습니다.
   잡티·모공은 주변과 차이가 작아서 다듬어지고,
   눈·눈썹·머리카락·얼굴 윤곽은 차이가 커서 그대로 남습니다. */
function softenInto(dst, src, f){
  var a = softAlpha(f);
  if (a<=0 || !(CFG.blurPx>0)) return;
  var W = dst.width, H = dst.height;
  if (!W || !H) return;
  var r = softBlur(W, H);

  var blur = document.createElement("canvas");
  blur.width=W; blur.height=H;
  var bx = blur.getContext("2d");
  if (ctxFilterWorks()){
    // 가우시안 흐림. 가장자리가 투명과 섞여 어두워지지 않게 원본을 먼저 깔아둡니다.
    bx.drawImage(src, 0, 0);
    bx.filter = "blur("+r+"px)";
    bx.drawImage(src, 0, 0);
    bx.filter = "none";
  } else {
    // ctx.filter 가 없는 옛 사파리: 줄였다 늘리는 흐림으로 대신합니다
    var div = Math.max(2, r);
    var small = document.createElement("canvas");
    small.width = Math.max(2, Math.round(W/div)); small.height = Math.max(2, Math.round(H/div));
    var sx = small.getContext("2d");
    sx.imageSmoothingEnabled = true;
    sx.drawImage(src, 0, 0, small.width, small.height);
    bx.imageSmoothingEnabled = true;
    bx.drawImage(small, 0, 0, W, H);
    free(small);
  }

  var dctx = dst.getContext("2d");
  var o, b;
  try {
    o = dctx.getImageData(0,0,W,H);
    b = bx.getImageData(0,0,W,H);
  } catch(e){ free(blur); return; }
  free(blur);

  var op = o.data, bp = b.data;
  var t = softThreshold(f), inv = 1/t;
  for (var i=0; i<op.length; i+=4){
    // 밝기 차이로 판단합니다. 색이 달라도 밝기가 비슷하면 피부로 봅니다.
    var dl = 0.299*(bp[i]-op[i]) + 0.587*(bp[i+1]-op[i+1]) + 0.114*(bp[i+2]-op[i+2]);
    var n = (dl<0 ? -dl : dl) * inv;
    if (n >= 1) continue;              // 차이가 크면 건드리지 않습니다
    // 두 번 제곱해서 경계 근처에서는 빠르게 손을 뗍니다. 눈가 후광을 줄여줍니다.
    var m = 1 - n*n;
    var k = m * m * a;
    op[i]   += (bp[i]  -op[i]  )*k;
    op[i+1] += (bp[i+1]-op[i+1])*k;
    op[i+2] += (bp[i+2]-op[i+2])*k;
  }
  dctx.putImageData(o, 0, 0);
}
/* 색감 덧씌우기와 먹색 띄우기 — 미리보기의 겹침 순서와 같습니다 */
function overlayInto(ctx, w, h, f){
  if (f.tint && f.tint.amount>0){
    ctx.save();
    ctx.globalCompositeOperation = f.tint.mode;
    ctx.globalAlpha = f.tint.amount/100;
    ctx.fillStyle = f.tint.color;
    ctx.fillRect(0,0,w,h);
    ctx.restore();
  }
  if (f.fade>0){
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = fadeAlpha(f);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,w,h);
    ctx.restore();
  }
}
/* 흑백 3컷 붙임(style "bwv"): 칸마다 어두운 모서리와 필름 입자. 입자 그림(256px)은 한 번 만들어 무늬로 깔아 씁니다 */
var grainTile = null;
function drawVintage(ctx, x, y, w, h){
  var cx=x+w/2, cy=y+h/2, g=ctx.createRadialGradient(cx,cy,Math.min(w,h)*0.35, cx,cy,Math.max(w,h)*0.75);
  g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,.42)");
  ctx.save(); ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  if (!grainTile){
    grainTile=document.createElement("canvas"); grainTile.width=grainTile.height=256;
    var gx=grainTile.getContext("2d"), id=gx.createImageData(256,256), d=id.data;
    for (var i=0;i<d.length;i+=4){ var v=128+(Math.random()-0.5)*110; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; }
    gx.putImageData(id,0,0);
  }
  ctx.globalCompositeOperation="overlay"; ctx.globalAlpha=0.35;
  ctx.fillStyle=ctx.createPattern(grainTile,"repeat"); ctx.fillRect(x,y,w,h);
  ctx.restore();
}
function drawVignette(ctx, x, y, w, h, f){
  if (!f.vignette) return;
  var cx=x+w/2, cy=y+h/2;
  var g=ctx.createRadialGradient(cx,cy,Math.min(w,h)*0.38, cx,cy,Math.max(w,h)*0.72);
  g.addColorStop(0,"rgba(0,0,0,0)");
  g.addColorStop(1,"rgba(0,0,0,"+vignAlpha(f)+")");
  ctx.save(); ctx.fillStyle=g; ctx.fillRect(x,y,w,h); ctx.restore();
}

/* ══════════════════════════════════════════
   색감 파일 — 라이트룸·포토샵에서 만든 색감을 가져옵니다
   *.cube  포토샵·다빈치 등의 3D 룩업 테이블(LUT). 가장 정확합니다.
   *.xmp   라이트룸 프리셋. 노출·대비·톤·채도·색온도·톤 커브를 비슷하게 옮깁니다(근사).
   *.acv   포토샵 곡선 파일.
   셋 다 33×33×33 칸의 룩업 테이블로 바꿔 보정에 붙입니다. 사진의 픽셀마다 테이블에서 색을 찾아 바꿉니다.
   ══════════════════════════════════════════ */
var LUT_N = 33;
var lutCache = {};
function u16ToB64(u){
  var u8=new Uint8Array(u.buffer, u.byteOffset, u.byteLength), s="", CH=0x8000;
  for (var i=0;i<u8.length;i+=CH) s+=String.fromCharCode.apply(null, u8.subarray(i,i+CH));
  return btoa(s);
}
function b64ToU16(b){
  var s=atob(b), u8=new Uint8Array(s.length);
  for (var i=0;i<s.length;i++) u8[i]=s.charCodeAt(i);
  return new Uint16Array(u8.buffer);
}
function lutData(L){ return lutCache[L.id] || (lutCache[L.id] = b64ToU16(L.data)); }

/* n³ 칸 테이블에서 (r,g,b: 0~1) 자리의 색을 3선형 보간으로 읽습니다 */
function sampleLut(fl, n, r, g, b, out){
  var n1=n-1, x=r*n1, y=g*n1, z=b*n1;
  var x0=Math.min(n1-1,Math.max(0,x|0)), y0=Math.min(n1-1,Math.max(0,y|0)), z0=Math.min(n1-1,Math.max(0,z|0));
  var fx=x-x0, fy=y-y0, fz=z-z0, i=((z0*n+y0)*n+x0)*3, dx=3, dy=n*3, dz=n*n*3;
  for (var c=0;c<3;c++){
    var a=fl[i+c], bx=fl[i+dx+c], by=fl[i+dy+c], bxy=fl[i+dx+dy+c];
    var az=fl[i+dz+c], bxz=fl[i+dz+dx+c], byz=fl[i+dz+dy+c], bxyz=fl[i+dz+dx+dy+c];
    var c0=(a+(bx-a)*fx)+((by+(bxy-by)*fx)-(a+(bx-a)*fx))*fy;
    var c1=(az+(bxz-az)*fx)+((byz+(bxyz-byz)*fx)-(az+(bxz-az)*fx))*fy;
    out[c]=c0+(c1-c0)*fz;
  }
}
function resampleLut(fl, n, m){
  var out=new Float32Array(m*m*m*3), px=[0,0,0], k=0, s=1/(m-1);
  for (var b=0;b<m;b++) for (var g=0;g<m;g++) for (var r=0;r<m;r++){
    sampleLut(fl, n, r*s, g*s, b*s, px); out[k++]=px[0]; out[k++]=px[1]; out[k++]=px[2];
  }
  return out;
}
/* fl: n³·3 개의 0~1 값, 빨강이 가장 빨리 변하는 순서(.cube 와 같음). 33 보다 크면 33 으로 줄여 저장합니다. */
function lutFromFloats(name, kind, n, fl, note){
  if (n > LUT_N){ fl = resampleLut(fl, n, LUT_N); n = LUT_N; }
  var u=new Uint16Array(fl.length);
  for (var i=0;i<fl.length;i++) u[i]=Math.max(0, Math.min(65535, Math.round(fl[i]*65535)));
  var L = { id:"L"+Date.now()+Math.floor(Math.random()*1000), name:name, kind:kind, size:n, data:u16ToB64(u) };
  if (note) L.note = note;
  return L;
}
/* 함수 fn(r,g,b)→[r,g,b] (0~1)를 테이블로 굽습니다 */
function bakeLut(fn, n){
  var fl=new Float32Array(n*n*n*3), k=0, s=1/(n-1);
  for (var b=0;b<n;b++) for (var g=0;g<n;g++) for (var r=0;r<n;r++){
    var o=fn(r*s, g*s, b*s); fl[k++]=o[0]; fl[k++]=o[1]; fl[k++]=o[2];
  }
  return fl;
}

/* 사진(캔버스)에 테이블을 입힙니다. f.lutAmount 는 원래 색과 섞는 정도(0~100). */
function lutInto(cv, f){
  var L=f.lut; if (!L || !L.data) return;
  var amt=(f.lutAmount===undefined ? 100 : f.lutAmount)/100; if (amt<=0) return;
  var T=lutData(L), n=L.size, n1=n-1, sc=n1/255, k=255/65535, dy=n*3, dz=n*n*3;
  var ctx=cv.getContext("2d"), img;
  try { img=ctx.getImageData(0,0,cv.width,cv.height); } catch(e){ return; }
  var p=img.data;
  for (var i=0;i<p.length;i+=4){
    var x=p[i]*sc, y=p[i+1]*sc, z=p[i+2]*sc;
    var x0=x|0, y0=y|0, z0=z|0;
    if (x0>=n1) x0=n1-1; if (y0>=n1) y0=n1-1; if (z0>=n1) z0=n1-1;
    var fx=x-x0, fy=y-y0, fz=z-z0, j=((z0*n+y0)*n+x0)*3;
    for (var c=0;c<3;c++){
      var a=T[j+c], bx=T[j+3+c], by=T[j+dy+c], bxy=T[j+dy+3+c];
      var az=T[j+dz+c], bxz=T[j+dz+3+c], byz=T[j+dz+dy+c], bxyz=T[j+dz+dy+3+c];
      var ab=a+(bx-a)*fx, cd=by+(bxy-by)*fx, ef=az+(bxz-az)*fx, gh=byz+(bxyz-byz)*fx;
      var c0=ab+(cd-ab)*fy, c1=ef+(gh-ef)*fy;
      var o=(c0+(c1-c0)*fz)*k;
      p[i+c] += (o-p[i+c])*amt;
    }
  }
  ctx.putImageData(img,0,0);
}

/* ── *.cube ── */
function parseCube(text){
  var n=0, vals=[], lines=text.split(/\r?\n/);
  for (var i=0;i<lines.length;i++){
    var s=lines[i].trim(); if (!s || s.charAt(0)==="#") continue;
    var m=/^LUT_3D_SIZE\s+(\d+)/i.exec(s);
    if (m){ n=parseInt(m[1],10); continue; }
    if (/^LUT_1D_SIZE/i.test(s)) throw new Error("1D 룩업 테이블(.cube)은 지원하지 않습니다. 3D 로 내보내 주세요.");
    if (/^[A-Za-z_]/.test(s)) continue;     // TITLE, DOMAIN_MIN, DOMAIN_MAX …
    var q=s.split(/\s+/);
    if (q.length>=3){ var a=+q[0], b=+q[1], c=+q[2]; if (isFinite(a)&&isFinite(b)&&isFinite(c)) vals.push(a,b,c); }
  }
  if (n<2 || vals.length!==n*n*n*3) throw new Error("이 .cube 파일을 읽지 못했습니다(격자 "+n+", 값 "+(vals.length/3)+"개).");
  return { size:n, floats:Float32Array.from(vals) };
}

/* ── 곡선: 점들을 부드럽게 잇는 256칸 표(0~1). 단조 3차 보간이라 곡선이 출렁이지 않습니다 ── */
function curveTable(pts, scale){
  pts=pts.slice().sort(function(a,b){ return a[0]-b[0]; });
  var xs=[], ys=[], t=new Float32Array(256), i;
  for (i=0;i<pts.length;i++){
    if (xs.length && pts[i][0]/scale===xs[xs.length-1]) continue;
    xs.push(pts[i][0]/scale); ys.push(pts[i][1]/scale);
  }
  var n=xs.length;
  if (n<2){ for (i=0;i<256;i++) t[i]=i/255; return t; }
  var d=[], m=[];
  for (i=0;i<n-1;i++) d[i]=(ys[i+1]-ys[i])/(xs[i+1]-xs[i]);
  m[0]=d[0]; m[n-1]=d[n-2];
  for (i=1;i<n-1;i++) m[i]=(d[i-1]*d[i]<=0) ? 0 : (d[i-1]+d[i])/2;
  for (i=0;i<n-1;i++){
    if (d[i]===0){ m[i]=0; m[i+1]=0; continue; }
    var a=m[i]/d[i], b=m[i+1]/d[i], s=a*a+b*b;
    if (s>9){ var tt=3/Math.sqrt(s); m[i]=tt*a*d[i]; m[i+1]=tt*b*d[i]; }
  }
  for (var k=0;k<256;k++){
    var x=k/255, y;
    if (x<=xs[0]) y=ys[0];
    else if (x>=xs[n-1]) y=ys[n-1];
    else {
      var j=0; while (j<n-2 && x>=xs[j+1]) j++;
      var h=xs[j+1]-xs[j], u=(x-xs[j])/h, u2=u*u, u3=u2*u;
      y=(2*u3-3*u2+1)*ys[j]+(u3-2*u2+u)*h*m[j]+(-2*u3+3*u2)*ys[j+1]+(u3-u2)*h*m[j+1];
    }
    t[k]=Math.max(0,Math.min(1,y));
  }
  return t;
}
function tabAt(t, v){
  var x=Math.max(0,Math.min(1,v))*255, i=x|0;
  return i>=255 ? t[255] : t[i]+(t[i+1]-t[i])*(x-i);
}

/* ── *.acv (포토샵 곡선) ── 곡선 순서: 전체(RGB), 빨강, 초록, 파랑 */
function acvLook(buf){
  var v=new DataView(buf), cnt=v.getUint16(2), pos=4, curves=[];
  if (cnt<1 || cnt>32) throw new Error("이 .acv 파일을 읽지 못했습니다.");
  for (var c=0;c<cnt;c++){
    var np=v.getUint16(pos); pos+=2; var pts=[];
    for (var j=0;j<np;j++){ var out=v.getUint16(pos), inp=v.getUint16(pos+2); pos+=4; pts.push([inp,out]); }
    curves.push(pts);
  }
  var id=[]; for (var i=0;i<256;i++) id.push(i/255);
  function tab(k){ return (curves[k] && curves[k].length>=2) ? curveTable(curves[k],255) : null; }
  var tm=tab(0), tr=tab(1), tg=tab(2), tb=tab(3);
  return bakeLut(function(r,g,b){
    if (tr) r=tabAt(tr,r); if (tg) g=tabAt(tg,g); if (tb) b=tabAt(tb,b);
    if (tm){ r=tabAt(tm,r); g=tabAt(tm,g); b=tabAt(tm,b); }
    return [r,g,b];
  }, LUT_N);
}

/* ── *.xmp (라이트룸 프리셋) ── 같은 값을 쓰는 포토샵 카메라 로우와 완전히 같게는 못 옮깁니다.
   노출·대비·하이라이트·섀도·화이트·블랙·채도·생동감·색온도·색조·흑백 변환·톤 커브(전체·RGB)만 비슷하게 옮깁니다. */
function xmpLook(text){
  var doc=new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("이 .xmp 파일을 읽지 못했습니다.");
  var d=doc.getElementsByTagName("rdf:Description")[0];
  if (!d) throw new Error("라이트룸 프리셋(.xmp)이 아닌 것 같습니다.");
  function A(k){
    var v=d.getAttribute("crs:"+k);
    if (v===null){ var e=d.getElementsByTagName("crs:"+k)[0]; v=e ? e.textContent.trim() : null; }
    return v;
  }
  function N(k){ var v=parseFloat(A(k)); return isFinite(v) ? v : 0; }
  function curve(k){
    var e=d.getElementsByTagName("crs:"+k)[0]; if (!e) return null;
    var li=e.getElementsByTagName("rdf:li"), pts=[];
    for (var i=0;i<li.length;i++){ var xy=li[i].textContent.split(","); if (xy.length>=2) pts.push([parseFloat(xy[0]),parseFloat(xy[1])]); }
    return pts.length>=2 ? curveTable(pts,255) : null;
  }
  var ex=N("Exposure2012"), ct=N("Contrast2012")/100, hi=N("Highlights2012")/100, sh=N("Shadows2012")/100,
      wh=N("Whites2012")/100, bl=N("Blacks2012")/100, sat=N("Saturation")/100, vib=N("Vibrance")/100,
      tmp=N("Temperature"), tnt=N("Tint"), gray=(A("ConvertToGrayscale")==="True");
  var tm=curve("ToneCurvePV2012"), tr=curve("ToneCurvePV2012Red"), tg=curve("ToneCurvePV2012Green"), tb=curve("ToneCurvePV2012Blue");
  // 색온도는 -100~100 일 때만 상대값으로 봅니다(라이트룸이 JPEG 에 쓰는 값). 켈빈 값은 건너뜁니다.
  var gR=1, gG=1, gB=1;
  if (Math.abs(tmp)<=100){ gR=1+tmp/100*0.22; gB=1-tmp/100*0.22; }
  if (Math.abs(tnt)<=150){ gG=1-tnt/150*0.12; }
  function lin(v){ return v<=0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }
  function enc(v){ v=Math.max(0,Math.min(1,v)); return v<=0.0031308 ? v*12.92 : 1.055*Math.pow(v,1/2.4)-0.055; }
  function sstep(a,b,x){ x=(x-a)/(b-a); x=x<0?0:(x>1?1:x); return x*x*(3-2*x); }
  var gain=Math.pow(2,ex);
  var fl=bakeLut(function(r,g,b){
    r=enc(lin(r)*gain*gR); g=enc(lin(g)*gain*gG); b=enc(lin(b)*gain*gB);
    var Y=0.2126*r+0.7152*g+0.0722*b;
    var adj=hi*0.22*sstep(0.45,1,Y) + sh*0.22*(1-sstep(0,0.55,Y)) + wh*0.14*sstep(0.7,1,Y) + bl*0.14*(1-sstep(0,0.3,Y));
    r+=adj; g+=adj; b+=adj;
    if (ct){
      r+=(sstep(0,1,r)-r)*ct*1.1; g+=(sstep(0,1,g)-g)*ct*1.1; b+=(sstep(0,1,b)-b)*ct*1.1;
    }
    Y=0.2126*r+0.7152*g+0.0722*b;
    var mx=Math.max(r,g,b), mn=Math.min(r,g,b), s0=mx>0 ? (mx-mn)/mx : 0, k=1+sat+vib*(1-s0);
    r=Y+(r-Y)*k; g=Y+(g-Y)*k; b=Y+(b-Y)*k;
    if (gray){ r=g=b=Y; }
    r=Math.max(0,Math.min(1,r)); g=Math.max(0,Math.min(1,g)); b=Math.max(0,Math.min(1,b));
    if (tr) r=tabAt(tr,r); if (tg) g=tabAt(tg,g); if (tb) b=tabAt(tb,b);
    if (tm){ r=tabAt(tm,r); g=tabAt(tm,g); b=tabAt(tm,b); }
    return [r,g,b];
  }, LUT_N);
  // 옮기지 못한 항목이 있으면 알려 줍니다
  var skipped=[], at=d.attributes;
  for (var i=0;i<at.length;i++){
    var nm=at[i].name.replace("crs:",""), val=parseFloat(at[i].value);
    if (/^(HueAdjustment|SaturationAdjustment|LuminanceAdjustment|SplitToning|ColorGrade)/.test(nm) && isFinite(val) && val!==0){
      var label=/Split|ColorGrade/.test(nm) ? "색 분리·컬러 그레이딩" : "HSL";
      if (skipped.indexOf(label)<0) skipped.push(label);
    }
  }
  return { floats:fl, note:"근사"+(skipped.length ? " · "+skipped.join("·")+" 는 빠짐" : "") };
}

/* 얼굴 줄이기 — 포토샵 유동화의 오목(Pucker)처럼 타원 안쪽을 가운데로 모읍니다.
   타원 밖은 그대로이고, 경계로 갈수록 부드럽게 원래 자리로 돌아갑니다.
   s = {amount 0~100, x·y 가운데 위치(그림의 %), size 타원 너비(그림 너비의 %)} */
function slimInto(cv, s){
  var k = s ? (s.amount||0)/100*0.45 : 0;   // 0.5 를 넘으면 경계에서 그림이 접힙니다
  if (k<=0) return;
  var W=cv.width, H=cv.height;
  var cx=s.x/100*W, cy=s.y/100*H, rx=s.size/100*W/2, ry=rx*1.3;   // 얼굴처럼 세로로 긴 타원
  var x0=Math.max(0,Math.floor(cx-rx)), x1=Math.min(W,Math.ceil(cx+rx));
  var y0=Math.max(0,Math.floor(cy-ry)), y1=Math.min(H,Math.ceil(cy+ry));
  var bw=x1-x0, bh=y1-y0;
  if (bw<2 || bh<2) return;
  var ctx=cv.getContext("2d"), img;
  try { img=ctx.getImageData(x0,y0,bw,bh); } catch(e){ return; }
  var dst=img.data, src=new Uint8ClampedArray(dst);
  var lcx=cx-x0, lcy=cy-y0, mx=bw-1.001, my=bh-1.001;
  for (var y=0; y<bh; y++){
    var dy=(y-lcy)/ry, dy2=dy*dy;
    if (dy2>=1) continue;
    for (var x=0; x<bw; x++){
      var dx=(x-lcx)/rx, d2=dx*dx+dy2;
      if (d2>=1) continue;
      // 가운데일수록 더 먼 곳을 가져와서 안쪽이 작아집니다
      var sc=1+k*(1-d2);
      var sx=lcx+(x-lcx)*sc, sy=lcy+(y-lcy)*sc;
      if (sx<0) sx=0; else if (sx>mx) sx=mx;
      if (sy<0) sy=0; else if (sy>my) sy=my;
      var ix=sx|0, iy=sy|0, fx=sx-ix, fy=sy-iy;
      var i00=(iy*bw+ix)*4, i10=i00+4, i01=i00+bw*4, i11=i01+4, o=(y*bw+x)*4;
      for (var c=0;c<3;c++){
        var top=src[i00+c]+(src[i10+c]-src[i00+c])*fx;
        var bot=src[i01+c]+(src[i11+c]-src[i01+c])*fx;
        dst[o+c]=top+(bot-top)*fy;
      }
    }
  }
  ctx.putImageData(img,x0,y0);
}

/* src(비디오나 캔버스)를 out 크기로 그리고 보정을 입힙니다.
   촬영·비교·실시간 미리보기가 모두 이 함수를 써서 보이는 대로 찍힙니다.
   순서: 색 보정 → 얼굴 줄이기 → 피부 보정 → 색감 덧씌우기 → 먹색 띄우기 */
function drawLook(out, src, f, mirror, slim){
  var W=out.width, H=out.height, ox=out.getContext("2d");
  ox.save();
  if (mirror){ ox.translate(W,0); ox.scale(-1,1); }
  // iOS 17 아래 사파리는 ctx.filter 를 무시하므로 색은 직접 계산합니다
  if (ctxFilterWorks()){
    ox.filter = colorCss(f);
    ox.drawImage(src,0,0,W,H);
    ox.filter = "none";
    ox.restore();
  } else {
    ox.drawImage(src,0,0,W,H);
    ox.restore();
    applyMatrix(ox, W, H, f);
  }
  slimInto(out, slim);
  softenInto(out, out, f);
  overlayInto(ox, W, H, f);
  lutInto(out, f);        // 가져온 색감 파일(*.cube *.xmp *.acv)
}

/* 실시간 미리보기 — 비디오를 작게 줄여 매 프레임 drawLook 으로 그립니다.
   on() 이 거짓이 되면 멈춥니다. guide() 가 참이면 얼굴 줄이기 범위를 점선으로 보여줍니다. */
var LIVE_LONG = 640;
function startLive(video, canvas, look, on, guide){
  if (canvas.dataset.live) return;
  canvas.dataset.live = "1";
  (function frame(){
    if (!on()){ delete canvas.dataset.live; return; }
    var vw=video.videoWidth, vh=video.videoHeight;
    if (vw && vh){
      var sc=Math.min(1, LIVE_LONG/Math.max(vw,vh));
      var W=Math.round(vw*sc), H=Math.round(vh*sc);
      if (canvas.width!==W || canvas.height!==H){ canvas.width=W; canvas.height=H; }
      drawLook(canvas, video, look(), previewMirror(), CFG.slim);
      if (guide() && CFG.slim.amount>0) drawSlimGuide(canvas);
    }
    // 카메라 새 프레임마다 한 번만 그립니다. 화면 주사율(60·120Hz)대로 그리면 같은 그림을 여러 번 계산합니다.
    // 카메라를 끄면 프레임이 안 와서 여기서 기다리고, 다시 켜면 이어서 그립니다.
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(frame);
    else requestAnimationFrame(frame);
  })();
}
/* 손님이 얼굴을 맞출 자리. 미리보기에만 그리고 사진에는 들어가지 않습니다. */
function drawSlimGuide(cv){
  var s=CFG.slim, ctx=cv.getContext("2d"), rx=s.size/100*cv.width/2;
  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.75)"; ctx.lineWidth=Math.max(1.5, cv.width/320);
  ctx.setLineDash([8,7]);
  ctx.beginPath();
  ctx.ellipse(s.x/100*cv.width, s.y/100*cv.height, rx, rx*1.3, 0, 0, Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

/* ── 카메라 ───────────────────────────── */
function stopStream(){
  if (S.stream){ S.stream.getTracks().forEach(function(t){ t.stop(); }); S.stream=null; }
  $("live").width = 0;   // 남겨두면 다음 손님이 카메라를 켤 때 앞 손님 얼굴이 잠깐 보입니다
}
/* 쓸 카메라를 고릅니다. 관리자가 정해둔 카메라가 없거나 빠졌으면
   기본 카메라로 돌아갑니다. */
function videoConstraint(){
  var c = { width:{ideal:1920}, height:{ideal:1440} };
  if (CFG.cameraId) c.deviceId = { exact: CFG.cameraId };
  else c.facingMode = S.facing;
  return c;
}
function mirrorFor(){
  // 외장 카메라는 거울로 뒤집지 않습니다. 전면 카메라만 뒤집습니다.
  return !CFG.cameraId && S.facing === "user";
}
/* 찍기 전 화면만 거울처럼 보입니다(거울 A, 사용자 요청). 외장 카메라(후지 HDMI)도 손님이 자리 잡기 쉽게 뒤집어 보여주고,
   찍힌 사진(grabFull)은 mirrorFor() 대로 정방향입니다. */
function previewMirror(){ return mirrorFor() || !!CFG.cameraId; }
function openCamera(){
  stopStream();
  var tryOpen = function(constraint){
    return navigator.mediaDevices.getUserMedia({ video:constraint, audio:false });
  };
  return tryOpen(videoConstraint())
    .catch(function(err){
      if (!CFG.cameraId) throw err;
      // 정해둔 카메라가 사라졌으면 기본 카메라로 한 번 더 시도합니다
      CFG.cameraId = null; saveConfig();
      say("정해둔 카메라를 찾지 못해 기본 카메라로 엽니다.", 5000);
      return tryOpen({ facingMode:S.facing, width:{ideal:1920}, height:{ideal:1440} });
    })
    .then(function(st){
      S.stream=st;
      var v=$("video"); v.srcObject=st;
      v.style.transform = previewMirror() ? "scaleX(-1)" : "none";
      startLive(v, $("live"), activeFilter,
        function(){ return !!S.stream && !shootEl.hidden; },
        function(){ return !$("goBtn").hidden; });       // 기다리는 동안만 얼굴 자리 표시
      return v.play().catch(function(){});
    });
}
function cameraError(err){
  var n = err && err.name ? err.name : "";
  if (n==="NotAllowedError") return "카메라 권한이 꺼져 있습니다. 설정 → Safari → 카메라에서 허용으로 바꾼 뒤 다시 열어주세요.";
  if (n==="NotFoundError" || n==="OverconstrainedError") return "쓸 수 있는 카메라를 찾지 못했습니다.";
  if (location.protocol!=="https:" && location.hostname!=="localhost")
    return "카메라는 https 주소에서만 열립니다. 주소가 https로 시작하는지 확인해 주세요.";
  return "카메라를 열지 못했습니다. 다른 앱이 카메라를 쓰고 있는지 확인해 주세요.";
}
function keepAwake(){
  if (!("wakeLock" in navigator)) return;
  navigator.wakeLock.request("screen").then(function(l){ S.wakeLock=l; }).catch(function(){});
}
function releaseAwake(){
  if (S.wakeLock){ S.wakeLock.release().catch(function(){}); S.wakeLock=null; }
}
document.addEventListener("visibilitychange", function(){
  if (document.visibilityState==="visible" && !shootEl.hidden) keepAwake();
});

/* ── 촬영 ─────────────────────────────── */
function wait(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }

/* 카메라 화면을 통째로 한 장 담아둡니다. 칸마다 비율이 달라도
   합성할 때 각 칸에 맞춰 가운데를 잘라 쓰면 되기 때문입니다. */
function grabFull(){
  var v=$("video"), vw=v.videoWidth, vh=v.videoHeight;
  if (!vw||!vh) return null;
  // 후지 HDMI 의 촬영 후 확인 화면은 3:2 사진 양옆에 검은 띠가 있습니다. 화면이 3:2 보다 넓으면 가운데 3:2 만 씁니다.
  // (1920×1080 → 1620×1080, 1920×1200 → 1800×1200)
  var cw = vw/vh > 1.51 ? Math.round(vh*1.5) : vw, cx = Math.round((vw-cw)/2);
  var src = v;
  if (cw < vw){
    src = document.createElement("canvas"); src.width=cw; src.height=vh;
    src.getContext("2d").drawImage(v, cx, 0, cw, vh, 0, 0, cw, vh);
  }
  var scale = Math.min(1, 1920/Math.max(cw,vh));   // HDMI 크기를 그대로 둡니다(1600 → 1920)
  var out=document.createElement("canvas");
  out.width=Math.round(cw*scale); out.height=Math.round(vh*scale);
  // 전면 카메라는 거울처럼 뒤집어 담습니다
  drawLook(out, src, activeFilter(), mirrorFor(), CFG.slim);
  if (src !== v) free(src);
  return out;
}

/* ── 릴리즈 촬영 ─────────────────────────
   손님이 릴리즈를 누르면 후지 화면이 잠깐 검게 바뀐 뒤 찍힌 사진(촬영 후 확인 화면, 화상 표시 1.5초)이 HDMI 로 들어옵니다.
   화면을 64×36 으로 줄여 1초에 약 30번 보고, 검게 된 뒤 장면이 0.3초 멈춰 있으면 그때를 담습니다.
   dark: 평균 밝기(0~255)가 이보다 낮으면 셔터가 눌린 것 / still: 앞 프레임과의 평균 차이가 이보다 작으면 멈춘 것 /
   giveUp: 검게 된 뒤 이 시간 안에 멈춘 장면이 없으면 그 컷은 버리고 다시 기다립니다. */
var REL = { dark:12, still:6, holdMs:300, giveUpMs:3000 };
function waitRelease(n, total){
  var v=$("video"), t=document.createElement("canvas"); t.width=64; t.height=36;
  var tc=t.getContext("2d", { willReadFrequently:true });
  $("shootHint").textContent = "릴리즈를 눌러 주세요";
  $("shootCount").textContent = n+" / "+total+" 장";
  return new Promise(function(resolve){
    var dark=false, darkAt=0, stillFrom=0, prev=null;
    (function tick(){
      if (S.cancelled || S.enough){ free(t); return resolve(null); }
      tc.drawImage(v, 0, 0, 64, 36);
      var d=tc.getImageData(0, 0, 64, 36).data, cur=new Uint8Array(64*36), sum=0, diff=0, i, j;
      for (i=0, j=0; i<d.length; i+=4, j++){
        cur[j]=(d[i]*3+d[i+1]*6+d[i+2])/10; sum+=cur[j];
        if (prev) diff+=Math.abs(cur[j]-prev[j]);
      }
      var mean=sum/cur.length, change=prev ? diff/cur.length : 255, now=Date.now();
      prev=cur;
      if (mean < REL.dark){ dark=true; darkAt=now; stillFrom=0; }
      else if (dark){
        if (now-darkAt > REL.giveUpMs) dark=false;
        else if (change < REL.still){
          if (!stillFrom) stillFrom=now;
          else if (now-stillFrom >= REL.holdMs){ free(t); return resolve(grabFull()); }
        } else stillFrom=0;
      }
      setTimeout(tick, 30);   // 1초에 약 30번. requestAnimationFrame 은 화면 상태에 따라 느려질 수 있어 쓰지 않습니다
    })();
  });
}
/* 다 쓴 캔버스는 바로 비웁니다. iOS Safari는 페이지 전체의 캔버스 메모리가
   한도를 넘으면 오류 없이 잡티 섞인 그림을 돌려줍니다. */
var lastResultUrl = null;
/* origs: 찍은 원본(jpgs 로 바꾼 글자 목록), plain: 스티커 없는 프레임(blob). 둘 다 아이맥 보관 폴더에만 올립니다(손님 QR 에는 프레임만). */
function jpgs(list){ return (list||[]).filter(function(c){ return c && c.width; }).map(function(c){ return c.toDataURL("image/jpeg", 0.92).split(",")[1]; }); }
function setResult(blob, origs, sub, plain){
  S.blob = blob; S.printed = false;
  S.sub = sub || stampName(new Date());   // 손님 폴더 이름. 좌우 반전으로 다시 만들어도 같은 폴더에 넣습니다
  if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
  lastResultUrl = URL.createObjectURL(blob);
  $("resultImg").src = lastResultUrl;
  showQr(blob, S.sub, origs, plain);
}

/* ── 구글 드라이브 QR ──
   인화 사진을 드라이브에 올리고(Code.gs), 받은 링크를 QR 로 결과 화면에 띄웁니다. 손님 휴대폰 카메라로 찍으면 사진이 열립니다. */
var qrScript = null;
function loadQrLib(){
  if (window.qrcode) return Promise.resolve();
  if (!qrScript) qrScript = new Promise(function(res, rej){
    var el=document.createElement("script"); el.src=QR_LIB; el.onload=res;
    el.onerror=function(){ qrScript=null; rej(new Error("QR 도구를 받지 못했습니다")); };
    document.head.appendChild(el);
  });
  return qrScript;
}
function blobBase64(blob){
  return new Promise(function(res, rej){
    var r=new FileReader();
    r.onload=function(){ res(String(r.result).split(",")[1]); };
    r.onerror=function(){ rej(r.error); };
    r.readAsDataURL(blob);
  });
}
function stampName(d){
  function p(n){ return ("0"+n).slice(-2); }
  return p(d.getFullYear()%100)+p(d.getMonth()+1)+p(d.getDate())+"_"+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds());
}
function postDrive(o){
  o.key = DRIVE_KEY;
  // text/plain 으로 보내야 구글 앱스 스크립트가 미리 묻기(CORS) 없이 받습니다
  return fetch(DRIVE_URL, { method:"POST", body: JSON.stringify(o) }).then(function(res){ return res.json(); });
}
function showQr(blob, sub, origs, plain){
  var box=$("qrBox"), img=$("qrImg"), note=$("qrNote");
  if (!DRIVE_URL){ box.hidden=true; return; }
  box.hidden=false; img.innerHTML=""; note.textContent="QR 을 만드는 중입니다…";
  var up = Promise.all([loadQrLib(), blobBase64(blob)]).then(function(r){
    return postDrive({ img:r[1], folder:sub });
  });
  // 원본은 프레임이 올라간 뒤 한 장씩 올립니다(같은 이름 폴더가 둘 생기지 않게). 손님 화면에는 안 보이게 조용히 합니다
  // 스티커 없는 프레임은 맨 먼저. orig:"00" 은 Code.gs 를 새로 배포하기 전에도 "원본_00.jpg" 로 남게 하려는 것입니다
  if (plain || (origs && origs.length)) up.catch(function(){}).then(function(){
    var first = !plain ? Promise.resolve() : blobBase64(plain)
      .then(function(b64){ return postDrive({ img:b64, folder:sub, orig:"00", plain:1 }); })
      .catch(function(e){ console.warn("스티커 없는 프레임을 올리지 못했습니다", e); });
    return (origs||[]).reduce(function(pr, b64, i){
      return pr.then(function(){ return postDrive({ img:b64, folder:sub, orig:i+1 }); }).catch(function(e){ console.warn("원본 "+(i+1)+" 을 올리지 못했습니다", e); });
    }, first);
  });
  up.then(function(j){
    if (S.blob !== blob) return;   // 그사이 다시 찍었으면 옛 QR 은 버립니다
    if (!j.ok) throw new Error(j.error || "올리지 못했습니다");
    // 드라이브 보기 화면을 거치면 다운로드가 새 창을 열어 두 번 묻습니다(사용자 시험). 사진 원본을 바로 엽니다 — 길게 눌러 사진 앱에 저장
    var id=(String(j.url).match(/\/d\/([\w-]+)/)||[])[1];
    var q=qrcode(0, "M"); q.addData(id ? "https://drive.google.com/uc?export=view&id="+id : j.url); q.make();
    img.innerHTML=q.createSvgTag({ cellSize:5, margin:2 });
    note.textContent="휴대폰 카메라로 찍으면 사진을 받을 수 있습니다 (2일 동안)";
  }).catch(function(e){
    if (S.blob !== blob) return;
    note.textContent="QR 을 만들지 못했습니다. 인터넷 연결을 확인해 주세요. ("+(e && e.message || e)+")";
  });
}
function freeCanvases(list){
  (list||[]).forEach(function(c){
    if (c && c.__lk){ for (var k in c.__lk.map) free(c.__lk.map[k]); c.__lk=null; }
    if (c && c.width){ c.width=0; c.height=0; }
  });
}

function ticks(done,total){
  var h=""; for (var i=0;i<total;i++) h+='<span class="tick'+(i<done?" done":"")+'"></span>';
  $("ticks").innerHTML=h;
}
function flash(){
  var f=$("flash"); f.classList.add("on");
  return wait(80).then(function(){ f.classList.remove("on"); });
}
function runSession(){
  var L = enabledLayouts()[cur];
  var need = needShots(L), total = shootTotal(L), pick = pickMode();
  S.shots=[]; S.cancelled=false; S.enough=false; ticks(0,total);
  function next(i){
    if (S.cancelled || S.enough || i>=total) return Promise.resolve();
    return waitRelease(i+1, total).then(function(c){
      if (S.cancelled || S.enough) return;
      if (!c){ say("카메라 화면을 읽지 못했습니다."); S.cancelled=true; return; }
      S.shots.push(c); ticks(S.shots.length,total);
      // 칸을 채울 만큼 찍었으면 그만 찍고 고르러 갈 수 있습니다
      if (pick && S.shots.length>=need && S.shots.length<total) $("doneBtn").hidden=false;
      return flash().then(function(){ return wait(700); }).then(function(){ return next(i+1); });
    });
  }
  return next(0).then(function(){
    stopShootTimer(); $("doneBtn").hidden=true;
    if (S.cancelled || S.shots.length<need) return;
    if (pick){ stopStream(); releaseAwake(); openPick(L, shotCount(L)); return; }
    return renderPrint(L, S.shots).then(function(blob){
      setResult(blob, jpgs(S.shots));
      keepResult(L, S.shots, null); S.shots=[];
      setPrintPage(L);
      stopStream(); releaseAwake(); show(resultEl);
    });
  });
}

/* ══════════════════════════════════════════
   합성 — 관리자 설정 그대로 그립니다
   ══════════════════════════════════════════ */
/* 사진에서 w×h 칸 모양으로 잘라낼 부분. src.__c = {x, y}(0~1)는 칸 가운데에 올 사진 속 자리입니다.
   없으면 사진 가운데. 얼굴 찾기(findFaces)와 고르기 화면 미리보기 끌기(pickPrev)가 정합니다.
   src.__z(1 이상)는 키운 배율. 사진과 칸 모양이 같으면 키워야 움직일 여유가 생깁니다. */
function coverBox(src, w, h){
  var sw=src.width, sh=src.height, z=src.__z || 1;
  var ar=w/h, cw=sh*ar, ch=sh;
  if (cw>sw){ cw=sw; ch=sw/ar; }
  cw/=z; ch/=z;
  var a=src.__c || {x:.5, y:.5};
  return { sx:Math.min(Math.max(a.x*sw-cw/2, 0), sw-cw), sy:Math.min(Math.max(a.y*sh-ch/2, 0), sh-ch), cw:cw, ch:ch };
}
function drawCover(ctx, src, x, y, w, h){
  var b=coverBox(src, w, h);
  ctx.drawImage(src,b.sx,b.sy,b.cw,b.ch,x,y,w,h);
}

/* ── 프레임 모양 — 포토샵 스크립트(인생네컷세로 5x7 · 흑백 3컷 띠 5x7)의 설정값 그대로입니다 ── */
var BW_STRIP = "#202020";                       // 흑백 3컷 띠 색 (STRIP_RGB)
/* ── 프레임 색 — 시작 화면 3단계에서 손님이 고릅니다(사용자 요청, 프레임마다 2가지로 줄임). 목록의 첫 번째가 예전부터 쓰던 색이라, 안 고르면 그대로입니다.
   film: 필름 띠 색(바탕·사진 테·구멍·글씨·이음매), strip: 흑백 띠 색, check/fill: 카메라 8컷 바탕(체커·단색), cut: 절취선, bg: 엡손 바깥 여백. */
var FRAME_COLORS = {
  film8: [
    { id:"black", name:"블랙",  dot:"#1B1713", film:{ color:"rgb(27,23,19)", edge:"rgb(56,48,40)", hole:"rgb(238,228,208)", text:"rgb(222,146,64)", seam:"rgb(10,8,6)", scratch:true }, cut:null, bg:"#1B1713" },
    { id:"white", name:"화이트", dot:"#FFFFFF", film:{ color:"#FFFFFF", edge:"#E8E8E8", hole:"#E4E4E4", text:"#999999", seam:"#EBEBEB" }, cut:"#BEBEBE", bg:"#FFFFFF" }
  ],
  bw3: [
    { id:"black", name:"블랙",  dot:"#202020", strip:"#202020", cut:null,      bg:"#202020" },
    { id:"white", name:"화이트", dot:"#FFFFFF", strip:"#FFFFFF", cut:"#BEBEBE", bg:"#FFFFFF" }
  ],
  cam8: [
    { id:"bluechk", name:"블루 체커", dot:"chk:#BAD8FA", check:"#BAD8FA", spark:"#78AAF0", bg:"#BAD8FA" },
    { id:"pinkchk", name:"핑크 체커", dot:"chk:#F9C6DC", check:"#F9C6DC", spark:"#F07AAE", bg:"#F9C6DC" }
  ]
};
FRAME_COLORS.film8t = FRAME_COLORS.film8;   // 옛날필름 4컷도 인생네컷과 같은 색
var frameColorId = null;   // 손님이 고른 색. null 이면 첫 번째(예전 색). 프레임을 새로 고르면 비웁니다
function frameColor(L){
  var list = L && FRAME_COLORS[L.id]; if (!list) return null;
  for (var i=0;i<list.length;i++) if (list[i].id === frameColorId) return list[i];
  return list[0];
}
function filmPal(L){ var fc = frameColor(L); return fc && fc.film ? fc.film : { color:FILM.color, edge:FILM.edge, hole:FILM.hole, text:FILM.text, seam:FILM.seam, scratch:true }; }
function bwColor(L){ var fc = frameColor(L); return fc && fc.strip ? fc.strip : BW_STRIP; }
/* 절취선 색: 첫 번째(예전) 색이면 관리자 화면에서 정한 값, 다른 색이면 그 색에 맞춘 값 */
function cutColor(L){ var fc = frameColor(L); return fc && fc.cut ? fc.cut : L.cut.color; }
/* 카메라 8컷 바탕: 체커(한 칸 75px + 반짝이) 또는 단색. 반짝이 자리는 늘 같게(씨앗 42) */
function drawCamBack(ctx, L){
  var fc = frameColor(L) || {}, W=L.canvas.w, H=L.canvas.h, s=75, x, y, i;
  if (!fc.check){ ctx.fillStyle = fc.fill || "#FFFFFF"; ctx.fillRect(0,0,W,H); return; }
  ctx.fillStyle="#FFFFFF"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=fc.check;
  for (y=0; y<H; y+=s) for (x=0; x<W; x+=s) if (((x/s)+(y/s))%2===0) ctx.fillRect(x,y,s,s);
  var seed=42; function rnd(){ seed=(seed*1103515245+12345)%2147483648; return seed/2147483648; }
  for (i=0;i<40;i++){
    var cx=rnd()*W, cy=rnd()*H, r=14+rnd()*32;
    ctx.fillStyle = rnd()<0.5 ? "#FFFFFF" : fc.spark;
    ctx.beginPath();
    for (var k=0;k<8;k++){ var a=k*Math.PI/4, rr=k%2===0 ? r : r*0.22; ctx.lineTo(cx+rr*Math.cos(a), cy+rr*Math.sin(a)); }
    ctx.closePath(); ctx.fill();
  }
}
var FILM = {
  color:"rgb(27,23,19)", edge:"rgb(56,48,40)", hole:"rgb(238,228,208)", text:"rgb(222,146,64)", seam:"rgb(10,8,6)",
  text1:"STUDIO 042", text2:"SAFETY FILM", font:"bold 21px Helvetica, Arial, sans-serif",   // 5pt = 21px (300dpi)
  holeW:32, holeH:40, pitch:56, pad:12, scratches:14, dust:40
};
function roundPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
  ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
  ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
  ctx.closePath();
}
/* 세로 필름 띠: 띠는 위에서 아래로(길이 = 캔버스 높이), 띠 폭 = 캔버스 폭 ÷ 줄 수.
   칸 자리는 L.slots 에서 읽습니다(같은 x 끼리 한 줄). */
function filmGeom(L){
  var xs=[]; L.slots.forEach(function(s){ if (xs.indexOf(s.x)<0) xs.push(s.x); });
  var thick = L.canvas.w / xs.length, cell = L.slots[0].w;
  var band = (thick - cell) / 2, outer = band - FILM.pad - FILM.holeH;
  return { thick:thick, cell:cell, band:band, outer:outer, strips:xs.length };
}
function drawFilmBack(ctx, L){
  var g=filmGeom(L), W=L.canvas.w, H=L.canvas.h, s, i, pal=filmPal(L);
  ctx.fillStyle=pal.color; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=pal.seam;                        // 띠와 띠가 맞닿는 이음매
  for (s=1; s<g.strips; s++) ctx.fillRect(s*g.thick-1, 0, 2, H);
  ctx.fillStyle=pal.edge;                        // 사진 둘레 얇은 테 (사진보다 3px 크게)
  L.slots.forEach(function(c){ ctx.fillRect(c.x-3, c.y-3, c.w+6, c.h+6); });
  // 띠의 긁힘(띠 방향으로 긴 실선)과 먼지 점 — 투명도 22%, 사진 아래라 사진에는 안 덮입니다. 밝은 띠에서는 안 보여서 뺍니다
  if (pal.scratch){ ctx.save(); ctx.globalAlpha=0.22; ctx.fillStyle="rgb(235,225,205)";
  for (i=0; i<FILM.scratches; i++) ctx.fillRect(Math.random()*W, Math.random()*H, 1, 150+Math.random()*700);
  for (i=0; i<FILM.dust; i++){ var d=2+Math.floor(Math.random()*3); ctx.fillRect(Math.random()*W, Math.random()*H, d, d); }
  ctx.restore(); }
  // 구멍: 띠 길이에 고르게, 가운데 맞춤. 종이색으로 칠합니다(포토샵은 구멍을 뚫어 종이 바탕이 보이게 함)
  var n=Math.floor((H-FILM.holeW)/FILM.pitch)+1, h0=Math.round((H-((n-1)*FILM.pitch+FILM.holeW))/2);
  ctx.fillStyle=pal.hole;
  for (s=0; s<g.strips; s++){
    var b1=s*g.thick+g.band-FILM.pad-FILM.holeH, b2=s*g.thick+g.band+g.cell+FILM.pad;
    for (i=0; i<n; i++){
      var a=h0+i*FILM.pitch;
      roundPath(ctx, b1, a, FILM.holeH, FILM.holeW, 5); ctx.fill();
      roundPath(ctx, b2, a, FILM.holeH, FILM.holeW, 5); ctx.fill();
    }
  }
}
/* 칸마다 앞쪽 띠에 "STUDIO 042 · SAFETY FILM · 번호", 뒤쪽 띠에 "▷ 번호A · 번호". 위에서 아래로 읽게 돌립니다. */
function drawFilmText(ctx, L){
  var g=filmGeom(L), aw=21, ah=7;
  ctx.save(); ctx.fillStyle=filmPal(L).text; ctx.font=FILM.font; ctx.textBaseline="middle"; ctx.textAlign="left";
  function txt(str, a, bc){ ctx.save(); ctx.translate(bc, a); ctx.rotate(Math.PI/2); ctx.fillText(str, 0, 0); ctx.restore(); }
  L.slots.forEach(function(c, k){
    var s=Math.floor(c.x/g.thick), a=c.y, num=String(k+1);
    var front=s*g.thick+g.outer/2, back=(s+1)*g.thick-g.outer/2;
    txt(FILM.text1, a+14, front);
    txt(FILM.text2, a+Math.round(c.h*0.42), front);
    txt(num, a+c.h-30, front);
    ctx.beginPath(); ctx.moveTo(back-ah, a+14); ctx.lineTo(back, a+14+aw); ctx.lineTo(back+ah, a+14); ctx.closePath(); ctx.fill();
    txt(num+"A", a+22+aw, back);
    txt(num, a+c.h-30, back);
  });
  ctx.restore();
}
/* 고르기 화면에서 손님이 고른 색감을 입힌 사진. 인화에는 어차피 칸 크기로 잘려 들어가니, 칸 크기(w×h)로 먼저
   줄이고 거기에 색감을 입힙니다(원본 160만 픽셀에 입히는 것보다 훨씬 빠르고 결과는 같습니다).
   같은 사진·같은 색감·같은 칸 크기면 다시 안 만듭니다. */
function lookKey(f){
  return [f.id,f.brightness,f.contrast,f.saturate,f.sepia,f.hue,f.smooth,f.detail,f.fade,f.vignette,
          f.tint ? f.tint.color+f.tint.mode+f.tint.amount : "", f.lut ? f.lut.id : "", f.lutAmount].join("|");
}
function lookCanvas(src, f, w, h){
  w=Math.max(1,Math.round(w)); h=Math.max(1,Math.round(h));
  var a=src.__c, key=lookKey(f)+"|"+w+"x"+h+"|"+(a ? a.x.toFixed(4)+","+a.y.toFixed(4) : "")+"|"+(src.__z||1).toFixed(3), mem=src.__lk || (src.__lk={ keys:[], map:{} });
  if (mem.map[key]) return mem.map[key];
  var tmp=document.createElement("canvas"); tmp.width=w; tmp.height=h;
  drawCover(tmp.getContext("2d"), src, 0, 0, w, h);
  var out=document.createElement("canvas"); out.width=w; out.height=h;
  drawLook(out, tmp, f, false, null);
  free(tmp);
  // 칸 크기라 작아서 색감 3개쯤은 다 기억해 둡니다(번갈아 눌러도 다시 안 그림). 많아지면 오래된 것부터 비웁니다.
  mem.map[key]=out; mem.keys.push(key);
  while (mem.keys.length>8){ var old=mem.keys.shift(); free(mem.map[old]); delete mem.map[old]; }
  return out;
}
/* lk: 입힐 색감(없으면 사진 그대로). 카메라로 찍은 사진은 찍을 때 이미 보정이 들어가 있어 lk 를 주지 않습니다.
   flip: 칸 안의 사진만 좌우로 뒤집습니다(결과 화면 "좌우 반전"). 프레임 글씨는 그대로입니다. */
function renderPrint(L, shots, lk, flip){
  var c=document.createElement("canvas");
  c.width=L.canvas.w; c.height=L.canvas.h;
  var ctx=c.getContext("2d");
  ctx.fillStyle="#FFFFFF"; ctx.fillRect(0,0,c.width,c.height);

  return Promise.all([getImage(bgKeyFor(L)), frameImage(L),
                      (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve()])
    .then(function(r){
      var bg=r[0], fr=r[1];
      if (bg) ctx.drawImage(bg.img, 0,0, c.width, c.height);
      if (L.style === "film") drawFilmBack(ctx, L);
      if (L.style === "bw"){ ctx.fillStyle = bwColor(L); ctx.fillRect(0,0,c.width,c.height); }
      if (L.style === "camera") drawCamBack(ctx, L);
      if (L.style === "bwv"){ ctx.fillStyle = L.bg; ctx.fillRect(0,0,c.width,c.height); }

      var look = lk || activeFilter();
      L.slots.forEach(function(s){
        var src = shots[s.shot % shots.length];
        if (!src) return;
        if (lk) src = lookCanvas(src, lk, s.w, s.h);
        // r: 사진 모서리 둥글기(흑백 3컷 띠). 칸 모양으로 잘라 그립니다.
        if (s.r){ ctx.save(); roundPath(ctx, s.x, s.y, s.w, s.h, s.r); ctx.clip(); }
        if (flip){ ctx.save(); ctx.translate(2*s.x+s.w, 0); ctx.scale(-1, 1); }
        drawCover(ctx, src, s.x, s.y, s.w, s.h);
        if (flip) ctx.restore();
        // 비네팅은 칸마다 겁니다. 촬영 화면에서 보이던 것과 같은 모양이 됩니다.
        drawVignette(ctx, s.x, s.y, s.w, s.h, look);
        if (L.style === "bwv") drawVintage(ctx, s.x, s.y, s.w, s.h);
        if (s.r) ctx.restore();
      });
      if (L.style === "film") drawFilmText(ctx, L);

      if (L.cut && L.cut.on){
        ctx.strokeStyle=cutColor(L); ctx.lineWidth=2; ctx.setLineDash([11,11]);
        ctx.beginPath(); ctx.moveTo(L.cut.x,40); ctx.lineTo(L.cut.x, c.height-40); ctx.stroke();
        ctx.setLineDash([]);
      }

      L.texts.forEach(function(t){
        ctx.fillStyle=t.color; ctx.font=fontOf(t); ctx.textAlign=t.align; ctx.textBaseline="alphabetic";
        if ("letterSpacing" in ctx) ctx.letterSpacing = (t.ls||0)+"px";   // 자간 (ls). 옛 브라우저는 없이 그립니다
        // rot: 글자를 (x, y) 를 중심으로 돌립니다. -90 이면 아래에서 위로 읽는 세로 글씨입니다.
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate((t.rot||0)*Math.PI/180);
        ctx.fillText(resolveText(t.content), 0, 0);
        ctx.restore();
      });
      if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

      if (fr) ctx.drawImage(fr.img, 0,0, c.width, c.height);
      return new Promise(function(res){ c.toBlob(res,"image/jpeg",0.95); });
    });
}
function setPrintPage(L){
  var el=$("pageSize"); if (!el) return;
  var w=(L.canvas.w/300).toFixed(2), h=(L.canvas.h/300).toFixed(2);
  el.textContent = "@page{ size:"+w+"in "+h+"in; margin:0 }";
}

/* ── 사진 고르기 ──────────────────────────
   찍은 사진을 격자로 보여주고, 손님이 누른 순서대로 1번 칸, 2번 칸… 에 넣습니다.
   고를 때마다 인화지를 다시 그려 왼쪽에 보여줍니다. */
var P = { L:null, need:0, picks:[], url:null, token:0, look:null };
var orientFixed = false;   // 가로·세로를 첫 화면에서 골랐는지(그러면 고르기 화면에 가로·세로 버튼을 안 둡니다)
/* 컷 버튼 옆의 색감 버튼 — 관리자에서 '고르기 화면에 보이기'를 켠 보정(최대 3개).
   카메라로 찍은 사진은 찍을 때 보정이 이미 들어갔으니, 불러온·실시간 사진(P.imported)일 때만 보입니다. */
var pickLookId = null;
function pickLooks(){ return allFilters().filter(function(f){ return f.pick; }).slice(0,3); }
function lookChips(){
  // 옛날필름 4컷(bwPick)은 카메라로 찍은 사진도 컬러·흑백을 고릅니다(사용자 요청). 흑백은 흑백 3컷 띠와 같은 보정(bwstrip)
  var bw = !P.imported && P.L && P.L.bwPick ? filterById("bwstrip") : null;
  var looks = bw ? [{id:"", name:"컬러"}, {id:bw.id, name:"흑백"}] : pickLooks(), on=(P.imported || !!bw) && looks.length>0;
  $("pickLooks").hidden = !on; $("pickSep").hidden = !on || $("pickFrames").hidden;
  if (!on){ P.look=null; return; }
  if (!looks.some(function(l){ return l.id===pickLookId; })) pickLookId=looks[0].id;
  buildChips($("pickLooks"), looks, pickLookId, false);
  P.look = pickLookId ? filterById(pickLookId) : null;   // 컬러("")는 찍은 그대로
}
$("pickLooks").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  pickLookId=b.dataset.v; P.look = pickLookId ? filterById(pickLookId) : null;
  pressOnly($("pickLooks"), pickLookId);
  refreshPick();
});
/* 컷·색감 버튼 줄의 실제 높이를 재서 필름 크기 계산(CSS --rowh)에 알려 줍니다. 좁아서 줄이 바뀌면 필름이 그만큼 줄어듭니다. */
function fitPick(){ pickEl.style.setProperty("--rowh", ($("pickRow").offsetHeight || 37)+"px"); }
window.addEventListener("resize", fitPick);
function addPickThumb(c, i){
  var b=document.createElement("button");
  b.className="pk"; b.dataset.i=i; b.setAttribute("aria-pressed","false");
  b.setAttribute("aria-label", (i+1)+"번째 사진");
  b.appendChild(c);   // 찍은 캔버스를 그대로 씁니다. 섬네일을 따로 만들면 메모리가 두 배가 됩니다.
  b.appendChild(document.createElement("span")).className="no";
  $("pickGrid").appendChild(b);
}
function instaxOrients(){ return ["h","v"].filter(function(o){ return instaxFrames(o).length; }); }
function pickChips(){
  buildChips($("pickFrames"), enabledLayouts().map(function(f, i){ return {id:i, name:shotCount(f)+"컷"}; }), cur, false);
  // 불러온 사진이 칸보다 적으면 그 프레임은 못 쓰니 눌리지 않게 합니다
  Array.prototype.forEach.call($("pickFrames").children, function(b, i){
    b.disabled = shotCount(enabledLayouts()[i]) > S.shots.length;
  });
}
function openPick(L, need, imported){
  P.L=L; P.need=need; P.picks=[]; P.imported=!!imported;
  setPickAr();
  // 인스탁스 부스는 여기서 프레임도 고릅니다. 불러온 사진은 가로·세로도 여기서 고릅니다.
  $("pickFrames").hidden = !instaxOn();
  $("pickOrient").hidden = !P.imported || orientFixed;
  pickEl.classList.toggle("withOrient", !$("pickOrient").hidden);   // 가로·세로 버튼이 있으면 필름을 조금 작게(자리 확보)
  if (P.imported && !orientFixed) buildChips($("pickOrient"), instaxOrients().map(function(o){ return {id:o, name:o==="h" ? "가로" : "세로"}; }), instaxOrient, false);
  pickLookId = null; lookChips();      // 손님마다 첫 번째 색감에서 시작합니다
  $("pickGrid").innerHTML = "";
  S.shots.forEach(function(c, i){ addPickThumb(c, i); });
  show(pickEl);
  fitPick();
  refreshPick();
}
function refreshPick(){
  Array.prototype.forEach.call($("pickGrid").children, function(b){
    var at = P.picks.indexOf(Number(b.dataset.i));
    b.setAttribute("aria-pressed", String(at>=0));
    b.lastChild.textContent = at>=0 ? at+1 : "";
  });
  $("pickTitle").textContent = "마음에 드는 사진을 골라주세요 · "+P.picks.length+" / "+P.need;
  $("pickDone").disabled = P.picks.length < P.need;
  $("pickDone").textContent = instaxOn() ? "인화하기" : "이 사진으로 완성";
  renderPick();
}
/* 미리보기만 다시 그립니다. 그리는 중에 또 부르면(끌어 옮기는 중) 지금 것이 끝난 뒤 한 번만 더 그립니다. */
function renderPick(){
  if (P.busy){ P.again=true; return; }
  P.busy=true; P.again=false;
  // 아직 안 고른 칸은 비워 둔 채로 그립니다
  var shots=[]; for (var k=0;k<P.need;k++) shots.push(S.shots[P.picks[k]]);
  var token=++P.token;
  function next(){ P.busy=false; if (P.again) renderPick(); }
  renderPrint(P.L, shots, P.look).then(function(blob){
    if (token===P.token){   // 그사이 고르기 화면을 닫았으면 버립니다
      if (P.url) URL.revokeObjectURL(P.url);
      P.url=URL.createObjectURL(blob); $("pickPrev").src=P.url;
    }
    next();
  }, next);
}
/* 미리보기에서 칸 안의 사진을 끌어 위치를 옮기고, 휠(두 손가락 스크롤)·핀치로 키웁니다.
   사진이 칸보다 넘치는 쪽으로만 움직이니, 칸과 모양이 같은 가로 칸은 먼저 조금 키워야 움직입니다. */
var drag=null, PICK_ZMAX=3;
function slotAt(e){
  var r=$("pickPrev").getBoundingClientRect(), W=P.L.canvas.w, H=P.L.canvas.h;
  var k=Math.max(r.width/W, r.height/H);   // 인스탁스 미리보기는 object-fit:cover 라 넘친 가장자리가 잘려 보입니다
  var x=(e.clientX-r.left-(r.width-W*k)/2)/k, y=(e.clientY-r.top-(r.height-H*k)/2)/k;
  var s=P.L.slots.filter(function(s){ return x>=s.x && x<s.x+s.w && y>=s.y && y<s.y+s.h; })[0];
  var src=s && S.shots[P.picks[s.shot % P.need]];
  return src ? { s:s, src:src, k:k } : null;
}
// 끝에 닿은 채 더 민 만큼이 쌓이지 않게, 지금 실제로 보이는 자리로 맞춥니다
function settle(src, s){
  var b=coverBox(src, s.w, s.h);
  src.__c={ x:(b.sx+b.cw/2)/src.width, y:(b.sy+b.ch/2)/src.height };
}
function zoomBy(t, f){
  t.src.__z=Math.min(Math.max((t.src.__z||1)*f, 1), PICK_ZMAX);
  settle(t.src, t.s); renderPick();
}
$("pickPrev").addEventListener("pointerdown", function(e){
  if (!P.L) return;
  var t=slotAt(e); if (!t) return;
  settle(t.src, t.s);
  drag={ src:t.src, s:t.s, k:t.k, x:e.clientX, y:e.clientY, a:t.src.__c };
  this.setPointerCapture(e.pointerId); e.preventDefault();
});
$("pickPrev").addEventListener("wheel", function(e){
  if (!P.L) return;
  var t=slotAt(e); if (!t) return;
  e.preventDefault();
  zoomBy(t, Math.exp(-e.deltaY*(e.ctrlKey ? 0.01 : 0.002)));   // ctrlKey: 크롬의 트랙패드 핀치
}, { passive:false });
// 사파리 트랙패드 핀치
var pinch=null;
$("pickPrev").addEventListener("gesturestart", function(e){ pinch=P.L && slotAt(e); if (pinch) pinch.z=pinch.src.__z||1; });
$("pickPrev").addEventListener("gesturechange", function(e){
  if (!pinch) return;
  e.preventDefault();
  zoomBy(pinch, pinch.z*e.scale/(pinch.src.__z||1));
});
$("pickPrev").addEventListener("gestureend", function(){ pinch=null; });
$("pickPrev").addEventListener("pointermove", function(e){
  if (!drag) return;
  var src=drag.src, sw=src.width, sh=src.height, b=coverBox(src, drag.s.w, drag.s.h);
  var px=b.cw/drag.s.w/drag.k;   // 화면 1px 이 사진 몇 px 인지
  function clamp(v, half){ return Math.min(Math.max(v, half), 1-half); }
  src.__c={ x:clamp(drag.a.x-(e.clientX-drag.x)*px/sw, b.cw/2/sw), y:clamp(drag.a.y-(e.clientY-drag.y)*px/sh, b.ch/2/sh) };
  renderPick();
});
function dragEnd(){ drag=null; }
$("pickPrev").addEventListener("pointerup", dragEnd);
$("pickPrev").addEventListener("pointercancel", dragEnd);
function closePick(){
  P.token++; $("pickGrid").innerHTML="";
  if (P.url){ URL.revokeObjectURL(P.url); P.url=null; }
  $("pickPrev").removeAttribute("src");
}
$("pickGrid").addEventListener("click", function(e){
  var b=e.target.closest(".pk"); if(!b) return;
  var i=Number(b.dataset.i), at=P.picks.indexOf(i);
  if (at>=0) P.picks.splice(at,1);
  else if (P.picks.length<P.need) P.picks.push(i);
  else { say(P.need+"장을 다 골랐습니다. 바꾸려면 고른 사진을 한 번 더 눌러 빼주세요."); return; }
  refreshPick();
});
function setPickAr(){
  // 인스탁스는 컷 수와 상관없이 사진 목록 크기를 같게 합니다(가로 3:2, 세로 2:3). 칸 모양으로 잘리는 건 오른쪽 미리보기가 보여 줍니다.
  // 셀프042: 촬영 화면과 같은 칸 모양(첫 칸 가로:세로, 인생네컷 1:1)으로 가운데를 잘라 보여 줍니다(사용자 요청).
  var s0 = (P.L && P.L.slots[0]) || {w:1,h:1};
  var ar = s0.w+" / "+s0.h;
  $("pickGrid").style.setProperty("--ar", ar);
  setFilm(P.L);
}
/* 프레임을 바꾸면 칸 수가 달라집니다. 넘치는 고른 사진은 뒤에서부터 뺍니다. */
$("pickFrames").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  cur = Number(b.dataset.v);
  P.L = enabledLayouts()[cur]; P.need = shotCount(P.L);
  P.picks = P.picks.slice(0, P.need);
  pressOnly($("pickFrames"), cur);
  setPickAr();
  refreshPick();
});
$("pickOrient").addEventListener("click", function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  instaxOrient = b.dataset.v; cur = 0;
  P.L = enabledLayouts()[cur]; P.need = shotCount(P.L);
  P.picks = P.picks.slice(0, P.need);
  pressOnly($("pickOrient"), instaxOrient);
  pickChips(); setPickAr(); refreshPick();
});

$("pickDone").addEventListener("click", function(){
  if (P.picks.length<P.need) return;
  var shots=P.picks.map(function(i){ return S.shots[i]; });
  $("pickDone").disabled=true;
  renderPrint(P.L, shots, P.look).then(function(blob){
    var origs = jpgs(S.shots);   // 원본 캔버스는 바로 뒤에 비워지므로 지금 JPG 글자로 바꿔 둡니다
    closePick(); keepResult(P.L, shots, P.look);
    freeCanvases(S.shots.filter(function(c){ return shots.indexOf(c) < 0; })); S.shots=[];
    setPrintPage(P.L);
    openSticker(blob, origs);   // 스티커 화면을 거쳐 결과 화면으로 갑니다(사용자 요청)
  });
});

/* ── 스티커 — 손님이 인화 사진 위에 스티커를 붙입니다(사용자 요청, 낙서 화면 대신) ──
   스티커 자리·크기는 사진 크기에 대한 비율(x·y 는 가운데 0~1, s 는 사진 너비에 대한 폭)로 모아 두었다가,
   인화 크기(1500×2100) 사진 위에 그대로 키워 붙입니다. 좌우 반전을 누르면 사진만 뒤집고 스티커는 그대로 다시 붙입니다(S.res.stickers).
   기본 8종은 직접 그린 SVG(w·h 는 viewBox 크기), 나머지 탭은 아래 STICKER_FILES 의 PNG 입니다. */
var STICKERS = [
  { id:"heart", w:100, h:100, svg:'<path d="M50 86C20 64 8 48 8 32 8 18 19 9 31 9c8 0 15 4 19 11 4-7 11-11 19-11 12 0 23 9 23 23 0 16-12 32-42 54z" fill="#F06A8A" stroke="#fff" stroke-width="5"/>' },
  { id:"star", w:100, h:100, svg:'<path d="M50 6l12 30 32 2-25 20 8 32-27-18-27 18 8-32L6 38l32-2z" fill="#F4D03F" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' },
  { id:"spark", w:100, h:100, svg:'<path d="M50 4C54 38 62 46 96 50 62 54 54 62 50 96 46 62 38 54 4 50 38 46 46 38 50 4z" fill="#fff"/>' },
  { id:"smile", w:100, h:100, svg:'<circle cx="50" cy="50" r="42" fill="#FFD84D" stroke="#fff" stroke-width="5"/><circle cx="36" cy="42" r="5" fill="#333"/><circle cx="64" cy="42" r="5" fill="#333"/><path d="M32 60q18 18 36 0" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round"/>' },
  { id:"crown", w:100, h:100, svg:'<path d="M10 74L16 30 36 50 50 20 64 50 84 30 90 74z" fill="#E8B84A" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' },
  { id:"flower", w:100, h:100, svg:'<g fill="#F7A8C8" stroke="#fff" stroke-width="4"><circle cx="50" cy="24" r="17"/><circle cx="76" cy="44" r="17"/><circle cx="66" cy="74" r="17"/><circle cx="34" cy="74" r="17"/><circle cx="24" cy="44" r="17"/></g><circle cx="50" cy="52" r="12" fill="#FFD84D"/>' },
  { id:"love", w:100, h:56, svg:'<rect x="4" y="6" width="92" height="44" rx="22" fill="#fff"/><text x="50" y="37" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="24" fill="#E8577E">LOVE</text>' },
  { id:"s042", w:100, h:56, svg:'<rect x="4" y="6" width="92" height="44" rx="8" fill="#1B1713" stroke="#C9B48A" stroke-width="3"/><text x="50" y="37" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#C9B48A">042</text>' }
];
/* 사용자가 준 이미지에서 오려 낸 스티커(stickers/폴더/이름.png, 흰 바탕을 지운 투명 PNG). [이름, 가로, 세로]
   원본 이미지가 작아 크게 붙이면 인화에서 흐릴 수 있습니다. 카메라는 스티커에서 빼고 카메라 8컷 프레임으로 옮겼습니다(사용자 요청). */
var STICKER_FILES = {
  chrome:[["chr01",168,170],["chr02",191,265],["chr03",196,222],["chr04",154,115],["chr05",159,155],["chr06",203,217],["chr07",159,158],["chr08",213,218],["chr09",147,144],["chr10",406,311],["chr11",147,141],["chr12",143,147],["chr13",398,206],["chr14",197,270],["chr15",155,162],["chr16",141,176],["chr17",186,255],["chr18",227,223],["chr19",167,159],["chr20",143,146]],
  letter:[["letB01",133,151],["letB02",133,148],["letB03",128,146],["letB04",136,154],["letB05",136,152],["letB06",134,147],["letB07",137,148],["letB08",121,149],["letB09",131,146],["letB10",128,138],["letB11",133,144],["letB12",133,148],["letB13",139,148],["letB14",128,150],["letB15",132,149],["letB16",129,146],["letB17",136,150],["letB18",135,146],["letB19",127,148],["letB20",132,145],["letB21",129,148],["letB22",119,147],["letB23",145,146],["letB24",131,146],["letB25",128,146],["letB26",129,143]],
  tape:[["tape01",312,115],["tape02",210,91],["tape03",164,103],["tape04",280,98],["tape05",226,108],["tape06",196,81],["tape07",145,57],["tape08",161,59],["tape09",216,93],["tape10",144,54],["tape11",204,68],["tape12",134,45],["tape13",146,93],["tape14",251,67],["tape15",273,76],["tape16",253,74],["tape17",254,87],["tape18",194,65],["tape19",159,63],["tape20",207,82],["tape21",151,60],["tape22",179,72],["tape23",115,45],["tape24",231,65],["tape25",260,69],["tape26",206,67],["tape27",187,62],["tape28",217,71],["tape29",210,85],["tape30",243,69],["tape31",131,52],["tape32",206,55],["tape33",207,63],["tape34",151,73],["tape35",172,65],["tape36",184,72],["tape37",188,73],["tape38",140,58],["tape39",246,87],["tape40",157,54],["tape41",151,53],["tape42",160,65],["tape43",187,70],["tape44",148,70],["tape45",183,75],["tape46",173,62],["tape47",448,142],["tape48",239,80],["tape49",173,61],["tape50",134,51],["tape51",184,95],["tape52",218,125],["tape53",288,52],["tape54",240,46],["tape55",290,59],["tape56",136,67],["tape57",226,79],["tape58",186,58],["tape59",130,61]]
};
/* 탭: 이름, 처음 붙는 폭(사진 너비에 대한 비율) */
var STK_TABS = [
  { id:"basic",  name:"기본",   size:0.22 },
  { id:"chrome", name:"크롬",   size:0.2 },
  { id:"letter", name:"글자",   size:0.1 },
  { id:"tape",   name:"테이프", size:0.35 }
];
var STK_MIN = 0.04, STK_MAX = 0.95;   // 가장 작게·크게(사진 너비에 대한 폭)
STICKERS.forEach(function(t){
  t.tab = "basic";
  t.url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+t.w+' '+t.h+'" width="'+t.w*4+'" height="'+t.h*4+'">'+t.svg+'</svg>');
});
Object.keys(STICKER_FILES).forEach(function(tab){
  STICKER_FILES[tab].forEach(function(f){ STICKERS.push({ id:f[0], tab:tab, w:f[1], h:f[2], url:"stickers/"+tab+"/"+f[0]+".png" }); });
});
function stickerById(id){ for (var i=0;i<STICKERS.length;i++) if (STICKERS[i].id===id) return STICKERS[i]; return null; }
function stickerImg(t){ if (!t.img){ t.img = new Image(); t.img.src = t.url; } return t.img; }   // 쓸 때 처음 받습니다
function tabById(id){ for (var i=0;i<STK_TABS.length;i++) if (STK_TABS[i].id===id) return STK_TABS[i]; return STK_TABS[0]; }
var K = { blob:null, origs:null, url:null, items:[], sel:null, drag:null, stop:null, busy:false };
var stkTab = "basic";
function buildStickerPal(){
  var pal=$("stkPal"); pal.innerHTML=""; pal.scrollTop=0;
  STICKERS.forEach(function(t){
    if (t.tab !== stkTab) return;
    var b=document.createElement("button"), im=document.createElement("img");
    b.className="stk-btn"; b.dataset.id=t.id; b.setAttribute("aria-label", t.id+" 스티커");
    im.src=t.url; im.alt=""; im.loading="lazy"; im.draggable=false;
    b.appendChild(im); pal.appendChild(b);
  });
}
(function(){
  var pal=$("stkPal");
  buildChips($("stkTabs"), STK_TABS, stkTab, false);
  buildStickerPal();
  $("stkTabs").addEventListener("click", function(e){
    var b=e.target.closest(".chip"); if (!b) return;
    stkTab=b.dataset.v; pressOnly($("stkTabs"), stkTab); buildStickerPal();
  });
  pal.addEventListener("click", function(e){
    var b=e.target.closest(".stk-btn"); if (!b || K.busy) return;
    addSticker(b.dataset.id);
  });
})();
function openSticker(blob, origs){
  K.blob=blob; K.origs=origs; K.busy=false; clearStickers();
  if (K.url) URL.revokeObjectURL(K.url);
  K.url=URL.createObjectURL(blob);
  $("stkImg").src=K.url;
  show(stickerEl);
  if (K.stop) K.stop();
  K.stop=countdown($("stkTimer"), function(){ K.stop=null; finishSticker(); });   // 시간이 끝나면 붙인 그대로 완성
}
function clearStickers(){
  K.items.forEach(function(it){ it.el.remove(); });
  K.items=[]; K.sel=null; K.drag=null; K.hdrag=null; stickerHandles();
}
function placeSticker(it){
  var t=stickerById(it.id);
  it.el.style.left=(it.x*100)+"%"; it.el.style.top=(it.y*100)+"%"; it.el.style.width=(it.s*100)+"%";
  it.el.style.transform="translate(-50%,-50%) rotate("+it.r+"deg)";
  it.el.style.aspectRatio=t.w+" / "+t.h;
  if (it === K.sel) stickerHandles();
}
/* 고른 스티커 모서리의 손잡이 3개(✕ 빼기 · ↻ 돌리기 · ⤡ 크기). 스티커가 돌아가면 손잡이도 같이 돕니다(사용자 요청, 견본 A).
   예전 크게·작게·돌리기·빼기 버튼 줄은 다음 버튼 바로 위라 다음이 잘못 눌려서 뺐습니다. */
function stickerHandles(){
  var box=$("stkHandles"), it=K.sel;
  box.hidden = !it || K.busy;
  if (box.hidden) return;
  var st=$("stkStage"), W=st.clientWidth, H=st.clientHeight, t=stickerById(it.id);
  var w=it.s*W, h=w*t.h/t.w, cx=it.x*W, cy=it.y*H, a=it.r*Math.PI/180, co=Math.cos(a), si=Math.sin(a), pad=12;
  var hs=box.children;
  function at(el, dx, dy){ el.style.left=(cx+dx*co-dy*si)+"px"; el.style.top=(cy+dx*si+dy*co)+"px"; }
  at(hs[0], -(w/2+pad), -(h/2+pad));   // ✕ 왼쪽 위
  at(hs[1],  (w/2+pad), -(h/2+pad));   // ↻ 오른쪽 위
  at(hs[2],  (w/2+pad),  (h/2+pad));   // ⤡ 오른쪽 아래
}
window.addEventListener("resize", function(){ if (!stickerEl.hidden) stickerHandles(); });
function selectSticker(it){
  if (K.sel) K.sel.el.classList.remove("sel");
  K.sel=it || null;
  if (K.sel) K.sel.el.classList.add("sel");
  stickerHandles();
}
function addSticker(id){
  var t=stickerById(id), el=document.createElement("img"), size=tabById(t.tab).size;
  el.src=t.url; el.className="stk"; el.draggable=false; el.alt="";
  if (t.tab === "basic" && t.w > t.h) size *= 1.4;   // 기본 LOVE·042 는 옆으로 길어서 조금 크게
  var it={ id:id, x:0.5, y:0.5, s:size, r:0, el:el };
  $("stkStage").appendChild(el); K.items.push(it); placeSticker(it); selectSticker(it);
}
$("stkStage").addEventListener("pointerdown", function(e){
  if (K.busy) return;
  var it=null;
  for (var i=0;i<K.items.length;i++) if (K.items[i].el===e.target) it=K.items[i];
  selectSticker(it);
  if (!it) return;
  e.preventDefault(); this.setPointerCapture(e.pointerId);
  var r=this.getBoundingClientRect();
  K.drag={ it:it, dx:(e.clientX-r.left)/r.width-it.x, dy:(e.clientY-r.top)/r.height-it.y };
  K.items.splice(K.items.indexOf(it),1); K.items.push(it); this.appendChild(it.el);   // 누른 스티커를 맨 위로
});
$("stkStage").addEventListener("pointermove", function(e){
  if (!K.drag) return;
  var r=this.getBoundingClientRect(), it=K.drag.it;
  it.x=Math.min(1, Math.max(0, (e.clientX-r.left)/r.width-K.drag.dx));
  it.y=Math.min(1, Math.max(0, (e.clientY-r.top)/r.height-K.drag.dy));
  placeSticker(it);
});
function stickerUp(){ K.drag=null; }
$("stkStage").addEventListener("pointerup", stickerUp);
$("stkStage").addEventListener("pointercancel", stickerUp);
/* 손잡이: ✕ 는 누르면 빼고, ↻ 는 끄는 방향으로 돌리고, ⤡ 는 스티커 가운데에서 멀어지면 커지고 가까워지면 작아집니다 */
$("stkHandles").addEventListener("pointerdown", function(e){
  var h=e.target.closest(".stk-h"), it=K.sel; if (!h || !it || K.busy) return;
  e.preventDefault(); e.stopPropagation();
  if (h.dataset.a === "del"){ it.el.remove(); K.items.splice(K.items.indexOf(it),1); selectSticker(null); return; }
  h.setPointerCapture(e.pointerId);
  var r=$("stkStage").getBoundingClientRect(), cx=r.left+it.x*r.width, cy=r.top+it.y*r.height;
  K.hdrag={ a:h.dataset.a, it:it, cx:cx, cy:cy, W:r.width,
            d0:Math.max(1, Math.hypot(e.clientX-cx, e.clientY-cy)), a0:Math.atan2(e.clientY-cy, e.clientX-cx), s0:it.s, r0:it.r };
});
$("stkHandles").addEventListener("pointermove", function(e){
  var g=K.hdrag; if (!g) return;
  if (g.a === "size") g.it.s = Math.min(STK_MAX, Math.max(STK_MIN, g.s0 * Math.hypot(e.clientX-g.cx, e.clientY-g.cy) / g.d0));
  else g.it.r = (g.r0 + (Math.atan2(e.clientY-g.cy, e.clientX-g.cx) - g.a0) * 180/Math.PI + 360) % 360;
  placeSticker(g.it);
});
function handleUp(){ K.hdrag=null; }
$("stkHandles").addEventListener("pointerup", handleUp);
$("stkHandles").addEventListener("pointercancel", handleUp);
$("stkDone").addEventListener("click", function(){ finishSticker(); });
/* 스티커를 인화 사진 크기 그대로 붙여 새 JPG 를 만듭니다. 스티커가 없으면 그대로 돌려줍니다. */
function applyStickers(blob, list){
  if (!list || !list.length) return Promise.resolve(blob);
  var imgs=list.map(function(it){ return stickerImg(stickerById(it.id)); });
  return Promise.all([createImageBitmap(blob)].concat(imgs.map(function(im){ return im.decode(); }))).then(function(r){
    var bm=r[0], c=document.createElement("canvas"); c.width=bm.width; c.height=bm.height;
    var ctx=c.getContext("2d"); ctx.drawImage(bm, 0, 0); bm.close();
    list.forEach(function(it, i){
      var t=stickerById(it.id), w=it.s*c.width, h=w*t.h/t.w;
      ctx.save(); ctx.translate(it.x*c.width, it.y*c.height); ctx.rotate(it.r*Math.PI/180);
      ctx.drawImage(imgs[i], -w/2, -h/2, w, h); ctx.restore();
    });
    return new Promise(function(res){ c.toBlob(function(b){ free(c); res(b); }, "image/jpeg", 0.95); });
  });
}
function finishSticker(){
  if (K.busy || stickerEl.hidden) return;
  K.busy=true; stickerUp();
  if (K.stop){ K.stop(); K.stop=null; }
  var list=K.items.map(function(it){ return { id:it.id, x:it.x, y:it.y, s:it.s, r:it.r }; }), plain=K.blob, origs=K.origs;
  applyStickers(plain, list).then(function(blob){
    if (S.res) S.res.stickers = list;
    // 스티커를 붙였으면 스티커 없는 프레임도 아이맥 보관 폴더에 같이 남깁니다(사용자 요청)
    setResult(blob, origs, null, list.length ? plain : null);
    K.origs=null; clearStickers();
    $("stkImg").removeAttribute("src");
    if (K.url){ URL.revokeObjectURL(K.url); K.url=null; }
    show(resultEl);
  }).catch(function(e){
    K.busy=false; say("꾸민 사진을 만들지 못했습니다. ("+(e && e.message || e)+")");
  });
}
$("pickQuit").addEventListener("click", function(){
  ask("찍은 사진을 버리고 처음으로 돌아갈까요?", function(){
    closePick(); freeCanvases(S.shots); S.shots=[]; readyMode(true); show(setupEl);
  });
});

/* ── 손님 버튼 ────────────────────────── */
$("startBtn").addEventListener("click", function(){
  hush();
  var L = enabledLayouts()[cur];
  if (!L){ say("관리자 화면에서 인화 방식을 하나 이상 켜주세요."); return; }
  var s0 = L.slots[0] || {w:2,h:3};
  $("stage").style.setProperty("--ar", s0.w+" / "+s0.h);
  $("stage").style.setProperty("--ar-num", s0.w/s0.h);
  show(shootEl); ticks(0, shootTotal(L)); applyPreviewFilter(); keepAwake();
  // 카메라가 켜지면 바로 릴리즈 촬영을 기다립니다(촬영 시작 버튼 없이, 사용자 요청).
  // 켜지는 동안 촬영 시작·카메라 전환 버튼이 잠깐 보이지 않게 숨기고 안내만 띄웁니다(사용자 요청).
  readyMode(false); $("shootHint").textContent = "카메라를 켜는 중입니다";
  openCamera()
    .then(function(){
      readyMode(false);
      stopShootTimer(); S.stopShootTimer = countdown($("shootTimer"), shootTimeUp);
      return runSession().catch(function(){ readyMode(true); });
    })
    .catch(function(err){ stopShootTimer(); say(cameraError(err),0); releaseAwake(); show(setupEl); });
});

/* ── 제한 시간 — 촬영·꾸미기 각각 3분(사용자 요청) ──
   box 안의 b 에 남은 시간(m:ss), .bar i 에 줄어드는 막대를 그리고, 0 이 되면 onEnd 를 한 번 부릅니다. 멈추는 함수를 돌려줍니다. */
var TIME_LIMIT = 180;
function countdown(box, onEnd){
  var end = Date.now() + TIME_LIMIT*1000, t = null;
  box.hidden = false;
  (function tick(){
    var s = Math.max(0, Math.ceil((end - Date.now())/1000));
    box.querySelector("b").textContent = Math.floor(s/60)+":"+("0"+s%60).slice(-2);
    box.querySelector(".bar i").style.width = (s/TIME_LIMIT*100)+"%";
    if (s <= 0){ t = null; onEnd(); return; }
    t = setTimeout(tick, 250);
  })();
  return function(){ clearTimeout(t); box.hidden = true; };
}
function stopShootTimer(){ if (S.stopShootTimer){ S.stopShootTimer(); S.stopShootTimer = null; } }
/* 촬영 시간이 끝나면: 고를 만큼 찍었으면 찍은 사진으로 고르러 가고, 모자라면 처음 화면으로 돌아갑니다. */
function shootTimeUp(){
  S.stopShootTimer = null; $("doneBtn").hidden = true;
  if (S.shots.length >= needShots(enabledLayouts()[cur])){ S.enough = true; return; }
  S.cancelled = true; readyMode(true); stopStream(); releaseAwake();
  freeCanvases(S.shots); S.shots = []; show(setupEl);
  say("시간이 끝났습니다. 처음부터 다시 찍어 주세요.", 6000);
}

/* 촬영 화면의 두 가지 상태: 기다리는 중 / 찍는 중 */
function readyMode(on){
  $("goBtn").hidden = !on;
  $("flipBtn").hidden = !on;
  // 찍는 중에도 "릴리즈를 눌러 주세요 (n/10)" 안내를 보여줍니다(waitRelease)
  $("shootHint").hidden = false;
  $("shootCount").textContent = "";
  if (on) $("shootHint").textContent = "얼굴을 맞추고 촬영 시작을 누르세요";
  $("count").hidden = true;
}

$("goBtn").addEventListener("click", function(){
  if (!S.stream){ say("카메라가 아직 준비되지 않았습니다."); return; }
  readyMode(false);
  runSession().catch(function(){ readyMode(true); });
});
$("cancelBtn").addEventListener("click", function(){
  stopShootTimer(); S.cancelled=true; $("doneBtn").hidden=true; readyMode(true); stopStream(); releaseAwake(); show(setupEl);
});
$("doneBtn").addEventListener("click", function(){ S.enough=true; $("doneBtn").hidden=true; });
$("flipBtn").addEventListener("click", function(){
  S.facing = S.facing==="user" ? "environment" : "user";
  openCamera().then(applyPreviewFilter).catch(function(e){ say(cameraError(e)); });
});
$("againBtn").addEventListener("click", function(){
  S.blob=null; freeCanvases(S.shots); S.shots=[]; keepResult(null); hush(); readyMode(true); show(setupEl);
});
/* 좌우 반전 — 손님이 고른 사진을 남겨 두었다가 칸 안의 사진만 뒤집어 다시 만듭니다(손님 요청).
   인화를 보낸 뒤에는 막습니다(다시 만들면 인화를 한 번 더 할 수 있게 되므로). */
function keepResult(L, shots, look){
  if (S.res) freeCanvases(S.res.shots);
  S.res = L ? { L:L, shots:shots, look:look, flip:false } : null;
  syncPrintBtn();
}
$("mirrorBtn").addEventListener("click", function(){
  var r=S.res, b=$("mirrorBtn");
  if (!r || S.printing || S.printed || b.disabled) return;
  b.disabled=true; r.flip=!r.flip;
  renderPrint(r.L, r.shots, r.look, r.flip).then(function(blob){
    return applyStickers(blob, r.stickers);   // 스티커는 뒤집지 않고 그대로 붙입니다(사용자 요청)
  }).then(function(blob){
    if (S.res !== r) return;   // 그사이 다시 찍기를 눌렀습니다
    setResult(blob, null, S.sub);
    b.disabled=false; syncPrintBtn();
  });
});
/* 인쇄는 웹 페이지(window.print)가 아니라 사진 파일을 공유 창으로 보냅니다. 손님이 "프린트" 를 고르면 사진 앱에서 뽑듯이 나가서
   사파리가 붙이는 날짜·주소가 없고 한 장에 맞춰집니다(아이패드 시험에서 두 장으로 나뉘고 날짜·주소가 찍혀 바꿈, 사용자 요청). */
$("printBtn").addEventListener("click", function(){
  if (relayUrl()){ printEpson(); return; }   // 맥 주소가 있으면 맥이 엡손으로 바로 뽑습니다(인쇄 창 없음)
  if (!shareResult()) window.print();   // 공유를 못 하는 브라우저(맥 등)는 예전처럼 인쇄 창
});
/* 맥의 인화 서버(instax/relay, POST /print-epson)로 보내 엡손 SC-P904 에서 5×7 무테로 바로 뽑습니다(사용자 요청).
   한 번 보내면 다시 찍기 전까지 막습니다(두 번 눌러 두 장 나가는 것을 막으려는 것). */
function printEpson(){
  if (!S.blob || S.printing || S.printed) return;
  S.printing = true; syncPrintBtn(); say("인화를 보내는 중입니다…", 0);
  // bg: 프레임 바탕색. 맥이 무테 인쇄 영역(종이보다 사방 약 5mm 넓음)만큼 이 색으로 여백을 붙여서 프레임이 종이에 딱 맞습니다
  var L = enabledLayouts()[cur], fc = L && frameColor(L);
  var bg = fc ? fc.bg.slice(1) : !L ? "FFFFFF" : L.style === "film" ? "1B1713" : L.style === "bw" ? BW_STRIP.slice(1) : L.bg ? L.bg.slice(1) : "FFFFFF";
  fetch(relayUrl()+"/print-epson?bg="+bg, { method:"POST", headers:{"Content-Type":"image/jpeg"}, body:S.blob })
    .then(function(r){ return r.json(); })
    .then(function(j){
      if (!j.ok) throw new Error(j.error || "인화하지 못했습니다.");
      S.printed = true;
      say("프린터로 보냈습니다. 잠시 뒤 사진이 나옵니다.", 8000);
    })
    .catch(function(e){
      say("인화를 보내지 못했습니다. 맥에서 인화 서버가 켜져 있는지 확인해 주세요.\n("+relayUrl()+" · "+(e && e.message || e)+")", 0);
    })
    .then(function(){ S.printing = false; syncPrintBtn(); });
}

/* 인화 맥(instax/relay) 주소 */
function relayUrl(){ return ((CFG.instax && CFG.instax.relay) || "").trim().replace(/\/+$/, ""); }
function syncPrintBtn(){
  var b=$("printBtn");
  var direct = instaxOn() || !!relayUrl();   // 맥으로 바로 뽑는 경우(인스탁스·엡손)
  b.textContent = !direct ? "인쇄" : S.printed ? "인화했습니다" : "인화";
  b.disabled = direct && (S.printing || S.printed);
  $("mirrorBtn").hidden = !S.res;
  $("mirrorBtn").disabled = !!(S.printing || S.printed);
  // 인스탁스는 인화가 주인공입니다. 버튼을 앞으로 빼고 강조합니다.
  b.classList.toggle("primary", instaxOn());
  $("saveBtn").classList.toggle("primary", !instaxOn());
  $("resultHint").hidden = direct;   // "공유 창 → 프린트" 안내는 맥 주소가 없을 때만
}
/* 결과 사진을 공유 창으로 엽니다(저장·에어드롭·프린트). 공유를 못 하는 브라우저면 false. */
function shareResult(){
  if (!S.blob) return true;
  var name = CFG.brand.replace(/\s+/g,"_")+"_"+Date.now()+".jpg";
  var file = new File([S.blob], name, {type:"image/jpeg"});
  if (!(navigator.canShare && navigator.canShare({files:[file]}))) return false;
  navigator.share({files:[file]}).catch(function(e){
    if (e && e.name==="AbortError") return;
    say("위 사진을 길게 눌러 ‘사진에 추가’를 고르면 저장됩니다.",6000);
  });
  return true;
}
$("saveBtn").addEventListener("click", function(){
  if (!shareResult()) say("위 사진을 길게 눌러 ‘사진에 추가’를 고르면 저장됩니다.",6000);
});

/* ══════════════════════════════════════════
   관리자 화면
   ══════════════════════════════════════════ */
function L(){ return CFG.layouts[admIdx]; }

function openAdmin(){
  if (!CFG.layouts.length) CFG.layouts = defaultConfig().layouts;
  admIdx = Math.min(admIdx, CFG.layouts.length-1);
  selSlot = L().slots.length ? 0 : -1;
  selText = L().texts.length ? 0 : -1;
  CFG.filters = allFilters();
  var at = allFilters().map(function(f){ return f.id; }).indexOf(CFG.filter);
  fIdx = at < 0 ? 0 : at;
  show(adminEl);
  renderAdmin();
}
$("admClose").addEventListener("click", function(){
  pvStop();
  saveConfig().then(function(){
    buildModes();
    buildChips($("filters"), shownFilters(), CFG.filter, false);
    show(setupEl); say("설정을 저장했습니다.");
  });
});

/* ── 화면 디자인 ─────────────────────────
   손님 화면의 색·글씨만 바꿉니다(index.html 의 body[data-theme] 규칙). 저장된 값이 없거나 틀리면 다크 시크. */
function setTheme(t){
  if (["light","vintage","dark"].indexOf(t) < 0) t = "dark";
  CFG.theme = t;
  document.body.dataset.theme = t;
  Array.prototype.forEach.call($("themePick").children, function(b){
    b.classList.toggle("primary", b.dataset.theme === t);
  });
}
$("themePick").addEventListener("click", function(e){
  var b=e.target.closest("[data-theme]"); if(!b) return;
  setTheme(b.dataset.theme); saveConfig();
});

/* ── 인화 맥 ─────────────────────────── */
$("relayUrl").addEventListener("input", function(e){
  CFG.instax.relay = e.target.value.trim(); saveConfig();
});
$("relayCheck").addEventListener("click", function(){
  var note=$("relayNote"), url=relayUrl();
  if (!url){ note.textContent = "인화 맥 주소를 먼저 넣어주세요."; return; }
  note.textContent = "맥을 찾는 중입니다…";
  // 인화 서버가 답하는지만 봅니다(엡손 프린터 상태는 맥에서 봅니다). "/" 는 CORS 머리가 없어 no-cors 로 닿는지만 확인합니다
  fetch(url+"/", { mode:"no-cors" }).then(function(){
    note.textContent = "맥과 연결됐습니다.";
  }).catch(function(){
    note.textContent = "맥에 연결하지 못했습니다. 인화 서버가 켜져 있는지, 아이패드에 인증서를 설치했는지 확인하세요.";
  });
});

/* ── 카메라 고르기 ────────────────────── */
function scanCameras(){
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
    $("camNote").textContent = "이 브라우저에서는 카메라 목록을 볼 수 없습니다.";
    return Promise.resolve([]);
  }
  return navigator.mediaDevices.enumerateDevices().then(function(all){
    var cams = all.filter(function(d){ return d.kind==="videoinput"; });
    var named = cams.filter(function(d){ return d.label; }).length;
    $("camPick").innerHTML = '<option value="">기본 카메라</option>' +
      cams.map(function(d,i){
        return '<option value="'+escapeHtml(d.deviceId)+'">'+
               escapeHtml(d.label || ("카메라 "+(i+1)+" (이름 모름)"))+'</option>';
      }).join("");
    // 저장해둔 카메라가 아직 꽂혀 있으면 그대로 골라둡니다
    var still = CFG.cameraId && cams.some(function(d){ return d.deviceId===CFG.cameraId; });
    $("camPick").value = still ? CFG.cameraId : "";
    if (CFG.cameraId && !still){
      CFG.cameraId = null; saveConfig();
      $("camNote").textContent = "정해둔 카메라가 지금은 없습니다. 기본 카메라로 돌려놨습니다.";
    } else if (!cams.length){
      $("camNote").textContent = "찾은 카메라가 없습니다.";
    } else if (!named){
      $("camNote").textContent = cams.length+"대를 찾았지만 이름을 모릅니다. 아래에서 카메라를 한 번 켜서 권한을 허용한 뒤 다시 찾으세요.";
    } else {
      $("camNote").textContent = cams.length+"대를 찾았습니다. 쓸 카메라를 고르세요.";
    }
    return cams;
  }).catch(function(){ return []; });
}
$("camScan").addEventListener("click", function(){
  scanCameras().then(function(){ say("카메라 목록을 다시 읽었습니다."); });
});
$("camPick").addEventListener("change", function(e){
  CFG.cameraId = e.target.value || null;
  saveConfig();
  if (pvStream){ pvStop(); $("pvToggle").click(); }   // 미리보기를 새 카메라로 다시 엽니다
  say(CFG.cameraId ? "이 카메라를 쓰도록 정했습니다." : "기본 카메라로 돌렸습니다.");
});
$("camFlip").addEventListener("click", function(){
  S.facing = S.facing==="user" ? "environment" : "user";
  CFG.cameraId = null; $("camPick").value=""; saveConfig();
  if (pvStream){ pvStop(); $("pvToggle").click(); }
  say(S.facing==="user" ? "앞 카메라로 바꿨습니다." : "뒤 카메라로 바꿨습니다.");
});

/* ── 보정 편집 ────────────────────────── */
var fIdx = 0;
var SLIDERS = [
  {k:"brightness", n:"밝기",      min:50,  max:150, def:100},
  {k:"contrast",   n:"대비",      min:50,  max:150, def:100},
  {k:"saturate",   n:"채도",      min:0,   max:200, def:100},
  {k:"smooth",     n:"피부 보정", min:0,   max:100, def:0},
  {k:"detail",     n:"디테일 지키기", min:0, max:100, def:70},
  {k:"fade",       n:"먹색 띄우기",min:0,  max:100, def:0},
  {k:"vignette",   n:"비네팅",    min:0,   max:100, def:0},
  {k:"sepia",      n:"세피아",    min:0,   max:100, def:0},
  {k:"hue",        n:"색상 돌리기",min:-45,max:45,  def:0}
];
/* 얼굴 보정은 모든 보정에 공통입니다. 실시간 미리보기가 매 프레임 이 값을 읽습니다. */
var FACE_SLIDERS = [
  {k:"blurPx", n:"잡티 흐림 px", min:0,  max:40, get:function(){ return CFG.blurPx; },     set:function(v){ CFG.blurPx=v; }},
  {k:"amount", n:"얼굴 줄이기",  min:0,  max:100,get:function(){ return CFG.slim.amount; }, set:function(v){ CFG.slim.amount=v; }},
  {k:"size",   n:"줄일 범위",    min:10, max:80, get:function(){ return CFG.slim.size; },   set:function(v){ CFG.slim.size=v; }},
  {k:"x",      n:"가로 위치",    min:10, max:90, get:function(){ return CFG.slim.x; },      set:function(v){ CFG.slim.x=v; }},
  {k:"y",      n:"세로 위치",    min:10, max:90, get:function(){ return CFG.slim.y; },      set:function(v){ CFG.slim.y=v; }}
];
function renderFaceSliders(){
  FACE_SLIDERS.forEach(function(s){ $("fc_"+s.k).value=s.get(); $("fco_"+s.k).textContent=s.get(); });
}
function F(){
  var all=allFilters();
  if (fIdx>=all.length) fIdx=0;
  return all[fIdx];
}
function buildSliders(){
  $("fSliders").innerHTML = SLIDERS.map(function(s){
    return '<div class="sl"><label for="sl_'+s.k+'">'+s.n+'</label>'+
      '<input type="range" id="sl_'+s.k+'" min="'+s.min+'" max="'+s.max+'" step="1">'+
      '<output id="out_'+s.k+'"></output></div>';
  }).join("");
  $("fTintSlider").innerHTML =
    '<div class="sl"><label for="sl_tint">세기</label>'+
    '<input type="range" id="sl_tint" min="0" max="100" step="1">'+
    '<output id="out_tint"></output></div>';
  $("faceSliders").innerHTML = FACE_SLIDERS.map(function(s){
    return '<div class="sl"><label for="fc_'+s.k+'">'+s.n+'</label>'+
      '<input type="range" id="fc_'+s.k+'" min="'+s.min+'" max="'+s.max+'" step="1">'+
      '<output id="fco_'+s.k+'"></output></div>';
  }).join("");
  FACE_SLIDERS.forEach(function(s){
    $("fc_"+s.k).addEventListener("input", function(e){
      s.set(Number(e.target.value)); $("fco_"+s.k).textContent=e.target.value; renderCompare();
    });
    $("fc_"+s.k).addEventListener("change", saveConfig);
  });
  $("fTintMode").innerHTML = BLEND_MODES.map(function(m){
    return '<option value="'+m.v+'">'+m.n+'</option>';
  }).join("");

  SLIDERS.forEach(function(s){
    $("sl_"+s.k).addEventListener("input", function(e){
      F()[s.k] = Number(e.target.value);
      $("out_"+s.k).textContent = e.target.value;
      paintAdminLook(); applyPreviewFilter(); renderCompare();
    });
    $("sl_"+s.k).addEventListener("change", saveConfig);
  });
  $("sl_tint").addEventListener("input", function(e){
    F().tint.amount = Number(e.target.value);
    $("out_tint").textContent = e.target.value;
    paintAdminLook(); applyPreviewFilter(); renderCompare();
  });
  $("sl_tint").addEventListener("change", saveConfig);
  $("fTintColor").addEventListener("input", function(e){
    F().tint.color = e.target.value; paintAdminLook(); applyPreviewFilter();
  });
  $("fTintColor").addEventListener("change", saveConfig);
  $("fTintMode").addEventListener("change", function(e){
    F().tint.mode = e.target.value; paintAdminLook(); applyPreviewFilter(); saveConfig();
  });
}
function renderFilterList(){
  $("filterList").innerHTML = allFilters().map(function(f,i){
    return '<button class="lrow" data-i="'+i+'" aria-pressed="'+(i===fIdx)+'">'+
      '<span class="nm">'+f.name+'</span>'+
      '<span class="off">'+(f.pick ? '★ 고르기 화면' : '')+(f.lut ? ' 파일' : '')+(f.enabled ? '' : (f.pick ? '' : '숨김'))+'</span></button>';
  }).join("");
  fillLookSelect();      // 보정 이름이 바뀌면 인화 방식의 필름 목록도 같이 바뀝니다
}
$("filterList").addEventListener("click", function(e){
  var b=e.target.closest(".lrow"); if(!b) return;
  fIdx=Number(b.dataset.i);
  CFG.filter = F().id;          // 고른 보정을 바로 미리봅니다
  renderFilterFields(); renderFilterList(); paintAdminLook();
  buildChips($("filters"), shownFilters(), CFG.filter, false);
  applyPreviewFilter(); saveConfig();
});
function renderFilterFields(){
  var f=F();
  $("fName").value=f.name;
  $("fEnabled").checked=!!f.enabled;
  var LU=f.lut, amt=(f.lutAmount===undefined ? 100 : f.lutAmount);
  $("fLutInfo").textContent = LU
    ? "가져온 색감: "+LU.name+" ("+(LU.kind==="cube" ? "*.cube "+LU.size+"³" : "*."+LU.kind)+(LU.note ? " · "+LU.note : "")+")"
    : "가져온 색감 파일이 없습니다.";
  $("fLutClear").hidden = !LU; $("fLutMore").hidden = !LU;
  $("fLutAmt").value=amt; $("fLutAmtOut").textContent=amt;
  SLIDERS.forEach(function(s){
    var v = (f[s.k]===undefined) ? s.def : f[s.k];
    $("sl_"+s.k).value=v; $("out_"+s.k).textContent=v;
  });
  if (!f.tint) f.tint={color:"#FFB07A",mode:"soft-light",amount:0};
  $("fTintColor").value=f.tint.color;
  $("fTintMode").value=f.tint.mode;
  $("sl_tint").value=f.tint.amount; $("out_tint").textContent=f.tint.amount;
}
$("fName").addEventListener("input", function(e){
  F().name=e.target.value||"이름 없음"; renderFilterList(); saveConfig();
  buildChips($("filters"), shownFilters(), CFG.filter, false);
});
$("fEnabled").addEventListener("change", function(e){
  var on=e.target.checked;
  if (!on && shownFilters().length<=1 && F().enabled){
    e.target.checked=true; say("보정은 최소 하나는 보여야 합니다."); return;
  }
  F().enabled=on; renderFilterList(); saveConfig();
  if (!on && CFG.filter===F().id) CFG.filter = shownFilters()[0].id;
  buildChips($("filters"), shownFilters(), CFG.filter, false);
});
/* 색감 파일 가져오기: *.cube *.xmp *.acv */
$("fLutBtn").addEventListener("click", function(){ $("fLutFile").value=""; $("fLutFile").click(); });
$("fLutFile").addEventListener("change", function(e){
  var file=e.target.files && e.target.files[0]; if (!file) return;
  var ext=(file.name.split(".").pop()||"").toLowerCase(), base=file.name.replace(/\.[^.]+$/,"").slice(0,24);
  var rd=new FileReader();
  rd.onerror=function(){ say("파일을 읽지 못했습니다.", 5000); };
  rd.onload=function(){
    try{
      var lut;
      if (ext==="cube"){ var c=parseCube(rd.result); lut=lutFromFloats(base,"cube",c.size,c.floats); }
      else if (ext==="xmp"){ var x=xmpLook(rd.result); lut=lutFromFloats(base,"xmp",LUT_N,x.floats,x.note); }
      else if (ext==="acv"){ lut=lutFromFloats(base,"acv",LUT_N,acvLook(rd.result)); }
      else throw new Error("*.cube *.xmp *.acv 파일만 가져올 수 있습니다.");
      var f=F(); f.lut=lut; f.lutAmount=100;
      if (/^(새 보정|이름 없음)/.test(f.name)) f.name=base.slice(0,12);
      renderFilterFields(); renderFilterList(); renderCompare(); saveConfig();
      say("‘"+base+"’ 색감을 가져왔습니다.", 4000);
    } catch(err){ say(err.message || "색감 파일을 읽지 못했습니다.", 8000); }
  };
  if (ext==="acv") rd.readAsArrayBuffer(file); else rd.readAsText(file);
});
$("fLutClear").addEventListener("click", function(){
  var f=F(); delete f.lut; delete f.lutAmount;
  renderFilterFields(); renderFilterList(); renderCompare(); saveConfig();
});
$("fLutAmt").addEventListener("input", function(e){
  F().lutAmount=Number(e.target.value); $("fLutAmtOut").textContent=e.target.value; renderCompare();
});
$("fLutAmt").addEventListener("change", saveConfig);
$("fAdd").addEventListener("click", function(){
  CFG.filters = allFilters().concat([newFilter({name:"새 보정", brightness:105, smooth:30})]);
  fIdx=CFG.filters.length-1; CFG.filter=F().id;
  renderFilterList(); renderFilterFields(); paintAdminLook();
  buildChips($("filters"), shownFilters(), CFG.filter, false); saveConfig();
});
$("fDup").addEventListener("click", function(){
  var c=JSON.parse(JSON.stringify(F()));
  c.id="F"+Date.now(); c.name=F().name+" 복사본";
  CFG.filters = allFilters(); CFG.filters.splice(fIdx+1,0,c);
  fIdx++; CFG.filter=F().id;
  renderFilterList(); renderFilterFields(); paintAdminLook();
  buildChips($("filters"), shownFilters(), CFG.filter, false); saveConfig();
});
$("fDel").addEventListener("click", function(){
  if (allFilters().length<=1){ say("마지막 하나는 지울 수 없습니다."); return; }
  var name=F().name;
  ask("‘"+name+"’ 보정을 지울까요?", function(){
    CFG.filters = allFilters(); CFG.filters.splice(fIdx,1);
    fIdx=Math.max(0,fIdx-1); CFG.filter=shownFilters()[0].id;
    renderFilterList(); renderFilterFields(); paintAdminLook();
    buildChips($("filters"), shownFilters(), CFG.filter, false); saveConfig();
  });
});
$("fReset").addEventListener("click", function(){
  ask("보정 목록을 기본값으로 되돌릴까요? 인화 방식은 그대로 둡니다.", function(){
    CFG.filters=defaultFilters(); fIdx=0; CFG.filter=CFG.filters[1].id;
    renderFilterList(); renderFilterFields(); paintAdminLook();
    buildChips($("filters"), shownFilters(), CFG.filter, false); saveConfig();
    say("보정을 기본값으로 되돌렸습니다.");
  });
});

/* 한 장 찍어서 보정 전후를 나란히 보여줍니다.
   잡티 보정은 움직이는 화면으로는 판단이 안 되기 때문입니다. */
var cmpFrame = null;
function renderCompare(){
  if (!cmpFrame) return;
  var f = F(), W = cmpFrame.width, H = cmpFrame.height;

  // 보정 전 — 색만 입히고 피부 보정과 얼굴 줄이기는 빼둡니다
  var plain = Object.create(null);
  for (var k in f) plain[k] = f[k];
  plain.smooth = 0;

  var a = renderLook(cmpFrame, plain, null);
  var b = renderLook(cmpFrame, f, CFG.slim);
  $("cmpA").src = a.toDataURL("image/jpeg", 0.9);
  $("cmpB").src = b.toDataURL("image/jpeg", 0.9);
  free(a); free(b);
  $("cmpBox").hidden = false;
  $("cmpNote").hidden = false;
}
/* 한 장짜리 캔버스에 보정을 입힙니다. grabFull 과 같은 함수입니다. */
function renderLook(src, f, slim){
  var out = document.createElement("canvas");
  out.width = src.width; out.height = src.height;
  drawLook(out, src, f, false, slim);
  return out;
}
$("cmpShot").addEventListener("click", function(){
  var v = $("pvVideo");
  if (!pvStream || !v.videoWidth){ say("먼저 카메라를 켜주세요."); return; }
  free(cmpFrame);
  var scale = Math.min(1, 900/Math.max(v.videoWidth, v.videoHeight));
  cmpFrame = document.createElement("canvas");
  cmpFrame.width  = Math.round(v.videoWidth*scale);
  cmpFrame.height = Math.round(v.videoHeight*scale);
  var c = cmpFrame.getContext("2d");
  if (mirrorFor()){ c.translate(cmpFrame.width,0); c.scale(-1,1); }
  c.drawImage(v, 0, 0, cmpFrame.width, cmpFrame.height);
  renderCompare();
});

function paintAdminLook(){ paintVignette($("pvVign"), F()); }

/* 보정 미리보기용 카메라 */
var pvStream=null;
function pvStop(){
  if (pvStream){ pvStream.getTracks().forEach(function(t){ t.stop(); }); pvStream=null; }
  $("pvVideo").srcObject=null;
  $("pvLive").width=0;
  $("pvOff").hidden=false;
  $("pvToggle").textContent="카메라 켜기";
}
$("pvToggle").addEventListener("click", function(){
  if (pvStream){ pvStop(); return; }
  var c = CFG.cameraId ? {deviceId:{exact:CFG.cameraId}} : {facingMode:S.facing};
  c.width = {ideal:1280};
  navigator.mediaDevices.getUserMedia({video:c,audio:false})
    .then(function(st){
      pvStream=st;
      var v=$("pvVideo");
      v.srcObject=st;
      v.style.transform = mirrorFor() ? "scaleX(-1)" : "none";
      startLive(v, $("pvLive"), F, function(){ return !!pvStream; }, function(){ return true; });
      $("pvOff").hidden=true;
      $("pvToggle").textContent="카메라 끄기";
      paintAdminLook();
      return v.play().catch(function(){});
    })
    .catch(function(err){ say(cameraError(err),5000); });
});

function renderAdmin(){
  scanCameras();
  $("relayUrl").value = (CFG.instax && CFG.instax.relay) || "";
  renderFilterList();
  renderFilterFields();
  renderFaceSliders();
  paintAdminLook();
  renderLayoutList();
  renderLayoutFields();
  renderTextList();
  renderTextFields();
  renderSlotFields();
  renderEditor();
}

function renderLayoutList(){
  $("admLayouts").innerHTML = CFG.layouts.map(function(l,i){
    return '<button class="lrow" data-i="'+i+'" aria-pressed="'+(i===admIdx)+'">'+
      '<span class="nm">'+l.name+'</span>'+
      '<span class="off">'+shotCount(l)+'컷'+(l.enabled?'':' · 숨김')+'</span></button>';
  }).join("");
}
$("admLayouts").addEventListener("click", function(e){
  var b=e.target.closest(".lrow"); if(!b) return;
  admIdx=Number(b.dataset.i);
  selSlot = L().slots.length?0:-1; selText = L().texts.length?0:-1;
  renderAdmin();
});

function renderLayoutFields(){
  var l=L();
  $("admName").value=l.name;
  $("admEnabled").checked=!!l.enabled;
  $("cutOn").checked = !!(l.cut && l.cut.on);
  $("cutX").value = l.cut ? l.cut.x : Math.round(l.canvas.w/2);
  $("cutColor").value = l.cut ? l.cut.color : "#D8D0CA";
  $("editNote").textContent = l.canvas.w+" × "+l.canvas.h+" px · 300dpi 기준 "+
    (l.canvas.w/300).toFixed(1)+" × "+(l.canvas.h/300).toFixed(1)+" 인치 · 촬영 "+shotCount(l)+"컷";
  fillLookSelect();
}
/* 필름 목록 — 손님에게 숨긴 보정도 고를 수 있습니다. 카메라 전용 색감을 숨겨두고 쓸 때입니다. */
function fillLookSelect(){
  var l=CFG.layouts[admIdx]; if (!l) return;
  $("admLook").innerHTML = '<option value="">손님이 고름</option>' + allFilters().map(function(f){
    return '<option value="'+f.id+'">'+escapeHtml(f.name)+(f.enabled?'':' (숨김)')+'</option>';
  }).join("");
  $("admLook").value = filterById(l.look) ? l.look : "";
}
$("admLook").addEventListener("change", function(e){
  L().look = e.target.value || null; saveConfig();
});
$("admName").addEventListener("input", function(e){
  L().name = e.target.value || "이름 없음"; renderLayoutList(); saveConfig();
});
$("admEnabled").addEventListener("change", function(e){
  L().enabled = e.target.checked; renderLayoutList(); saveConfig();
});
["cutOn","cutX","cutColor"].forEach(function(id){
  $(id).addEventListener("change", function(){
    var l=L();
    if (!l.cut) l.cut={on:false,x:Math.round(l.canvas.w/2),color:"#D8D0CA"};
    l.cut.on = $("cutOn").checked;
    l.cut.x = Number($("cutX").value)||Math.round(l.canvas.w/2);
    l.cut.color = $("cutColor").value;
    renderEditor(); saveConfig();
  });
});

/* 레이아웃 추가·복제·삭제 */
$("admAdd").addEventListener("click", function(){
  CFG.layouts.push({
    id:"L"+Date.now(), name:"새 인화", enabled:true,
    canvas:{w:1200,h:1800}, bgId:null, frame:null,
    slots:[{x:150,y:150,w:900,h:600,shot:0}],
    texts:[{content:"{brand}",x:600,y:1700,size:48,font:"display",align:"center",color:"#111111"}],
    cut:{on:false,x:600,color:"#D8D0CA"}
  });
  admIdx=CFG.layouts.length-1; selSlot=0; selText=0; renderAdmin(); saveConfig();
});
$("admDup").addEventListener("click", function(){
  var copy=JSON.parse(JSON.stringify(L()));
  copy.id="L"+Date.now(); copy.name=L().name+" 복사본";
  CFG.layouts.splice(admIdx+1,0,copy); admIdx++; renderAdmin(); saveConfig();
});
$("admDel").addEventListener("click", function(){
  if (CFG.layouts.length<=1){ say("마지막 하나는 지울 수 없습니다."); return; }
  ask("‘"+L().name+"’ 인화 방식을 지울까요?", function(){
    CFG.layouts.splice(admIdx,1);
    admIdx=Math.max(0,admIdx-1); selSlot=0; selText=0; renderAdmin(); saveConfig();
    buildModes();
  });
});

/* 사진 칸 */
function renderSlotFields(){
  var s = L().slots[selSlot];
  var on = !!s;
  ["slotX","slotY","slotW","slotH","slotShot"].forEach(function(id){ $(id).disabled=!on; });
  if (!on) return;
  $("slotX").value=s.x; $("slotY").value=s.y;
  $("slotW").value=s.w; $("slotH").value=s.h; $("slotShot").value=s.shot+1;
}
["slotX","slotY","slotW","slotH","slotShot"].forEach(function(id){
  $(id).addEventListener("change", function(){
    var s=L().slots[selSlot]; if(!s) return;
    s.x=Math.round(Number($("slotX").value)||0);
    s.y=Math.round(Number($("slotY").value)||0);
    s.w=Math.max(20,Math.round(Number($("slotW").value)||20));
    s.h=Math.max(20,Math.round(Number($("slotH").value)||20));
    s.shot=Math.max(0,(Number($("slotShot").value)||1)-1);
    renderEditor(); renderLayoutFields(); renderLayoutList(); saveConfig();
  });
});
$("slotAdd").addEventListener("click", function(){
  var l=L();
  l.slots.push({x:Math.round(l.canvas.w*0.1), y:Math.round(l.canvas.h*0.1),
                w:Math.round(l.canvas.w*0.3), h:Math.round(l.canvas.h*0.2),
                shot:shotCount(l)});
  selSlot=l.slots.length-1; renderAdmin(); saveConfig();
});
$("slotDup").addEventListener("click", function(){
  var s=L().slots[selSlot]; if(!s){ say("복제할 칸을 먼저 고르세요."); return; }
  var c=JSON.parse(JSON.stringify(s)); c.x+=Math.round(s.w*0.3); c.y+=Math.round(s.h*0.3);
  L().slots.push(c); selSlot=L().slots.length-1; renderAdmin(); saveConfig();
});
$("slotDel").addEventListener("click", function(){
  if (L().slots.length<=1){ say("칸은 최소 하나 있어야 합니다."); return; }
  if (selSlot<0) return;
  L().slots.splice(selSlot,1); selSlot=Math.max(0,selSlot-1); renderAdmin(); saveConfig();
});
$("slotRowX").addEventListener("click", function(){
  var l=L(), n=l.slots.length; if(n<2) return;
  var m=Math.round(l.canvas.w*0.05), gap=Math.round(l.canvas.w*0.02);
  var w=Math.floor((l.canvas.w-m*2-gap*(n-1))/n);
  l.slots.forEach(function(s,i){ s.w=w; s.x=m+i*(w+gap); });
  renderAdmin(); saveConfig();
});
$("slotRowY").addEventListener("click", function(){
  var l=L(), n=l.slots.length; if(n<2) return;
  var m=Math.round(l.canvas.h*0.04), gap=Math.round(l.canvas.h*0.012);
  var h=Math.floor((l.canvas.h-m*2-gap*(n-1))/n);
  l.slots.forEach(function(s,i){ s.h=h; s.y=m+i*(h+gap); });
  renderAdmin(); saveConfig();
});
$("slotTwin").addEventListener("click", function(){
  var l=L();
  var half=l.canvas.w/2;
  var base=l.slots.filter(function(s){ return s.x+s.w/2 < half; });
  if (!base.length) base=l.slots.slice();
  l.slots = base.concat(base.map(function(s){
    var c=JSON.parse(JSON.stringify(s)); c.x=Math.round(s.x+half); return c;
  }));
  selSlot=0; renderAdmin(); saveConfig();
  say("왼쪽 칸을 오른쪽에 같은 사진 번호로 복제했습니다.");
});

/* ── 정렬 ────────────────────────────────
   편집 화면만 다시 그립니다. 카메라는 다시 찾지 않습니다. */
function redrawEdit(){
  renderSlotFields(); renderTextList(); renderTextFields();
  renderLayoutFields(); renderEditor(); saveConfig();
}
/* 선택한 칸을 인화지 끝이나 가운데에 붙입니다 */
function alignSlot(how){
  var l=L(), s=l.slots[selSlot];
  if (!s){ say("먼저 칸을 고르세요."); return; }
  if (how==="left")        s.x=0;
  else if (how==="cx")     s.x=Math.round((l.canvas.w-s.w)/2);
  else if (how==="right")  s.x=l.canvas.w-s.w;
  else if (how==="top")    s.y=0;
  else if (how==="cy")     s.y=Math.round((l.canvas.h-s.h)/2);
  else if (how==="bottom") s.y=l.canvas.h-s.h;
  redrawEdit();
}
[["slotAlL","left"],["slotAlCX","cx"],["slotAlR","right"],
 ["slotAlT","top"],["slotAlCY","cy"],["slotAlB","bottom"]].forEach(function(pair){
  $(pair[0]).addEventListener("click", function(){ alignSlot(pair[1]); });
});
$("slotSame").addEventListener("click", function(){
  var l=L(), s=l.slots[selSlot];
  if (!s){ say("기준이 될 칸을 먼저 고르세요."); return; }
  l.slots.forEach(function(o){ o.w=s.w; o.h=s.h; });
  redrawEdit(); say("모든 칸을 선택 칸과 같은 크기로 맞췄습니다.");
});
/* 선택 칸과 위아래로 겹치는 칸들의 Y·세로를 같게 만듭니다 */
$("slotAlRow").addEventListener("click", function(){
  var l=L(), s=l.slots[selSlot];
  if (!s){ say("기준이 될 칸을 먼저 고르세요."); return; }
  var c=s.y+s.h/2, n=0;
  l.slots.forEach(function(o,i){
    if (i===selSlot) return;
    if (Math.abs((o.y+o.h/2)-c) <= Math.max(s.h,o.h)*0.6){ o.y=s.y; o.h=s.h; n++; }
  });
  redrawEdit();
  say(n ? n+"개 칸을 같은 줄로 맞췄습니다." : "같은 줄에 있는 칸이 없습니다.");
});
/* 선택 칸과 좌우로 겹치는 칸들의 X·가로를 같게 만듭니다 */
$("slotAlCol").addEventListener("click", function(){
  var l=L(), s=l.slots[selSlot];
  if (!s){ say("기준이 될 칸을 먼저 고르세요."); return; }
  var c=s.x+s.w/2, n=0;
  l.slots.forEach(function(o,i){
    if (i===selSlot) return;
    if (Math.abs((o.x+o.w/2)-c) <= Math.max(s.w,o.w)*0.6){ o.x=s.x; o.w=s.w; n++; }
  });
  redrawEdit();
  say(n ? n+"개 칸을 같은 열로 맞췄습니다." : "같은 열에 있는 칸이 없습니다.");
});

/* 글자 */
function renderTextList(){
  $("textList").innerHTML = L().texts.map(function(t,i){
    return '<button class="txtrow" data-i="'+i+'" aria-pressed="'+(i===selText)+'">'+
      '<span class="nm">'+(t.content||"(빈 글자)")+'</span></button>';
  }).join("") || '<p class="note">글자가 없습니다.</p>';
}
$("textList").addEventListener("click", function(e){
  var b=e.target.closest(".txtrow"); if(!b) return;
  selText=Number(b.dataset.i); renderTextList(); renderTextFields(); renderEditor();
});
function renderTextFields(){
  var t=L().texts[selText], on=!!t;
  ["textContent","textX","textY","textSize","textFont","textAlign","textColor"].forEach(function(id){ $(id).disabled=!on; });
  if (!on) return;
  $("textContent").value=t.content; $("textX").value=t.x; $("textY").value=t.y;
  $("textSize").value=t.size; $("textFont").value=t.font;
  $("textAlign").value=t.align; $("textColor").value=t.color;
}
["textContent","textX","textY","textSize","textFont","textAlign","textColor"].forEach(function(id){
  $(id).addEventListener("change", function(){
    var t=L().texts[selText]; if(!t) return;
    t.content=$("textContent").value;
    t.x=Math.round(Number($("textX").value)||0);
    t.y=Math.round(Number($("textY").value)||0);
    t.size=Math.max(6,Math.round(Number($("textSize").value)||20));
    t.font=$("textFont").value; t.align=$("textAlign").value; t.color=$("textColor").value;
    renderTextList(); renderEditor(); saveConfig();
  });
});
$("textAdd").addEventListener("click", function(){
  var l=L();
  l.texts.push({content:"{brand}", x:Math.round(l.canvas.w/2), y:Math.round(l.canvas.h*0.9),
                size:40, font:"display", align:"center", color:"#111111"});
  selText=l.texts.length-1; renderTextList(); renderTextFields(); renderEditor(); saveConfig();
});
$("textDel").addEventListener("click", function(){
  if (selText<0) return;
  L().texts.splice(selText,1); selText=Math.min(selText, L().texts.length-1);
  renderTextList(); renderTextFields(); renderEditor(); saveConfig();
});
/* 글자 정렬. Y 는 글자 밑줄(기준선)이라 세로 가운데는 글자 크기만큼 내려 잡습니다 */
function alignText(how){
  var l=L(), t=l.texts[selText];
  if (!t){ say("먼저 글자를 고르세요."); return; }
  if (how==="cx"){ t.align="center"; t.x=Math.round(l.canvas.w/2); }
  else if (how==="cy"){ t.y=Math.round(l.canvas.h/2 + t.size*0.35); }
  else if (how==="slot"){
    var s=l.slots[selSlot];
    if (!s){ say("기준이 될 칸을 먼저 고르세요."); return; }
    t.align="center"; t.x=Math.round(s.x+s.w/2);
  } else if (how==="same"){
    var n=0;
    l.texts.forEach(function(o,i){ if (i!==selText){ o.x=t.x; o.align=t.align; n++; } });
    if (!n){ say("맞출 다른 글자가 없습니다."); return; }
    say(n+"개 글자를 선택 글자와 같은 세로줄에 맞췄습니다.");
  }
  redrawEdit();
}
[["textAlCX","cx"],["textAlCY","cy"],["textAlSlot","slot"],["textAlSame","same"]]
  .forEach(function(pair){
    $(pair[0]).addEventListener("click", function(){ alignText(pair[1]); });
  });

/* ── 편집 캔버스 ──────────────────────── */
var EDIT_MAX = 460;
function editScale(){
  var l=L();
  var box=$("editor").parentElement.clientWidth - 32;
  var maxW=Math.min(box>120?box:EDIT_MAX, EDIT_MAX);
  var maxH=Math.min(window.innerHeight*0.56, 620);
  return Math.min(maxW/l.canvas.w, maxH/l.canvas.h);
}
function renderEditor(){
  var l=L(), k=editScale();
  var ed=$("editor");
  ed.style.width = (l.canvas.w*k)+"px";
  ed.style.height= (l.canvas.h*k)+"px";

  var html="";
  html += '<div class="layer" id="bgLayer"></div>';
  l.slots.forEach(function(s,i){
    html += '<div class="slot'+(i===selSlot?" sel":"")+'" data-i="'+i+'" style="'+
      'left:'+(s.x*k)+'px;top:'+(s.y*k)+'px;width:'+(s.w*k)+'px;height:'+(s.h*k)+'px">'+
      '<span>'+(s.shot+1)+'</span>'+(i===selSlot?'<div class="hd" data-h="1"></div>':'')+'</div>';
  });
  if (l.cut && l.cut.on){
    html += '<div style="position:absolute;left:'+(l.cut.x*k)+'px;top:0;bottom:0;width:0;'+
            'border-left:1px dashed '+l.cut.color+';pointer-events:none"></div>';
  }
  l.texts.forEach(function(t,i){
    var left = t.x*k, align=t.align;
    var tx = align==="center" ? "-50%" : (align==="right" ? "-100%" : "0%");
    html += '<div class="txt'+(i===selText?" sel":"")+'" data-t="'+i+'" style="'+
      'left:'+left+'px;top:'+(t.y*k)+'px;transform-origin:0 0;'+
      'transform:rotate('+(t.rot||0)+'deg) translate('+tx+',-100%);white-space:pre;'+
      'letter-spacing:'+((t.ls||0)*k)+'px;'+
      'font-size:'+Math.max(7,t.size*k)+'px;font-weight:'+(t.weight||500)+';color:'+t.color+';'+
      'font-family:'+(t.font==="display"?"var(--display)":"var(--body)")+'">'+
      escapeHtml(resolveText(t.content))+'</div>';
  });
  html += '<div class="layer frameLayer" id="frLayer"></div>';
  // 자석이 걸린 자리를 노란 선으로 보여줍니다
  snapGuides.forEach(function(g){
    html += '<div class="guide" style="'+(g.d==="v"
      ? 'left:'+Math.round(g.at*k)+'px;top:0;width:1px;height:100%'
      : 'top:'+Math.round(g.at*k)+'px;left:0;height:1px;width:100%')+'"></div>';
  });
  ed.innerHTML=html;

  getImage(bgKeyFor(l)).then(function(b){
    var el=$("bgLayer"); if (el) el.style.backgroundImage = b ? 'url('+b.url+')' : "none";
  });
  frameImage(l).then(function(f){
    var el=$("frLayer"); if (el) el.style.backgroundImage = f ? 'url('+f.url+')' : "none";
  });
}
function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];
  });
}

/* ── 자석 맞추기 ──────────────────────────
   끌 때 다른 칸·글자의 선과 인화지 가운데에 달라붙게 합니다.
   SNAP_TOL 은 화면 픽셀이라 편집 배율로 나눠 인화지 픽셀로 바꿉니다. */
var SNAP_TOL = 7;
var snapGuides = [];
function snapOn(){ var c=$("snapOn"); return !c || c.checked; }
/* 달라붙을 세로선 자리들 — 인화지 양끝·가운데, 다른 칸의 왼쪽·가운데·오른쪽, 글자, 절취선 */
function vLines(skipSlot, skipText){
  var l=L(), out=[0, Math.round(l.canvas.w/2), l.canvas.w];
  l.slots.forEach(function(s,i){ if (i===skipSlot) return; out.push(s.x, s.x+s.w/2, s.x+s.w); });
  l.texts.forEach(function(t,i){ if (i===skipText) return; out.push(t.x); });
  if (l.cut && l.cut.on) out.push(l.cut.x);
  return out;
}
function hLines(skipSlot, skipText){
  var l=L(), out=[0, Math.round(l.canvas.h/2), l.canvas.h];
  l.slots.forEach(function(s,i){ if (i===skipSlot) return; out.push(s.y, s.y+s.h/2, s.y+s.h); });
  l.texts.forEach(function(t,i){ if (i===skipText) return; out.push(t.y); });
  return out;
}
/* 다른 칸들의 가로(또는 세로) 길이 — 크기를 바꿀 때 같은 크기로 달라붙게 씁니다 */
function otherSizes(which, skipSlot){
  var out=[];
  L().slots.forEach(function(s,i){ if (i!==skipSlot) out.push(which==="w" ? s.w : s.h); });
  return out;
}
/* 끌고 있는 기준점들 가운데 가장 가까운 선을 찾습니다. 없으면 null */
function nearestLine(anchors, lines, tol){
  var best=null, i, j, d;
  for (i=0;i<anchors.length;i++){
    for (j=0;j<lines.length;j++){
      d = lines[j]-anchors[i];
      if (Math.abs(d)<=tol && (!best || Math.abs(d)<Math.abs(best.d))) best={d:d, at:lines[j]};
    }
  }
  return best;
}

/* 드래그: 칸 이동·크기, 글자 이동 */
(function(){
  var drag=null;
  $("editor").addEventListener("pointerdown", function(e){
    var handle=e.target.closest(".hd");
    var slot=e.target.closest(".slot");
    var text=e.target.closest(".txt");
    var k=editScale();
    if (handle && slot){
      selSlot=Number(slot.dataset.i);
      var s=L().slots[selSlot];
      drag={type:"size", k:k, sx:e.clientX, sy:e.clientY, w0:s.w, h0:s.h};
    } else if (slot){
      selSlot=Number(slot.dataset.i);
      var s2=L().slots[selSlot];
      drag={type:"move", k:k, sx:e.clientX, sy:e.clientY, x0:s2.x, y0:s2.y};
      renderSlotFields(); renderEditor();
    } else if (text){
      selText=Number(text.dataset.t);
      var t=L().texts[selText];
      drag={type:"text", k:k, sx:e.clientX, sy:e.clientY, x0:t.x, y0:t.y};
      renderTextList(); renderTextFields(); renderEditor();
    } else return;
    if (drag.type!=="size"){ renderSlotFields(); }
    $("editor").setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  $("editor").addEventListener("pointermove", function(e){
    if (!drag) return;
    var dx=(e.clientX-drag.sx)/drag.k, dy=(e.clientY-drag.sy)/drag.k;
    // 손가락이 2px 넘게 움직였을 때만 자석을 겁니다. 그냥 눌러서 고르기만 할 때는
    // 칸이 혼자 움직이지 않습니다.
    var moved = Math.abs(e.clientX-drag.sx) + Math.abs(e.clientY-drag.sy);
    var l=L(), tol=SNAP_TOL/drag.k, on=snapOn() && moved>2, g=[], hit;
    if (drag.type==="move"){
      var s=l.slots[selSlot];
      s.x=Math.round(drag.x0+dx); s.y=Math.round(drag.y0+dy);
      if (on){
        hit=nearestLine([s.x, s.x+s.w/2, s.x+s.w], vLines(selSlot,-1), tol);
        if (hit){ s.x=Math.round(s.x+hit.d); g.push({d:"v", at:hit.at}); }
        hit=nearestLine([s.y, s.y+s.h/2, s.y+s.h], hLines(selSlot,-1), tol);
        if (hit){ s.y=Math.round(s.y+hit.d); g.push({d:"h", at:hit.at}); }
      }
    } else if (drag.type==="size"){
      var s2=l.slots[selSlot];
      s2.w=Math.max(20,Math.round(drag.w0+dx)); s2.h=Math.max(20,Math.round(drag.h0+dy));
      if (on){
        // 오른쪽·아래 끝을 선에 맞추고, 선에 안 걸리면 다른 칸과 같은 크기로 맞춥니다
        hit=nearestLine([s2.x+s2.w], vLines(selSlot,-1), tol);
        if (hit){ s2.w=Math.max(20,Math.round(s2.w+hit.d)); g.push({d:"v", at:hit.at}); }
        else {
          hit=nearestLine([s2.w], otherSizes("w",selSlot), tol);
          if (hit) s2.w=Math.max(20,Math.round(s2.w+hit.d));
        }
        hit=nearestLine([s2.y+s2.h], hLines(selSlot,-1), tol);
        if (hit){ s2.h=Math.max(20,Math.round(s2.h+hit.d)); g.push({d:"h", at:hit.at}); }
        else {
          hit=nearestLine([s2.h], otherSizes("h",selSlot), tol);
          if (hit) s2.h=Math.max(20,Math.round(s2.h+hit.d));
        }
      }
    } else {
      var t=l.texts[selText];
      t.x=Math.round(drag.x0+dx); t.y=Math.round(drag.y0+dy);
      if (on){
        hit=nearestLine([t.x], vLines(-1,selText), tol);
        if (hit){ t.x=Math.round(hit.at); g.push({d:"v", at:hit.at}); }
        hit=nearestLine([t.y], hLines(-1,selText), tol);
        if (hit){ t.y=Math.round(hit.at); g.push({d:"h", at:hit.at}); }
      }
    }
    snapGuides=g;
    renderEditor();
  });
  function end(){
    if (!drag) return;
    drag=null;
    if (snapGuides.length){ snapGuides=[]; }
    renderSlotFields(); renderTextFields(); renderEditor(); saveConfig();
  }
  $("editor").addEventListener("pointerup", end);
  $("editor").addEventListener("pointercancel", end);
})();

window.addEventListener("resize", function(){
  if (!adminEl.hidden){ renderEditor(); paintAdminLook(); }
  if (!shootEl.hidden) applyPreviewFilter();
});

/* 미리보기 — 더미 사진으로 실제 합성 결과를 봅니다 */
$("admPreview").addEventListener("click", function(){
  var l=L(), n=shotCount(l), shots=[];
  for (var i=0;i<n;i++){
    var c=document.createElement("canvas"); c.width=900; c.height=900;
    var x=c.getContext("2d");
    var tone=[ "#2A4060", "#4E586E", "#786060", "#96765F", "#5F7866", "#6B5F78" ][i%6];
    x.fillStyle=tone; x.fillRect(0,0,900,900);
    x.fillStyle="rgba(255,255,255,.85)"; x.textAlign="center"; x.textBaseline="middle";
    x.font="140px Anton, sans-serif"; x.fillText(String(i+1),450,450);
    shots.push(c);
  }
  renderPrint(l, shots).then(function(blob){
    setResult(blob); freeCanvases(shots);
    setPrintPage(l); show(resultEl);
    say("미리보기입니다. 다시 찍기를 누르면 손님 화면으로 돌아갑니다.",5000);
  });
});

/* 내보내기 / 가져오기 — 이미지까지 한 파일에 담습니다 */
$("admExport").addEventListener("click", function(){
  var out=JSON.parse(JSON.stringify(CFG));
  var jobs=[];
  function embed(key, target, field){
    if (!key) return;
    jobs.push(kvGet(key).then(function(blob){
      if (!blob) return;
      return new Promise(function(res){
        var fr=new FileReader();
        fr.onload=function(){ target[field]=fr.result; res(); };
        fr.onerror=function(){ res(); };
        fr.readAsDataURL(blob);
      });
    }));
  }
  CFG.layouts.forEach(function(l,i){
    embed(l.frame, out.layouts[i], "frameData");
    embed(l.icon,  out.layouts[i], "iconData");
  });
  (CFG.backgrounds||[]).forEach(function(e,i){
    embed(e.h, out.backgrounds[i], "hData");
    embed(e.v, out.backgrounds[i], "vData");
  });
  Promise.all(jobs).then(function(){
    var blob=new Blob([JSON.stringify(out,null,2)],{type:"application/json"});
    var file=new File([blob],"booth-settings.json",{type:"application/json"});
    if (navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file]}).catch(function(){});
    } else {
      var a=document.createElement("a");
      a.href=URL.createObjectURL(blob); a.download="booth-settings.json"; a.click();
    }
  });
});
$("admImport").addEventListener("change", function(){
  var f=this.files && this.files[0]; if(!f) return;
  var input=this;
  f.text().then(function(txt){
    var data=JSON.parse(txt);
    if (!data || !Array.isArray(data.layouts)) throw new Error("형식이 다릅니다");
    ask("지금 설정을 지우고 이 파일 내용으로 바꿀까요?", function(){
      var jobs=[];
      function restore(obj, field, dest){
        var d=obj[field];
        delete obj[field];
        obj[dest]=null;
        if (!d) return;
        jobs.push(fetch(d).then(function(r){ return r.blob(); })
          .then(putImage).then(function(key){ obj[dest]=key; }).catch(function(){}));
      }
      data.layouts.forEach(function(l){
        delete l.bgData; delete l.bg;        // 옛 파일에 있던 레이아웃별 배경
        restore(l, "frameData", "frame");
        restore(l, "iconData", "icon");
      });
      if (!Array.isArray(data.backgrounds)) data.backgrounds=[];
      data.backgrounds.forEach(function(e){
        restore(e, "hData", "h");
        restore(e, "vData", "v");
      });
      Promise.all(jobs).then(function(){
        CFG=migrate(data); if (!CFG.brand) CFG.brand="STUDIO 042";
        admIdx=0; selSlot=0; selText=0;
        return saveConfig();
      }).then(function(){
        $("brandEdit").value=CFG.brand;
        buildChips($("filters"),shownFilters(),CFG.filter,false);
        buildChips($("timers"),TIMERS,CFG.timer,true);
      buildChips($("shootModes"),SHOOT_MODES,CFG.shootMode||"fixed",false);
        buildModes(); buildBgPick(); renderAdmin(); say("설정을 가져왔습니다.");
      });
    });
  }).catch(function(){ say("읽을 수 없는 설정 파일입니다."); })
    .then(function(){ input.value=""; });
});

$("admReset").addEventListener("click", function(){
  ask("모든 인화 설정과 올린 이미지를 지우고 기본값으로 되돌릴까요?", function(){
    var keys=[];
    CFG.layouts.forEach(function(l){ if(l.frame) keys.push(l.frame); if(l.icon) keys.push(l.icon); });
    (CFG.backgrounds||[]).forEach(function(e){ if(e.h) keys.push(e.h); if(e.v) keys.push(e.v); });
    Promise.all(keys.map(kvDel)).then(function(){
      imgCache={}; CFG=defaultConfig(); admIdx=0; selSlot=0; selText=0;
      return saveConfig();
    }).then(function(){
      $("brandEdit").value=CFG.brand;
      buildChips($("filters"),shownFilters(),CFG.filter,false);
      buildChips($("timers"),TIMERS,CFG.timer,true);
      buildChips($("shootModes"),SHOOT_MODES,CFG.shootMode||"fixed",false);
      buildModes(); buildBgPick(); renderAdmin(); say("기본 설정으로 되돌렸습니다.");
    });
  });
});

/* ── 시작 ─────────────────────────────── */
document.addEventListener("gesturestart", function(e){ e.preventDefault(); });

kvGet("config").then(function(saved){
  if (saved && Array.isArray(saved.layouts) && saved.layouts.length){
    CFG = migrate(saved);
    saveConfig();
  }
}).catch(function(){}).then(function(){
  CFG.filters = allFilters();
  if (!filterById(CFG.filter) || shownFilters().map(function(f){return f.id;}).indexOf(CFG.filter)<0)
    CFG.filter = shownFilters()[0].id;
  $("brandEdit").value = CFG.brand;
  setTheme(CFG.theme);
  buildSliders();
  buildChips($("filters"), shownFilters(), CFG.filter, false);
  buildChips($("timers"), TIMERS, CFG.timer, true);
  buildChips($("shootModes"), SHOOT_MODES, CFG.shootMode||"fixed", false);
  buildModes();
  buildBgPick();
  showStep(1);
  var L0 = enabledLayouts()[0];
  if (L0) setPrintPage(L0);
});

if ("serviceWorker" in navigator){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  });
}
})();

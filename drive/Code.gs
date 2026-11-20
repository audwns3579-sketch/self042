/*
  셀프042 — 구글 드라이브로 사진 받기 (Google Apps Script)
  ---------------------------------------------------------------
  아이패드 부스 앱이 인화 사진을 보내면 드라이브에 두 곳으로 저장합니다.
    · "셀프042 QR"   — 손님이 QR 로 받는 곳. 링크가 있는 사람은 볼 수 있고, 2일 지나면 휴지통으로 옮깁니다.
    · "셀프042 사진" — 보관용. 지우지 않습니다. 아이맥의 "Google Drive" 앱으로 이 폴더를 받으면 자동으로 아이맥에 들어옵니다.

  올리는 법은 셀프042/README.md 의 "구글 드라이브 QR" 을 보세요.
  KEY 는 부스 앱 app.js 의 DRIVE_KEY 와 같아야 합니다.
*/

var SHARE_FOLDER = "셀프042 QR";
var KEEP_FOLDER  = "셀프042 사진";
var KEEP_DAYS    = 2;            // 손님 QR 사진을 남겨두는 날 수 (사용자 요청 2일)
var KEY          = "self042";    // 아무나 사진을 올리지 못하게 하는 암호. app.js 의 DRIVE_KEY 와 같게

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.key !== KEY) return reply({ ok: false, error: "key" });
    var name = "self042_" + Utilities.formatDate(new Date(), "Asia/Seoul", "yyMMdd_HHmmss") + ".jpg";
    var blob = Utilities.newBlob(Utilities.base64Decode(body.img), "image/jpeg", name);
    var f = folder(SHARE_FOLDER).createFile(blob);
    f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    folder(KEEP_FOLDER).createFile(blob.copyBlob().setName(name));
    return reply({ ok: true, url: "https://drive.google.com/file/d/" + f.getId() + "/view" });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

/* 1시간마다 돌면서 KEEP_DAYS 가 지난 QR 사진을 휴지통으로 옮깁니다. 휴지통에 들어가면 손님 링크가 막힙니다.
   보관용 폴더(KEEP_FOLDER)는 건드리지 않습니다. */
function cleanup() {
  var cut = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
  var it = folder(SHARE_FOLDER).getFiles();
  while (it.hasNext()) {
    var f = it.next();
    if (f.getDateCreated().getTime() < cut) f.setTrashed(true);
  }
}

/* 처음 한 번만 실행합니다. cleanup 을 1시간마다 돌게 등록합니다. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "cleanup") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("cleanup").timeBased().everyHours(1).create();
  folder(SHARE_FOLDER);
  folder(KEEP_FOLDER);
}

function folder(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

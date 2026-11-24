/* 피부색 판단(skinW) 검사. 쓰는 법: 셀프042 폴더에서  node tests/skin-check.js */
var fs=require("fs"), path=require("path"), assert=require("assert");
var src=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
eval(src.match(/function skinBand[^\n]*\n/)[0]); eval(src.match(/function skinW[\s\S]*?\n}\n/)[0]);
// 밝은 피부·어두운 피부는 피부로
assert.ok(skinW(230,180,160) > 0.5, "밝은 피부");
assert.ok(skinW(190,140,115) > 0.5, "조금 어두운 피부");
// 빨간 커튼·주황 점퍼·검정·회색·흰 벽은 피부가 아님(거뭇한 테두리의 원인이던 곳)
assert.strictEqual(skinW(110,20,30), 0, "빨간 커튼");
assert.strictEqual(skinW(220,110,80), 0, "주황 점퍼");
assert.strictEqual(skinW(20,20,20), 0, "검정");
assert.strictEqual(skinW(128,128,128), 0, "회색");
assert.strictEqual(skinW(240,240,240), 0, "흰 벽");
console.log("피부색 판단 검사 통과");

/* 릴스 부스 흑백 밝기 곡선(reelTone) 검사. 쓰는 법: 셀프042 폴더에서  node tests/reelbw-check.js */
var fs=require("fs"), path=require("path"), assert=require("assert");
var src=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
eval(src.match(/function reelTone[\s\S]*?\n}\n/)[0]);
// 검정은 살짝 띄우고(0.035), 흰색은 0.985 까지
assert.ok(Math.abs(reelTone(0)-0.035)<1e-6, "검정");
assert.ok(Math.abs(reelTone(1)-0.985)<1e-6, "흰색");
// 어두운 곳이 밝은 곳보다 밝아지는 일이 없어야 함(곡선이 계속 올라감)
for (var v=0.01; v<=1; v+=0.01) assert.ok(reelTone(v) >= reelTone(v-0.01), "곡선이 꺾임 " + v.toFixed(2));
// 피부(0.71)는 하얗게(0.85 이상), 배경(0.15)은 어둡게(0.2 이하) — 릴스처럼
assert.ok(reelTone(0.71) > 0.85, "피부가 밝아야 합니다 " + reelTone(0.71));
assert.ok(reelTone(0.15) < 0.2, "배경이 어두워야 합니다 " + reelTone(0.15));
console.log("릴스 흑백 곡선 검사 통과");

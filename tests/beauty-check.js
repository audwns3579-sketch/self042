/* 뷰티 떨림 잡기(smoothFaces) 검사. 쓰는 법: 셀프042 폴더에서  node tests/beauty-check.js */
var fs=require("fs"), path=require("path"), assert=require("assert");
var src=fs.readFileSync(path.join(__dirname,"..","app.js"),"utf8");
eval(src.match(/var FACE_KEYS[^\n]*\n/)[0]); eval(src.match(/function smoothFaces[\s\S]*?\n}\n/)[0]);
function face(x,y,ed){ return { e1:{x:x-ed/2,y:y}, e2:{x:x+ed/2,y:y}, n:{x:x,y:y+ed*0.4}, m:{x:x,y:y+ed*0.8}, a1:{x:x-ed,y:y}, a2:{x:x+ed,y:y} }; }
var ed=0.1, prev=[face(0.5,0.4,ed)], seed=1;
function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647-0.5; }
// 1) 눈 사이 거리의 ±1% 흔들림은 무시 → 위치가 그대로
for (var i=0;i<50;i++){ var j=face(0.5+rnd()*ed*0.02, 0.4+rnd()*ed*0.02, ed); prev=smoothFaces(prev,[j]); }
assert.ok(Math.abs(prev[0].e1.x-0.45)<1e-9 && Math.abs(prev[0].e1.y-0.4)<1e-9, "작은 흔들림은 무시해야 합니다");
// 2) 조금 움직이면(눈 사이 10%) 30%씩 따라감
var p2=smoothFaces(prev,[face(0.51,0.4,ed)]);
assert.ok(Math.abs(p2[0].e1.x-(0.45+0.01*0.3))<1e-9, "새 위치를 30%만 섞어야 합니다");
// 3) 크게 움직이면(눈 사이 50%) 바로 따라감
var p3=smoothFaces(prev,[face(0.55,0.4,ed)]);
assert.ok(Math.abs(p3[0].e1.x-0.5)<1e-9, "크게 움직이면 바로 따라가야 합니다");
// 4) 얼굴 수가 바뀌면 새로 찾은 그대로
assert.strictEqual(smoothFaces(prev,[face(0.3,0.4,ed),face(0.7,0.4,ed)]).length, 2);
console.log("뷰티 떨림 잡기 검사 통과");

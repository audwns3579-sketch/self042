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
// 2) 조금 움직이면(눈 사이 10%) 15%씩 따라감
var p2=smoothFaces(prev,[face(0.51,0.4,ed)]);
assert.ok(Math.abs(p2[0].e1.x-(0.45+0.01*0.15))<1e-9, "새 위치를 15%만 섞어야 합니다");
// 3) 크게 움직이면(눈 사이 50%) 바로 따라감
var p3=smoothFaces(prev,[face(0.55,0.4,ed)]);
assert.ok(Math.abs(p3[0].e1.x-0.5)<1e-9, "크게 움직이면 바로 따라가야 합니다");
// 4) 얼굴 수가 바뀌면 새로 찾은 그대로
assert.strictEqual(smoothFaces(prev,[face(0.3,0.4,ed),face(0.7,0.4,ed)]).length, 2);
// 5) 한 점만 눈 사이 3% 움직이면(4% 미만) 6점 모두 그대로(점마다 따로 움직여 모양이 일그러지지 않게)
var j5=face(0.5,0.4,ed); j5.e1={x:j5.e1.x+ed*0.03, y:j5.e1.y};
var p5=smoothFaces(prev,[j5]);
FACE_KEYS.forEach(function(k){ assert.ok(p5[0][k].x===prev[0][k].x && p5[0][k].y===prev[0][k].y, "4% 미만이면 모두 그대로여야 합니다: "+k); });
// 6) 얼굴을 놓쳐도 FACE_HOLD 번은 직전 위치, 그다음엔 비움
var h=prev;
for (var m=0;m<FACE_HOLD;m++){ h=smoothFaces(h,[]); assert.strictEqual(h.length,1,"놓친 "+(m+1)+"번째에도 직전 얼굴을 써야 합니다"); }
assert.strictEqual(smoothFaces(h,[]).length,0,"FACE_HOLD 번이 지나면 비워야 합니다");
// 7) 놓쳤다가 다시 찾으면 직전 위치에서 이어서 다듬음(툭 튀지 않게)
var p7=smoothFaces(smoothFaces(prev,[]),[face(0.51,0.4,ed)]);
assert.ok(Math.abs(p7[0].e1.x-(0.45+0.01*0.15))<1e-9, "다시 찾으면 이어서 15%씩 따라가야 합니다");
console.log("뷰티 떨림 잡기 검사 통과");

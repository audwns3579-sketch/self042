/* 쓰는 법: 셀프042 폴더에서  node tests/sw-check.js   (sw.js 의 받아 오기 방식을 고치면 다시 돌리세요) */
// sw.js 의 fetch 처리 검사: 화면 파일은 인터넷 먼저(끊기면 캐시), 그 밖은 캐시 먼저
const fs=require('fs'), vm=require('vm'), assert=require('assert');
const src=fs.readFileSync(process.argv[2]||require("path").join(__dirname,"..","sw.js"),"utf8");
const store={}; let online=true; const fetched=[];
function Res(body){ return { status:200, type:'basic', body, clone(){ return Res(body); } }; }
const caches={ open:async()=>({ put:async(req,res)=>{ store[req.url]=res; }, addAll:async()=>{} }), match:async(req)=>store[typeof req==='string'?'http://x/self042/index.html':req.url]||undefined, keys:async()=>[], delete:async()=>true };
const handlers={};
const self={ location:{ origin:'http://x' }, addEventListener:(t,f)=>handlers[t]=f, skipWaiting(){}, clients:{ claim(){} } };
vm.runInNewContext(src,{ self, caches, URL, fetch:async(req,opt)=>{ fetched.push([req.url,opt&&opt.cache]); if(!online) throw new Error('offline'); return Res('NET:'+req.url); }, console });
async function get(url, mode){ let p=null; handlers.fetch({ request:{ url, method:'GET', mode:mode||'no-cors' }, respondWith:(x)=>{ p=x; } }); return p ? (await p) : 'PASS-THROUGH'; }
(async()=>{
  store['http://x/self042/app.js']=Res('OLD app');
  store['http://x/self042/']=Res('OLD page');
  store['http://x/self042/stickers/tape/tape01.png']=Res('CACHED png');
  let r=await get('http://x/self042/','navigate'); assert.strictEqual(r.body,'NET:http://x/self042/','페이지는 인터넷 먼저');
  r=await get('http://x/self042/app.js'); assert.strictEqual(r.body,'NET:http://x/self042/app.js','app.js 는 인터넷 먼저');
  assert.ok(fetched.some(f=>f[0].endsWith('app.js')&&f[1]==='no-store'),'브라우저 캐시도 건너뜀');
  await new Promise(r=>setTimeout(r,10)); assert.strictEqual(store['http://x/self042/app.js'].body,'NET:http://x/self042/app.js','받은 것으로 캐시 갱신');
  r=await get('http://x/self042/stickers/tape/tape01.png'); assert.strictEqual(r.body,'CACHED png','스티커는 캐시 먼저');
  online=false;
  r=await get('http://x/self042/app.js'); assert.strictEqual(r.body,'NET:http://x/self042/app.js','끊기면 캐시(마지막으로 받은 것)');
  r=await get('http://x/self042/','navigate'); assert.ok(r && r.body,'끊겨도 페이지가 뜸');
  r=await get('https://studio042s-iMac.local:8443/photos'); assert.strictEqual(r,'PASS-THROUGH','인화 서버는 손대지 않음');
  console.log('sw 검사 통과');
})().catch(e=>{ console.error('실패:', e.message); process.exit(1); });

import{c as L}from"./index-DshXEMtg.js";import{r as T}from"./admin-auth-CZb-V-WK.js";const w=L("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],rating:0,phase:{},tog:{contam:!1,spawnBought:!1,b2b:!1,opIssue:!1},userEmail:""},f=[{id:"rooms",icon:"📅",title:"তারিখ ও রুম",type:"rooms"},{id:"harvest",icon:"🍄",title:"হার্ভেস্ট",type:"yn",q:"আজ হার্ভেস্ট হয়েছে?"},{id:"qc",icon:"✅",title:"কোয়ালিটি নিয়ন্ত্রণ",type:"yn",q:"কোয়ালিটি তথ্য রেকর্ড করবেন?"},{id:"spawn",icon:"🌱",title:"স্পন ও সাবষ্ট্রেট",type:"yn",q:"স্পন বা সাবষ্ট্রেট কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"প্রসেসিং",type:"yn",q:"আজ প্রসেসিং হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রয়",type:"yn",q:"আজ বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"ক্লোজিং স্টক",type:"yn",q:"ক্লোজিং স্টক রেকর্ড করবেন?"},{id:"expenses",icon:"💰",title:"দৈনিক খরচ",type:"yn",q:"আজ কোনো খরচ হয়েছে?"},{id:"ops",icon:"🏭",title:"অপারেশন",type:"yn",q:"অপারেশন তথ্য দিবেন?"},{id:"notes",icon:"📝",title:"পর্যবেক্ষণ ও রেটিং",type:"yn",q:"রেটিং ও মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"সারসংক্ষেপ",type:"summary"}],h=f.length,g=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),c=e=>parseFloat(t.d[e])||0,_=e=>t.d[e]??"0",o=e=>{const i=parseFloat(t.d[e]);return isNaN(i)?null:i},r=e=>t.d[e]||null;function a(e,i,n,s=.1,d=""){const l=_(e),p=s<1?2:0,u=s<1?"decimal":"numeric",v=d?`oninput="S.d['${e}']=this.value;lc('${d}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${i}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${s},${p})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${l}" step="${s}" min="0" inputmode="${u}" ${v}/>
      <button type="button" class="cb" onclick="adj('${e}',${s},${p})">+</button>
    </div>
    <div class="card-unit">${n}</div>
    ${d?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,i,n){const s=document.getElementById("f-"+e);if(!s)return;const d=Math.max(0,parseFloat(s.value||0)+i);s.value=d.toFixed(n),t.d[e]=s.value,s.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&$(),e==="sale"&&E(),e==="exp"&&I(),e==="proc"&&B(),e==="spn"&&x()};function $(){const e=c("h-fresh-a")+c("h-fresh-b")+c("h-fresh-rej"),i=document.getElementById("ht-tot");i&&(i.textContent=e.toFixed(2)+" kg")}function E(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let i=0;e.forEach(([s,d])=>{const l=c(s)*c(d);i+=l;const p=document.getElementById("tag-"+s);p&&(p.textContent=l>0?"= "+g(l):"")});const n=document.getElementById("sale-tot");n&&(n.textContent=g(i))}function I(){const i=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((s,d)=>s+c(d),0),n=document.getElementById("exp-tot");n&&(n.textContent=g(i))}function B(){const e=c("pr-fresh-in"),i=c("pr-dried-out"),n=c("pr-dried-in"),s=c("pr-powder-out"),d=document.getElementById("dry-yld"),l=document.getElementById("pow-yld");d&&(d.textContent=e>0?"ড্রাই ইল্ড: "+(i/e*100).toFixed(1)+"%":""),l&&(l.textContent=n>0?"পাউডার ইল্ড: "+(s/n*100).toFixed(1)+"%":"")}function x(){const e=c("sp-bought-kg")*c("sp-price-per-kg"),i=document.getElementById("spn-cost"),n=document.getElementById("spn-cost-row");i&&(i.textContent=g(e)),n&&(n.style.display=e>0?"flex":"none")}function F(){return`<div class="cards">
    <div class="sec-lbl">তাজা মাশরুম (kg)</div>
    <div class="cg3">
      ${a("h-fresh-a","গ্রেড A","kg",.1,"h")}
      ${a("h-fresh-b","গ্রেড B","kg",.1,"h")}
      ${a("h-fresh-rej","বাতিল","kg",.1,"h")}
    </div>
    <div class="tot"><span class="tot-lbl">মোট তাজা</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
    <div class="divider"></div>
    <div class="sec-lbl">প্রসেসড আউটপুট (kg)</div>
    <div class="cg2">
      ${a("h-dried","শুকনো আউটপুট","kg",.1)}
      ${a("h-powder","পাউডার আউটপুট","kg",.1)}
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">ব্যাচ তথ্য</div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">প্রাথমিক ব্যাচ</div>
        <input class="ci-txt" type="text" id="f-h-primary-batch" value="${t.d["h-primary-batch"]||""}" placeholder="BAT-2025-001" oninput="S.d['h-primary-batch']=this.value"/>
      </div>
      <div class="card">
        <div class="card-lbl">ফ্লাশ নম্বর</div>
        <select class="sel-inline" id="f-h-flush-num" onchange="S.d['h-flush-num']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(e=>`<option value="${e}"${t.d["h-flush-num"]==e?" selected":""}>ফ্লাশ ${e}</option>`).join("")}
        </select>
      </div>
    </div>
  </div>`}function N(){return`<div class="cards">
    <div class="sec-lbl">QC ফলাফল (kg)</div>
    <div class="cg3">
      ${a("qc-pass","QC পাশ","kg",.1)}
      ${a("qc-fail","QC ফেল","kg",.1)}
      <div class="card">
        <div class="card-lbl">ফেলের কারণ</div>
        <select class="sel-inline" id="f-qc-fail-reason" onchange="S.d['qc-fail-reason']=this.value">
          <option value="">—</option>
          ${[["overripe","অতিপরিপক্ব"],["damaged","ক্ষতিগ্রস্ত"],["off-colour","রং অস্বাভাবিক"],["contaminated","দূষিত"],["undersize","আকারে ছোট"],["mixed","মিশ্রিত"]].map(([e,i])=>`<option value="${e}"${t.d["qc-fail-reason"]===e?" selected":""}>${i}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">দূষণের ঘটনা ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-contam" ${t.tog.contam?"checked":""} onchange="togC('contam',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.contam?" show":""}" id="cond-contam">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">আক্রান্ত রুম</div>
          <select class="sel-inline" id="f-qc-contam-room" onchange="S.d['qc-contam-room']=this.value">
            <option value="">—</option>
            <option>A</option><option>B</option><option>C</option>
            <option value="multiple">একাধিক</option>
          </select>
        </div>
        <div class="card">
          <div class="card-lbl">দূষণের ধরন</div>
          <select class="sel-inline" id="f-qc-contam-type" onchange="S.d['qc-contam-type']=this.value">
            <option value="">—</option>
            <option value="bacterial">ব্যাকটেরিয়াল</option>
            <option value="mould">মোল্ড</option>
            <option value="trichoderma">ট্রাইকোডার্মা</option>
            <option value="unknown">অজানা</option>
          </select>
        </div>
        ${a("qc-contam-bags","আক্রান্ত ব্যাগ","টি",1)}
      </div>
    </div>
  </div>`}function M(){return`<div class="cards">
    <div class="tog-row">
      <span class="tog-lbl">আজ স্পন কেনা হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-spawn" ${t.tog.spawnBought?"checked":""} onchange="togC('spawnBought',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.spawnBought?" show":""}" id="cond-spawn">
      <div class="cg3" style="width:100%;max-width:460px">
        ${a("sp-bought-kg","পরিমাণ","kg",.1,"spn")}
        ${a("sp-price-per-kg","দাম/kg","৳",50,"spn")}
        <div class="card">
          <div class="card-lbl">সরবরাহকারী</div>
          <input class="ci-txt" type="text" id="f-sp-supplier" value="${t.d["sp-supplier"]||""}" placeholder="নাম" oninput="S.d['sp-supplier']=this.value"/>
        </div>
      </div>
      <div class="tot" id="spn-cost-row" style="display:none">
        <span class="tot-lbl">স্পন ক্রয় মূল্য</span>
        <span class="tot-val" id="spn-cost">৳ 0</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">আজকের ব্যবহার</div>
    <div class="cg2">
      ${a("sp-used-kg","ব্যবহৃত স্পন","kg",.1)}
      ${a("sp-substrate-kg","সাবষ্ট্রেট","kg",.1)}
    </div>
    <div class="cg3">
      ${a("sp-bags-inoculated","টিকা দেওয়া ব্যাগ","টি",1)}
      ${a("sp-bags-discarded","বাতিল ব্যাগ","টি",1)}
      <div class="card">
        <div class="card-lbl">সাবষ্ট্রেট ধরন</div>
        <select class="sel-inline" id="f-sp-substrate-type" onchange="S.d['sp-substrate-type']=this.value">
          <option value="">—</option>
          <option value="wheat_straw">গমের খড়</option>
          <option value="sawdust">করাতের গুঁড়া</option>
          <option value="rice_straw">ধানের খড়</option>
          <option value="mixed">মিশ্রিত</option>
        </select>
      </div>
    </div>
  </div>`}function A(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${a("pr-fresh-in","ড্রায়ারে দেওয়া","kg",.1,"proc")}
      ${a("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${a("pr-dried-in","গ্রাইন্ডারে দেওয়া","kg",.1,"proc")}
      ${a("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
  </div>`}function O(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([n,s,d,l])=>`
    <div class="sec-lbl">${d}</div>
    <div class="cg2">
      ${a(n,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">মূল্য / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${s}',-${l},0)">−</button>
          <input type="number" id="f-${s}" class="ci sm" value="${_(s)}" step="${l}" min="0" inputmode="numeric" oninput="S.d['${s}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${s}',${l},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${n}"></div>
      </div>
    </div>`).join("")}
    <div class="tot"><span class="tot-lbl">মোট রাজস্ব</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg2">
      ${a("s-orders","অর্ডার পূর্ণ","টি",1)}
      ${a("s-waste","অপচয়/ফেরত","kg",.1)}
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ B2B অর্ডার ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">B2B ক্লায়েন্ট</div>
          <input class="ci-txt" type="text" id="f-s-b2b-name" value="${t.d["s-b2b-name"]||""}" placeholder="রেস্টুরেন্ট…" oninput="S.d['s-b2b-name']=this.value"/>
        </div>
        ${a("s-b2b-qty","পরিমাণ","kg",.1)}
        ${a("s-b2b-value","মূল্য","৳",100)}
      </div>
    </div>
  </div>`}function z(){return`<div class="cards">
    <div class="sec-lbl">দিনশেষের মজুদ (kg)</div>
    <div class="cg3">
      ${a("st-fresh","তাজা","kg",.1)}
      ${a("st-dried","শুকনো","kg",.1)}
      ${a("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function D(){const e=[["ex-spawn","স্পন কেনা"],["ex-substrate","সাবষ্ট্রেট"],["ex-packaging","প্যাকেজিং"],["ex-labor","শ্রম মজুরি"],["ex-electricity","বিদ্যুৎ"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],i=[];for(let n=0;n<e.length;n+=2)i.push(`<div class="cg2">
      ${a(e[n][0],e[n][1],"৳",100,"exp")}
      ${n+1<e.length?a(e[n+1][0],e[n+1][1],"৳",100,"exp"):"<div></div>"}
    </div>`);return`<div class="cards">
    ${i.join("")}
    <div class="tot exp"><span class="tot-lbl">মোট খরচ</span><span class="tot-val" id="exp-tot">৳ 0</span></div>
  </div>`}function H(){return`<div class="cards">
    <div class="cg4">
      ${a("op-rooms","সক্রিয় রুম","টি",1)}
      ${a("op-bags-total","মোট ব্যাগ","টি",1)}
      ${a("op-workers","কর্মী","জন",1)}
      ${a("op-shifts","শিফট","টি",1)}
    </div>
    <div class="cg4">
      ${a("op-new-batches","নতুন ব্যাচ","টি",1)}
      ${a("op-done-batches","সম্পন্ন","টি",1)}
      ${a("op-bags-removed","সরানো ব্যাগ","টি",1)}
      ${a("op-energy-kwh","বিদ্যুৎ","kWh",.1)}
    </div>
    <div class="tog-row">
      <span class="tog-lbl">যন্ত্রপাতির সমস্যা ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-issue" ${t.tog.opIssue?"checked":""} onchange="togC('opIssue',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.opIssue?" show":""}" id="cond-issue">
      <textarea class="txt" id="f-op-issue-desc" rows="3" placeholder="কোন যন্ত্র, কী সমস্যা, সমাধান হয়েছে কিনা…" oninput="S.d['op-issue-desc']=this.value">${t.d["op-issue-desc"]||""}</textarea>
    </div>
  </div>`}function J(){const e=[["","— নির্বাচন"],["normal","স্বাভাবিক"],["hot","গরম"],["rainy","বৃষ্টি"],["cold","ঠান্ডা"],["humid","অতিআর্দ্র"],["stormy","ঝড়"]],i=[1,2,3,4,5].map(s=>`<span class="star${t.rating>=s?" on":""}" data-v="${s}" onclick="setStar(${s})">⭐</span>`).join(""),n=["","খুব খারাপ","খারাপ","স্বাভাবিক","ভালো","চমৎকার"];return`<div class="cards">
    <div class="sec-lbl">আবহাওয়া</div>
    <select class="sel" id="f-n-weather" onchange="S.d['n-weather']=this.value">
      ${e.map(([s,d])=>`<option value="${s}"${t.d["n-weather"]===s?" selected":""}>${d}</option>`).join("")}
    </select>
    <div class="sec-lbl">আজকের রেটিং</div>
    <div class="stars">${i}</div>
    <div class="star-lbl" id="star-lbl">${t.rating?n[t.rating]:"একটি তারা বেছে নিন"}</div>
    <div class="sec-lbl">আজকের পর্যবেক্ষণ</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের বৃদ্ধি, রঙ, গন্ধ, অস্বাভাবিকতা…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কাল কী করতে হবে</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="হার্ভেস্ট, উপকরণ কেনা, ব্যাচ চেক…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অস্বাভাবিক ঘটনা (ঐচ্ছিক)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, অনুপস্থিত কর্মী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const Q={harvest:F,qc:N,spawn:M,processing:A,sales:O,stock:z,expenses:D,ops:H,notes:J};function X(e){if(e.type==="rooms"){const i=t.d["log-date"]||new Date().toISOString().slice(0,10),n=["A","B","C"].map(s=>`
      <div class="rc${t.rooms.includes(s)?" sel":""}" id="rc-${s}" onclick="togRoom('${s}')">
        <div class="rc-letter">${s}</div>
        <div class="rc-name">রুম ${s}</div>
      </div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${i}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ পরিবর্তন</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${i}" onchange="dateChanged()"/>
      <div class="step-sub">আজকের হার্ভেস্ট করা রুম নির্বাচন করুন</div>
      <div class="rooms">${n}</div>
      <div style="font-size:11px;color:rgba(245,239,230,.22)">একাধিক রুম বেছে নেওয়া যাবে</div>`}if(e.type==="summary"){const i=c("h-fresh-a")+c("h-fresh-b")+c("h-fresh-rej"),n=c("s-fresh-kg")*c("s-fresh-price")+c("s-dried-kg")*c("s-dried-price")+c("s-powder-kg")*c("s-powder-price"),s=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((u,v)=>u+c(v),0),d=n-s,l=c("qc-pass")+c("qc-fail"),p=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",i>0?i.toFixed(2)+" kg":"—","g"],["QC পাশ হার",l>0?(c("qc-pass")/l*100).toFixed(0)+"%":"—","gold"],["মোট রাজস্ব",n>0?g(n):"—","g"],["মোট খরচ",s>0?g(s):"—","r"],["কর্মী",c("op-workers")||"—",""],["রেটিং",t.rating?"⭐".repeat(t.rating):"—",""]].map(([u,v,b])=>`<div class="sum-row"><span class="sum-k">${u}</span><span class="sum-v${b?" "+b:""}">${v}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">জমা দেওয়ার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${p}
        <div class="net-box ${d>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি</div>
          <div class="net-val">${g(d)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(Q[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না</button>
      </div>`:""}function m(e="next"){const i=f[t.step],n=document.getElementById("wrap"),s=t.step===h-1,d=i.type==="yn"&&t.phase[i.id]==="form",l=i.type==="yn"&&!d;document.getElementById("prog-title").textContent=i.title,document.getElementById("prog-count").textContent=t.step+1+"/"+h,document.getElementById("prog-bar").style.width=(t.step+1)/h*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const p=document.getElementById("btn-next");p.textContent=s?"জমা দিন ✓":"পরবর্তী →",p.className="btn-next"+(s?" sub":""),p.disabled=!1,document.getElementById("btn-skip").style.display=l||i.type==="summary"?"none":"";const u=document.createElement("div"),v=n.querySelector(".slide");u.className=v?"slide "+(e==="back"?"in-l":"in-r"):"slide",u.innerHTML=X(i),n.appendChild(u),v&&(v.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>v.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>u.classList.remove("in-r","in-l"))),i.id==="harvest"&&d&&$(),i.id==="sales"&&d&&E(),i.id==="expenses"&&d&&I(),i.id==="processing"&&d&&B(),i.id==="spawn"&&d&&t.tog.spawnBought&&x(),setTimeout(()=>{const b=u.querySelector('input[type="number"],input[type="text"],textarea');b&&b.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[f[t.step].id]="form",m("next")};window.ansNo=function(){t.step<h-1?(t.step++,m("next")):k()};function q(){y(),t.step<h-1?(t.step++,m("next")):k()}function S(){y();const e=f[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],m("back");return}t.step>0&&(t.step--,m("back"))}function y(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(n=>{const s=n.id.slice(2);n.tagName==="SELECT"?n.value&&(t.d[s]=n.value):n.type==="checkbox"||(t.d[s]=n.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({contam:"tog-contam",spawnBought:"tog-spawn",b2b:"tog-b2b",opIssue:"tog-issue"}).forEach(([n,s])=>{const d=document.getElementById(s);d&&(t.tog[n]=d.checked)}),t.rating&&(t.d["n-overall-rating"]=String(t.rating))}window.togRoom=function(e){const i=t.rooms.indexOf(e);i>-1?t.rooms.splice(i,1):t.rooms.push(e);const n=document.getElementById("rc-"+e);n&&n.classList.toggle("sel",t.rooms.includes(e))};window.togC=function(e,i){t.tog[e]=i.checked;const n={contam:"cond-contam",spawnBought:"cond-spawn",b2b:"cond-b2b",opIssue:"cond-issue"},s=document.getElementById(n[e]);s&&s.classList.toggle("show",i.checked),e==="spawnBought"&&x()};window.editDate=function(){var i;document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),(i=e.showPicker)==null||i.call(e)};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};window.setStar=function(e){t.rating=e,document.querySelectorAll(".star").forEach(s=>s.classList.toggle("on",+s.dataset.v<=e));const i=["","খুব খারাপ","খারাপ","স্বাভাবিক","ভালো","চমৎকার"],n=document.getElementById("star-lbl");n&&(n.textContent=i[e])};function Y(e,i="info"){const n=document.getElementById("toast-stack"),s=document.createElement("div");s.className=`toast ${i}`,s.textContent=e,n.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},3e3)}async function k(){y();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="জমা হচ্ছে…";const i={log_date:t.d["log-date"]||new Date().toISOString().slice(0,10),submitted_by:t.userEmail||null,harvest_fresh_a:o("h-fresh-a"),harvest_fresh_b:o("h-fresh-b"),harvest_fresh_rej:o("h-fresh-rej"),harvest_dried:o("h-dried"),harvest_powder:o("h-powder"),harvest_rooms:t.rooms.length?t.rooms:null,harvest_primary_batch:r("h-primary-batch"),harvest_flush_num:o("h-flush-num"),qc_pass:o("qc-pass"),qc_fail:o("qc-fail"),qc_fail_reason:r("qc-fail-reason"),contam_event:t.tog.contam,contam_room:r("qc-contam-room"),contam_type:r("qc-contam-type"),contam_bags:o("qc-contam-bags"),spawn_bought_kg:o("sp-bought-kg"),spawn_price_per_kg:o("sp-price-per-kg"),spawn_supplier:r("sp-supplier"),spawn_used_kg:o("sp-used-kg"),substrate_kg:o("sp-substrate-kg"),substrate_type:r("sp-substrate-type"),bags_inoculated:o("sp-bags-inoculated"),bags_discarded:o("sp-bags-discarded"),pr_fresh_in:o("pr-fresh-in"),pr_dried_out:o("pr-dried-out"),pr_dried_in:o("pr-dried-in"),pr_powder_out:o("pr-powder-out"),s_fresh_kg:o("s-fresh-kg"),s_fresh_price:o("s-fresh-price"),s_dried_kg:o("s-dried-kg"),s_dried_price:o("s-dried-price"),s_powder_kg:o("s-powder-kg"),s_powder_price:o("s-powder-price"),s_orders:o("s-orders"),s_waste:o("s-waste"),s_b2b_name:r("s-b2b-name"),s_b2b_qty:o("s-b2b-qty"),s_b2b_value:o("s-b2b-value"),st_fresh:o("st-fresh"),st_dried:o("st-dried"),st_powder:o("st-powder"),ex_spawn:o("ex-spawn"),ex_substrate:o("ex-substrate"),ex_packaging:o("ex-packaging"),ex_labor:o("ex-labor"),ex_electricity:o("ex-electricity"),ex_transport:o("ex-transport"),ex_water:o("ex-water"),ex_other:o("ex-other"),op_rooms:o("op-rooms"),op_bags_total:o("op-bags-total"),op_workers:o("op-workers"),op_shifts:o("op-shifts"),op_new_batches:o("op-new-batches"),op_done_batches:o("op-done-batches"),op_bags_removed:o("op-bags-removed"),op_energy_kwh:o("op-energy-kwh"),op_issue:t.tog.opIssue,op_issue_desc:r("op-issue-desc"),n_weather:r("n-weather"),n_overall_rating:o("n-overall-rating"),n_observations:r("n-observations"),n_tomorrow:r("n-tomorrow"),n_unusual:r("n-unusual")};try{const{error:n}=await w.from("farm_daily_logs").upsert(i,{onConflict:"log_date"});if(n)throw n;document.getElementById("ftr").style.display="none";const s=document.getElementById("wrap"),d=s.querySelector(".slide");d&&d.classList.add("out-l");const l=document.createElement("div");l.className="slide in-r",l.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">লগ জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে সেভ হয়েছে।<br>অ্যাডমিন প্যানেলে ফিরে যাচ্ছেন…</div>
    </div>`,s.appendChild(l),requestAnimationFrame(()=>requestAnimationFrame(()=>l.classList.remove("in-r"))),setTimeout(()=>d==null?void 0:d.remove(),260),setTimeout(()=>window.location.href="admin.html",2800)}catch(n){e.disabled=!1,e.textContent="জমা দিন ✓",e.className="btn-next sub",Y("জমা হয়নি: "+n.message,"error")}}document.getElementById("btn-next").addEventListener("click",q);document.getElementById("btn-skip").addEventListener("click",()=>{y(),t.step<h-1?(t.step++,m("next")):k()});document.getElementById("hdr-back").addEventListener("click",S);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function R(){try{const{data:e}=await w.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let C=0,j=0;document.getElementById("wrap").addEventListener("touchstart",e=>{C=e.touches[0].clientX,j=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const i=e.changedTouches[0].clientX-C,n=Math.abs(e.changedTouches[0].clientY-j);Math.abs(i)>60&&n<80&&(i<0?q():S())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await T(w);if(!e){window.location.href="admin.html";return}t.userEmail=e.user.email,t.d["log-date"]=new Date().toISOString().slice(0,10),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await R(),document.getElementById("wrap").innerHTML="",m("next")})();

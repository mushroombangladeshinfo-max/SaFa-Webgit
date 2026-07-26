import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as j}from"./index-B-jIxwbw.js";import{r as T}from"./admin-auth-Bm8-hV4r.js";import{l as w}from"./date-utils-BQiP-iFW.js";const x=j("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],rating:0,phase:{},tog:{contam:!1,spawnBought:!1,b2b:!1,samples:!1,opIssue:!1},userEmail:""},f=[{id:"rooms",icon:"📅",title:"তারিখ ও রুম",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"✅",title:"Quality Check",type:"yn",q:"আজকের Quality Check দিবেন?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"ops",icon:"🏭",title:"Operations",type:"yn",q:"আজকের Operation তথ্য দিবেন?"},{id:"notes",icon:"📝",title:"নোট ও রেটিং",type:"yn",q:"আজকের রেটিং ও মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],h=f.length,g=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),c=e=>parseFloat(t.d[e])||0,$=e=>t.d[e]??"0",a=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},r=e=>t.d[e]||null;function o(e,n,i,s=.1,d=""){const l=$(e),p=s<1?2:0,v=s<1?"decimal":"numeric",u=d?`oninput="S.d['${e}']=this.value;lc('${d}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${s},${p})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${l}" step="${s}" min="0" inputmode="${v}" ${u}/>
      <button type="button" class="cb" onclick="adj('${e}',${s},${p})">+</button>
    </div>
    <div class="card-unit">${i}</div>
    ${d?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,i){const s=document.getElementById("f-"+e);if(!s)return;const d=Math.max(0,parseFloat(s.value||0)+n);s.value=d.toFixed(i),t.d[e]=s.value,s.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&E(),e==="sale"&&B(),e==="exp"&&S(),e==="proc"&&I(),e==="spn"&&k()};function E(){const e=c("h-fresh-a")+c("h-fresh-b")+c("h-fresh-rej"),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function B(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([s,d])=>{const l=c(s)*c(d);n+=l;const p=document.getElementById("tag-"+s);p&&(p.textContent=l>0?"= "+g(l):"")});const i=document.getElementById("sale-tot");i&&(i.textContent=g(n))}function S(){const n=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((s,d)=>s+c(d),0),i=document.getElementById("exp-tot");i&&(i.textContent=g(n))}function I(){const e=c("pr-fresh-in"),n=c("pr-dried-out"),i=c("pr-dried-in"),s=c("pr-powder-out"),d=document.getElementById("dry-yld"),l=document.getElementById("pow-yld");d&&(d.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),l&&(l.textContent=i>0?"পাউডার ইল্ড: "+(s/i*100).toFixed(1)+"%":"")}function k(){const e=c("sp-bought-kg")*c("sp-price-per-kg"),n=document.getElementById("spn-cost"),i=document.getElementById("spn-cost-row");n&&(n.textContent=g(e)),i&&(i.style.display=e>0?"flex":"none")}function M(){return`<div class="cards">
    <div class="sec-lbl">তাজা মাশরুম (kg)</div>
    <div class="cg3">
      ${o("h-fresh-a","Grade A","kg",.1,"h")}
      ${o("h-fresh-b","Grade B","kg",.1,"h")}
      ${o("h-fresh-rej","বাতিল","kg",.1,"h")}
    </div>
    <div class="tot"><span class="tot-lbl">মোট তাজা</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
    <div class="divider"></div>
    <div class="sec-lbl">হার্ভেস্ট উৎস</div>
    <div class="cg2">
      ${o("h-healthy-kg","সুস্থ ব্যাগ থেকে","kg",.01)}
      ${o("h-recovered-kg","মোল্ড থেকে উদ্ধারকৃত","kg",.01)}
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">প্রসেসড পণ্য (kg)</div>
    <div class="cg2">
      ${o("h-dried","শুকনো","kg",.1)}
      ${o("h-powder","পাউডার","kg",.1)}
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">Batch তথ্য</div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Primary Batch</div>
        <input class="ci-txt" type="text" id="f-h-primary-batch" value="${t.d["h-primary-batch"]||""}" placeholder="BAT-2025-001" oninput="S.d['h-primary-batch']=this.value"/>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-h-flush-num" onchange="S.d['h-flush-num']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(e=>`<option value="${e}"${t.d["h-flush-num"]==e?" selected":""}>${e}ম Flush</option>`).join("")}
        </select>
      </div>
    </div>
  </div>`}function N(){return`<div class="cards">
    <div class="sec-lbl">Quality Check ফলাফল (kg)</div>
    <div class="cg3">
      ${o("qc-pass","Pass","kg",.1)}
      ${o("qc-fail","Fail","kg",.1)}
      <div class="card">
        <div class="card-lbl">Fail-এর কারণ</div>
        <select class="sel-inline" id="f-qc-fail-reason" onchange="S.d['qc-fail-reason']=this.value">
          <option value="">—</option>
          ${[["overripe","বেশি পাকা"],["damaged","ক্ষতিগ্রস্ত"],["off-colour","রং ঠিক নেই"],["contaminated","দূষিত"],["undersize","আকারে ছোট"],["mixed","মিশ্রিত"]].map(([e,n])=>`<option value="${e}"${t.d["qc-fail-reason"]===e?" selected":""}>${n}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি Contamination হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-contam" ${t.tog.contam?"checked":""} onchange="togC('contam',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.contam?" show":""}" id="cond-contam">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">কোন রুম?</div>
          <select class="sel-inline" id="f-qc-contam-room" onchange="S.d['qc-contam-room']=this.value">
            <option value="">—</option>
            <option>A</option><option>B</option><option>C</option>
            <option value="multiple">একাধিক</option>
          </select>
        </div>
        <div class="card">
          <div class="card-lbl">ধরন</div>
          <select class="sel-inline" id="f-qc-contam-type" onchange="S.d['qc-contam-type']=this.value">
            <option value="">—</option>
            <option value="bacterial">Bacterial</option>
            <option value="mould">Mould</option>
            <option value="trichoderma">Trichoderma</option>
            <option value="unknown">অজানা</option>
          </select>
        </div>
        ${o("qc-contam-bags","ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
      </div>
      <div class="card" style="max-width:460px;width:100%">
        <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
        <input class="ci-txt" type="text" id="f-qc-contam-action" value="${t.d["qc-contam-action"]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-contam-action']=this.value"/>
      </div>
    </div>
  </div>`}function A(){return`<div class="cards">
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি Spawn কেনা হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-spawn" ${t.tog.spawnBought?"checked":""} onchange="togC('spawnBought',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.spawnBought?" show":""}" id="cond-spawn">
      <div class="cg3" style="width:100%;max-width:460px">
        ${o("sp-bought-kg","পরিমাণ","kg",.1,"spn")}
        ${o("sp-price-per-kg","দাম/kg","৳",50,"spn")}
        <div class="card">
          <div class="card-lbl">Supplier</div>
          <input class="ci-txt" type="text" id="f-sp-supplier" value="${t.d["sp-supplier"]||""}" placeholder="নাম লিখুন" oninput="S.d['sp-supplier']=this.value"/>
        </div>
      </div>
      <div class="tot" id="spn-cost-row" style="display:none">
        <span class="tot-lbl">Spawn কেনার মোট দাম</span>
        <span class="tot-val" id="spn-cost">৳ 0</span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">আজকের ব্যবহার</div>
    <div class="cg2">
      ${o("sp-used-kg","Spawn ব্যবহার","kg",.1)}
      ${o("sp-substrate-kg","Substrate","kg",.1)}
    </div>
    <div class="cg3">
      ${o("sp-bags-inoculated","Inoculated ব্যাগ","টি",1)}
      ${o("sp-bags-discarded","বাদ দেওয়া ব্যাগ","টি",1)}
      <div class="card">
        <div class="card-lbl">Substrate ধরন</div>
        <select class="sel-inline" id="f-sp-substrate-type" onchange="S.d['sp-substrate-type']=this.value">
          <option value="">—</option>
          <option value="wheat_straw">গমের খড়</option>
          <option value="sawdust">করাতের গুঁড়া</option>
          <option value="rice_straw">ধানের খড়</option>
          <option value="mixed">মিশ্রিত</option>
        </select>
      </div>
    </div>
  </div>`}function H(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${o("pr-fresh-in","Dryer-এ দেওয়া","kg",.1,"proc")}
      ${o("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${o("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${o("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function O(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([i,s,d,l])=>`
    <div class="sec-lbl">${d}</div>
    <div class="cg2">
      ${o(i,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${s}',-${l},0)">−</button>
          <input type="number" id="f-${s}" class="ci sm" value="${$(s)}" step="${l}" min="0" inputmode="numeric" oninput="S.d['${s}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${s}',${l},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${i}"></div>
      </div>
    </div>`).join("")}
    <div class="tot"><span class="tot-lbl">মোট বিক্রয়</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg2">
      ${o("s-orders","Order পূরণ","টি",1)}
      ${o("s-waste","নষ্ট/ফেরত","kg",.1)}
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি B2B Order ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">B2B Client</div>
          <input class="ci-txt" type="text" id="f-s-b2b-name" value="${t.d["s-b2b-name"]||""}" placeholder="রেস্টুরেন্ট…" oninput="S.d['s-b2b-name']=this.value"/>
        </div>
        ${o("s-b2b-qty","পরিমাণ","kg",.1)}
        ${o("s-b2b-value","মূল্য","৳",100)}
      </div>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বিনামূল্যে নমুনা দেওয়া হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-samples" ${t.tog.samples?"checked":""} onchange="togC('samples',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.samples?" show":""}" id="cond-samples">
      <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
      <div class="cg3" style="width:100%;max-width:460px">
        ${o("sample-fresh-kg","তাজা","kg",.01)}
        ${o("sample-dried-kg","শুকনো","kg",.01)}
        ${o("sample-powder-kg","পাউডার","kg",.01)}
      </div>
      <div class="card" style="max-width:460px;width:100%">
        <div class="card-lbl">কাকে/কেন দেওয়া হয়েছে</div>
        <input class="ci-txt" type="text" id="f-sample-notes" value="${t.d["sample-notes"]||""}" placeholder="যেমন: রেস্টুরেন্ট ট্রায়াল, বন্ধু-পরিবার" oninput="S.d['sample-notes']=this.value"/>
      </div>
    </div>
  </div>`}function z(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${o("st-fresh","তাজা","kg",.1)}
      ${o("st-dried","শুকনো","kg",.1)}
      ${o("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function P(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],n=[];for(let i=0;i<e.length;i+=2)n.push(`<div class="cg2">
      ${o(e[i][0],e[i][1],"৳",100,"exp")}
      ${i+1<e.length?o(e[i+1][0],e[i+1][1],"৳",100,"exp"):"<div></div>"}
    </div>`);return`<div class="cards">
    ${n.join("")}
    <div class="tot exp"><span class="tot-lbl">মোট খরচ</span><span class="tot-val" id="exp-tot">৳ 0</span></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">খরচের মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-ex-notes" value="${t.d["ex-notes"]||""}" placeholder="অন্যান্য খরচের বিস্তারিত..." oninput="S.d['ex-notes']=this.value"/>
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">চ্যানেল অনুযায়ী খরচ (ঐচ্ছিক)</div>
    <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">অনলাইন (ওয়েবসাইট) বনাম অফলাইন (সরাসরি/B2B) বিক্রির প্রকৃত প্যাকেজিং ও ডেলিভারি খরচ আলাদা রাখলে চ্যানেল-ভিত্তিক লাভ-ক্ষতি দেখা যাবে।</div>
    <div class="cg2">
      ${o("ex-online-packaging","অনলাইন প্যাকেজিং","৳",50)}
      ${o("ex-online-delivery","অনলাইন ডেলিভারি","৳",50)}
    </div>
    <div class="cg2">
      ${o("ex-offline-packaging","অফলাইন প্যাকেজিং","৳",50)}
      ${o("ex-offline-delivery","অফলাইন ডেলিভারি","৳",50)}
    </div>
  </div>`}function D(){return`<div class="cards">
    <div class="cg4">
      ${o("op-rooms","Active রুম","টি",1)}
      ${o("op-bags-total","মোট ব্যাগ","টি",1)}
      ${o("op-workers","কর্মী","জন",1)}
      ${o("op-shifts","Shift","টি",1)}
    </div>
    <div class="cg4">
      ${o("op-new-batches","নতুন Batch","টি",1)}
      ${o("op-done-batches","শেষ Batch","টি",1)}
      ${o("op-bags-removed","বাদ দেওয়া ব্যাগ","টি",1)}
      ${o("op-energy-kwh","বিদ্যুৎ","kWh",.1)}
    </div>
    <div class="tog-row">
      <span class="tog-lbl">কোনো Machine-এ সমস্যা ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-issue" ${t.tog.opIssue?"checked":""} onchange="togC('opIssue',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.opIssue?" show":""}" id="cond-issue">
      <textarea class="txt" id="f-op-issue-desc" rows="3" placeholder="কোন machine, কী সমস্যা হয়েছে, ঠিক হয়েছে কিনা…" oninput="S.d['op-issue-desc']=this.value">${t.d["op-issue-desc"]||""}</textarea>
    </div>
  </div>`}function J(){const e=[["","— বেছে নিন"],["normal","স্বাভাবিক"],["hot","গরম"],["rainy","বৃষ্টি"],["cold","ঠান্ডা"],["humid","বেশি আর্দ্র"],["stormy","ঝড়"]],n=[1,2,3,4,5].map(s=>`<span class="star${t.rating>=s?" on":""}" data-v="${s}" onclick="setStar(${s})">⭐</span>`).join(""),i=["","খুব খারাপ","খারাপ","মোটামুটি","ভালো","অনেক ভালো"];return`<div class="cards">
    <div class="sec-lbl">আজকের আবহাওয়া</div>
    <select class="sel" id="f-n-weather" onchange="S.d['n-weather']=this.value">
      ${e.map(([s,d])=>`<option value="${s}"${t.d["n-weather"]===s?" selected":""}>${d}</option>`).join("")}
    </select>
    <div class="sec-lbl">আজকের দিনটা কেমন ছিল?</div>
    <div class="stars">${n}</div>
    <div class="star-lbl" id="star-lbl">${t.rating?i[t.rating]:"একটা তারা বেছে নিন"}</div>
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const G={harvest:M,qc:N,spawn:A,processing:H,sales:O,stock:z,expenses:P,ops:D,notes:J};function Q(e){if(e.type==="rooms"){const n=t.d["log-date"]||w(),i=["A","B","C"].map(s=>`
      <div class="rc${t.rooms.includes(s)?" sel":""}" id="rc-${s}" onclick="togRoom('${s}')">
        <div class="rc-letter">${s}</div>
        <div class="rc-name">রুম ${s}</div>
      </div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub">আজকে কোন রুম থেকে Harvest হয়েছে?</div>
      <div class="rooms">${i}</div>
      <div style="font-size:11px;color:rgba(245,239,230,.22)">একাধিক রুম select করা যাবে</div>`}if(e.type==="summary"){const n=c("h-fresh-a")+c("h-fresh-b")+c("h-fresh-rej"),i=c("s-fresh-kg")*c("s-fresh-price")+c("s-dried-kg")*c("s-dried-price")+c("s-powder-kg")*c("s-powder-price"),s=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((v,u)=>v+c(u),0),d=i-s,l=c("qc-pass")+c("qc-fail"),p=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["QC পাশ হার",l>0?(c("qc-pass")/l*100).toFixed(0)+"%":"—","gold"],["মোট বিক্রয়",i>0?g(i):"—","g"],["মোট খরচ",s>0?g(s):"—","r"],["কর্মী",c("op-workers")||"—",""],["রেটিং",t.rating?"⭐".repeat(t.rating):"—",""]].map(([v,u,b])=>`<div class="sum-row"><span class="sum-k">${v}</span><span class="sum-v${b?" "+b:""}">${u}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${p}
        <div class="net-box ${d>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${g(d)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(G[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function m(e="next"){const n=f[t.step],i=document.getElementById("wrap"),s=t.step===h-1,d=n.type==="yn"&&t.phase[n.id]==="form",l=n.type==="yn"&&!d;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+h,document.getElementById("prog-bar").style.width=(t.step+1)/h*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const p=document.getElementById("btn-next");p.textContent=s?"Submit করুন ✓":"পরবর্তী →",p.className="btn-next"+(s?" sub":""),p.disabled=!1,document.getElementById("btn-skip").style.display=l||n.type==="summary"?"none":"";const v=document.createElement("div"),u=i.querySelector(".slide");v.className=u?"slide "+(e==="back"?"in-l":"in-r"):"slide",v.innerHTML=Q(n),i.appendChild(v),u&&(u.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>u.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>v.classList.remove("in-r","in-l"))),n.id==="harvest"&&d&&E(),n.id==="sales"&&d&&B(),n.id==="expenses"&&d&&S(),n.id==="processing"&&d&&I(),n.id==="spawn"&&d&&t.tog.spawnBought&&k(),setTimeout(()=>{const b=v.querySelector('input[type="number"],input[type="text"],textarea');b&&b.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[f[t.step].id]="form",m("next")};window.ansNo=function(){t.step<h-1?(t.step++,m("next")):_()};function q(){y(),t.step<h-1?(t.step++,m("next")):_()}function C(){y();const e=f[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],m("back");return}t.step>0&&(t.step--,m("back"))}function y(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(i=>{const s=i.id.slice(2);i.tagName==="SELECT"?i.value&&(t.d[s]=i.value):i.type==="checkbox"||(t.d[s]=i.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({contam:"tog-contam",spawnBought:"tog-spawn",b2b:"tog-b2b",samples:"tog-samples",opIssue:"tog-issue"}).forEach(([i,s])=>{const d=document.getElementById(s);d&&(t.tog[i]=d.checked)}),t.rating&&(t.d["n-overall-rating"]=String(t.rating))}window.togRoom=function(e){const n=t.rooms.indexOf(e);n>-1?t.rooms.splice(n,1):t.rooms.push(e);const i=document.getElementById("rc-"+e);i&&i.classList.toggle("sel",t.rooms.includes(e))};window.togC=function(e,n){t.tog[e]=n.checked;const i={contam:"cond-contam",spawnBought:"cond-spawn",b2b:"cond-b2b",samples:"cond-samples",opIssue:"cond-issue"},s=document.getElementById(i[e]);s&&s.classList.toggle("show",n.checked),e==="spawnBought"&&k()};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};window.setStar=function(e){t.rating=e,document.querySelectorAll(".star").forEach(s=>s.classList.toggle("on",+s.dataset.v<=e));const n=["","খুব খারাপ","খারাপ","স্বাভাবিক","ভালো","চমৎকার"],i=document.getElementById("star-lbl");i&&(i.textContent=n[e])};function X(e,n="info"){const i=document.getElementById("toast-stack"),s=document.createElement("div");s.className=`toast ${n}`,s.textContent=e,i.appendChild(s),requestAnimationFrame(()=>s.classList.add("show")),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),300)},3e3)}async function _(){y();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n={log_date:t.d["log-date"]||w(),submitted_by:t.userEmail||null,harvest_fresh_a:a("h-fresh-a"),harvest_fresh_b:a("h-fresh-b"),harvest_fresh_rej:a("h-fresh-rej"),harvest_dried:a("h-dried"),harvest_powder:a("h-powder"),harvest_healthy_kg:a("h-healthy-kg"),harvest_recovered_kg:a("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,harvest_primary_batch:r("h-primary-batch"),harvest_flush_num:a("h-flush-num"),qc_pass:a("qc-pass"),qc_fail:a("qc-fail"),qc_fail_reason:r("qc-fail-reason"),contam_event:t.tog.contam,contam_room:r("qc-contam-room"),contam_type:r("qc-contam-type"),contam_bags:a("qc-contam-bags"),contam_action:r("qc-contam-action"),spawn_bought_kg:a("sp-bought-kg"),spawn_price_per_kg:a("sp-price-per-kg"),spawn_supplier:r("sp-supplier"),spawn_used_kg:a("sp-used-kg"),substrate_kg:a("sp-substrate-kg"),substrate_type:r("sp-substrate-type"),bags_inoculated:a("sp-bags-inoculated"),bags_discarded:a("sp-bags-discarded"),pr_fresh_in:a("pr-fresh-in"),pr_dried_out:a("pr-dried-out"),pr_dried_in:a("pr-dried-in"),pr_powder_out:a("pr-powder-out"),pr_notes:r("pr-notes"),s_fresh_kg:a("s-fresh-kg"),s_fresh_price:a("s-fresh-price"),s_dried_kg:a("s-dried-kg"),s_dried_price:a("s-dried-price"),s_powder_kg:a("s-powder-kg"),s_powder_price:a("s-powder-price"),s_orders:a("s-orders"),s_waste:a("s-waste"),s_b2b_name:r("s-b2b-name"),s_b2b_qty:a("s-b2b-qty"),s_b2b_value:a("s-b2b-value"),sample_fresh_kg:a("sample-fresh-kg"),sample_dried_kg:a("sample-dried-kg"),sample_powder_kg:a("sample-powder-kg"),sample_notes:r("sample-notes"),st_fresh:a("st-fresh"),st_dried:a("st-dried"),st_powder:a("st-powder"),ex_spawn:a("ex-spawn"),ex_substrate:a("ex-substrate"),ex_packaging:a("ex-packaging"),ex_labor:a("ex-labor"),ex_electricity:a("ex-electricity"),ex_transport:a("ex-transport"),ex_water:a("ex-water"),ex_other:a("ex-other"),ex_notes:r("ex-notes"),online_packaging_cost:a("ex-online-packaging"),online_delivery_cost:a("ex-online-delivery"),offline_packaging_cost:a("ex-offline-packaging"),offline_delivery_cost:a("ex-offline-delivery"),op_rooms:a("op-rooms"),op_bags_total:a("op-bags-total"),op_workers:a("op-workers"),op_shifts:a("op-shifts"),op_new_batches:a("op-new-batches"),op_done_batches:a("op-done-batches"),op_bags_removed:a("op-bags-removed"),op_energy_kwh:a("op-energy-kwh"),op_issue:t.tog.opIssue,op_issue_desc:r("op-issue-desc"),n_weather:r("n-weather"),n_overall_rating:a("n-overall-rating"),n_observations:r("n-observations"),n_tomorrow:r("n-tomorrow"),n_unusual:r("n-unusual")};try{const{error:i}=await x.from("farm_daily_logs").upsert(n,{onConflict:"log_date"});if(i)throw i;document.getElementById("ftr").style.display="none";const s=document.getElementById("wrap"),d=s.querySelector(".slide");d&&d.classList.add("out-l");const l=document.createElement("div");l.className="slide in-r",l.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Admin panel-এ ফিরে যাচ্ছেন…</div>
    </div>`,s.appendChild(l),requestAnimationFrame(()=>requestAnimationFrame(()=>l.classList.remove("in-r"))),setTimeout(()=>d?.remove(),260),setTimeout(()=>window.location.href="admin.html",2800)}catch(i){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",X("জমা হয়নি: "+i.message,"error")}}document.getElementById("btn-next").addEventListener("click",q);document.getElementById("btn-skip").addEventListener("click",()=>{y(),t.step<h-1?(t.step++,m("next")):_()});document.getElementById("hdr-back").addEventListener("click",C);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function Y(){try{const{data:e}=await x.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let F=0,L=0;document.getElementById("wrap").addEventListener("touchstart",e=>{F=e.touches[0].clientX,L=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-F,i=Math.abs(e.changedTouches[0].clientY-L);Math.abs(n)>60&&i<80&&(n<0?q():C())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await T(x);if(!e){window.location.href="admin.html";return}t.userEmail=e.user.email,t.d["log-date"]=w(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Y(),document.getElementById("wrap").innerHTML="",m("next")})();

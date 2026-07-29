import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as L}from"./index-B-jIxwbw.js";import{r as M}from"./admin-auth-4ZiUUGs_.js";import{l as y}from"./date-utils-BQiP-iFW.js";const g=L("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{spawnBought:!1,newBatch:!1,b2b:!1,samples:!1,fnf:!1},userEmail:""},x=[{id:"rooms",icon:"📅",title:"তারিখ ও রুম",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],f=x.length,h=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),l=e=>parseFloat(t.d[e])||0,E=e=>t.d[e]??"0",a=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},p=e=>t.d[e]||null;function d(e,n,s,i=.1,o=""){const c=E(e),r=i<1?2:0,v=i<1?"decimal":"numeric",u=o?`oninput="S.d['${e}']=this.value;lc('${o}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${i},${r})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${c}" step="${i}" min="0" inputmode="${v}" ${u}/>
      <button type="button" class="cb" onclick="adj('${e}',${i},${r})">+</button>
    </div>
    <div class="card-unit">${s}</div>
    ${o?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,s){const i=document.getElementById("f-"+e);if(!i)return;const o=Math.max(0,parseFloat(i.value||0)+n);i.value=o.toFixed(s),t.d[e]=i.value,i.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&S(),e==="sale"&&I(),e==="exp"&&C(),e==="proc"&&q(),e==="spn"&&k()};function S(){const e=l("h-fresh-a")+l("h-fresh-rej"),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function I(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([i,o])=>{const c=l(i)*l(o);n+=c;const r=document.getElementById("tag-"+i);r&&(r.textContent=c>0?"= "+h(c):"")});const s=document.getElementById("sale-tot");s&&(s.textContent=h(n))}function C(){const n=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((i,o)=>i+l(o),0),s=document.getElementById("exp-tot");s&&(s.textContent=h(n))}function q(){const e=l("pr-fresh-in"),n=l("pr-dried-out"),s=l("pr-dried-in"),i=l("pr-powder-out"),o=document.getElementById("dry-yld"),c=document.getElementById("pow-yld");o&&(o.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),c&&(c.textContent=s>0?"পাউডার ইল্ড: "+(i/s*100).toFixed(1)+"%":"")}function k(){const e=l("sp-bought-kg")*l("sp-price-per-kg"),n=document.getElementById("spn-cost"),s=document.getElementById("spn-cost-row");n&&(n.textContent=h(e)),s&&(s.style.display=e>0?"flex":"none")}function A(){return`<div class="cards">
    <div class="sec-lbl">তাজা মাশরুম (kg)</div>
    <div class="cg3">
      ${d("h-fresh-a","Grade A","kg",.1,"h")}
      ${d("h-fresh-rej","বাতিল","kg",.1,"h")}
    </div>
    <div class="tot"><span class="tot-lbl">মোট তাজা</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
    <div class="divider"></div>
    <div class="sec-lbl">হার্ভেস্ট উৎস</div>
    <div class="cg2">
      ${d("h-healthy-kg","সুস্থ ব্যাগ থেকে","kg",.01)}
      ${d("h-recovered-kg","মোল্ড থেকে উদ্ধারকৃত","kg",.01)}
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">Batch তথ্য</div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-h-primary-batch" onchange="onHarvestBatchChange(this)">
          <option value="">—</option>
          ${B.map(e=>`<option value="${e.batch_number}"${t.d["h-primary-batch"]===e.batch_number?" selected":""}>${e.batch_number} (Room ${e.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-h-flush-num" onchange="S.d['h-flush-num']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(e=>`<option value="${e}"${t.d["h-flush-num"]==e?" selected":""}>${e}ম Flush</option>`).join("")}
        </select>
      </div>
      ${d("h-bags-removed","চক্রের শেষে সরানো ব্যাগ","টি",1)}
    </div>
  </div>`}function H(){return`<div class="cards">
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
        ${d("qc-contam-bags","ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
      </div>
      <div class="card" style="max-width:460px;width:100%">
        <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
        <input class="ci-txt" type="text" id="f-qc-contam-action" value="${t.d["qc-contam-action"]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-contam-action']=this.value"/>
      </div>
  </div>`}function R(){return`<div class="cards">
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি Spawn কেনা হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-spawn" ${t.tog.spawnBought?"checked":""} onchange="togC('spawnBought',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.spawnBought?" show":""}" id="cond-spawn">
      <div class="cg3" style="width:100%;max-width:460px">
        ${d("sp-bought-kg","পরিমাণ","kg",.1,"spn")}
        ${d("sp-price-per-kg","দাম/kg","৳",50,"spn")}
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
      ${d("sp-used-kg","Spawn ব্যবহার","kg",.1)}
      ${d("sp-substrate-kg","Substrate","kg",.1)}
    </div>
    <div class="cg3">
      ${d("sp-bags-inoculated","Inoculated ব্যাগ","টি",1)}
      ${d("sp-bags-discarded","বাদ দেওয়া ব্যাগ","টি",1)}
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
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">নতুন Batch শুরু করবেন?</span>
      <label class="tog"><input type="checkbox" id="tog-newbatch" ${t.tog.newBatch?"checked":""} onchange="togC('newBatch',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.newBatch?" show":""}" id="cond-newbatch">
      <div class="cg2" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">রুম</div>
          <select class="sel-inline" id="f-nb-room" onchange="onNewBatchRoomChange(this)">
            <option value="">—</option>
            <option value="A"${t.d["nb-room"]==="A"?" selected":""}>Room A</option>
            <option value="B"${t.d["nb-room"]==="B"?" selected":""}>Room B</option>
            <option value="C"${t.d["nb-room"]==="C"?" selected":""}>Room C</option>
          </select>
        </div>
        <div class="card">
          <div class="card-lbl">Batch নম্বর (auto)</div>
          <div class="ci-txt" id="nb-batch-preview" style="display:flex;align-items:center;color:rgba(245,239,230,.5)">${t.d["nb-batch-number"]||"—"}</div>
        </div>
      </div>
    </div>
  </div>`}function z(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${d("pr-fresh-in","Dryer-এ দেওয়া","kg",.1,"proc")}
      ${d("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${d("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${d("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function P(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([s,i,o,c])=>`
    <div class="sec-lbl">${o}</div>
    <div class="cg2">
      ${d(s,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${i}',-${c},0)">−</button>
          <input type="number" id="f-${i}" class="ci sm" value="${E(i)}" step="${c}" min="0" inputmode="numeric" oninput="S.d['${i}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${i}',${c},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${s}"></div>
      </div>
    </div>`).join("")}
    <div class="tot"><span class="tot-lbl">মোট বিক্রয়</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg2">
      ${d("s-waste","নষ্ট/ফেরত","kg",.1)}
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি B2B Order ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">B2B Client</div>
          <select class="sel-inline" id="f-s-b2b-buyer-select" onchange="onB2BBuyerChange(this)">
            <option value="">—</option>
            ${w.map(s=>`<option value="${s.business_name}"${t.d["s-b2b-name"]===s.business_name?" selected":""}>${s.business_name}${s.contact_name?` (${s.contact_name})`:""}</option>`).join("")}
            <option value="__other__"${t.d["s-b2b-name"]&&!w.some(s=>s.business_name===t.d["s-b2b-name"])?" selected":""}>অন্য কেউ…</option>
          </select>
        </div>
        ${d("s-b2b-qty","পরিমাণ","kg",.1)}
        ${d("s-b2b-value","মূল্য","৳",100)}
      </div>
      <div class="card" id="b2b-other-wrap" style="display:${t.d["s-b2b-name"]&&!w.some(s=>s.business_name===t.d["s-b2b-name"])?"":"none"};max-width:460px;width:100%;margin-top:10px">
        <div class="card-lbl">নাম লিখুন</div>
        <input class="ci-txt" type="text" id="f-s-b2b-name-other" value="${t.d["s-b2b-name-other"]||""}" placeholder="ব্যবসার নাম" oninput="S.d['s-b2b-name-other']=this.value; S.d['s-b2b-name']=this.value;"/>
      </div>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বন্ধু/পরিবারকে বিক্রি হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-fnf" ${t.tog.fnf?"checked":""} onchange="togC('fnf',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.fnf?" show":""}" id="cond-fnf">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">কার কাছে</div>
          <input class="ci-txt" type="text" id="f-fnf-name" value="${t.d["fnf-name"]||""}" placeholder="নাম" oninput="S.d['fnf-name']=this.value"/>
        </div>
        ${d("fnf-qty","পরিমাণ","kg",.1)}
        ${d("fnf-value","মূল্য","৳",50)}
      </div>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বিনামূল্যে নমুনা দেওয়া হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-samples" ${t.tog.samples?"checked":""} onchange="togC('samples',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.samples?" show":""}" id="cond-samples">
      <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
      <div class="cg3" style="width:100%;max-width:460px">
        ${d("sample-fresh-kg","তাজা","kg",.01)}
        ${d("sample-dried-kg","শুকনো","kg",.01)}
        ${d("sample-powder-kg","পাউডার","kg",.01)}
      </div>
      <div class="card" style="max-width:460px;width:100%">
        <div class="card-lbl">কাকে/কেন দেওয়া হয়েছে</div>
        <input class="ci-txt" type="text" id="f-sample-notes" value="${t.d["sample-notes"]||""}" placeholder="যেমন: রেস্টুরেন্ট ট্রায়াল, বন্ধু-পরিবার" oninput="S.d['sample-notes']=this.value"/>
      </div>
    </div>
  </div>`}function D(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${d("st-fresh","তাজা","kg",.1)}
      ${d("st-dried","শুকনো","kg",.1)}
      ${d("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function J(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],n=[];for(let s=0;s<e.length;s+=2)n.push(`<div class="cg2">
      ${d(e[s][0],e[s][1],"৳",100,"exp")}
      ${s+1<e.length?d(e[s+1][0],e[s+1][1],"৳",100,"exp"):"<div></div>"}
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
      ${d("ex-online-packaging","অনলাইন প্যাকেজিং","৳",50)}
      ${d("ex-online-delivery","অনলাইন ডেলিভারি","৳",50)}
    </div>
    <div class="cg2">
      ${d("ex-offline-packaging","অফলাইন প্যাকেজিং","৳",50)}
      ${d("ex-offline-delivery","অফলাইন ডেলিভারি","৳",50)}
    </div>
  </div>`}function Y(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const O={harvest:A,qc:H,spawn:R,processing:z,sales:P,stock:D,expenses:J,notes:Y};function X(e){if(e.type==="rooms"){const n=t.d["log-date"]||y(),s=["A","B","C"].map(i=>`
      <div class="rc${t.rooms.includes(i)?" sel":""}" id="rc-${i}" onclick="togRoom('${i}')">
        <div class="rc-letter">${i}</div>
        <div class="rc-name">রুম ${i}</div>
      </div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub">আজকে কোন রুম থেকে Harvest হয়েছে?</div>
      <div class="rooms">${s}</div>
      <div style="font-size:11px;color:rgba(245,239,230,.22)">একাধিক রুম select করা যাবে</div>`}if(e.type==="summary"){const n=l("h-fresh-a")+l("h-fresh-rej"),s=l("s-fresh-kg")*l("s-fresh-price")+l("s-dried-kg")*l("s-dried-price")+l("s-powder-kg")*l("s-powder-price"),i=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((v,u)=>v+l(u),0),o=s-i,c=l("st-fresh")+l("st-dried")+l("st-powder"),r=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",s>0?h(s):"—","g"],["মোট খরচ",i>0?h(i):"—","r"],["ক্লোজিং স্টক",c>0?c.toFixed(2)+" kg":"—",""]].map(([v,u,m])=>`<div class="sum-row"><span class="sum-k">${v}</span><span class="sum-v${m?" "+m:""}">${u}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${r}
        <div class="net-box ${o>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${h(o)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(O[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function b(e="next"){const n=x[t.step],s=document.getElementById("wrap"),i=t.step===f-1,o=n.type==="yn"&&t.phase[n.id]==="form",c=n.type==="yn"&&!o;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+f,document.getElementById("prog-bar").style.width=(t.step+1)/f*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const r=document.getElementById("btn-next");r.textContent=i?"Submit করুন ✓":"পরবর্তী →",r.className="btn-next"+(i?" sub":""),r.disabled=!1,document.getElementById("btn-skip").style.display=c||n.type==="summary"?"none":"";const v=document.createElement("div"),u=s.querySelector(".slide");v.className=u?"slide "+(e==="back"?"in-l":"in-r"):"slide",v.innerHTML=X(n),s.appendChild(v),u&&(u.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>u.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>v.classList.remove("in-r","in-l"))),n.id==="harvest"&&o&&S(),n.id==="sales"&&o&&I(),n.id==="expenses"&&o&&C(),n.id==="processing"&&o&&q(),n.id==="spawn"&&o&&t.tog.spawnBought&&k(),setTimeout(()=>{const m=v.querySelector('input[type="number"],input[type="text"],textarea');m&&m.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[x[t.step].id]="form",b("next")};window.ansNo=function(){t.step<f-1?(t.step++,b("next")):$()};function N(){_(),t.step<f-1?(t.step++,b("next")):$()}function T(){_();const e=x[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],b("back");return}t.step>0&&(t.step--,b("back"))}function _(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(s=>{const i=s.id.slice(2);s.tagName==="SELECT"?s.value&&(t.d[i]=s.value):s.type==="checkbox"||(t.d[i]=s.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({spawnBought:"tog-spawn",newBatch:"tog-newbatch",b2b:"tog-b2b",samples:"tog-samples",fnf:"tog-fnf"}).forEach(([s,i])=>{const o=document.getElementById(i);o&&(t.tog[s]=o.checked)})}window.togRoom=function(e){const n=t.rooms.indexOf(e);n>-1?t.rooms.splice(n,1):t.rooms.push(e);const s=document.getElementById("rc-"+e);s&&s.classList.toggle("sel",t.rooms.includes(e))};window.togC=function(e,n){t.tog[e]=n.checked;const s={spawnBought:"cond-spawn",newBatch:"cond-newbatch",b2b:"cond-b2b",samples:"cond-samples",fnf:"cond-fnf"},i=document.getElementById(s[e]);i&&i.classList.toggle("show",n.checked),e==="spawnBought"&&k()};window.onNewBatchRoomChange=async function(e){const n=e.value,s=document.getElementById("nb-batch-preview");if(!n){s.textContent="—",t.d["nb-room"]="",t.d["nb-batch-number"]="";return}s.textContent="হিসাব করা হচ্ছে…";const i=(t.d["log-date"]||y()).replace(/-/g,"").slice(2),o=`${n}-${i}-`,{data:c}=await g.from("batches").select("batch_number").like("batch_number",o+"%"),r=(c||[]).map(m=>parseInt(m.batch_number.slice(o.length),10)).filter(m=>!isNaN(m)),v=(r.length?Math.max(...r):0)+1,u=o+String(v).padStart(2,"0");s.textContent=u,t.d["nb-room"]=n,t.d["nb-batch-number"]=u};window.onHarvestBatchChange=function(e){t.d["h-primary-batch"]=e.value;const n=B.find(s=>s.batch_number===e.value);n&&!t.rooms.includes(n.room)&&t.rooms.push(n.room)};window.onB2BBuyerChange=function(e){const n=document.getElementById("b2b-other-wrap");e.value==="__other__"?(n.style.display="",t.d["s-b2b-name"]=t.d["s-b2b-name-other"]||""):(n.style.display="none",t.d["s-b2b-name"]=e.value)};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function G(e,n="info"){const s=document.getElementById("toast-stack"),i=document.createElement("div");i.className=`toast ${n}`,i.textContent=e,s.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},3e3)}async function $(){_();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n={log_date:t.d["log-date"]||y(),submitted_by:t.userEmail||null,harvest_fresh_a:a("h-fresh-a"),harvest_fresh_rej:a("h-fresh-rej"),harvest_healthy_kg:a("h-healthy-kg"),harvest_recovered_kg:a("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,harvest_primary_batch:p("h-primary-batch"),harvest_flush_num:a("h-flush-num"),harvest_bags_removed:a("h-bags-removed"),contam_event:t.phase.qc==="form",contam_room:p("qc-contam-room"),contam_type:p("qc-contam-type"),contam_bags:a("qc-contam-bags"),contam_action:p("qc-contam-action"),spawn_bought_kg:a("sp-bought-kg"),spawn_price_per_kg:a("sp-price-per-kg"),spawn_supplier:p("sp-supplier"),spawn_used_kg:a("sp-used-kg"),substrate_kg:a("sp-substrate-kg"),substrate_type:p("sp-substrate-type"),bags_inoculated:a("sp-bags-inoculated"),bags_discarded:a("sp-bags-discarded"),pr_fresh_in:a("pr-fresh-in"),pr_dried_out:a("pr-dried-out"),pr_dried_in:a("pr-dried-in"),pr_powder_out:a("pr-powder-out"),pr_notes:p("pr-notes"),s_fresh_kg:a("s-fresh-kg"),s_fresh_price:a("s-fresh-price"),s_dried_kg:a("s-dried-kg"),s_dried_price:a("s-dried-price"),s_powder_kg:a("s-powder-kg"),s_powder_price:a("s-powder-price"),s_waste:a("s-waste"),s_b2b_name:p("s-b2b-name"),s_b2b_qty:a("s-b2b-qty"),s_b2b_value:a("s-b2b-value"),fnf_name:p("fnf-name"),fnf_qty:a("fnf-qty"),fnf_value:a("fnf-value"),sample_fresh_kg:a("sample-fresh-kg"),sample_dried_kg:a("sample-dried-kg"),sample_powder_kg:a("sample-powder-kg"),sample_notes:p("sample-notes"),st_fresh:a("st-fresh"),st_dried:a("st-dried"),st_powder:a("st-powder"),ex_spawn:a("ex-spawn"),ex_substrate:a("ex-substrate"),ex_packaging:a("ex-packaging"),ex_labor:a("ex-labor"),ex_electricity:a("ex-electricity"),ex_transport:a("ex-transport"),ex_water:a("ex-water"),ex_other:a("ex-other"),ex_notes:p("ex-notes"),online_packaging_cost:a("ex-online-packaging"),online_delivery_cost:a("ex-online-delivery"),offline_packaging_cost:a("ex-offline-packaging"),offline_delivery_cost:a("ex-offline-delivery"),n_observations:p("n-observations"),n_tomorrow:p("n-tomorrow"),n_unusual:p("n-unusual")};try{if(t.d["nb-batch-number"]){const{error:r}=await g.from("batches").insert({batch_number:t.d["nb-batch-number"],room:t.d["nb-room"],spawn_date:t.d["log-date"]||y(),substrate_type:t.d["sp-substrate-type"]||null});if(r)throw r}const{error:s}=await g.from("farm_daily_logs").upsert(n,{onConflict:"log_date"});if(s)throw s;document.getElementById("ftr").style.display="none";const i=document.getElementById("wrap"),o=i.querySelector(".slide");o&&o.classList.add("out-l");const c=document.createElement("div");c.className="slide in-r",c.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,i.appendChild(c),requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.remove("in-r"))),setTimeout(()=>o?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(s){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",G("জমা হয়নি: "+s.message,"error")}}document.getElementById("btn-next").addEventListener("click",N);document.getElementById("btn-skip").addEventListener("click",()=>{_(),t.step<f-1?(t.step++,b("next")):$()});document.getElementById("hdr-back").addEventListener("click",T);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function V(){try{const{data:e}=await g.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let w=[];async function Z(){try{const{data:e}=await g.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");w=e||[]}catch{}}let B=[];async function U(){try{const{data:e}=await g.from("batches").select("batch_number,room").eq("status","active").order("batch_number");B=e||[]}catch{}}let j=0,F=0;document.getElementById("wrap").addEventListener("touchstart",e=>{j=e.touches[0].clientX,F=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-j,s=Math.abs(e.changedTouches[0].clientY-F);Math.abs(n)>60&&s<80&&(n<0?N():T())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await M(g);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=y(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([V(),Z(),U()]),document.getElementById("wrap").innerHTML="",b("next")})();

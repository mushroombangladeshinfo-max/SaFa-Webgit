import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as H}from"./index-B-jIxwbw.js";import{r as A}from"./admin-auth-4ZiUUGs_.js";import{l as w}from"./date-utils-BQiP-iFW.js";const h=H("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{spawnBought:!1,newBatch:!1,b2b:!1,samples:!1,fnf:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1},k=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],f=k.length,g=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),l=e=>parseFloat(t.d[e])||0,C=e=>t.d[e]??"0",o=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},m=e=>t.d[e]||null;function d(e,n,s,a=.1,i=""){const c=C(e),u=a<1?2:0,r=a<1?"decimal":"numeric",p=i?`oninput="S.d['${e}']=this.value;lc('${i}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${a},${u})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${c}" step="${a}" min="0" inputmode="${r}" ${p}/>
      <button type="button" class="cb" onclick="adj('${e}',${a},${u})">+</button>
    </div>
    <div class="card-unit">${s}</div>
    ${i?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,s){const a=document.getElementById("f-"+e);if(!a)return;const i=Math.max(0,parseFloat(a.value||0)+n);a.value=i.toFixed(s),t.d[e]=a.value,a.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&$(),e==="sale"&&q(),e==="exp"&&N(),e==="proc"&&j(),e==="spn"&&B()};function $(){const e=t.harvestEntryIds.reduce((s,a)=>s+l("h-fresh-a-"+a)+l("h-fresh-rej-"+a),0),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function q(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([a,i])=>{const c=l(a)*l(i);n+=c;const u=document.getElementById("tag-"+a);u&&(u.textContent=c>0?"= "+g(c):"")});const s=document.getElementById("sale-tot");s&&(s.textContent=g(n))}function N(){const n=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((a,i)=>a+l(i),0),s=document.getElementById("exp-tot");s&&(s.textContent=g(n))}function j(){const e=l("pr-fresh-in"),n=l("pr-dried-out"),s=l("pr-dried-in"),a=l("pr-powder-out"),i=document.getElementById("dry-yld"),c=document.getElementById("pow-yld");i&&(i.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),c&&(c.textContent=s>0?"পাউডার ইল্ড: "+(a/s*100).toFixed(1)+"%":"")}function B(){const e=l("sp-bought-kg")*l("sp-price-per-kg"),n=document.getElementById("spn-cost"),s=document.getElementById("spn-cost-row");n&&(n.textContent=g(e)),s&&(s.style.display=e>0?"flex":"none")}function R(e){const n="h-batch-"+e,s="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${E.map(a=>`<option value="${a.batch_number}"${t.d[n]===a.batch_number?" selected":""}>${a.batch_number} (Room ${a.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(a=>`<option value="${a}"${t.d[s]==a?" selected":""}>${a}ম Flush</option>`).join("")}
        </select>
      </div>
      ${d("h-bags-removed-"+e,"সরানো ব্যাগ","টি",1)}
    </div>
    <div class="cg2">
      ${d("h-fresh-a-"+e,"Grade A","kg",.1,"h")}
      ${d("h-fresh-rej-"+e,"বাতিল","kg",.1,"h")}
    </div>
    <div class="cg2">
      ${d("h-healthy-kg-"+e,"সুস্থ ব্যাগ থেকে","kg",.01)}
      ${d("h-recovered-kg-"+e,"মোল্ড থেকে উদ্ধারকৃত","kg",.01)}
    </div>
  </div>`}function I(){return t.harvestEntryIds.map(e=>R(e)).join('<div class="he-sep"></div>')}function z(){return`<div class="cards">
    <div id="harvest-entries">${I()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){y(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=I(),$()};window.removeHarvestEntry=function(e){y(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=I(),$(),recomputeRooms()};function D(){return`<div class="cards">
      <div class="cg3" style="width:100%;max-width:460px">
        <div class="card">
          <div class="card-lbl">কোন রুম?</div>
          <select class="sel-inline" id="f-qc-contam-room" onchange="S.d['qc-contam-room']=this.value; recomputeRooms();">
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
  </div>`}function P(){return`<div class="cards">
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
  </div>`}function J(){return`<div class="cards">
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
  </div>`}function Y(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([s,a,i,c])=>`
    <div class="sec-lbl">${i}</div>
    <div class="cg2">
      ${d(s,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${a}',-${c},0)">−</button>
          <input type="number" id="f-${a}" class="ci sm" value="${C(a)}" step="${c}" min="0" inputmode="numeric" oninput="S.d['${a}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${a}',${c},0)">+</button>
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
            ${x.map(s=>`<option value="${s.business_name}"${t.d["s-b2b-name"]===s.business_name?" selected":""}>${s.business_name}${s.contact_name?` (${s.contact_name})`:""}</option>`).join("")}
            <option value="__other__"${t.d["s-b2b-name"]&&!x.some(s=>s.business_name===t.d["s-b2b-name"])?" selected":""}>অন্য কেউ…</option>
          </select>
        </div>
        ${d("s-b2b-qty","পরিমাণ","kg",.1)}
        ${d("s-b2b-value","মূল্য","৳",100)}
      </div>
      <div class="card" id="b2b-other-wrap" style="display:${t.d["s-b2b-name"]&&!x.some(s=>s.business_name===t.d["s-b2b-name"])?"":"none"};max-width:460px;width:100%;margin-top:10px">
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
  </div>`}function X(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${d("st-fresh","তাজা","kg",.1)}
      ${d("st-dried","শুকনো","kg",.1)}
      ${d("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function G(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],n=[];for(let s=0;s<e.length;s+=2)n.push(`<div class="cg2">
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
  </div>`}function O(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const V={harvest:z,qc:D,spawn:P,processing:J,sales:Y,stock:X,expenses:G,notes:O};function Z(e){if(e.type==="rooms"){const n=t.d["log-date"]||w();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=t.harvestEntryIds.reduce((r,p)=>r+l("h-fresh-a-"+p)+l("h-fresh-rej-"+p),0),s=l("s-fresh-kg")*l("s-fresh-price")+l("s-dried-kg")*l("s-dried-price")+l("s-powder-kg")*l("s-powder-price"),a=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((r,p)=>r+l(p),0),i=s-a,c=l("st-fresh")+l("st-dried")+l("st-powder"),u=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",s>0?g(s):"—","g"],["মোট খরচ",a>0?g(a):"—","r"],["ক্লোজিং স্টক",c>0?c.toFixed(2)+" kg":"—",""]].map(([r,p,v])=>`<div class="sum-row"><span class="sum-k">${r}</span><span class="sum-v${v?" "+v:""}">${p}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${u}
        <div class="net-box ${i>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${g(i)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(V[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function b(e="next"){const n=k[t.step],s=document.getElementById("wrap"),a=t.step===f-1,i=n.type==="yn"&&t.phase[n.id]==="form",c=n.type==="yn"&&!i;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+f,document.getElementById("prog-bar").style.width=(t.step+1)/f*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const u=document.getElementById("btn-next");u.textContent=a?"Submit করুন ✓":"পরবর্তী →",u.className="btn-next"+(a?" sub":""),u.disabled=!1,document.getElementById("btn-skip").style.display=c||n.type==="summary"?"none":"";const r=document.createElement("div"),p=s.querySelector(".slide");r.className=p?"slide "+(e==="back"?"in-l":"in-r"):"slide",r.innerHTML=Z(n),s.appendChild(r),p&&(p.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>p.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>r.classList.remove("in-r","in-l"))),n.id==="harvest"&&i&&$(),n.id==="sales"&&i&&q(),n.id==="expenses"&&i&&N(),n.id==="processing"&&i&&j(),n.id==="spawn"&&i&&t.tog.spawnBought&&B(),setTimeout(()=>{const v=r.querySelector('input[type="number"],input[type="text"],textarea');v&&v.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[k[t.step].id]="form",b("next")};window.ansNo=function(){t.step<f-1?(t.step++,b("next")):S()};function T(){y(),t.step<f-1?(t.step++,b("next")):S()}function L(){y();const e=k[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],b("back");return}t.step>0&&(t.step--,b("back"))}function y(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(s=>{const a=s.id.slice(2);s.tagName==="SELECT"?s.value&&(t.d[a]=s.value):s.type==="checkbox"||(t.d[a]=s.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({spawnBought:"tog-spawn",newBatch:"tog-newbatch",b2b:"tog-b2b",samples:"tog-samples",fnf:"tog-fnf"}).forEach(([s,a])=>{const i=document.getElementById(a);i&&(t.tog[s]=i.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(s=>{const a=E.find(i=>i.batch_number===t.d["h-batch-"+s]);a&&e.add(a.room)}),t.d["nb-room"]&&e.add(t.d["nb-room"]);const n=t.d["qc-contam-room"];n&&n!=="multiple"&&e.add(n),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const s={spawnBought:"cond-spawn",newBatch:"cond-newbatch",b2b:"cond-b2b",samples:"cond-samples",fnf:"cond-fnf"},a=document.getElementById(s[e]);a&&a.classList.toggle("show",n.checked),e==="spawnBought"&&B()};window.onNewBatchRoomChange=async function(e){const n=e.value,s=document.getElementById("nb-batch-preview");if(!n){s.textContent="—",t.d["nb-room"]="",t.d["nb-batch-number"]="";return}s.textContent="হিসাব করা হচ্ছে…";const a=(t.d["log-date"]||w()).replace(/-/g,"").slice(2),i=`${n}-${a}-`,{data:c}=await h.from("batches").select("batch_number").like("batch_number",i+"%"),u=(c||[]).map(v=>parseInt(v.batch_number.slice(i.length),10)).filter(v=>!isNaN(v)),r=(u.length?Math.max(...u):0)+1,p=i+String(r).padStart(2,"0");s.textContent=p,t.d["nb-room"]=n,t.d["nb-batch-number"]=p,recomputeRooms()};window.onB2BBuyerChange=function(e){const n=document.getElementById("b2b-other-wrap");e.value==="__other__"?(n.style.display="",t.d["s-b2b-name"]=t.d["s-b2b-name-other"]||""):(n.style.display="none",t.d["s-b2b-name"]=e.value)};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function U(e,n="info"){const s=document.getElementById("toast-stack"),a=document.createElement("div");a.className=`toast ${n}`,a.textContent=e,s.appendChild(a),requestAnimationFrame(()=>a.classList.add("show")),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},3e3)}function _(e){return t.harvestEntryIds.reduce((n,s)=>n+l(e+"-"+s),0)}async function S(){y();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||w(),s=t.harvestEntryIds.map(i=>{const c=m("h-batch-"+i),u=E.find(r=>r.batch_number===c);return{log_date:n,batch_number:c||null,room:u?u.room:null,flush_num:o("h-flush-"+i),fresh_a_kg:o("h-fresh-a-"+i),fresh_rej_kg:o("h-fresh-rej-"+i),healthy_kg:o("h-healthy-kg-"+i),recovered_kg:o("h-recovered-kg-"+i),bags_removed:o("h-bags-removed-"+i)}}).filter(i=>i.batch_number||i.fresh_a_kg||i.fresh_rej_kg||i.healthy_kg||i.recovered_kg||i.bags_removed),a={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:_("h-fresh-a"),harvest_fresh_rej:_("h-fresh-rej"),harvest_healthy_kg:_("h-healthy-kg"),harvest_recovered_kg:_("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:t.phase.qc==="form",contam_room:m("qc-contam-room"),contam_type:m("qc-contam-type"),contam_bags:o("qc-contam-bags"),contam_action:m("qc-contam-action"),spawn_bought_kg:o("sp-bought-kg"),spawn_price_per_kg:o("sp-price-per-kg"),spawn_supplier:m("sp-supplier"),spawn_used_kg:o("sp-used-kg"),substrate_kg:o("sp-substrate-kg"),substrate_type:m("sp-substrate-type"),bags_inoculated:o("sp-bags-inoculated"),bags_discarded:o("sp-bags-discarded"),pr_fresh_in:o("pr-fresh-in"),pr_dried_out:o("pr-dried-out"),pr_dried_in:o("pr-dried-in"),pr_powder_out:o("pr-powder-out"),pr_notes:m("pr-notes"),s_fresh_kg:o("s-fresh-kg"),s_fresh_price:o("s-fresh-price"),s_dried_kg:o("s-dried-kg"),s_dried_price:o("s-dried-price"),s_powder_kg:o("s-powder-kg"),s_powder_price:o("s-powder-price"),s_waste:o("s-waste"),s_b2b_name:m("s-b2b-name"),s_b2b_qty:o("s-b2b-qty"),s_b2b_value:o("s-b2b-value"),fnf_name:m("fnf-name"),fnf_qty:o("fnf-qty"),fnf_value:o("fnf-value"),sample_fresh_kg:o("sample-fresh-kg"),sample_dried_kg:o("sample-dried-kg"),sample_powder_kg:o("sample-powder-kg"),sample_notes:m("sample-notes"),st_fresh:o("st-fresh"),st_dried:o("st-dried"),st_powder:o("st-powder"),ex_spawn:o("ex-spawn"),ex_substrate:o("ex-substrate"),ex_packaging:o("ex-packaging"),ex_labor:o("ex-labor"),ex_electricity:o("ex-electricity"),ex_transport:o("ex-transport"),ex_water:o("ex-water"),ex_other:o("ex-other"),ex_notes:m("ex-notes"),online_packaging_cost:o("ex-online-packaging"),online_delivery_cost:o("ex-online-delivery"),offline_packaging_cost:o("ex-offline-packaging"),offline_delivery_cost:o("ex-offline-delivery"),n_observations:m("n-observations"),n_tomorrow:m("n-tomorrow"),n_unusual:m("n-unusual")};try{if(t.d["nb-batch-number"]){const{error:v}=await h.from("batches").insert({batch_number:t.d["nb-batch-number"],room:t.d["nb-room"],spawn_date:t.d["log-date"]||w(),substrate_type:t.d["sp-substrate-type"]||null});if(v)throw v}const{error:i}=await h.from("farm_daily_logs").upsert(a,{onConflict:"log_date"});if(i)throw i;const{error:c}=await h.from("harvest_entries").delete().eq("log_date",n);if(c)throw c;if(s.length){const{error:v}=await h.from("harvest_entries").insert(s);if(v)throw v}document.getElementById("ftr").style.display="none";const u=document.getElementById("wrap"),r=u.querySelector(".slide");r&&r.classList.add("out-l");const p=document.createElement("div");p.className="slide in-r",p.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,u.appendChild(p),requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.remove("in-r"))),setTimeout(()=>r?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(i){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",U("জমা হয়নি: "+i.message,"error")}}document.getElementById("btn-next").addEventListener("click",T);document.getElementById("btn-skip").addEventListener("click",()=>{y(),t.step<f-1?(t.step++,b("next")):S()});document.getElementById("hdr-back").addEventListener("click",L);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function Q(){try{const{data:e}=await h.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let x=[];async function W(){try{const{data:e}=await h.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");x=e||[]}catch{}}let E=[];async function K(){try{const{data:e}=await h.from("batches").select("batch_number,room").eq("status","active").order("batch_number");E=e||[]}catch{}}let F=0,M=0;document.getElementById("wrap").addEventListener("touchstart",e=>{F=e.touches[0].clientX,M=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-F,s=Math.abs(e.changedTouches[0].clientY-M);Math.abs(n)>60&&s<80&&(n<0?T():L())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await A(h);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=w(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([Q(),W(),K()]),document.getElementById("wrap").innerHTML="",b("next")})();

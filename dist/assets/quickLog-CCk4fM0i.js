import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as z}from"./index-B-jIxwbw.js";import{r as D}from"./admin-auth-4ZiUUGs_.js";import{l as _}from"./date-utils-D3sh9T8I.js";const h=z("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{spawnBought:!1,newBatch:!1,b2b:!1,samples:!1,fnf:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1},E=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],w=E.length,f=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),r=e=>parseFloat(t.d[e])||0,T=e=>t.d[e]??"0",o=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},v=e=>t.d[e]||null;function d(e,n,s,i=.1,c=""){const a=T(e),l=i<1?2:0,p=i<1?"decimal":"numeric",u=c?`oninput="S.d['${e}']=this.value;lc('${c}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${i},${l})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${a}" step="${i}" min="0" inputmode="${p}" ${u}/>
      <button type="button" class="cb" onclick="adj('${e}',${i},${l})">+</button>
    </div>
    <div class="card-unit">${s}</div>
    ${c?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,s){const i=document.getElementById("f-"+e);if(!i)return;const c=Math.max(0,parseFloat(i.value||0)+n);i.value=c.toFixed(s),t.d[e]=i.value,i.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&B(),e==="sale"&&j(),e==="exp"&&L(),e==="proc"&&M(),e==="spn"&&S()};function B(){const e=t.harvestEntryIds.reduce((s,i)=>s+r("h-fresh-a-"+i)+r("h-fresh-rej-"+i),0),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function j(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([i,c])=>{const a=r(i)*r(c);n+=a;const l=document.getElementById("tag-"+i);l&&(l.textContent=a>0?"= "+f(a):"")});const s=document.getElementById("sale-tot");s&&(s.textContent=f(n))}function L(){const n=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((i,c)=>i+r(c),0),s=document.getElementById("exp-tot");s&&(s.textContent=f(n))}function M(){const e=r("pr-fresh-in"),n=r("pr-dried-out"),s=r("pr-dried-in"),i=r("pr-powder-out"),c=document.getElementById("dry-yld"),a=document.getElementById("pow-yld");c&&(c.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),a&&(a.textContent=s>0?"পাউডার ইল্ড: "+(i/s*100).toFixed(1)+"%":"")}function S(){const e=r("sp-bought-kg")*r("sp-price-per-kg"),n=document.getElementById("spn-cost"),s=document.getElementById("spn-cost-row");n&&(n.textContent=f(e)),s&&(s.style.display=e>0?"flex":"none")}function P(e){const n="h-batch-"+e,s="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${I.map(i=>`<option value="${i.batch_number}"${t.d[n]===i.batch_number?" selected":""}>${i.batch_number} (Room ${i.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(i=>`<option value="${i}"${t.d[s]==i?" selected":""}>${i}ম Flush</option>`).join("")}
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
  </div>`}function q(){return t.harvestEntryIds.map(e=>P(e)).join('<div class="he-sep"></div>')}function Q(){return`<div class="cards">
    <div id="harvest-entries">${q()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){b(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=q(),B()};window.removeHarvestEntry=function(e){b(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=q(),B(),recomputeRooms()};function J(e){const n="qc-room-"+e,s="qc-type-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">কন্টামিনেশন এন্ট্রি ${e+1}</span>
      ${t.qcEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeQcEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">কোন রুম?</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          <option${t.d[n]==="A"?" selected":""}>A</option>
          <option${t.d[n]==="B"?" selected":""}>B</option>
          <option${t.d[n]==="C"?" selected":""}>C</option>
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">ধরন</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value">
          <option value="">—</option>
          <option value="bacterial"${t.d[s]==="bacterial"?" selected":""}>Bacterial</option>
          <option value="mould"${t.d[s]==="mould"?" selected":""}>Mould</option>
          <option value="trichoderma"${t.d[s]==="trichoderma"?" selected":""}>Trichoderma</option>
          <option value="unknown"${t.d[s]==="unknown"?" selected":""}>অজানা</option>
        </select>
      </div>
      ${d("qc-bags-"+e,"ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function C(){return t.qcEntryIds.map(e=>J(e)).join('<div class="he-sep"></div>')}function Y(){return`<div class="cards">
    <div id="qc-entries">${C()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){b(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=C()};window.removeQcEntry=function(e){b(),t.qcEntryIds=t.qcEntryIds.filter(n=>n!==e),document.getElementById("qc-entries").innerHTML=C(),recomputeRooms()};function X(){return`<div class="cards">
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
      <div class="cg2" style="width:100%;max-width:460px;margin-top:10px">
        ${d("nb-substrate-kg","Substrate ওজন (শুকনো)","kg",.5)}
        ${d("nb-bags-count","ব্যাগ সংখ্যা","টি",1)}
      </div>
      <div style="font-size:11px;color:rgba(245,239,230,.3);width:100%;max-width:460px;margin-top:2px">এই তথ্য দিলে পরে এই Batch-এর Efficiency (BE%) ও প্রতি ব্যাগ ফলন হিসাব করা যাবে — না দিলেও Batch তৈরি হবে, শুধু হিসাবগুলো দেখানো যাবে না</div>
    </div>
  </div>`}function G(){return`<div class="cards">
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
  </div>`}function O(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([s,i,c,a])=>`
    <div class="sec-lbl">${c}</div>
    <div class="cg2">
      ${d(s,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${i}',-${a},0)">−</button>
          <input type="number" id="f-${i}" class="ci sm" value="${T(i)}" step="${a}" min="0" inputmode="numeric" oninput="S.d['${i}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${i}',${a},0)">+</button>
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
            ${$.map(s=>`<option value="${s.business_name}"${t.d["s-b2b-name"]===s.business_name?" selected":""}>${s.business_name}${s.contact_name?` (${s.contact_name})`:""}</option>`).join("")}
            <option value="__other__"${t.d["s-b2b-name"]&&!$.some(s=>s.business_name===t.d["s-b2b-name"])?" selected":""}>অন্য কেউ…</option>
          </select>
        </div>
        ${d("s-b2b-qty","পরিমাণ","kg",.1)}
        ${d("s-b2b-value","মূল্য","৳",100)}
      </div>
      <div class="card" id="b2b-other-wrap" style="display:${t.d["s-b2b-name"]&&!$.some(s=>s.business_name===t.d["s-b2b-name"])?"":"none"};max-width:460px;width:100%;margin-top:10px">
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
  </div>`}function V(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${d("st-fresh","তাজা","kg",.1)}
      ${d("st-dried","শুকনো","kg",.1)}
      ${d("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function Z(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],n=[];for(let s=0;s<e.length;s+=2)n.push(`<div class="cg2">
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
  </div>`}function U(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const W={harvest:Q,qc:Y,spawn:X,processing:G,sales:O,stock:V,expenses:Z,notes:U};function K(e){if(e.type==="rooms"){const n=t.d["log-date"]||_();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=t.harvestEntryIds.reduce((p,u)=>p+r("h-fresh-a-"+u)+r("h-fresh-rej-"+u),0),s=r("s-fresh-kg")*r("s-fresh-price")+r("s-dried-kg")*r("s-dried-price")+r("s-powder-kg")*r("s-powder-price"),i=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((p,u)=>p+r(u),0),c=s-i,a=r("st-fresh")+r("st-dried")+r("st-powder"),l=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",s>0?f(s):"—","g"],["মোট খরচ",i>0?f(i):"—","r"],["ক্লোজিং স্টক",a>0?a.toFixed(2)+" kg":"—",""]].map(([p,u,m])=>`<div class="sum-row"><span class="sum-k">${p}</span><span class="sum-v${m?" "+m:""}">${u}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${l}
        <div class="net-box ${c>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${f(c)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(W[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function y(e="next"){const n=E[t.step],s=document.getElementById("wrap"),i=t.step===w-1,c=n.type==="yn"&&t.phase[n.id]==="form",a=n.type==="yn"&&!c;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+w,document.getElementById("prog-bar").style.width=(t.step+1)/w*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const l=document.getElementById("btn-next");l.textContent=i?"Submit করুন ✓":"পরবর্তী →",l.className="btn-next"+(i?" sub":""),l.disabled=!1,document.getElementById("btn-skip").style.display=a||n.type==="summary"?"none":"";const p=document.createElement("div"),u=s.querySelector(".slide");p.className=u?"slide "+(e==="back"?"in-l":"in-r"):"slide",p.innerHTML=K(n),s.appendChild(p),u&&(u.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>u.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.remove("in-r","in-l"))),n.id==="harvest"&&c&&B(),n.id==="sales"&&c&&j(),n.id==="expenses"&&c&&L(),n.id==="processing"&&c&&M(),n.id==="spawn"&&c&&t.tog.spawnBought&&S(),setTimeout(()=>{const m=p.querySelector('input[type="number"],input[type="text"],textarea');m&&m.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[E[t.step].id]="form",y("next")};window.ansNo=function(){t.step<w-1?(t.step++,y("next")):N()};function F(){b(),t.step<w-1?(t.step++,y("next")):N()}function H(){b();const e=E[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],y("back");return}t.step>0&&(t.step--,y("back"))}function b(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(s=>{const i=s.id.slice(2);s.tagName==="SELECT"?s.value&&(t.d[i]=s.value):s.type==="checkbox"||(t.d[i]=s.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({spawnBought:"tog-spawn",newBatch:"tog-newbatch",b2b:"tog-b2b",samples:"tog-samples",fnf:"tog-fnf"}).forEach(([s,i])=>{const c=document.getElementById(i);c&&(t.tog[s]=c.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(n=>{const s=I.find(i=>i.batch_number===t.d["h-batch-"+n]);s&&e.add(s.room)}),t.d["nb-room"]&&e.add(t.d["nb-room"]),t.qcEntryIds.forEach(n=>{const s=t.d["qc-room-"+n];s&&e.add(s)}),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const s={spawnBought:"cond-spawn",newBatch:"cond-newbatch",b2b:"cond-b2b",samples:"cond-samples",fnf:"cond-fnf"},i=document.getElementById(s[e]);i&&i.classList.toggle("show",n.checked),e==="spawnBought"&&S()};window.onNewBatchRoomChange=async function(e){const n=e.value,s=document.getElementById("nb-batch-preview");if(!n){s.textContent="—",t.d["nb-room"]="",t.d["nb-batch-number"]="";return}s.textContent="হিসাব করা হচ্ছে…";const i=(t.d["log-date"]||_()).replace(/-/g,"").slice(2),c=`${n}-${i}-`,{data:a}=await h.from("batches").select("batch_number").like("batch_number",c+"%"),l=(a||[]).map(m=>parseInt(m.batch_number.slice(c.length),10)).filter(m=>!isNaN(m)),p=(l.length?Math.max(...l):0)+1,u=c+String(p).padStart(2,"0");s.textContent=u,t.d["nb-room"]=n,t.d["nb-batch-number"]=u,recomputeRooms()};window.onB2BBuyerChange=function(e){const n=document.getElementById("b2b-other-wrap");e.value==="__other__"?(n.style.display="",t.d["s-b2b-name"]=t.d["s-b2b-name-other"]||""):(n.style.display="none",t.d["s-b2b-name"]=e.value)};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function ee(e,n="info"){const s=document.getElementById("toast-stack"),i=document.createElement("div");i.className=`toast ${n}`,i.textContent=e,s.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},3e3)}function x(e){return t.harvestEntryIds.reduce((n,s)=>n+r(e+"-"+s),0)}async function N(){b();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||_(),s=t.harvestEntryIds.map(a=>{const l=v("h-batch-"+a),p=I.find(u=>u.batch_number===l);return{log_date:n,batch_number:l||null,room:p?p.room:null,flush_num:o("h-flush-"+a),fresh_a_kg:o("h-fresh-a-"+a),fresh_rej_kg:o("h-fresh-rej-"+a),healthy_kg:o("h-healthy-kg-"+a),recovered_kg:o("h-recovered-kg-"+a),bags_removed:o("h-bags-removed-"+a)}}).filter(a=>a.batch_number||a.fresh_a_kg||a.fresh_rej_kg||a.healthy_kg||a.recovered_kg||a.bags_removed),i=t.qcEntryIds.map(a=>({log_date:n,room:v("qc-room-"+a),contam_type:v("qc-type-"+a),bags:o("qc-bags-"+a),action:v("qc-action-"+a)})).filter(a=>a.room||a.contam_type||a.bags||a.action),c={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:x("h-fresh-a"),harvest_fresh_rej:x("h-fresh-rej"),harvest_healthy_kg:x("h-healthy-kg"),harvest_recovered_kg:x("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:i.length>0,contam_bags:t.qcEntryIds.reduce((a,l)=>a+r("qc-bags-"+l),0),spawn_bought_kg:o("sp-bought-kg"),spawn_price_per_kg:o("sp-price-per-kg"),spawn_supplier:v("sp-supplier"),spawn_used_kg:o("sp-used-kg"),substrate_kg:o("sp-substrate-kg"),substrate_type:v("sp-substrate-type"),bags_inoculated:o("sp-bags-inoculated"),bags_discarded:o("sp-bags-discarded"),pr_fresh_in:o("pr-fresh-in"),pr_dried_out:o("pr-dried-out"),pr_dried_in:o("pr-dried-in"),pr_powder_out:o("pr-powder-out"),pr_notes:v("pr-notes"),s_fresh_kg:o("s-fresh-kg"),s_fresh_price:o("s-fresh-price"),s_dried_kg:o("s-dried-kg"),s_dried_price:o("s-dried-price"),s_powder_kg:o("s-powder-kg"),s_powder_price:o("s-powder-price"),s_waste:o("s-waste"),s_b2b_name:v("s-b2b-name"),s_b2b_qty:o("s-b2b-qty"),s_b2b_value:o("s-b2b-value"),fnf_name:v("fnf-name"),fnf_qty:o("fnf-qty"),fnf_value:o("fnf-value"),sample_fresh_kg:o("sample-fresh-kg"),sample_dried_kg:o("sample-dried-kg"),sample_powder_kg:o("sample-powder-kg"),sample_notes:v("sample-notes"),st_fresh:o("st-fresh"),st_dried:o("st-dried"),st_powder:o("st-powder"),ex_spawn:o("ex-spawn"),ex_substrate:o("ex-substrate"),ex_packaging:o("ex-packaging"),ex_labor:o("ex-labor"),ex_electricity:o("ex-electricity"),ex_transport:o("ex-transport"),ex_water:o("ex-water"),ex_other:o("ex-other"),ex_notes:v("ex-notes"),online_packaging_cost:o("ex-online-packaging"),online_delivery_cost:o("ex-online-delivery"),offline_packaging_cost:o("ex-offline-packaging"),offline_delivery_cost:o("ex-offline-delivery"),n_observations:v("n-observations"),n_tomorrow:v("n-tomorrow"),n_unusual:v("n-unusual")};try{if(t.d["nb-batch-number"]){const{error:g}=await h.from("batches").insert({batch_number:t.d["nb-batch-number"],room:t.d["nb-room"],spawn_date:t.d["log-date"]||_(),substrate_type:t.d["sp-substrate-type"]||null,substrate_kg:o("nb-substrate-kg"),bags_count:o("nb-bags-count")});if(g)throw g}const{error:a}=await h.from("farm_daily_logs").upsert(c,{onConflict:"log_date"});if(a)throw a;const{error:l}=await h.from("harvest_entries").delete().eq("log_date",n);if(l)throw l;if(s.length){const{error:g}=await h.from("harvest_entries").insert(s);if(g)throw g}const{error:p}=await h.from("qc_entries").delete().eq("log_date",n);if(p)throw p;if(i.length){const{error:g}=await h.from("qc_entries").insert(i);if(g)throw g}document.getElementById("ftr").style.display="none";const u=document.getElementById("wrap"),m=u.querySelector(".slide");m&&m.classList.add("out-l");const k=document.createElement("div");k.className="slide in-r",k.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,u.appendChild(k),requestAnimationFrame(()=>requestAnimationFrame(()=>k.classList.remove("in-r"))),setTimeout(()=>m?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(a){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",ee("জমা হয়নি: "+a.message,"error")}}document.getElementById("btn-next").addEventListener("click",F);document.getElementById("btn-skip").addEventListener("click",()=>{b(),t.step<w-1?(t.step++,y("next")):N()});document.getElementById("hdr-back").addEventListener("click",H);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function te(){try{const{data:e}=await h.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let $=[];async function se(){try{const{data:e}=await h.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");$=e||[]}catch{}}let I=[];async function ne(){try{const{data:e}=await h.from("batches").select("batch_number,room").eq("status","active").order("batch_number");I=e||[]}catch{}}let A=0,R=0;document.getElementById("wrap").addEventListener("touchstart",e=>{A=e.touches[0].clientX,R=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-A,s=Math.abs(e.changedTouches[0].clientY-R);Math.abs(n)>60&&s<80&&(n<0?F():H())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await D(h);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=_(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([te(),se(),ne()]),document.getElementById("wrap").innerHTML="",y("next")})();

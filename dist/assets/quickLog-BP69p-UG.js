import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as Q}from"./index-B-jIxwbw.js";import{r as Y}from"./admin-auth-4ZiUUGs_.js";import{l as N}from"./date-utils-D3sh9T8I.js";const h=Q("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{b2b:!1,samples:!1,fnf:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1,inocEntryIds:[0],inocEntryNextId:1},q=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],_=q.length,$=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),u=e=>parseFloat(t.d[e])||0,M=e=>t.d[e]??"0",a=e=>{const s=parseFloat(t.d[e]);return isNaN(s)?null:s},v=e=>t.d[e]||null;function d(e,s,n,o=.1,c=""){const r=M(e),l=o<1?2:0,i=o<1?"decimal":"numeric",p=c?`oninput="S.d['${e}']=this.value;lc('${c}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${s}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${o},${l})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${r}" step="${o}" min="0" inputmode="${i}" ${p}/>
      <button type="button" class="cb" onclick="adj('${e}',${o},${l})">+</button>
    </div>
    <div class="card-unit">${n}</div>
    ${c?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,s,n){const o=document.getElementById("f-"+e);if(!o)return;const c=Math.max(0,parseFloat(o.value||0)+s);o.value=c.toFixed(n),t.d[e]=o.value,o.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&C(),e==="sale"&&A(),e==="exp"&&H(),e==="proc"&&F()};function C(){const e=t.harvestEntryIds.reduce((n,o)=>n+u("h-fresh-a-"+o)+u("h-fresh-rej-"+o),0),s=document.getElementById("ht-tot");s&&(s.textContent=e.toFixed(2)+" kg")}function A(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let s=0;e.forEach(([o,c])=>{const r=u(o)*u(c);s+=r;const l=document.getElementById("tag-"+o);l&&(l.textContent=r>0?"= "+$(r):"")});const n=document.getElementById("sale-tot");n&&(n.textContent=$(s))}function H(){const s=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((o,c)=>o+u(c),0),n=document.getElementById("exp-tot");n&&(n.textContent=$(s))}function F(){const e=u("pr-fresh-in"),s=u("pr-dried-out"),n=u("pr-dried-in"),o=u("pr-powder-out"),c=document.getElementById("dry-yld"),r=document.getElementById("pow-yld");c&&(c.textContent=e>0?"ড্রাই ইল্ড: "+(s/e*100).toFixed(1)+"%":""),r&&(r.textContent=n>0?"পাউডার ইল্ড: "+(o/n*100).toFixed(1)+"%":"")}function J(e){const s="h-batch-"+e,n="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${w.map(o=>`<option value="${o.batch_number}"${t.d[s]===o.batch_number?" selected":""}>${o.batch_number} (Room ${o.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(o=>`<option value="${o}"${t.d[n]==o?" selected":""}>${o}ম Flush</option>`).join("")}
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
  </div>`}function j(){return t.harvestEntryIds.map(e=>J(e)).join('<div class="he-sep"></div>')}function X(){return`<div class="cards">
    <div id="harvest-entries">${j()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){g(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=j(),C()};window.removeHarvestEntry=function(e){g(),t.harvestEntryIds=t.harvestEntryIds.filter(s=>s!==e),document.getElementById("harvest-entries").innerHTML=j(),C(),recomputeRooms()};function V(e){const s="qc-room-"+e,n="qc-type-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">কন্টামিনেশন এন্ট্রি ${e+1}</span>
      ${t.qcEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeQcEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">কোন রুম?</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value; recomputeRooms();">
          <option value="">—</option>
          <option${t.d[s]==="A"?" selected":""}>A</option>
          <option${t.d[s]==="B"?" selected":""}>B</option>
          <option${t.d[s]==="C"?" selected":""}>C</option>
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">ধরন</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value">
          <option value="">—</option>
          <option value="bacterial"${t.d[n]==="bacterial"?" selected":""}>Bacterial</option>
          <option value="mould"${t.d[n]==="mould"?" selected":""}>Mould</option>
          <option value="trichoderma"${t.d[n]==="trichoderma"?" selected":""}>Trichoderma</option>
          <option value="unknown"${t.d[n]==="unknown"?" selected":""}>অজানা</option>
        </select>
      </div>
      ${d("qc-bags-"+e,"ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function T(){return t.qcEntryIds.map(e=>V(e)).join('<div class="he-sep"></div>')}function Z(){return`<div class="cards">
    <div id="qc-entries">${T()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){g(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=T()};window.removeQcEntry=function(e){g(),t.qcEntryIds=t.qcEntryIds.filter(s=>s!==e),document.getElementById("qc-entries").innerHTML=T(),recomputeRooms()};function U(e){const s="inoc-batch-"+e,n=t.d[s]==="__new__",o=t.d["inoc-source-"+e]||"",c=w.map(l=>`<option value="${l.batch_number}"${t.d[s]===l.batch_number?" selected":""}>${l.batch_number} (Room ${l.room})</option>`).join(""),r=z.map(l=>`<option value="${l.id}"${t.d["inoc-grain-"+e]==l.id?" selected":""}>#${l.id} ${l.grain_type||""} (${l.start_date})</option>`).join("");return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">Inoculation এন্ট্রি ${e+1}</span>
      ${t.inocEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeInocEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${s}" onchange="S.d['${s}']=this.value; renderInocEntries_(); recomputeRooms();">
          <option value="">—</option>
          ${c}
          <option value="__new__"${n?" selected":""}>+ নতুন Batch</option>
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Substrate ধরন</div>
        <select class="sel-inline" id="f-inoc-subtype-${e}" onchange="S.d['inoc-subtype-${e}']=this.value">
          <option value="">—</option>
          <option value="wheat_straw"${t.d["inoc-subtype-"+e]==="wheat_straw"?" selected":""}>গমের খড়</option>
          <option value="sawdust"${t.d["inoc-subtype-"+e]==="sawdust"?" selected":""}>করাতের গুঁড়া</option>
          <option value="rice_straw"${t.d["inoc-subtype-"+e]==="rice_straw"?" selected":""}>ধানের খড়</option>
          <option value="mixed"${t.d["inoc-subtype-"+e]==="mixed"?" selected":""}>মিশ্রিত</option>
        </select>
      </div>
    </div>
    ${n?`<div class="cg2" style="margin-top:8px">
      <div class="card">
        <div class="card-lbl">রুম</div>
        <select class="sel-inline" id="f-inoc-newroom-${e}" onchange="onInocNewBatchRoomChange(this,${e})">
          <option value="">—</option>
          <option value="A"${t.d["inoc-newroom-"+e]==="A"?" selected":""}>Room A</option>
          <option value="B"${t.d["inoc-newroom-"+e]==="B"?" selected":""}>Room B</option>
          <option value="C"${t.d["inoc-newroom-"+e]==="C"?" selected":""}>Room C</option>
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Batch নম্বর (auto)</div>
        <div class="ci-txt" id="inoc-newbatch-preview-${e}" style="display:flex;align-items:center;color:rgba(245,239,230,.5)">${t.d["inoc-newbatch-number-"+e]||"—"}</div>
      </div>
    </div>`:""}
    <div class="cg3" style="margin-top:8px">
      ${d("inoc-substrate-kg-"+e,"Substrate ওজন","kg",.5)}
      ${d("inoc-bags-"+e,"ব্যাগ সংখ্যা","টি",1)}
      ${d("inoc-bags-discarded-"+e,"বাদ দেওয়া ব্যাগ","টি",1)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${d("inoc-spawn-kg-"+e,"Spawn ব্যবহার","kg",.1)}
      <div class="card">
        <div class="card-lbl">Spawn Source</div>
        <select class="sel-inline" id="f-inoc-source-${e}" onchange="S.d['inoc-source-${e}']=this.value; renderInocEntries_();">
          <option value="">—</option>
          <option value="purchased"${o==="purchased"?" selected":""}>কেনা</option>
          <option value="inhouse"${o==="inhouse"?" selected":""}>নিজস্ব (In-house)</option>
        </select>
      </div>
    </div>
    ${o==="inhouse"?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">কোন Grain Spawn ব্যবহার হয়েছে?</div>
      <select class="sel-inline" id="f-inoc-grain-${e}" onchange="S.d['inoc-grain-${e}']=this.value">
        <option value="">—</option>
        ${r}
      </select>
    </div>`:""}
  </div>`}function L(){return t.inocEntryIds.map(e=>U(e)).join('<div class="he-sep"></div>')}function W(){return`<div class="cards">
    <div id="inoc-entries">${L()}</div>
    <button type="button" class="he-add" onclick="addInocEntry()">+ আরেকটি রুম/Batch-এর Inoculation যোগ করুন</button>
  </div>`}window.addInocEntry=function(){g(),t.inocEntryIds.push(t.inocEntryNextId++),document.getElementById("inoc-entries").innerHTML=L()};window.removeInocEntry=function(e){g(),t.inocEntryIds=t.inocEntryIds.filter(s=>s!==e),document.getElementById("inoc-entries").innerHTML=L(),recomputeRooms()};function K(){return`<div class="cards">
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
  </div>`}function ee(){return`<div class="cards">
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([n,o,c,r])=>`
    <div class="sec-lbl">${c}</div>
    <div class="cg2">
      ${d(n,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${o}',-${r},0)">−</button>
          <input type="number" id="f-${o}" class="ci sm" value="${M(o)}" step="${r}" min="0" inputmode="numeric" oninput="S.d['${o}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${o}',${r},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${n}"></div>
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
            ${S.map(n=>`<option value="${n.business_name}"${t.d["s-b2b-name"]===n.business_name?" selected":""}>${n.business_name}${n.contact_name?` (${n.contact_name})`:""}</option>`).join("")}
            <option value="__other__"${t.d["s-b2b-name"]&&!S.some(n=>n.business_name===t.d["s-b2b-name"])?" selected":""}>অন্য কেউ…</option>
          </select>
        </div>
        ${d("s-b2b-qty","পরিমাণ","kg",.1)}
        ${d("s-b2b-value","মূল্য","৳",100)}
      </div>
      <div class="card" id="b2b-other-wrap" style="display:${t.d["s-b2b-name"]&&!S.some(n=>n.business_name===t.d["s-b2b-name"])?"":"none"};max-width:460px;width:100%;margin-top:10px">
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
  </div>`}function te(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${d("st-fresh","তাজা","kg",.1)}
      ${d("st-dried","শুকনো","kg",.1)}
      ${d("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function se(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],s=[];for(let n=0;n<e.length;n+=2)s.push(`<div class="cg2">
      ${d(e[n][0],e[n][1],"৳",100,"exp")}
      ${n+1<e.length?d(e[n+1][0],e[n+1][1],"৳",100,"exp"):"<div></div>"}
    </div>`);return`<div class="cards">
    ${s.join("")}
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
  </div>`}function ne(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const oe={harvest:X,qc:Z,spawn:W,processing:K,sales:ee,stock:te,expenses:se,notes:ne};function ie(e){if(e.type==="rooms"){const s=t.d["log-date"]||N();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${s}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${s}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const s=t.harvestEntryIds.reduce((i,p)=>i+u("h-fresh-a-"+p)+u("h-fresh-rej-"+p),0),n=u("s-fresh-kg")*u("s-fresh-price")+u("s-dried-kg")*u("s-dried-price")+u("s-powder-kg")*u("s-powder-price"),o=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((i,p)=>i+u(p),0),c=n-o,r=u("st-fresh")+u("st-dried")+u("st-powder"),l=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",s>0?s.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",n>0?$(n):"—","g"],["মোট খরচ",o>0?$(o):"—","r"],["ক্লোজিং স্টক",r>0?r.toFixed(2)+" kg":"—",""]].map(([i,p,m])=>`<div class="sum-row"><span class="sum-k">${i}</span><span class="sum-v${m?" "+m:""}">${p}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${l}
        <div class="net-box ${c>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${$(c)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(oe[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function y(e="next"){const s=q[t.step],n=document.getElementById("wrap"),o=t.step===_-1,c=s.type==="yn"&&t.phase[s.id]==="form",r=s.type==="yn"&&!c;document.getElementById("prog-title").textContent=s.title,document.getElementById("prog-count").textContent=t.step+1+"/"+_,document.getElementById("prog-bar").style.width=(t.step+1)/_*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const l=document.getElementById("btn-next");l.textContent=o?"Submit করুন ✓":"পরবর্তী →",l.className="btn-next"+(o?" sub":""),l.disabled=!1,document.getElementById("btn-skip").style.display=r||s.type==="summary"?"none":"";const i=document.createElement("div"),p=n.querySelector(".slide");i.className=p?"slide "+(e==="back"?"in-l":"in-r"):"slide",i.innerHTML=ie(s),n.appendChild(i),p&&(p.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>p.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>i.classList.remove("in-r","in-l"))),s.id==="harvest"&&c&&C(),s.id==="sales"&&c&&A(),s.id==="expenses"&&c&&H(),s.id==="processing"&&c&&F(),setTimeout(()=>{const m=i.querySelector('input[type="number"],input[type="text"],textarea');m&&m.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[q[t.step].id]="form",y("next")};window.ansNo=function(){t.step<_-1?(t.step++,y("next")):R()};function P(){g(),t.step<_-1?(t.step++,y("next")):R()}function D(){g();const e=q[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],y("back");return}t.step>0&&(t.step--,y("back"))}function g(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(n=>{const o=n.id.slice(2);n.tagName==="SELECT"?n.value&&(t.d[o]=n.value):n.type==="checkbox"||(t.d[o]=n.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({b2b:"tog-b2b",samples:"tog-samples",fnf:"tog-fnf"}).forEach(([n,o])=>{const c=document.getElementById(o);c&&(t.tog[n]=c.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(s=>{const n=w.find(o=>o.batch_number===t.d["h-batch-"+s]);n&&e.add(n.room)}),t.qcEntryIds.forEach(s=>{const n=t.d["qc-room-"+s];n&&e.add(n)}),t.inocEntryIds.forEach(s=>{const n=w.find(o=>o.batch_number===t.d["inoc-batch-"+s]);n&&e.add(n.room),t.d["inoc-newroom-"+s]&&e.add(t.d["inoc-newroom-"+s])}),t.rooms=Array.from(e)};window.togC=function(e,s){t.tog[e]=s.checked;const n={b2b:"cond-b2b",samples:"cond-samples",fnf:"cond-fnf"},o=document.getElementById(n[e]);o&&o.classList.toggle("show",s.checked)};let x=null;async function ae(){if(x!=null)return x;const{data:e}=await h.from("batches").select("batch_number");let s=0;return(e||[]).forEach(n=>{const o=parseInt((n.batch_number||"").split("-")[0],10);!isNaN(o)&&o>s&&(s=o)}),x=s+1,x}window.onInocNewBatchRoomChange=async function(e,s){const n=e.value,o=document.getElementById("inoc-newbatch-preview-"+s);if(!n){o.textContent="—",t.d["inoc-newroom-"+s]="",t.d["inoc-newbatch-number-"+s]="";return}o.textContent="হিসাব করা হচ্ছে…";const r=`${await ae()}-${n}`;o.textContent=r,t.d["inoc-newroom-"+s]=n,t.d["inoc-newbatch-number-"+s]=r,recomputeRooms()};window.onB2BBuyerChange=function(e){const s=document.getElementById("b2b-other-wrap");e.value==="__other__"?(s.style.display="",t.d["s-b2b-name"]=t.d["s-b2b-name-other"]||""):(s.style.display="none",t.d["s-b2b-name"]=e.value)};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function ce(e,s="info"){const n=document.getElementById("toast-stack"),o=document.createElement("div");o.className=`toast ${s}`,o.textContent=e,n.appendChild(o),requestAnimationFrame(()=>o.classList.add("show")),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>o.remove(),300)},3e3)}function B(e){return t.harvestEntryIds.reduce((s,n)=>s+u(e+"-"+n),0)}async function R(){g();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const s=t.d["log-date"]||N(),n=t.harvestEntryIds.map(i=>{const p=v("h-batch-"+i),m=w.find(f=>f.batch_number===p);return{log_date:s,batch_number:p||null,room:m?m.room:null,flush_num:a("h-flush-"+i),fresh_a_kg:a("h-fresh-a-"+i),fresh_rej_kg:a("h-fresh-rej-"+i),healthy_kg:a("h-healthy-kg-"+i),recovered_kg:a("h-recovered-kg-"+i),bags_removed:a("h-bags-removed-"+i)}}).filter(i=>i.batch_number||i.fresh_a_kg||i.fresh_rej_kg||i.healthy_kg||i.recovered_kg||i.bags_removed),o=t.qcEntryIds.map(i=>({log_date:s,room:v("qc-room-"+i),contam_type:v("qc-type-"+i),bags:a("qc-bags-"+i),action:v("qc-action-"+i)})).filter(i=>i.room||i.contam_type||i.bags||i.action),c=t.inocEntryIds.filter(i=>t.d["inoc-batch-"+i]==="__new__"&&t.d["inoc-newbatch-number-"+i]).map(i=>({batch_number:t.d["inoc-newbatch-number-"+i],room:t.d["inoc-newroom-"+i],spawn_date:s,substrate_type:v("inoc-subtype-"+i),status:"active"})),r=t.inocEntryIds.map(i=>{const p=t.d["inoc-batch-"+i],m=p==="__new__",f=m?t.d["inoc-newbatch-number-"+i]:p,k=m?null:w.find(E=>E.batch_number===f);return{log_date:s,batch_number:f||null,room:m?t.d["inoc-newroom-"+i]:k?k.room:null,substrate_type:v("inoc-subtype-"+i),substrate_kg:a("inoc-substrate-kg-"+i),bags_count:a("inoc-bags-"+i),bags_discarded:a("inoc-bags-discarded-"+i),spawn_kg_used:a("inoc-spawn-kg-"+i),spawn_source:v("inoc-source-"+i),grain_spawn_batch_id:v("inoc-source-"+i)==="inhouse"&&v("inoc-grain-"+i)||null}}).filter(i=>i.batch_number||i.substrate_kg||i.bags_count||i.spawn_kg_used),l={log_date:s,submitted_by:t.userEmail||null,harvest_fresh_a:B("h-fresh-a"),harvest_fresh_rej:B("h-fresh-rej"),harvest_healthy_kg:B("h-healthy-kg"),harvest_recovered_kg:B("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:o.length>0,contam_bags:t.qcEntryIds.reduce((i,p)=>i+u("qc-bags-"+p),0),pr_fresh_in:a("pr-fresh-in"),pr_dried_out:a("pr-dried-out"),pr_dried_in:a("pr-dried-in"),pr_powder_out:a("pr-powder-out"),pr_notes:v("pr-notes"),s_fresh_kg:a("s-fresh-kg"),s_fresh_price:a("s-fresh-price"),s_dried_kg:a("s-dried-kg"),s_dried_price:a("s-dried-price"),s_powder_kg:a("s-powder-kg"),s_powder_price:a("s-powder-price"),s_waste:a("s-waste"),s_b2b_name:v("s-b2b-name"),s_b2b_qty:a("s-b2b-qty"),s_b2b_value:a("s-b2b-value"),fnf_name:v("fnf-name"),fnf_qty:a("fnf-qty"),fnf_value:a("fnf-value"),sample_fresh_kg:a("sample-fresh-kg"),sample_dried_kg:a("sample-dried-kg"),sample_powder_kg:a("sample-powder-kg"),sample_notes:v("sample-notes"),st_fresh:a("st-fresh"),st_dried:a("st-dried"),st_powder:a("st-powder"),ex_spawn:a("ex-spawn"),ex_substrate:a("ex-substrate"),ex_packaging:a("ex-packaging"),ex_labor:a("ex-labor"),ex_electricity:a("ex-electricity"),ex_transport:a("ex-transport"),ex_water:a("ex-water"),ex_other:a("ex-other"),ex_notes:v("ex-notes"),online_packaging_cost:a("ex-online-packaging"),online_delivery_cost:a("ex-online-delivery"),offline_packaging_cost:a("ex-offline-packaging"),offline_delivery_cost:a("ex-offline-delivery"),n_observations:v("n-observations"),n_tomorrow:v("n-tomorrow"),n_unusual:v("n-unusual")};try{if(c.length){const{error:b}=await h.from("batches").insert(c);if(b)throw b}const{error:i}=await h.from("farm_daily_logs").upsert(l,{onConflict:"log_date"});if(i)throw i;const{error:p}=await h.from("harvest_entries").delete().eq("log_date",s);if(p)throw p;if(n.length){const{error:b}=await h.from("harvest_entries").insert(n);if(b)throw b}const{error:m}=await h.from("qc_entries").delete().eq("log_date",s);if(m)throw m;if(o.length){const{error:b}=await h.from("qc_entries").insert(o);if(b)throw b}const{error:f}=await h.from("inoculation_entries").delete().eq("log_date",s);if(f)throw f;if(r.length){const{error:b}=await h.from("inoculation_entries").insert(r);if(b)throw b}document.getElementById("ftr").style.display="none";const k=document.getElementById("wrap"),E=k.querySelector(".slide");E&&E.classList.add("out-l");const I=document.createElement("div");I.className="slide in-r",I.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,k.appendChild(I),requestAnimationFrame(()=>requestAnimationFrame(()=>I.classList.remove("in-r"))),setTimeout(()=>E?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(i){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",ce("জমা হয়নি: "+i.message,"error")}}document.getElementById("btn-next").addEventListener("click",P);document.getElementById("btn-skip").addEventListener("click",()=>{g(),t.step<_-1?(t.step++,y("next")):R()});document.getElementById("hdr-back").addEventListener("click",D);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function de(){try{const{data:e}=await h.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let S=[];async function re(){try{const{data:e}=await h.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");S=e||[]}catch{}}let w=[];async function le(){try{const{data:e}=await h.from("batches").select("batch_number,room").eq("status","active").order("batch_number");w=e||[]}catch{}}let z=[];async function pe(){try{const{data:e}=await h.from("grain_spawn_batches").select("id,grain_type,start_date").in("status",["ready","incubating"]).order("start_date",{ascending:!1});z=e||[]}catch{}}let G=0,O=0;document.getElementById("wrap").addEventListener("touchstart",e=>{G=e.touches[0].clientX,O=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const s=e.changedTouches[0].clientX-G,n=Math.abs(e.changedTouches[0].clientY-O);Math.abs(s)>60&&n<80&&(s<0?P():D())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await Y(h);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=N(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([de(),re(),le(),pe()]),document.getElementById("wrap").innerHTML="",y("next")})();

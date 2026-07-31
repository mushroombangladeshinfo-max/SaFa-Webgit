import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ee}from"./index-B-jIxwbw.js";import{r as te}from"./admin-auth-4ZiUUGs_.js";import{l as H}from"./date-utils-D3sh9T8I.js";const m=ee("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{b2b:!1,fnf:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1,inocEntryIds:[0],inocEntryNextId:1,b2bEntryIds:[0],b2bEntryNextId:1,fnfEntryIds:[0],fnfEntryNextId:1,sampleEntryIds:[0],sampleEntryNextId:1},N=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"samples",icon:"🎁",title:"নমুনা",type:"yn",q:"আজকে কি বিনামূল্যে নমুনা দেওয়া হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],k=N.length,I=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),p=e=>parseFloat(t.d[e])||0,Q=e=>t.d[e]??"0",a=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},b=e=>t.d[e]||null;function r(e,n,o,i=.1,c=""){const l=Q(e),d=i<1?2:0,f=i<1?"decimal":"numeric",h=c?`oninput="S.d['${e}']=this.value;lc('${c}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${i},${d})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${l}" step="${i}" min="0" inputmode="${f}" ${h}/>
      <button type="button" class="cb" onclick="adj('${e}',${i},${d})">+</button>
    </div>
    <div class="card-unit">${o}</div>
    ${c?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,o){const i=document.getElementById("f-"+e);if(!i)return;const c=Math.max(0,parseFloat(i.value||0)+n);i.value=c.toFixed(o),t.d[e]=i.value,i.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&T(),e==="sale"&&Y(),e==="exp"&&J(),e==="proc"&&X()};function T(){const e=t.harvestEntryIds.reduce((o,i)=>o+p("h-fresh-a-"+i)+p("h-fresh-rej-"+i),0),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function Y(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([i,c])=>{const l=p(i)*p(c);n+=l;const d=document.getElementById("tag-"+i);d&&(d.textContent=l>0?"= "+I(l):"")});const o=document.getElementById("sale-tot");o&&(o.textContent=I(n))}function J(){const n=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((i,c)=>i+p(c),0),o=document.getElementById("exp-tot");o&&(o.textContent=I(n))}function X(){const e=p("pr-fresh-in"),n=p("pr-dried-out"),o=p("pr-dried-in"),i=p("pr-powder-out"),c=document.getElementById("dry-yld"),l=document.getElementById("pow-yld");c&&(c.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),l&&(l.textContent=o>0?"পাউডার ইল্ড: "+(i/o*100).toFixed(1)+"%":"")}function ne(e){const n="h-batch-"+e,o="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${$.map(i=>`<option value="${i.batch_number}"${t.d[n]===i.batch_number?" selected":""}>${i.batch_number} (Room ${i.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${o}" onchange="S.d['${o}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(i=>`<option value="${i}"${t.d[o]==i?" selected":""}>${i}ম Flush</option>`).join("")}
        </select>
      </div>
      ${r("h-bags-removed-"+e,"সরানো ব্যাগ","টি",1)}
    </div>
    <div class="cg2">
      ${r("h-fresh-a-"+e,"Grade A","kg",.1,"h")}
      ${r("h-fresh-rej-"+e,"বাতিল","kg",.1,"h")}
    </div>
    <div class="cg2">
      ${r("h-healthy-kg-"+e,"সুস্থ ব্যাগ থেকে","kg",.01)}
      ${r("h-recovered-kg-"+e,"মোল্ড থেকে উদ্ধারকৃত","kg",.01)}
    </div>
  </div>`}function F(){return t.harvestEntryIds.map(e=>ne(e)).join('<div class="he-sep"></div>')}function se(){return`<div class="cards">
    <div id="harvest-entries">${F()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){y(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=F(),T()};window.removeHarvestEntry=function(e){y(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=F(),T(),recomputeRooms()};function oe(e){const n="qc-room-"+e,o="qc-type-"+e;return`<div class="he-block">
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
        <select class="sel-inline" id="f-${o}" onchange="S.d['${o}']=this.value">
          <option value="">—</option>
          <option value="bacterial"${t.d[o]==="bacterial"?" selected":""}>Bacterial</option>
          <option value="mould"${t.d[o]==="mould"?" selected":""}>Mould</option>
          <option value="trichoderma"${t.d[o]==="trichoderma"?" selected":""}>Trichoderma</option>
          <option value="unknown"${t.d[o]==="unknown"?" selected":""}>অজানা</option>
        </select>
      </div>
      ${r("qc-bags-"+e,"ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function R(){return t.qcEntryIds.map(e=>oe(e)).join('<div class="he-sep"></div>')}function ie(){return`<div class="cards">
    <div id="qc-entries">${R()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){y(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=R()};window.removeQcEntry=function(e){y(),t.qcEntryIds=t.qcEntryIds.filter(n=>n!==e),document.getElementById("qc-entries").innerHTML=R(),recomputeRooms()};function ae(e){const n="inoc-batch-"+e,o=t.d[n]==="__new__",i=t.d["inoc-source-"+e]||"",c=$.map(d=>`<option value="${d.batch_number}"${t.d[n]===d.batch_number?" selected":""}>${d.batch_number} (Room ${d.room})</option>`).join(""),l=U.map(d=>`<option value="${d.id}"${t.d["inoc-grain-"+e]==d.id?" selected":""}>#${d.id} ${d.grain_type||""} (${d.start_date})</option>`).join("");return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">Inoculation এন্ট্রি ${e+1}</span>
      ${t.inocEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeInocEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; renderInocEntries_(); recomputeRooms();">
          <option value="">—</option>
          ${c}
          <option value="__new__"${o?" selected":""}>+ নতুন Batch</option>
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
    ${o?`<div class="cg2" style="margin-top:8px">
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
      ${r("inoc-substrate-kg-"+e,"Substrate ওজন","kg",.5)}
      ${r("inoc-bags-"+e,"ব্যাগ সংখ্যা","টি",1)}
      ${r("inoc-bags-discarded-"+e,"বাদ দেওয়া ব্যাগ","টি",1)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${r("inoc-spawn-kg-"+e,"Spawn ব্যবহার","kg",.1)}
      <div class="card">
        <div class="card-lbl">Spawn Source</div>
        <select class="sel-inline" id="f-inoc-source-${e}" onchange="S.d['inoc-source-${e}']=this.value; renderInocEntries_();">
          <option value="">—</option>
          <option value="purchased"${i==="purchased"?" selected":""}>কেনা</option>
          <option value="inhouse"${i==="inhouse"?" selected":""}>নিজস্ব (In-house)</option>
        </select>
      </div>
    </div>
    ${i==="inhouse"?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">কোন Grain Spawn ব্যবহার হয়েছে?</div>
      <select class="sel-inline" id="f-inoc-grain-${e}" onchange="S.d['inoc-grain-${e}']=this.value">
        <option value="">—</option>
        ${l}
      </select>
    </div>`:""}
  </div>`}function A(){return t.inocEntryIds.map(e=>ae(e)).join('<div class="he-sep"></div>')}function ce(){return`<div class="cards">
    <div id="inoc-entries">${A()}</div>
    <button type="button" class="he-add" onclick="addInocEntry()">+ আরেকটি রুম/Batch-এর Inoculation যোগ করুন</button>
  </div>`}window.addInocEntry=function(){y(),t.inocEntryIds.push(t.inocEntryNextId++),document.getElementById("inoc-entries").innerHTML=A()};window.removeInocEntry=function(e){y(),t.inocEntryIds=t.inocEntryIds.filter(n=>n!==e),document.getElementById("inoc-entries").innerHTML=A(),recomputeRooms()};function re(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${r("pr-fresh-in","Dryer-এ দেওয়া","kg",.1,"proc")}
      ${r("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${r("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${r("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function de(){return`<div class="cards">
    <div class="sec-lbl">খুচরা বিক্রি (B2B, বন্ধু-পরিবার ও নমুনা বাদে)</div>
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([o,i,c,l])=>`
    <div class="sec-lbl">${c}</div>
    <div class="cg2">
      ${r(o,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${i}',-${l},0)">−</button>
          <input type="number" id="f-${i}" class="ci sm" value="${Q(i)}" step="${l}" min="0" inputmode="numeric" oninput="S.d['${i}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${i}',${l},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${o}"></div>
      </div>
    </div>`).join("")}
    <div class="tot"><span class="tot-lbl">মোট বিক্রয়</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg3">
      ${r("s-waste-kg","নষ্ট (Spoilage)","kg",.1)}
      ${r("s-returned-kg","ফেরত পরিমাণ","kg",.1)}
      ${r("s-returned-value","ফেরত মূল্য","৳",50)}
    </div>
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি B2B Order ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div id="b2b-entries">${L()}</div>
      <button type="button" class="he-add" onclick="addB2bEntry()">+ আরেকটি B2B এন্ট্রি যোগ করুন</button>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বন্ধু/পরিবারকে বিক্রি হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-fnf" ${t.tog.fnf?"checked":""} onchange="togC('fnf',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.fnf?" show":""}" id="cond-fnf">
      <div id="fnf-entries">${P()}</div>
      <button type="button" class="he-add" onclick="addFnfEntry()">+ আরেকটি এন্ট্রি যোগ করুন</button>
    </div>
  </div>`}function le(e){const n="b2b-name-"+e,o="b2b-name-other-"+e,i=t.d[n]&&!M.some(c=>c.business_name===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">B2B এন্ট্রি ${e+1}</span>
      ${t.b2bEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeB2bEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">B2B Client</div>
        <select class="sel-inline" id="f-b2b-select-${e}" onchange="onB2BBuyerChange(this,${e})">
          <option value="">—</option>
          ${M.map(c=>`<option value="${c.business_name}"${t.d[n]===c.business_name?" selected":""}>${c.business_name}${c.contact_name?` (${c.contact_name})`:""}</option>`).join("")}
          <option value="__other__"${i?" selected":""}>অন্য কেউ…</option>
        </select>
      </div>
      ${r("b2b-qty-"+e,"পরিমাণ","kg",.1)}
      ${r("b2b-value-"+e,"মূল্য","৳",100)}
    </div>
    ${i?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">নাম লিখুন</div>
      <input class="ci-txt" type="text" id="f-${o}" value="${t.d[o]||""}" placeholder="ব্যবসার নাম" oninput="S.d['${o}']=this.value; S.d['${n}']=this.value;"/>
    </div>`:""}
  </div>`}function L(){return t.b2bEntryIds.map(e=>le(e)).join('<div class="he-sep"></div>')}function ue(){y(),document.getElementById("b2b-entries").innerHTML=L()}window.addB2bEntry=function(){y(),t.b2bEntryIds.push(t.b2bEntryNextId++),document.getElementById("b2b-entries").innerHTML=L()};window.removeB2bEntry=function(e){y(),t.b2bEntryIds=t.b2bEntryIds.filter(n=>n!==e),document.getElementById("b2b-entries").innerHTML=L()};window.onB2BBuyerChange=function(e,n){const o="b2b-name-"+n;t.d[o]=e.value==="__other__"?t.d["b2b-name-other-"+n]||"":e.value,ue()};function pe(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">এন্ট্রি ${e+1}</span>
      ${t.fnfEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeFnfEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">কার কাছে</div>
        <input class="ci-txt" type="text" id="f-fnf-name-${e}" value="${t.d["fnf-name-"+e]||""}" placeholder="নাম" oninput="S.d['fnf-name-${e}']=this.value"/>
      </div>
      ${r("fnf-qty-"+e,"পরিমাণ","kg",.1)}
      ${r("fnf-value-"+e,"মূল্য","৳",50)}
    </div>
  </div>`}function P(){return t.fnfEntryIds.map(e=>pe(e)).join('<div class="he-sep"></div>')}window.addFnfEntry=function(){y(),t.fnfEntryIds.push(t.fnfEntryNextId++),document.getElementById("fnf-entries").innerHTML=P()};window.removeFnfEntry=function(e){y(),t.fnfEntryIds=t.fnfEntryIds.filter(n=>n!==e),document.getElementById("fnf-entries").innerHTML=P()};function ve(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">নমুনা এন্ট্রি ${e+1}</span>
      ${t.sampleEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeSampleEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">কাকে/কেন দেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-sample-recipient-${e}" value="${t.d["sample-recipient-"+e]||""}" placeholder="যেমন: রেস্টুরেন্ট ট্রায়াল, বন্ধু-পরিবার" oninput="S.d['sample-recipient-${e}']=this.value"/>
    </div>
    <div class="cg3">
      ${r("sample-fresh-"+e,"তাজা","kg",.01)}
      ${r("sample-dried-"+e,"শুকনো","kg",.01)}
      ${r("sample-powder-"+e,"পাউডার","kg",.01)}
    </div>
  </div>`}function D(){return t.sampleEntryIds.map(e=>ve(e)).join('<div class="he-sep"></div>')}window.addSampleEntry=function(){y(),t.sampleEntryIds.push(t.sampleEntryNextId++),document.getElementById("sample-entries").innerHTML=D()};window.removeSampleEntry=function(e){y(),t.sampleEntryIds=t.sampleEntryIds.filter(n=>n!==e),document.getElementById("sample-entries").innerHTML=D()};function me(){return`<div class="cards">
    <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
    <div id="sample-entries">${D()}</div>
    <button type="button" class="he-add" onclick="addSampleEntry()">+ আরেকটি নমুনা এন্ট্রি যোগ করুন</button>
  </div>`}function he(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${r("st-fresh","তাজা","kg",.1)}
      ${r("st-dried","শুকনো","kg",.1)}
      ${r("st-powder","পাউডার","kg",.1)}
    </div>
  </div>`}function fe(){const e=[["ex-spawn","Spawn কেনা"],["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-electricity","বিদ্যুৎ বিল"],["ex-transport","পরিবহন"],["ex-water","পানি"],["ex-other","অন্যান্য"]],n=[];for(let o=0;o<e.length;o+=2)n.push(`<div class="cg2">
      ${r(e[o][0],e[o][1],"৳",100,"exp")}
      ${o+1<e.length?r(e[o+1][0],e[o+1][1],"৳",100,"exp"):"<div></div>"}
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
      ${r("ex-online-packaging","অনলাইন প্যাকেজিং","৳",50)}
      ${r("ex-online-delivery","অনলাইন ডেলিভারি","৳",50)}
    </div>
    <div class="cg2">
      ${r("ex-offline-packaging","অফলাইন প্যাকেজিং","৳",50)}
      ${r("ex-offline-delivery","অফলাইন ডেলিভারি","৳",50)}
    </div>
  </div>`}function be(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const ye={harvest:se,qc:ie,spawn:ce,processing:re,sales:de,samples:me,stock:he,expenses:fe,notes:be};function ge(e){if(e.type==="rooms"){const n=t.d["log-date"]||H();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=t.harvestEntryIds.reduce((f,h)=>f+p("h-fresh-a-"+h)+p("h-fresh-rej-"+h),0),o=p("s-fresh-kg")*p("s-fresh-price")+p("s-dried-kg")*p("s-dried-price")+p("s-powder-kg")*p("s-powder-price"),i=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((f,h)=>f+p(h),0),c=o-i,l=p("st-fresh")+p("st-dried")+p("st-powder"),d=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",o>0?I(o):"—","g"],["মোট খরচ",i>0?I(i):"—","r"],["ক্লোজিং স্টক",l>0?l.toFixed(2)+" kg":"—",""]].map(([f,h,w])=>`<div class="sum-row"><span class="sum-k">${f}</span><span class="sum-v${w?" "+w:""}">${h}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${d}
        <div class="net-box ${c>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${I(c)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(ye[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function E(e="next"){const n=N[t.step],o=document.getElementById("wrap"),i=t.step===k-1,c=n.type==="yn"&&t.phase[n.id]==="form",l=n.type==="yn"&&!c;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+k,document.getElementById("prog-bar").style.width=(t.step+1)/k*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const d=document.getElementById("btn-next");d.textContent=i?"Submit করুন ✓":"পরবর্তী →",d.className="btn-next"+(i?" sub":""),d.disabled=!1,document.getElementById("btn-skip").style.display=l||n.type==="summary"?"none":"";const f=document.createElement("div"),h=o.querySelector(".slide");f.className=h?"slide "+(e==="back"?"in-l":"in-r"):"slide",f.innerHTML=ge(n),o.appendChild(f),h&&(h.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>h.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>f.classList.remove("in-r","in-l"))),n.id==="harvest"&&c&&T(),n.id==="sales"&&c&&Y(),n.id==="expenses"&&c&&J(),n.id==="processing"&&c&&X(),setTimeout(()=>{const w=f.querySelector('input[type="number"],input[type="text"],textarea');w&&w.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[N[t.step].id]="form",E("next")};window.ansNo=function(){t.step<k-1?(t.step++,E("next")):O()};function V(){y(),t.step<k-1?(t.step++,E("next")):O()}function Z(){y();const e=N[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],E("back");return}t.step>0&&(t.step--,E("back"))}function y(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(o=>{const i=o.id.slice(2);o.tagName==="SELECT"?o.value&&(t.d[i]=o.value):o.type==="checkbox"||(t.d[i]=o.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({b2b:"tog-b2b",fnf:"tog-fnf"}).forEach(([o,i])=>{const c=document.getElementById(i);c&&(t.tog[o]=c.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(n=>{const o=$.find(i=>i.batch_number===t.d["h-batch-"+n]);o&&e.add(o.room)}),t.qcEntryIds.forEach(n=>{const o=t.d["qc-room-"+n];o&&e.add(o)}),t.inocEntryIds.forEach(n=>{const o=$.find(i=>i.batch_number===t.d["inoc-batch-"+n]);o&&e.add(o.room),t.d["inoc-newroom-"+n]&&e.add(t.d["inoc-newroom-"+n])}),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const o={b2b:"cond-b2b",fnf:"cond-fnf"},i=document.getElementById(o[e]);i&&i.classList.toggle("show",n.checked)};let q=null;async function we(){if(q!=null)return q;const{data:e}=await m.from("batches").select("batch_number");let n=0;return(e||[]).forEach(o=>{const i=parseInt((o.batch_number||"").split("-")[0],10);!isNaN(i)&&i>n&&(n=i)}),q=n+1,q}window.onInocNewBatchRoomChange=async function(e,n){const o=e.value,i=document.getElementById("inoc-newbatch-preview-"+n);if(!o){i.textContent="—",t.d["inoc-newroom-"+n]="",t.d["inoc-newbatch-number-"+n]="";return}i.textContent="হিসাব করা হচ্ছে…";const l=`${await we()}-${o}`;i.textContent=l,t.d["inoc-newroom-"+n]=o,t.d["inoc-newbatch-number-"+n]=l,recomputeRooms()};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function _e(e,n="info"){const o=document.getElementById("toast-stack"),i=document.createElement("div");i.className=`toast ${n}`,i.textContent=e,o.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},3e3)}function C(e){return t.harvestEntryIds.reduce((n,o)=>n+p(e+"-"+o),0)}async function O(){y();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||H(),o=t.harvestEntryIds.map(s=>{const u=b("h-batch-"+s),g=$.find(_=>_.batch_number===u);return{log_date:n,batch_number:u||null,room:g?g.room:null,flush_num:a("h-flush-"+s),fresh_a_kg:a("h-fresh-a-"+s),fresh_rej_kg:a("h-fresh-rej-"+s),healthy_kg:a("h-healthy-kg-"+s),recovered_kg:a("h-recovered-kg-"+s),bags_removed:a("h-bags-removed-"+s)}}).filter(s=>s.batch_number||s.fresh_a_kg||s.fresh_rej_kg||s.healthy_kg||s.recovered_kg||s.bags_removed),i=t.qcEntryIds.map(s=>({log_date:n,room:b("qc-room-"+s),contam_type:b("qc-type-"+s),bags:a("qc-bags-"+s),action:b("qc-action-"+s)})).filter(s=>s.room||s.contam_type||s.bags||s.action),c=t.inocEntryIds.filter(s=>t.d["inoc-batch-"+s]==="__new__"&&t.d["inoc-newbatch-number-"+s]).map(s=>({batch_number:t.d["inoc-newbatch-number-"+s],room:t.d["inoc-newroom-"+s],spawn_date:n,substrate_type:b("inoc-subtype-"+s),status:"active"})),l=t.inocEntryIds.map(s=>{const u=t.d["inoc-batch-"+s],g=u==="__new__",_=g?t.d["inoc-newbatch-number-"+s]:u,B=g?null:$.find(x=>x.batch_number===_);return{log_date:n,batch_number:_||null,room:g?t.d["inoc-newroom-"+s]:B?B.room:null,substrate_type:b("inoc-subtype-"+s),substrate_kg:a("inoc-substrate-kg-"+s),bags_count:a("inoc-bags-"+s),bags_discarded:a("inoc-bags-discarded-"+s),spawn_kg_used:a("inoc-spawn-kg-"+s),spawn_source:b("inoc-source-"+s),grain_spawn_batch_id:b("inoc-source-"+s)==="inhouse"&&b("inoc-grain-"+s)||null}}).filter(s=>s.batch_number||s.substrate_kg||s.bags_count||s.spawn_kg_used),d=t.b2bEntryIds.map(s=>({log_date:n,business_name:b("b2b-name-"+s),qty:a("b2b-qty-"+s),value:a("b2b-value-"+s)})).filter(s=>s.business_name||s.qty||s.value),f=t.fnfEntryIds.map(s=>({log_date:n,person_name:b("fnf-name-"+s),qty:a("fnf-qty-"+s),value:a("fnf-value-"+s)})).filter(s=>s.person_name||s.qty||s.value),h=t.sampleEntryIds.map(s=>({log_date:n,recipient:b("sample-recipient-"+s),fresh_kg:a("sample-fresh-"+s),dried_kg:a("sample-dried-"+s),powder_kg:a("sample-powder-"+s)})).filter(s=>s.recipient||s.fresh_kg||s.dried_kg||s.powder_kg),w={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:C("h-fresh-a"),harvest_fresh_rej:C("h-fresh-rej"),harvest_healthy_kg:C("h-healthy-kg"),harvest_recovered_kg:C("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:i.length>0,contam_bags:t.qcEntryIds.reduce((s,u)=>s+p("qc-bags-"+u),0),pr_fresh_in:a("pr-fresh-in"),pr_dried_out:a("pr-dried-out"),pr_dried_in:a("pr-dried-in"),pr_powder_out:a("pr-powder-out"),pr_notes:b("pr-notes"),s_fresh_kg:a("s-fresh-kg"),s_fresh_price:a("s-fresh-price"),s_dried_kg:a("s-dried-kg"),s_dried_price:a("s-dried-price"),s_powder_kg:a("s-powder-kg"),s_powder_price:a("s-powder-price"),s_waste_kg:a("s-waste-kg"),s_returned_kg:a("s-returned-kg"),s_returned_value:a("s-returned-value"),s_b2b_qty:d.reduce((s,u)=>s+(+u.qty||0),0),s_b2b_value:d.reduce((s,u)=>s+(+u.value||0),0),fnf_qty:f.reduce((s,u)=>s+(+u.qty||0),0),fnf_value:f.reduce((s,u)=>s+(+u.value||0),0),sample_fresh_kg:h.reduce((s,u)=>s+(+u.fresh_kg||0),0),sample_dried_kg:h.reduce((s,u)=>s+(+u.dried_kg||0),0),sample_powder_kg:h.reduce((s,u)=>s+(+u.powder_kg||0),0),st_fresh:a("st-fresh"),st_dried:a("st-dried"),st_powder:a("st-powder"),ex_spawn:a("ex-spawn"),ex_substrate:a("ex-substrate"),ex_packaging:a("ex-packaging"),ex_labor:a("ex-labor"),ex_electricity:a("ex-electricity"),ex_transport:a("ex-transport"),ex_water:a("ex-water"),ex_other:a("ex-other"),ex_notes:b("ex-notes"),online_packaging_cost:a("ex-online-packaging"),online_delivery_cost:a("ex-online-delivery"),offline_packaging_cost:a("ex-offline-packaging"),offline_delivery_cost:a("ex-offline-delivery"),n_observations:b("n-observations"),n_tomorrow:b("n-tomorrow"),n_unusual:b("n-unusual")};try{if(c.length){const{error:v}=await m.from("batches").insert(c);if(v)throw v}const{error:s}=await m.from("farm_daily_logs").upsert(w,{onConflict:"log_date"});if(s)throw s;const{error:u}=await m.from("harvest_entries").delete().eq("log_date",n);if(u)throw u;if(o.length){const{error:v}=await m.from("harvest_entries").insert(o);if(v)throw v}const{error:g}=await m.from("qc_entries").delete().eq("log_date",n);if(g)throw g;if(i.length){const{error:v}=await m.from("qc_entries").insert(i);if(v)throw v}const{error:_}=await m.from("inoculation_entries").delete().eq("log_date",n);if(_)throw _;if(l.length){const{error:v}=await m.from("inoculation_entries").insert(l);if(v)throw v}const{error:B}=await m.from("b2b_sale_entries").delete().eq("log_date",n);if(B)throw B;if(d.length){const{error:v}=await m.from("b2b_sale_entries").insert(d);if(v)throw v}const{error:x}=await m.from("fnf_sale_entries").delete().eq("log_date",n);if(x)throw x;if(f.length){const{error:v}=await m.from("fnf_sale_entries").insert(f);if(v)throw v}const{error:z}=await m.from("sample_entries").delete().eq("log_date",n);if(z)throw z;if(h.length){const{error:v}=await m.from("sample_entries").insert(h);if(v)throw v}document.getElementById("ftr").style.display="none";const G=document.getElementById("wrap"),j=G.querySelector(".slide");j&&j.classList.add("out-l");const S=document.createElement("div");S.className="slide in-r",S.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,G.appendChild(S),requestAnimationFrame(()=>requestAnimationFrame(()=>S.classList.remove("in-r"))),setTimeout(()=>j?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(s){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",_e("জমা হয়নি: "+s.message,"error")}}document.getElementById("btn-next").addEventListener("click",V);document.getElementById("btn-skip").addEventListener("click",()=>{y(),t.step<k-1?(t.step++,E("next")):O()});document.getElementById("hdr-back").addEventListener("click",Z);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function Ee(){try{const{data:e}=await m.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let M=[];async function $e(){try{const{data:e}=await m.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");M=e||[]}catch{}}let $=[];async function ke(){try{const{data:e}=await m.from("batches").select("batch_number,room").eq("status","active").order("batch_number");$=e||[]}catch{}}let U=[];async function Ie(){try{const{data:e}=await m.from("grain_spawn_batches").select("id,grain_type,start_date").in("status",["ready","incubating"]).order("start_date",{ascending:!1});U=e||[]}catch{}}let K=0,W=0;document.getElementById("wrap").addEventListener("touchstart",e=>{K=e.touches[0].clientX,W=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-K,o=Math.abs(e.changedTouches[0].clientY-W);Math.abs(n)>60&&o<80&&(n<0?V():Z())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await te(m);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=H(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([Ee(),$e(),ke(),Ie()]),document.getElementById("wrap").innerHTML="",E("next")})();

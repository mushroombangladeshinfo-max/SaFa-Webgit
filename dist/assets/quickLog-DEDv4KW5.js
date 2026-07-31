import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as se}from"./index-B-jIxwbw.js";import{r as oe}from"./admin-auth-4ZiUUGs_.js";import{l as x}from"./date-utils-D3sh9T8I.js";const m=se("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{b2b:!1,fnf:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1,inocEntryIds:[0],inocEntryNextId:1,b2bEntryIds:[0],b2bEntryNextId:1,fnfEntryIds:[0],fnfEntryNextId:1,sampleEntryIds:[0],sampleEntryNextId:1},F=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি হয়েছে?"},{id:"samples",icon:"🎁",title:"নমুনা",type:"yn",q:"আজকে কি বিনামূল্যে নমুনা দেওয়া হয়েছে?"},{id:"stock",icon:"📊",title:"Closing Stock",type:"yn",q:"আজকের Closing Stock দিবেন?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],I=F.length,B=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),c=e=>parseFloat(t.d[e])||0,J=e=>t.d[e]??"0",r=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},b=e=>t.d[e]||null;function l(e,n,o,i=.1,a=""){const u=J(e),p=i<1?2:0,h=i<1?"decimal":"numeric",v=a?`oninput="S.d['${e}']=this.value;lc('${a}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${i},${p})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${u}" step="${i}" min="0" inputmode="${h}" ${v}/>
      <button type="button" class="cb" onclick="adj('${e}',${i},${p})">+</button>
    </div>
    <div class="card-unit">${o}</div>
    ${a?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,o){const i=document.getElementById("f-"+e);if(!i)return;const a=Math.max(0,parseFloat(i.value||0)+n);i.value=a.toFixed(o),t.d[e]=i.value,i.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&L(),e==="sale"&&X(),e==="exp"&&V(),e==="proc"&&Z(),e==="stock"&&ee()};function L(){const e=t.harvestEntryIds.reduce((o,i)=>o+c("h-fresh-a-"+i)+c("h-fresh-rej-"+i),0),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function X(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([i,a])=>{const u=c(i)*c(a);n+=u;const p=document.getElementById("tag-"+i);p&&(p.textContent=u>0?"= "+B(u):"")});const o=document.getElementById("sale-tot");o&&(o.textContent=B(n))}function V(){const n=["ex-substrate","ex-packaging","ex-labor","ex-other"].reduce((i,a)=>i+c(a),0),o=document.getElementById("exp-tot");o&&(o.textContent=B(n))}function Z(){const e=c("pr-fresh-in"),n=c("pr-dried-out"),o=c("pr-dried-in"),i=c("pr-powder-out"),a=document.getElementById("dry-yld"),u=document.getElementById("pow-yld");a&&(a.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),u&&(u.textContent=o>0?"পাউডার ইল্ড: "+(i/o*100).toFixed(1)+"%":"")}function ie(e){const n="h-batch-"+e,o="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${k.map(i=>`<option value="${i.batch_number}"${t.d[n]===i.batch_number?" selected":""}>${i.batch_number} (Room ${i.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${o}" onchange="S.d['${o}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(i=>`<option value="${i}"${t.d[o]==i?" selected":""}>${i}ম Flush</option>`).join("")}
        </select>
      </div>
      ${l("h-bags-removed-"+e,"সরানো ব্যাগ","টি",1)}
    </div>
    <div class="cg2">
      ${l("h-fresh-a-"+e,"Grade A","kg",.1,"h")}
      ${l("h-fresh-rej-"+e,"বাতিল","kg",.1,"h")}
    </div>
    <div class="cg2">
      ${l("h-healthy-kg-"+e,"সুস্থ ব্যাগ থেকে","kg",.01)}
      ${l("h-recovered-kg-"+e,"মোল্ড থেকে উদ্ধারকৃত","kg",.01)}
    </div>
  </div>`}function A(){return t.harvestEntryIds.map(e=>ie(e)).join('<div class="he-sep"></div>')}function ae(){return`<div class="cards">
    <div id="harvest-entries">${A()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){y(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=A(),L()};window.removeHarvestEntry=function(e){y(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=A(),L(),recomputeRooms()};function re(e){const n="qc-room-"+e,o="qc-type-"+e;return`<div class="he-block">
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
      ${l("qc-bags-"+e,"ক্ষতিগ্রস্ত ব্যাগ","টি",1)}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function D(){return t.qcEntryIds.map(e=>re(e)).join('<div class="he-sep"></div>')}function ce(){return`<div class="cards">
    <div id="qc-entries">${D()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){y(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=D()};window.removeQcEntry=function(e){y(),t.qcEntryIds=t.qcEntryIds.filter(n=>n!==e),document.getElementById("qc-entries").innerHTML=D(),recomputeRooms()};function de(e){const n="inoc-batch-"+e,o=t.d[n]==="__new__",i=t.d["inoc-source-"+e]||"",a=k.map(p=>`<option value="${p.batch_number}"${t.d[n]===p.batch_number?" selected":""}>${p.batch_number} (Room ${p.room})</option>`).join(""),u=W.map(p=>`<option value="${p.id}"${t.d["inoc-grain-"+e]==p.id?" selected":""}>#${p.id} ${p.grain_type||""} (${p.start_date})</option>`).join("");return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">Inoculation এন্ট্রি ${e+1}</span>
      ${t.inocEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeInocEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; renderInocEntries_(); recomputeRooms();">
          <option value="">—</option>
          ${a}
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
      ${l("inoc-substrate-kg-"+e,"Substrate ওজন","kg",.5)}
      ${l("inoc-bags-"+e,"ব্যাগ সংখ্যা","টি",1)}
      ${l("inoc-bags-discarded-"+e,"বাদ দেওয়া ব্যাগ","টি",1)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${l("inoc-spawn-kg-"+e,"Spawn ব্যবহার","kg",.1)}
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
        ${u}
      </select>
    </div>`:""}
  </div>`}function P(){return t.inocEntryIds.map(e=>de(e)).join('<div class="he-sep"></div>')}function le(){return`<div class="cards">
    <div id="inoc-entries">${P()}</div>
    <button type="button" class="he-add" onclick="addInocEntry()">+ আরেকটি রুম/Batch-এর Inoculation যোগ করুন</button>
  </div>`}window.addInocEntry=function(){y(),t.inocEntryIds.push(t.inocEntryNextId++),document.getElementById("inoc-entries").innerHTML=P()};window.removeInocEntry=function(e){y(),t.inocEntryIds=t.inocEntryIds.filter(n=>n!==e),document.getElementById("inoc-entries").innerHTML=P(),recomputeRooms()};function ue(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${l("pr-fresh-in","Dryer-এ দেওয়া","kg",.1,"proc")}
      ${l("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${l("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${l("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function pe(){return`<div class="cards">
    <div class="sec-lbl">খুচরা বিক্রি (B2B, বন্ধু-পরিবার ও নমুনা বাদে)</div>
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([o,i,a,u])=>`
    <div class="sec-lbl">${a}</div>
    <div class="cg2">
      ${l(o,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${i}',-${u},0)">−</button>
          <input type="number" id="f-${i}" class="ci sm" value="${J(i)}" step="${u}" min="0" inputmode="numeric" oninput="S.d['${i}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${i}',${u},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${o}"></div>
      </div>
    </div>`).join("")}
    <div class="tot"><span class="tot-lbl">মোট বিক্রয়</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg3">
      ${l("s-waste-kg","নষ্ট (Spoilage)","kg",.1)}
      ${l("s-returned-kg","ফেরত পরিমাণ","kg",.1)}
      ${l("s-returned-value","ফেরত মূল্য","৳",50)}
    </div>
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি B2B Order ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div id="b2b-entries">${j()}</div>
      <button type="button" class="he-add" onclick="addB2bEntry()">+ আরেকটি B2B এন্ট্রি যোগ করুন</button>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বন্ধু/পরিবারকে বিক্রি হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-fnf" ${t.tog.fnf?"checked":""} onchange="togC('fnf',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.fnf?" show":""}" id="cond-fnf">
      <div id="fnf-entries">${z()}</div>
      <button type="button" class="he-add" onclick="addFnfEntry()">+ আরেকটি এন্ট্রি যোগ করুন</button>
    </div>
  </div>`}function ve(e){const n="b2b-name-"+e,o="b2b-name-other-"+e,i=t.d[n]&&!R.some(a=>a.business_name===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">B2B এন্ট্রি ${e+1}</span>
      ${t.b2bEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeB2bEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">B2B Client</div>
        <select class="sel-inline" id="f-b2b-select-${e}" onchange="onB2BBuyerChange(this,${e})">
          <option value="">—</option>
          ${R.map(a=>`<option value="${a.business_name}"${t.d[n]===a.business_name?" selected":""}>${a.business_name}${a.contact_name?` (${a.contact_name})`:""}</option>`).join("")}
          <option value="__other__"${i?" selected":""}>অন্য কেউ…</option>
        </select>
      </div>
      ${l("b2b-qty-"+e,"পরিমাণ","kg",.1)}
      ${l("b2b-value-"+e,"মূল্য","৳",100)}
    </div>
    ${i?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">নাম লিখুন</div>
      <input class="ci-txt" type="text" id="f-${o}" value="${t.d[o]||""}" placeholder="ব্যবসার নাম" oninput="S.d['${o}']=this.value; S.d['${n}']=this.value;"/>
    </div>`:""}
  </div>`}function j(){return t.b2bEntryIds.map(e=>ve(e)).join('<div class="he-sep"></div>')}function me(){y(),document.getElementById("b2b-entries").innerHTML=j()}window.addB2bEntry=function(){y(),t.b2bEntryIds.push(t.b2bEntryNextId++),document.getElementById("b2b-entries").innerHTML=j()};window.removeB2bEntry=function(e){y(),t.b2bEntryIds=t.b2bEntryIds.filter(n=>n!==e),document.getElementById("b2b-entries").innerHTML=j()};window.onB2BBuyerChange=function(e,n){const o="b2b-name-"+n;t.d[o]=e.value==="__other__"?t.d["b2b-name-other-"+n]||"":e.value,me()};function he(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">এন্ট্রি ${e+1}</span>
      ${t.fnfEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeFnfEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">কার কাছে</div>
        <input class="ci-txt" type="text" id="f-fnf-name-${e}" value="${t.d["fnf-name-"+e]||""}" placeholder="নাম" oninput="S.d['fnf-name-${e}']=this.value"/>
      </div>
      ${l("fnf-qty-"+e,"পরিমাণ","kg",.1)}
      ${l("fnf-value-"+e,"মূল্য","৳",50)}
    </div>
  </div>`}function z(){return t.fnfEntryIds.map(e=>he(e)).join('<div class="he-sep"></div>')}window.addFnfEntry=function(){y(),t.fnfEntryIds.push(t.fnfEntryNextId++),document.getElementById("fnf-entries").innerHTML=z()};window.removeFnfEntry=function(e){y(),t.fnfEntryIds=t.fnfEntryIds.filter(n=>n!==e),document.getElementById("fnf-entries").innerHTML=z()};function fe(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">নমুনা এন্ট্রি ${e+1}</span>
      ${t.sampleEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeSampleEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">কাকে/কেন দেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-sample-recipient-${e}" value="${t.d["sample-recipient-"+e]||""}" placeholder="যেমন: রেস্টুরেন্ট ট্রায়াল, বন্ধু-পরিবার" oninput="S.d['sample-recipient-${e}']=this.value"/>
    </div>
    <div class="cg3">
      ${l("sample-fresh-"+e,"তাজা","kg",.01)}
      ${l("sample-dried-"+e,"শুকনো","kg",.01)}
      ${l("sample-powder-"+e,"পাউডার","kg",.01)}
    </div>
  </div>`}function O(){return t.sampleEntryIds.map(e=>fe(e)).join('<div class="he-sep"></div>')}window.addSampleEntry=function(){y(),t.sampleEntryIds.push(t.sampleEntryNextId++),document.getElementById("sample-entries").innerHTML=O()};window.removeSampleEntry=function(e){y(),t.sampleEntryIds=t.sampleEntryIds.filter(n=>n!==e),document.getElementById("sample-entries").innerHTML=O()};function be(){return`<div class="cards">
    <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
    <div id="sample-entries">${O()}</div>
    <button type="button" class="he-add" onclick="addSampleEntry()">+ আরেকটি নমুনা এন্ট্রি যোগ করুন</button>
  </div>`}function ye(){return`<div class="cards">
    <div class="sec-lbl">দিন শেষের Stock (kg)</div>
    <div class="cg3">
      ${l("st-fresh","তাজা","kg",.1,"stock")}
      ${l("st-dried","শুকনো","kg",.1,"stock")}
      ${l("st-powder","পাউডার","kg",.1,"stock")}
    </div>
    <div style="font-size:11px;color:rgba(245,239,230,.3);width:100%;max-width:460px">"Expected" গতকালের Stock + আজকের Harvest/Processing/বিক্রয়-খরচ হিসাব করে বসানো হয়। বড় পার্থক্য থাকলে আবার গুনে দেখুন — অলিখিত loss বা ভুলে যাওয়া বিক্রয় ধরা পড়তে পারে।</div>
  </div>`}function ge(){const e=[["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-other","অন্যান্য"]],n=[];for(let o=0;o<e.length;o+=2)n.push(`<div class="cg2">
      ${l(e[o][0],e[o][1],"৳",100,"exp")}
      ${o+1<e.length?l(e[o+1][0],e[o+1][1],"৳",100,"exp"):"<div></div>"}
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
      ${l("ex-online-packaging","অনলাইন প্যাকেজিং","৳",50)}
      ${l("ex-online-delivery","অনলাইন ডেলিভারি","৳",50)}
    </div>
    <div class="cg2">
      ${l("ex-offline-packaging","অফলাইন প্যাকেজিং","৳",50)}
      ${l("ex-offline-delivery","অফলাইন ডেলিভারি","৳",50)}
    </div>
  </div>`}function we(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const _e={harvest:ae,qc:ce,spawn:le,processing:ue,sales:pe,samples:be,stock:ye,expenses:ge,notes:we};function Ee(e){if(e.type==="rooms"){const n=t.d["log-date"]||x();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=t.harvestEntryIds.reduce((h,v)=>h+c("h-fresh-a-"+v)+c("h-fresh-rej-"+v),0),o=c("s-fresh-kg")*c("s-fresh-price")+c("s-dried-kg")*c("s-dried-price")+c("s-powder-kg")*c("s-powder-price"),i=["ex-spawn","ex-substrate","ex-packaging","ex-labor","ex-electricity","ex-transport","ex-water","ex-other"].reduce((h,v)=>h+c(v),0),a=o-i,u=c("st-fresh")+c("st-dried")+c("st-powder"),p=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",o>0?B(o):"—","g"],["মোট খরচ",i>0?B(i):"—","r"],["ক্লোজিং স্টক",u>0?u.toFixed(2)+" kg":"—",""]].map(([h,v,g])=>`<div class="sum-row"><span class="sum-k">${h}</span><span class="sum-v${g?" "+g:""}">${v}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${p}
        <div class="net-box ${a>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${B(a)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(_e[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function $(e="next"){const n=F[t.step],o=document.getElementById("wrap"),i=t.step===I-1,a=n.type==="yn"&&t.phase[n.id]==="form",u=n.type==="yn"&&!a;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+I,document.getElementById("prog-bar").style.width=(t.step+1)/I*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const p=document.getElementById("btn-next");p.textContent=i?"Submit করুন ✓":"পরবর্তী →",p.className="btn-next"+(i?" sub":""),p.disabled=!1,document.getElementById("btn-skip").style.display=u||n.type==="summary"?"none":"";const h=document.createElement("div"),v=o.querySelector(".slide");h.className=v?"slide "+(e==="back"?"in-l":"in-r"):"slide",h.innerHTML=Ee(n),o.appendChild(h),v&&(v.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>v.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>h.classList.remove("in-r","in-l"))),n.id==="harvest"&&a&&L(),n.id==="sales"&&a&&X(),n.id==="expenses"&&a&&V(),n.id==="processing"&&a&&Z(),n.id==="stock"&&a&&ee(),setTimeout(()=>{const g=h.querySelector('input[type="number"],input[type="text"],textarea');g&&g.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[F[t.step].id]="form",$("next")};window.ansNo=function(){t.step<I-1?(t.step++,$("next")):Q()};function U(){y(),t.step<I-1?(t.step++,$("next")):Q()}function K(){y();const e=F[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],$("back");return}t.step>0&&(t.step--,$("back"))}function y(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(o=>{const i=o.id.slice(2);o.tagName==="SELECT"?o.value&&(t.d[i]=o.value):o.type==="checkbox"||(t.d[i]=o.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({b2b:"tog-b2b",fnf:"tog-fnf"}).forEach(([o,i])=>{const a=document.getElementById(i);a&&(t.tog[o]=a.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(n=>{const o=k.find(i=>i.batch_number===t.d["h-batch-"+n]);o&&e.add(o.room)}),t.qcEntryIds.forEach(n=>{const o=t.d["qc-room-"+n];o&&e.add(o)}),t.inocEntryIds.forEach(n=>{const o=k.find(i=>i.batch_number===t.d["inoc-batch-"+n]);o&&e.add(o.room),t.d["inoc-newroom-"+n]&&e.add(t.d["inoc-newroom-"+n])}),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const o={b2b:"cond-b2b",fnf:"cond-fnf"},i=document.getElementById(o[e]);i&&i.classList.toggle("show",n.checked)};let T=null;async function $e(){if(T!=null)return T;const{data:e}=await m.from("batches").select("batch_number");let n=0;return(e||[]).forEach(o=>{const i=parseInt((o.batch_number||"").split("-")[0],10);!isNaN(i)&&i>n&&(n=i)}),T=n+1,T}window.onInocNewBatchRoomChange=async function(e,n){const o=e.value,i=document.getElementById("inoc-newbatch-preview-"+n);if(!o){i.textContent="—",t.d["inoc-newroom-"+n]="",t.d["inoc-newbatch-number-"+n]="";return}i.textContent="হিসাব করা হচ্ছে…";const u=`${await $e()}-${o}`;i.textContent=u,t.d["inoc-newroom-"+n]=o,t.d["inoc-newbatch-number-"+n]=u,recomputeRooms()};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function ke(e,n="info"){const o=document.getElementById("toast-stack"),i=document.createElement("div");i.className=`toast ${n}`,i.textContent=e,o.appendChild(i),requestAnimationFrame(()=>i.classList.add("show")),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),300)},3e3)}function _(e){return t.harvestEntryIds.reduce((n,o)=>n+c(e+"-"+o),0)}async function Q(){y();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||x(),o=t.harvestEntryIds.map(s=>{const d=b("h-batch-"+s),w=k.find(E=>E.batch_number===d);return{log_date:n,batch_number:d||null,room:w?w.room:null,flush_num:r("h-flush-"+s),fresh_a_kg:r("h-fresh-a-"+s),fresh_rej_kg:r("h-fresh-rej-"+s),healthy_kg:r("h-healthy-kg-"+s),recovered_kg:r("h-recovered-kg-"+s),bags_removed:r("h-bags-removed-"+s)}}).filter(s=>s.batch_number||s.fresh_a_kg||s.fresh_rej_kg||s.healthy_kg||s.recovered_kg||s.bags_removed),i=t.qcEntryIds.map(s=>({log_date:n,room:b("qc-room-"+s),contam_type:b("qc-type-"+s),bags:r("qc-bags-"+s),action:b("qc-action-"+s)})).filter(s=>s.room||s.contam_type||s.bags||s.action),a=t.inocEntryIds.filter(s=>t.d["inoc-batch-"+s]==="__new__"&&t.d["inoc-newbatch-number-"+s]).map(s=>({batch_number:t.d["inoc-newbatch-number-"+s],room:t.d["inoc-newroom-"+s],spawn_date:n,substrate_type:b("inoc-subtype-"+s),status:"active"})),u=t.inocEntryIds.map(s=>{const d=t.d["inoc-batch-"+s],w=d==="__new__",E=w?t.d["inoc-newbatch-number-"+s]:d,S=w?null:k.find(C=>C.batch_number===E);return{log_date:n,batch_number:E||null,room:w?t.d["inoc-newroom-"+s]:S?S.room:null,substrate_type:b("inoc-subtype-"+s),substrate_kg:r("inoc-substrate-kg-"+s),bags_count:r("inoc-bags-"+s),bags_discarded:r("inoc-bags-discarded-"+s),spawn_kg_used:r("inoc-spawn-kg-"+s),spawn_source:b("inoc-source-"+s),grain_spawn_batch_id:b("inoc-source-"+s)==="inhouse"&&b("inoc-grain-"+s)||null}}).filter(s=>s.batch_number||s.substrate_kg||s.bags_count||s.spawn_kg_used),p=t.b2bEntryIds.map(s=>({log_date:n,business_name:b("b2b-name-"+s),qty:r("b2b-qty-"+s),value:r("b2b-value-"+s)})).filter(s=>s.business_name||s.qty||s.value),h=t.fnfEntryIds.map(s=>({log_date:n,person_name:b("fnf-name-"+s),qty:r("fnf-qty-"+s),value:r("fnf-value-"+s)})).filter(s=>s.person_name||s.qty||s.value),v=t.sampleEntryIds.map(s=>({log_date:n,recipient:b("sample-recipient-"+s),fresh_kg:r("sample-fresh-"+s),dried_kg:r("sample-dried-"+s),powder_kg:r("sample-powder-"+s)})).filter(s=>s.recipient||s.fresh_kg||s.dried_kg||s.powder_kg),g={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:_("h-fresh-a"),harvest_fresh_rej:_("h-fresh-rej"),harvest_healthy_kg:_("h-healthy-kg"),harvest_recovered_kg:_("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:i.length>0,contam_bags:t.qcEntryIds.reduce((s,d)=>s+c("qc-bags-"+d),0),pr_fresh_in:r("pr-fresh-in"),pr_dried_out:r("pr-dried-out"),pr_dried_in:r("pr-dried-in"),pr_powder_out:r("pr-powder-out"),pr_notes:b("pr-notes"),s_fresh_kg:r("s-fresh-kg"),s_fresh_price:r("s-fresh-price"),s_dried_kg:r("s-dried-kg"),s_dried_price:r("s-dried-price"),s_powder_kg:r("s-powder-kg"),s_powder_price:r("s-powder-price"),s_waste_kg:r("s-waste-kg"),s_returned_kg:r("s-returned-kg"),s_returned_value:r("s-returned-value"),s_b2b_qty:p.reduce((s,d)=>s+(+d.qty||0),0),s_b2b_value:p.reduce((s,d)=>s+(+d.value||0),0),fnf_qty:h.reduce((s,d)=>s+(+d.qty||0),0),fnf_value:h.reduce((s,d)=>s+(+d.value||0),0),sample_fresh_kg:v.reduce((s,d)=>s+(+d.fresh_kg||0),0),sample_dried_kg:v.reduce((s,d)=>s+(+d.dried_kg||0),0),sample_powder_kg:v.reduce((s,d)=>s+(+d.powder_kg||0),0),st_fresh:r("st-fresh"),st_dried:r("st-dried"),st_powder:r("st-powder"),ex_substrate:r("ex-substrate"),ex_packaging:r("ex-packaging"),ex_labor:r("ex-labor"),ex_other:r("ex-other"),ex_notes:b("ex-notes"),online_packaging_cost:r("ex-online-packaging"),online_delivery_cost:r("ex-online-delivery"),offline_packaging_cost:r("ex-offline-packaging"),offline_delivery_cost:r("ex-offline-delivery"),n_observations:b("n-observations"),n_tomorrow:b("n-tomorrow"),n_unusual:b("n-unusual")};try{if(a.length){const{error:f}=await m.from("batches").insert(a);if(f)throw f}const{error:s}=await m.from("farm_daily_logs").upsert(g,{onConflict:"log_date"});if(s)throw s;const{error:d}=await m.from("harvest_entries").delete().eq("log_date",n);if(d)throw d;if(o.length){const{error:f}=await m.from("harvest_entries").insert(o);if(f)throw f}const{error:w}=await m.from("qc_entries").delete().eq("log_date",n);if(w)throw w;if(i.length){const{error:f}=await m.from("qc_entries").insert(i);if(f)throw f}const{error:E}=await m.from("inoculation_entries").delete().eq("log_date",n);if(E)throw E;if(u.length){const{error:f}=await m.from("inoculation_entries").insert(u);if(f)throw f}const{error:S}=await m.from("b2b_sale_entries").delete().eq("log_date",n);if(S)throw S;if(p.length){const{error:f}=await m.from("b2b_sale_entries").insert(p);if(f)throw f}const{error:C}=await m.from("fnf_sale_entries").delete().eq("log_date",n);if(C)throw C;if(h.length){const{error:f}=await m.from("fnf_sale_entries").insert(h);if(f)throw f}const{error:Y}=await m.from("sample_entries").delete().eq("log_date",n);if(Y)throw Y;if(v.length){const{error:f}=await m.from("sample_entries").insert(v);if(f)throw f}document.getElementById("ftr").style.display="none";const G=document.getElementById("wrap"),M=G.querySelector(".slide");M&&M.classList.add("out-l");const N=document.createElement("div");N.className="slide in-r",N.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,G.appendChild(N),requestAnimationFrame(()=>requestAnimationFrame(()=>N.classList.remove("in-r"))),setTimeout(()=>M?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(s){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",ke("জমা হয়নি: "+s.message,"error")}}document.getElementById("btn-next").addEventListener("click",U);document.getElementById("btn-skip").addEventListener("click",()=>{y(),t.step<I-1?(t.step++,$("next")):Q()});document.getElementById("hdr-back").addEventListener("click",K);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function Ie(){try{const{data:e}=await m.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let R=[];async function Be(){try{const{data:e}=await m.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");R=e||[]}catch{}}let k=[];async function Se(){try{const{data:e}=await m.from("batches").select("batch_number,room").eq("status","active").order("batch_number");k=e||[]}catch{}}let W=[];async function qe(){try{const{data:e}=await m.from("grain_spawn_batches").select("id,grain_type,start_date").in("status",["ready","incubating"]).order("start_date",{ascending:!1});W=e||[]}catch{}}let q=null;async function xe(e){if(q&&q.forDate===e)return q;const n=new Date(e+"T00:00:00");n.setDate(n.getDate()-1);const{data:o}=await m.from("farm_daily_logs").select("st_fresh,st_dried,st_powder").eq("log_date",x(n)).maybeSingle();return q={forDate:e,fresh:o?.st_fresh??null,dried:o?.st_dried??null,powder:o?.st_powder??null},q}async function ee(){const e=t.d["log-date"]||x(),n=await xe(e),o=_("h-fresh-a")+_("h-fresh-rej")+_("h-healthy-kg")+_("h-recovered-kg"),i=t.b2bEntryIds.reduce((s,d)=>s+c("b2b-qty-"+d),0)+t.fnfEntryIds.reduce((s,d)=>s+c("fnf-qty-"+d),0),a=t.sampleEntryIds.reduce((s,d)=>s+c("sample-fresh-"+d),0),u=t.sampleEntryIds.reduce((s,d)=>s+c("sample-dried-"+d),0),p=t.sampleEntryIds.reduce((s,d)=>s+c("sample-powder-"+d),0),h=(n.fresh??0)+o-c("pr-fresh-in")-c("s-fresh-kg")-i-a-c("s-waste-kg")+c("s-returned-kg"),v=(n.dried??0)+c("pr-dried-out")-c("pr-dried-in")-c("s-dried-kg")-u,g=(n.powder??0)+c("pr-powder-out")-c("s-powder-kg")-p;H("st-fresh",h,n.fresh),H("st-dried",v,n.dried),H("st-powder",g,n.powder)}function H(e,n,o){const i=document.getElementById("tag-"+e);if(!i)return;if(o==null){i.textContent="গতকালের Stock নেই — তুলনা করা যাচ্ছে না";return}const a=c(e)-n,u=Math.abs(a)>.5;i.innerHTML=`Expected: ${n.toFixed(2)} kg · পার্থক্য: <span style="color:${u?"var(--red)":"var(--green)"}">${a>0?"+":""}${a.toFixed(2)} kg</span>`}let te=0,ne=0;document.getElementById("wrap").addEventListener("touchstart",e=>{te=e.touches[0].clientX,ne=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-te,o=Math.abs(e.changedTouches[0].clientY-ne);Math.abs(n)>60&&o<80&&(n<0?U():K())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await oe(m);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=x(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([Ie(),Be(),Se(),qe()]),document.getElementById("wrap").innerHTML="",$("next")})();

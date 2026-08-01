import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as te}from"./index-B-jIxwbw.js";import{r as ne}from"./admin-auth-4ZiUUGs_.js";import{l as M}from"./date-utils-D3sh9T8I.js";const m=te("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{b2b:!1,fnf:!1,samples:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1,inocEntryIds:[0],inocEntryNextId:1,b2bEntryIds:[0],b2bEntryNextId:1,fnfEntryIds:[0],fnfEntryNextId:1,sampleEntryIds:[0],sampleEntryNextId:1},N=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি বা নমুনা দেওয়া হয়েছে?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],k=N.length,I=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),h=e=>parseFloat(t.d[e])||0,Y=e=>t.d[e]??"0",c=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},b=e=>t.d[e]||null;function l(e,n,i,o=.1,a=""){const d=Y(e),r=o<1?2:0,p=o<1?"decimal":"numeric",g=a?`oninput="S.d['${e}']=this.value;lc('${a}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${o},${r})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${d}" step="${o}" min="0" inputmode="${p}" ${g}/>
      <button type="button" class="cb" onclick="adj('${e}',${o},${r})">+</button>
    </div>
    <div class="card-unit">${i}</div>
    ${a?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,i){const o=document.getElementById("f-"+e);if(!o)return;const a=Math.max(0,parseFloat(o.value||0)+n);o.value=a.toFixed(i),t.d[e]=o.value,o.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&j(),e==="sale"&&G(),e==="exp"&&J(),e==="proc"&&X()};function j(){const e=U(),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function G(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([o,a])=>{const d=h(o)*h(a);n+=d;const r=document.getElementById("tag-"+o);r&&(r.textContent=d>0?"= "+I(d):"")});const i=document.getElementById("sale-tot");i&&(i.textContent=I(n))}function J(){const n=["ex-substrate","ex-packaging","ex-labor","ex-other"].reduce((o,a)=>o+h(a),0),i=document.getElementById("exp-tot");i&&(i.textContent=I(n))}function X(){const e=h("pr-fresh-in"),n=h("pr-dried-out"),i=h("pr-dried-in"),o=h("pr-powder-out"),a=document.getElementById("dry-yld"),d=document.getElementById("pow-yld");a&&(a.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),d&&(d.textContent=i>0?"পাউডার ইল্ড: "+(o/i*100).toFixed(1)+"%":"")}function se(e){const n="h-batch-"+e,i="h-flush-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">হার্ভেস্ট এন্ট্রি ${e+1}</span>
      ${t.harvestEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeHarvestEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; recomputeRooms();">
          <option value="">—</option>
          ${_.map(o=>`<option value="${o.batch_number}"${t.d[n]===o.batch_number?" selected":""}>${o.batch_number} (Room ${o.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">Flush নম্বর</div>
        <select class="sel-inline" id="f-${i}" onchange="S.d['${i}']=this.value">
          <option value="">—</option>
          ${[1,2,3,4,5].map(o=>`<option value="${o}"${t.d[i]==o?" selected":""}>${o}ম Flush</option>`).join("")}
        </select>
      </div>
      ${l("h-bags-removed-kg-"+e,"সরানো ব্যাগের ওজন","kg",.1)}
    </div>
    <div class="cg2">
      ${l("h-healthy-kg-"+e,"সুস্থ ব্যাগ থেকে","kg",.01,"h")}
      ${l("h-recovered-kg-"+e,"মোল্ড থেকে উদ্ধারকৃত","kg",.01,"h")}
    </div>
  </div>`}function R(){return t.harvestEntryIds.map(e=>se(e)).join('<div class="he-sep"></div>')}function oe(){return`<div class="cards">
    <div id="harvest-entries">${R()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){f(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=R(),j()};window.removeHarvestEntry=function(e){f(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=R(),j(),recomputeRooms()};function ie(e){const n="qc-batch-"+e,i="qc-type-"+e,o="qc-room-"+e,a=_.find(d=>d.batch_number===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">কন্টামিনেশন এন্ট্রি ${e+1}</span>
      ${t.qcEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeQcEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; renderQcEntries_(); recomputeRooms();">
          <option value="">—</option>
          ${_.map(d=>`<option value="${d.batch_number}"${t.d[n]===d.batch_number?" selected":""}>${d.batch_number} (Room ${d.room})</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="card-lbl">ধরন</div>
        <select class="sel-inline" id="f-${i}" onchange="S.d['${i}']=this.value">
          <option value="">—</option>
          <option value="bacterial"${t.d[i]==="bacterial"?" selected":""}>Bacterial</option>
          <option value="mould"${t.d[i]==="mould"?" selected":""}>Mould</option>
          <option value="trichoderma"${t.d[i]==="trichoderma"?" selected":""}>Trichoderma</option>
          <option value="unknown"${t.d[i]==="unknown"?" selected":""}>অজানা</option>
        </select>
      </div>
    </div>
    <div class="cg2" style="margin-top:8px">
      ${a?"<div></div>":`<div class="card">
        <div class="card-lbl">কোন রুম?</div>
        <select class="sel-inline" id="f-${o}" onchange="S.d['${o}']=this.value; recomputeRooms();">
          <option value="">—</option>
          <option${t.d[o]==="A"?" selected":""}>A</option>
          <option${t.d[o]==="B"?" selected":""}>B</option>
          <option${t.d[o]==="C"?" selected":""}>C</option>
        </select>
      </div>`}
      ${l("qc-bags-kg-"+e,"ক্ষতিগ্রস্ত ওজন","kg",.1)}
    </div>
    <div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function F(){return t.qcEntryIds.map(e=>ie(e)).join('<div class="he-sep"></div>')}function ae(){return`<div class="cards">
    <div id="qc-entries">${F()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){f(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=F()};window.removeQcEntry=function(e){f(),t.qcEntryIds=t.qcEntryIds.filter(n=>n!==e),document.getElementById("qc-entries").innerHTML=F(),recomputeRooms()};function ce(e){const n="inoc-batch-"+e,i=t.d[n]==="__new__",o=t.d["inoc-source-"+e]||"",a=_.map(r=>`<option value="${r.batch_number}"${t.d[n]===r.batch_number?" selected":""}>${r.batch_number} (Room ${r.room})</option>`).join(""),d=K.map(r=>`<option value="${r.id}"${t.d["inoc-grain-"+e]==r.id?" selected":""}>#${r.id} ${r.grain_type||""} (${r.start_date})</option>`).join("");return`<div class="he-block">
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
          <option value="__new__"${i?" selected":""}>+ নতুন Batch</option>
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
    ${i?`<div class="cg2" style="margin-top:8px">
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
          <option value="purchased"${o==="purchased"?" selected":""}>কেনা</option>
          <option value="inhouse"${o==="inhouse"?" selected":""}>নিজস্ব (In-house)</option>
        </select>
      </div>
    </div>
    ${o==="inhouse"?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">কোন Grain Spawn ব্যবহার হয়েছে?</div>
      <select class="sel-inline" id="f-inoc-grain-${e}" onchange="S.d['inoc-grain-${e}']=this.value">
        <option value="">—</option>
        ${d}
      </select>
    </div>`:""}
  </div>`}function A(){return t.inocEntryIds.map(e=>ce(e)).join('<div class="he-sep"></div>')}function re(){return`<div class="cards">
    <div id="inoc-entries">${A()}</div>
    <button type="button" class="he-add" onclick="addInocEntry()">+ আরেকটি রুম/Batch-এর Inoculation যোগ করুন</button>
  </div>`}window.addInocEntry=function(){f(),t.inocEntryIds.push(t.inocEntryNextId++),document.getElementById("inoc-entries").innerHTML=A()};window.removeInocEntry=function(e){f(),t.inocEntryIds=t.inocEntryIds.filter(n=>n!==e),document.getElementById("inoc-entries").innerHTML=A(),recomputeRooms()};function de(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো</div>
    <div class="cg2">
      ${l("pr-fresh-in","Dryer-এ দেওয়া","kg",.1,"proc")}
      ${l("pr-dried-out","শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="dry-yld"></div>
    ${l("pr-dried-reject-kg","নষ্ট (পোড়া/ছত্রাক)","kg",.1)}
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${l("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${l("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    ${l("pr-powder-reject-kg","নষ্ট পাউডার","kg",.1)}
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function le(){return`<div class="cards">
    <div class="sec-lbl">খুচরা বিক্রি (B2B, বন্ধু-পরিবার ও নমুনা বাদে)</div>
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([i,o,a,d])=>`
    <div class="sec-lbl">${a}</div>
    <div class="cg2">
      ${l(i,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${o}',-${d},0)">−</button>
          <input type="number" id="f-${o}" class="ci sm" value="${Y(o)}" step="${d}" min="0" inputmode="numeric" oninput="S.d['${o}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${o}',${d},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${i}"></div>
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
      <div id="b2b-entries">${T()}</div>
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
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি বিনামূল্যে নমুনা দেওয়া হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-samples" ${t.tog.samples?"checked":""} onchange="togC('samples',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.samples?" show":""}" id="cond-samples">
      <div style="font-size:11px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
      <div id="sample-entries">${D()}</div>
      <button type="button" class="he-add" onclick="addSampleEntry()">+ আরেকটি নমুনা এন্ট্রি যোগ করুন</button>
    </div>
  </div>`}function ue(e){const n="b2b-name-"+e,i="b2b-name-other-"+e,o=t.d[n]&&!H.some(a=>a.business_name===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">B2B এন্ট্রি ${e+1}</span>
      ${t.b2bEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeB2bEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">B2B Client</div>
        <select class="sel-inline" id="f-b2b-select-${e}" onchange="onB2BBuyerChange(this,${e})">
          <option value="">—</option>
          ${H.map(a=>`<option value="${a.business_name}"${t.d[n]===a.business_name?" selected":""}>${a.business_name}${a.contact_name?` (${a.contact_name})`:""}</option>`).join("")}
          <option value="__other__"${o?" selected":""}>অন্য কেউ…</option>
        </select>
      </div>
      ${l("b2b-qty-"+e,"পরিমাণ","kg",.1)}
      ${l("b2b-value-"+e,"মূল্য","৳",100)}
    </div>
    ${o?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">নাম লিখুন</div>
      <input class="ci-txt" type="text" id="f-${i}" value="${t.d[i]||""}" placeholder="ব্যবসার নাম" oninput="S.d['${i}']=this.value; S.d['${n}']=this.value;"/>
    </div>`:""}
  </div>`}function T(){return t.b2bEntryIds.map(e=>ue(e)).join('<div class="he-sep"></div>')}function pe(){f(),document.getElementById("b2b-entries").innerHTML=T()}window.addB2bEntry=function(){f(),t.b2bEntryIds.push(t.b2bEntryNextId++),document.getElementById("b2b-entries").innerHTML=T()};window.removeB2bEntry=function(e){f(),t.b2bEntryIds=t.b2bEntryIds.filter(n=>n!==e),document.getElementById("b2b-entries").innerHTML=T()};window.onB2BBuyerChange=function(e,n){const i="b2b-name-"+n;t.d[i]=e.value==="__other__"?t.d["b2b-name-other-"+n]||"":e.value,pe()};function ve(e){return`<div class="he-block">
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
  </div>`}function P(){return t.fnfEntryIds.map(e=>ve(e)).join('<div class="he-sep"></div>')}window.addFnfEntry=function(){f(),t.fnfEntryIds.push(t.fnfEntryNextId++),document.getElementById("fnf-entries").innerHTML=P()};window.removeFnfEntry=function(e){f(),t.fnfEntryIds=t.fnfEntryIds.filter(n=>n!==e),document.getElementById("fnf-entries").innerHTML=P()};function me(e){return`<div class="he-block">
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
  </div>`}function D(){return t.sampleEntryIds.map(e=>me(e)).join('<div class="he-sep"></div>')}window.addSampleEntry=function(){f(),t.sampleEntryIds.push(t.sampleEntryNextId++),document.getElementById("sample-entries").innerHTML=D()};window.removeSampleEntry=function(e){f(),t.sampleEntryIds=t.sampleEntryIds.filter(n=>n!==e),document.getElementById("sample-entries").innerHTML=D()};function he(){const e=[["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-other","অন্যান্য"]],n=[];for(let i=0;i<e.length;i+=2)n.push(`<div class="cg2">
      ${l(e[i][0],e[i][1],"৳",100,"exp")}
      ${i+1<e.length?l(e[i+1][0],e[i+1][1],"৳",100,"exp"):"<div></div>"}
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
  </div>`}function be(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const fe={harvest:oe,qc:ae,spawn:re,processing:de,sales:le,expenses:he,notes:be};function ge(e){if(e.type==="rooms"){const n=t.d["log-date"]||M();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=U(),i=h("s-fresh-kg")*h("s-fresh-price")+h("s-dried-kg")*h("s-dried-price")+h("s-powder-kg")*h("s-powder-price")+t.b2bEntryIds.reduce((r,p)=>r+h("b2b-value-"+p),0)+t.fnfEntryIds.reduce((r,p)=>r+h("fnf-value-"+p),0)-h("s-returned-value"),o=["ex-substrate","ex-packaging","ex-labor","ex-other","ex-online-packaging","ex-online-delivery","ex-offline-packaging","ex-offline-delivery"].reduce((r,p)=>r+h(p),0),a=i-o,d=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",i>0?I(i):"—","g"],["মোট খরচ",o>0?I(o):"—","r"]].map(([r,p,g])=>`<div class="sum-row"><span class="sum-k">${r}</span><span class="sum-v${g?" "+g:""}">${p}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${d}
        <div class="net-box ${a>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${I(a)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(fe[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function $(e="next"){const n=N[t.step],i=document.getElementById("wrap"),o=t.step===k-1,a=n.type==="yn"&&t.phase[n.id]==="form",d=n.type==="yn"&&!a;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+k,document.getElementById("prog-bar").style.width=(t.step+1)/k*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const r=document.getElementById("btn-next");r.textContent=o?"Submit করুন ✓":"পরবর্তী →",r.className="btn-next"+(o?" sub":""),r.disabled=!1,document.getElementById("btn-skip").style.display=d||n.type==="summary"?"none":"";const p=document.createElement("div"),g=i.querySelector(".slide");p.className=g?"slide "+(e==="back"?"in-l":"in-r"):"slide",p.innerHTML=ge(n),i.appendChild(p),g&&(g.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>g.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>p.classList.remove("in-r","in-l"))),n.id==="harvest"&&a&&j(),n.id==="sales"&&a&&G(),n.id==="expenses"&&a&&J(),n.id==="processing"&&a&&X(),setTimeout(()=>{const q=p.querySelector('input[type="number"],input[type="text"],textarea');q&&q.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[N[t.step].id]="form",$("next")};window.ansNo=function(){t.step<k-1?(t.step++,$("next")):O()};function V(){f(),t.step<k-1?(t.step++,$("next")):O()}function Z(){f();const e=N[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],$("back");return}t.step>0&&(t.step--,$("back"))}function f(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(i=>{const o=i.id.slice(2);i.tagName==="SELECT"?i.value&&(t.d[o]=i.value):i.type==="checkbox"||(t.d[o]=i.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({b2b:"tog-b2b",fnf:"tog-fnf",samples:"tog-samples"}).forEach(([i,o])=>{const a=document.getElementById(o);a&&(t.tog[i]=a.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["h-batch-"+n]);i&&e.add(i.room)}),t.qcEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["qc-batch-"+n]);i?e.add(i.room):t.d["qc-room-"+n]&&e.add(t.d["qc-room-"+n])}),t.inocEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["inoc-batch-"+n]);i&&e.add(i.room),t.d["inoc-newroom-"+n]&&e.add(t.d["inoc-newroom-"+n])}),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const i={b2b:"cond-b2b",fnf:"cond-fnf",samples:"cond-samples"},o=document.getElementById(i[e]);o&&o.classList.toggle("show",n.checked)};let C=null;async function ye(){if(C!=null)return C;const{data:e}=await m.from("batches").select("batch_number");let n=0;return(e||[]).forEach(i=>{const o=parseInt((i.batch_number||"").split("-")[0],10);!isNaN(o)&&o>n&&(n=o)}),C=n+1,C}window.onInocNewBatchRoomChange=async function(e,n){const i=e.value,o=document.getElementById("inoc-newbatch-preview-"+n);if(!i){o.textContent="—",t.d["inoc-newroom-"+n]="",t.d["inoc-newbatch-number-"+n]="";return}o.textContent="হিসাব করা হচ্ছে…";const d=`${await ye()}-${i}`;o.textContent=d,t.d["inoc-newroom-"+n]=i,t.d["inoc-newbatch-number-"+n]=d,recomputeRooms()};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function _e(e,n="info"){const i=document.getElementById("toast-stack"),o=document.createElement("div");o.className=`toast ${n}`,o.textContent=e,i.appendChild(o),requestAnimationFrame(()=>o.classList.add("show")),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>o.remove(),300)},3e3)}function E(e){return t.harvestEntryIds.reduce((n,i)=>n+h(e+"-"+i),0)}function U(){return E("h-fresh-a")+E("h-fresh-rej")+E("h-healthy-kg")+E("h-recovered-kg")}async function O(){f();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||M(),i=t.harvestEntryIds.map(s=>{const u=b("h-batch-"+s),y=_.find(w=>w.batch_number===u);return{log_date:n,batch_number:u||null,room:y?y.room:null,flush_num:c("h-flush-"+s),fresh_a_kg:c("h-fresh-a-"+s),fresh_rej_kg:c("h-fresh-rej-"+s),healthy_kg:c("h-healthy-kg-"+s),recovered_kg:c("h-recovered-kg-"+s),bags_removed_kg:c("h-bags-removed-kg-"+s)}}).filter(s=>s.batch_number||s.fresh_a_kg||s.fresh_rej_kg||s.healthy_kg||s.recovered_kg||s.bags_removed_kg),o=t.qcEntryIds.map(s=>{const u=b("qc-batch-"+s),y=_.find(w=>w.batch_number===u);return{log_date:n,batch_number:u||null,room:y?y.room:b("qc-room-"+s),contam_type:b("qc-type-"+s),bags_kg:c("qc-bags-kg-"+s),action:b("qc-action-"+s)}}).filter(s=>s.batch_number||s.room||s.contam_type||s.bags_kg||s.action),a=t.inocEntryIds.filter(s=>t.d["inoc-batch-"+s]==="__new__"&&t.d["inoc-newbatch-number-"+s]).map(s=>({batch_number:t.d["inoc-newbatch-number-"+s],room:t.d["inoc-newroom-"+s],spawn_date:n,substrate_type:b("inoc-subtype-"+s),status:"active"})),d=t.inocEntryIds.map(s=>{const u=t.d["inoc-batch-"+s],y=u==="__new__",w=y?t.d["inoc-newbatch-number-"+s]:u,B=y?null:_.find(S=>S.batch_number===w);return{log_date:n,batch_number:w||null,room:y?t.d["inoc-newroom-"+s]:B?B.room:null,substrate_type:b("inoc-subtype-"+s),substrate_kg:c("inoc-substrate-kg-"+s),bags_count:c("inoc-bags-"+s),bags_discarded:c("inoc-bags-discarded-"+s),spawn_kg_used:c("inoc-spawn-kg-"+s),spawn_source:b("inoc-source-"+s),grain_spawn_batch_id:b("inoc-source-"+s)==="inhouse"&&b("inoc-grain-"+s)||null}}).filter(s=>s.batch_number||s.substrate_kg||s.bags_count||s.spawn_kg_used),r=t.b2bEntryIds.map(s=>({log_date:n,business_name:b("b2b-name-"+s),qty:c("b2b-qty-"+s),value:c("b2b-value-"+s)})).filter(s=>s.business_name||s.qty||s.value),p=t.fnfEntryIds.map(s=>({log_date:n,person_name:b("fnf-name-"+s),qty:c("fnf-qty-"+s),value:c("fnf-value-"+s)})).filter(s=>s.person_name||s.qty||s.value),g=t.sampleEntryIds.map(s=>({log_date:n,recipient:b("sample-recipient-"+s),fresh_kg:c("sample-fresh-"+s),dried_kg:c("sample-dried-"+s),powder_kg:c("sample-powder-"+s)})).filter(s=>s.recipient||s.fresh_kg||s.dried_kg||s.powder_kg),q={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:E("h-fresh-a"),harvest_fresh_rej:E("h-fresh-rej"),harvest_healthy_kg:E("h-healthy-kg"),harvest_recovered_kg:E("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:o.length>0,contam_kg:t.qcEntryIds.reduce((s,u)=>s+h("qc-bags-kg-"+u),0),pr_fresh_in:c("pr-fresh-in"),pr_dried_out:c("pr-dried-out"),pr_dried_in:c("pr-dried-in"),pr_powder_out:c("pr-powder-out"),pr_notes:b("pr-notes"),pr_dried_reject_kg:c("pr-dried-reject-kg"),pr_powder_reject_kg:c("pr-powder-reject-kg"),s_fresh_kg:c("s-fresh-kg"),s_fresh_price:c("s-fresh-price"),s_dried_kg:c("s-dried-kg"),s_dried_price:c("s-dried-price"),s_powder_kg:c("s-powder-kg"),s_powder_price:c("s-powder-price"),s_waste_kg:c("s-waste-kg"),s_returned_kg:c("s-returned-kg"),s_returned_value:c("s-returned-value"),s_b2b_qty:r.reduce((s,u)=>s+(+u.qty||0),0),s_b2b_value:r.reduce((s,u)=>s+(+u.value||0),0),fnf_qty:p.reduce((s,u)=>s+(+u.qty||0),0),fnf_value:p.reduce((s,u)=>s+(+u.value||0),0),sample_fresh_kg:g.reduce((s,u)=>s+(+u.fresh_kg||0),0),sample_dried_kg:g.reduce((s,u)=>s+(+u.dried_kg||0),0),sample_powder_kg:g.reduce((s,u)=>s+(+u.powder_kg||0),0),ex_substrate:c("ex-substrate"),ex_packaging:c("ex-packaging"),ex_labor:c("ex-labor"),ex_other:c("ex-other"),ex_notes:b("ex-notes"),online_packaging_cost:c("ex-online-packaging"),online_delivery_cost:c("ex-online-delivery"),offline_packaging_cost:c("ex-offline-packaging"),offline_delivery_cost:c("ex-offline-delivery"),n_observations:b("n-observations"),n_tomorrow:b("n-tomorrow"),n_unusual:b("n-unusual")};try{if(a.length){const{error:v}=await m.from("batches").insert(a);if(v)throw v}const{error:s}=await m.from("farm_daily_logs").upsert(q,{onConflict:"log_date"});if(s)throw s;const{error:u}=await m.from("harvest_entries").delete().eq("log_date",n);if(u)throw u;if(i.length){const{error:v}=await m.from("harvest_entries").insert(i);if(v)throw v}const{error:y}=await m.from("qc_entries").delete().eq("log_date",n);if(y)throw y;if(o.length){const{error:v}=await m.from("qc_entries").insert(o);if(v)throw v}const{error:w}=await m.from("inoculation_entries").delete().eq("log_date",n);if(w)throw w;if(d.length){const{error:v}=await m.from("inoculation_entries").insert(d);if(v)throw v}const{error:B}=await m.from("b2b_sale_entries").delete().eq("log_date",n);if(B)throw B;if(r.length){const{error:v}=await m.from("b2b_sale_entries").insert(r);if(v)throw v}const{error:S}=await m.from("fnf_sale_entries").delete().eq("log_date",n);if(S)throw S;if(p.length){const{error:v}=await m.from("fnf_sale_entries").insert(p);if(v)throw v}const{error:Q}=await m.from("sample_entries").delete().eq("log_date",n);if(Q)throw Q;if(g.length){const{error:v}=await m.from("sample_entries").insert(g);if(v)throw v}document.getElementById("ftr").style.display="none";const z=document.getElementById("wrap"),L=z.querySelector(".slide");L&&L.classList.add("out-l");const x=document.createElement("div");x.className="slide in-r",x.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,z.appendChild(x),requestAnimationFrame(()=>requestAnimationFrame(()=>x.classList.remove("in-r"))),setTimeout(()=>L?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(s){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",_e("জমা হয়নি: "+s.message,"error")}}document.getElementById("btn-next").addEventListener("click",V);document.getElementById("btn-skip").addEventListener("click",()=>{f(),t.step<k-1?(t.step++,$("next")):O()});document.getElementById("hdr-back").addEventListener("click",Z);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function we(){try{const{data:e}=await m.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let H=[];async function Ee(){try{const{data:e}=await m.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");H=e||[]}catch{}}let _=[];async function $e(){try{const{data:e}=await m.from("batches").select("batch_number,room").eq("status","active").order("batch_number");_=e||[]}catch{}}let K=[];async function ke(){try{const{data:e}=await m.from("grain_spawn_batches").select("id,grain_type,start_date").in("status",["ready","incubating"]).order("start_date",{ascending:!1});K=e||[]}catch{}}let W=0,ee=0;document.getElementById("wrap").addEventListener("touchstart",e=>{W=e.touches[0].clientX,ee=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-W,i=Math.abs(e.changedTouches[0].clientY-ee);Math.abs(n)>60&&i<80&&(n<0?V():Z())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:13px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await ne(m);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=M(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([we(),Ee(),$e(),ke()]),document.getElementById("wrap").innerHTML="",$("next")})();

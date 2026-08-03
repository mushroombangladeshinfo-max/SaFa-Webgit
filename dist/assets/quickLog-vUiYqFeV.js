import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as ae}from"./index-B-jIxwbw.js";import{r as ce}from"./admin-auth-4ZiUUGs_.js";import{l as N}from"./date-utils-D3sh9T8I.js";const h=ae("https://uiwmerejtrdrykqpumdu.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0"),t=window.S={step:0,d:{},rooms:[],phase:{},tog:{b2b:!1,fnf:!1,samples:!1},userEmail:"",harvestEntryIds:[0],harvestEntryNextId:1,qcEntryIds:[0],qcEntryNextId:1,inocEntryIds:[0],inocEntryNextId:1,procEntryIds:[0],procEntryNextId:1,b2bEntryIds:[0],b2bEntryNextId:1,fnfEntryIds:[0],fnfEntryNextId:1,sampleEntryIds:[0],sampleEntryNextId:1},j=[{id:"rooms",icon:"📅",title:"তারিখ",type:"rooms"},{id:"harvest",icon:"🍄",title:"Harvest",type:"yn",q:"আজকে কি Harvest হয়েছে?"},{id:"qc",icon:"🦠",title:"Contamination",type:"yn",q:"আজকে কি কোনো Contamination হয়েছে?"},{id:"spawn",icon:"🌱",title:"Spawn ও Substrate",type:"yn",q:"আজকে কি Spawn বা Substrate কাজ হয়েছে?"},{id:"processing",icon:"⚙️",title:"Processing",type:"yn",q:"আজকে কি Processing হয়েছে?"},{id:"sales",icon:"📦",title:"বিক্রি",type:"yn",q:"আজকে কি বিক্রি বা নমুনা দেওয়া হয়েছে?"},{id:"expenses",icon:"💰",title:"খরচের হিসাব",type:"yn",q:"আজকে কোনো খরচ হয়েছে?"},{id:"notes",icon:"📝",title:"নোট",type:"yn",q:"আজকের মন্তব্য দিবেন?"},{id:"summary",icon:"📋",title:"Summary",type:"summary"}],I=j.length,B=e=>"৳ "+Math.round(e||0).toLocaleString("en-BD"),b=e=>parseFloat(t.d[e])||0,U=e=>t.d[e]??"0",r=e=>{const n=parseFloat(t.d[e]);return isNaN(n)?null:n},v=e=>t.d[e]||null;function u(e,n,i,o=.1,a=""){const l=U(e),p=o<1?2:0,c=o<1?"decimal":"numeric",y=a?`oninput="S.d['${e}']=this.value;lc('${a}')"`:`oninput="S.d['${e}']=this.value"`;return`<div class="card">
    <div class="card-lbl">${n}</div>
    <div class="ctrl">
      <button type="button" class="cb" onclick="adj('${e}',-${o},${p})">−</button>
      <input type="number" id="f-${e}" class="ci" value="${l}" step="${o}" min="0" inputmode="${c}" ${y}/>
      <button type="button" class="cb" onclick="adj('${e}',${o},${p})">+</button>
    </div>
    <div class="card-unit">${i}</div>
    ${a?`<div class="card-tag" id="tag-${e}"></div>`:""}
  </div>`}window.adj=function(e,n,i){const o=document.getElementById("f-"+e);if(!o)return;const a=Math.max(0,parseFloat(o.value||0)+n);o.value=a.toFixed(i),t.d[e]=o.value,o.dispatchEvent(new Event("input"))};window.lc=function(e){e==="h"&&T(),e==="sale"&&V(),e==="exp"&&Z(),e==="proc"&&F()};function T(){const e=ee(),n=document.getElementById("ht-tot");n&&(n.textContent=e.toFixed(2)+" kg")}function V(){const e=[["s-fresh-kg","s-fresh-price"],["s-dried-kg","s-dried-price"],["s-powder-kg","s-powder-price"]];let n=0;e.forEach(([o,a])=>{const l=b(o)*b(a);n+=l;const p=document.getElementById("tag-"+o);p&&(p.textContent=l>0?"= "+B(l):"")});const i=document.getElementById("sale-tot");i&&(i.textContent=B(n))}function Z(){const n=["ex-substrate","ex-packaging","ex-labor","ex-other"].reduce((o,a)=>o+b(a),0),i=document.getElementById("exp-tot");i&&(i.textContent=B(n))}function F(){const e=t.procEntryIds.reduce((p,c)=>p+b("pr-fresh-in-"+c),0),n=t.procEntryIds.reduce((p,c)=>p+b("pr-dried-out-"+c),0),i=b("pr-dried-in"),o=b("pr-powder-out"),a=document.getElementById("dry-yld"),l=document.getElementById("pow-yld");a&&(a.textContent=e>0?"ড্রাই ইল্ড: "+(n/e*100).toFixed(1)+"%":""),l&&(l.textContent=i>0?"পাউডার ইল্ড: "+(o/i*100).toFixed(1)+"%":"")}function re(e){const n="h-batch-"+e,i="h-flush-"+e;return`<div class="he-block">
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
      ${u("h-bags-removed-kg-"+e,"সরানো ব্যাগের ওজন","kg",.1)}
    </div>
    <div class="cg2">
      ${u("h-healthy-kg-"+e,"সুস্থ ব্যাগ থেকে","kg",.01,"h")}
      ${u("h-recovered-kg-"+e,"মোল্ড থেকে উদ্ধারকৃত","kg",.01,"h")}
    </div>
  </div>`}function A(){return t.harvestEntryIds.map(e=>re(e)).join('<div class="he-sep"></div>')}function de(){return`<div class="cards">
    <div id="harvest-entries">${A()}</div>
    <button type="button" class="he-add" onclick="addHarvestEntry()">+ আরেকটি Batch-এর Harvest যোগ করুন</button>
    <div class="tot"><span class="tot-lbl">মোট তাজা (সব Batch)</span><span class="tot-val" id="ht-tot">0.00 kg</span></div>
  </div>`}window.addHarvestEntry=function(){f(),t.harvestEntryIds.push(t.harvestEntryNextId++),document.getElementById("harvest-entries").innerHTML=A(),T()};window.removeHarvestEntry=function(e){f(),t.harvestEntryIds=t.harvestEntryIds.filter(n=>n!==e),document.getElementById("harvest-entries").innerHTML=A(),T(),recomputeRooms()};function le(e){const n="qc-batch-"+e,i="qc-type-"+e,o="qc-room-"+e,a=_.find(l=>l.batch_number===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">কন্টামিনেশন এন্ট্রি ${e+1}</span>
      ${t.qcEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeQcEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg2">
      <div class="card">
        <div class="card-lbl">Batch</div>
        <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value; renderQcEntries_(); recomputeRooms();">
          <option value="">—</option>
          ${_.map(l=>`<option value="${l.batch_number}"${t.d[n]===l.batch_number?" selected":""}>${l.batch_number} (Room ${l.room})</option>`).join("")}
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
      ${u("qc-bags-kg-"+e,"ক্ষতিগ্রস্ত ওজন","kg",.1)}
    </div>
    <div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">ব্যবস্থা নেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-qc-action-${e}" value="${t.d["qc-action-"+e]||""}" placeholder="যেমন: ব্যাগ সরানো হয়েছে, রুম জীবাণুমুক্ত করা হয়েছে..." oninput="S.d['qc-action-${e}']=this.value"/>
    </div>
  </div>`}function P(){return t.qcEntryIds.map(e=>le(e)).join('<div class="he-sep"></div>')}function ue(){return`<div class="cards">
    <div id="qc-entries">${P()}</div>
    <button type="button" class="he-add" onclick="addQcEntry()">+ আরেকটি রুমের Contamination যোগ করুন</button>
  </div>`}window.addQcEntry=function(){f(),t.qcEntryIds.push(t.qcEntryNextId++),document.getElementById("qc-entries").innerHTML=P()};window.removeQcEntry=function(e){f(),t.qcEntryIds=t.qcEntryIds.filter(n=>n!==e),document.getElementById("qc-entries").innerHTML=P(),recomputeRooms()};function pe(e){const n="inoc-batch-"+e,i=t.d[n]==="__new__",o=t.d["inoc-source-"+e]||"",a=_.map(c=>`<option value="${c.batch_number}"${t.d[n]===c.batch_number?" selected":""}>${c.batch_number} (Room ${c.room})</option>`).join(""),l=te.map(c=>`<option value="${c.id}"${t.d["inoc-grain-"+e]==c.id?" selected":""}>#${c.id} ${c.grain_type||""} (${c.start_date})</option>`).join(""),p=ne.map(c=>`<option value="${c.id}"${t.d["inoc-purchase-"+e]==c.id?" selected":""}>#${c.id} ${c.supplier_name||""} (${c.purchase_date}, ${(+c.kg_purchased||0).toFixed(1)}kg)</option>`).join("");return`<div class="he-block">
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
      ${u("inoc-substrate-kg-"+e,"Substrate ওজন","kg",.5)}
      ${u("inoc-bags-"+e,"ব্যাগ সংখ্যা","টি",1)}
      ${u("inoc-bags-discarded-"+e,"বাদ দেওয়া ব্যাগ","টি",1)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${u("inoc-spawn-kg-"+e,"Spawn ব্যবহার","kg",.1)}
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
        ${l}
      </select>
    </div>`:""}
    ${o==="purchased"?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">কোন Purchase থেকে এই Spawn? (ঐচ্ছিক)</div>
      <select class="sel-inline" id="f-inoc-purchase-${e}" onchange="S.d['inoc-purchase-${e}']=this.value">
        <option value="">—</option>
        ${p}
      </select>
    </div>`:""}
  </div>`}function D(){return t.inocEntryIds.map(e=>pe(e)).join('<div class="he-sep"></div>')}function ve(){return`<div class="cards">
    <div id="inoc-entries">${D()}</div>
    <button type="button" class="he-add" onclick="addInocEntry()">+ আরেকটি রুম/Batch-এর Inoculation যোগ করুন</button>
  </div>`}window.addInocEntry=function(){f(),t.inocEntryIds.push(t.inocEntryNextId++),document.getElementById("inoc-entries").innerHTML=D()};window.removeInocEntry=function(e){f(),t.inocEntryIds=t.inocEntryIds.filter(n=>n!==e),document.getElementById("inoc-entries").innerHTML=D(),recomputeRooms()};function me(e){const n="pr-batch-"+e;return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">Dryer এন্ট্রি ${e+1}</span>
      ${t.procEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeProcessingEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="card">
      <div class="card-lbl">Batch</div>
      <select class="sel-inline" id="f-${n}" onchange="S.d['${n}']=this.value">
        <option value="">—</option>
        ${_.map(i=>`<option value="${i.batch_number}"${t.d[n]===i.batch_number?" selected":""}>${i.batch_number} (Room ${i.room})</option>`).join("")}
      </select>
    </div>
    <div class="cg2" style="margin-top:8px">
      ${u("pr-fresh-in-"+e,"Dryer-এ দেওয়া","kg",.1,"proc")}
      ${u("pr-dried-out-"+e,"শুকনো পাওয়া","kg",.1,"proc")}
    </div>
    ${u("pr-dried-reject-"+e,"নষ্ট (পোড়া/ছত্রাক)","kg",.1)}
  </div>`}function O(){return t.procEntryIds.map(e=>me(e)).join('<div class="he-sep"></div>')}window.addProcessingEntry=function(){f(),t.procEntryIds.push(t.procEntryNextId++),document.getElementById("proc-entries").innerHTML=O()};window.removeProcessingEntry=function(e){f(),t.procEntryIds=t.procEntryIds.filter(n=>n!==e),document.getElementById("proc-entries").innerHTML=O(),F()};function he(){return`<div class="cards">
    <div class="sec-lbl">তাজা → শুকনো (Batch অনুযায়ী)</div>
    <div id="proc-entries">${O()}</div>
    <button type="button" class="he-add" onclick="addProcessingEntry()">+ আরেকটি Batch-এর Drying যোগ করুন</button>
    <div class="yield-tag" id="dry-yld"></div>
    <div class="divider"></div>
    <div class="sec-lbl">শুকনো → পাউডার</div>
    <div class="cg2">
      ${u("pr-dried-in","Grinder-এ দেওয়া","kg",.1,"proc")}
      ${u("pr-powder-out","পাউডার পাওয়া","kg",.1,"proc")}
    </div>
    <div class="yield-tag" id="pow-yld"></div>
    ${u("pr-powder-reject-kg","নষ্ট পাউডার","kg",.1)}
    <div class="divider"></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">প্রসেসিং মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-pr-notes" value="${t.d["pr-notes"]||""}" placeholder="যন্ত্রপাতির অবস্থা, অস্বাভাবিকতা..." oninput="S.d['pr-notes']=this.value"/>
    </div>
  </div>`}function be(){return`<div class="cards">
    <div class="sec-lbl">খুচরা বিক্রি (B2B, বন্ধু-পরিবার ও নমুনা বাদে)</div>
    ${[["s-fresh-kg","s-fresh-price","তাজা মাশরুম",50],["s-dried-kg","s-dried-price","শুকনো মাশরুম",100],["s-powder-kg","s-powder-price","মাশরুম পাউডার",100]].map(([i,o,a,l])=>`
    <div class="sec-lbl">${a}</div>
    <div class="cg2">
      ${u(i,"পরিমাণ","kg",.1,"sale")}
      <div class="card">
        <div class="card-lbl">দাম / kg (৳)</div>
        <div class="ctrl">
          <button type="button" class="cb" onclick="adj('${o}',-${l},0)">−</button>
          <input type="number" id="f-${o}" class="ci sm" value="${U(o)}" step="${l}" min="0" inputmode="numeric" oninput="S.d['${o}']=this.value;lc('sale')"/>
          <button type="button" class="cb" onclick="adj('${o}',${l},0)">+</button>
        </div>
        <div class="card-unit">৳/kg</div>
        <div class="card-tag" id="tag-${i}"></div>
      </div>
    </div>
    ${i==="s-fresh-kg"?`<div class="cg2">${L("s-fresh-batch",t.d["s-fresh-batch"])}<div></div></div>`:""}`).join("")}
    <div class="tot"><span class="tot-lbl">মোট বিক্রয়</span><span class="tot-val" id="sale-tot">৳ 0</span></div>
    <div class="divider"></div>
    <div class="cg3">
      ${u("s-waste-kg","নষ্ট (Spoilage)","kg",.1)}
      ${u("s-returned-kg","ফেরত পরিমাণ","kg",.1)}
      ${u("s-returned-value","ফেরত মূল্য","৳",50)}
    </div>
    <div class="divider"></div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি B2B Order ছিল?</span>
      <label class="tog"><input type="checkbox" id="tog-b2b" ${t.tog.b2b?"checked":""} onchange="togC('b2b',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.b2b?" show":""}" id="cond-b2b">
      <div id="b2b-entries">${R()}</div>
      <button type="button" class="he-add" onclick="addB2bEntry()">+ আরেকটি B2B এন্ট্রি যোগ করুন</button>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজ বন্ধু/পরিবারকে বিক্রি হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-fnf" ${t.tog.fnf?"checked":""} onchange="togC('fnf',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.fnf?" show":""}" id="cond-fnf">
      <div id="fnf-entries">${Q()}</div>
      <button type="button" class="he-add" onclick="addFnfEntry()">+ আরেকটি এন্ট্রি যোগ করুন</button>
    </div>
    <div class="tog-row">
      <span class="tog-lbl">আজকে কি বিনামূল্যে নমুনা দেওয়া হয়েছে?</span>
      <label class="tog"><input type="checkbox" id="tog-samples" ${t.tog.samples?"checked":""} onchange="togC('samples',this)"/><span class="tog-track"></span></label>
    </div>
    <div class="cond${t.tog.samples?" show":""}" id="cond-samples">
      <div style="font-size:12px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">বন্ধু-পরিবার, রেস্টুরেন্ট ট্রায়াল ইত্যাদি — খরচ হিসেবে যোগ হয় না, শুধু মার্কেটিং ভ্যালু হিসেবে ট্র্যাক করা হয়।</div>
      <div id="sample-entries">${z()}</div>
      <button type="button" class="he-add" onclick="addSampleEntry()">+ আরেকটি নমুনা এন্ট্রি যোগ করুন</button>
    </div>
  </div>`}function L(e,n){const i=_.map(o=>`<option value="${o.batch_number}"${n===o.batch_number?" selected":""}>${o.batch_number} (Room ${o.room})</option>`).join("");return`<div class="card">
    <div class="card-lbl">কোন Batch থেকে? (ঐচ্ছিক)</div>
    <select class="sel-inline" id="f-${e}" onchange="S.d['${e}']=this.value">
      <option value="">—</option>
      ${i}
    </select>
  </div>`}function fe(e){const n="b2b-name-"+e,i="b2b-name-other-"+e,o=t.d[n]&&!M.some(a=>a.business_name===t.d[n]);return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">B2B এন্ট্রি ${e+1}</span>
      ${t.b2bEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeB2bEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">B2B Client</div>
        <select class="sel-inline" id="f-b2b-select-${e}" onchange="onB2BBuyerChange(this,${e})">
          <option value="">—</option>
          ${M.map(a=>`<option value="${a.business_name}"${t.d[n]===a.business_name?" selected":""}>${a.business_name}${a.contact_name?` (${a.contact_name})`:""}</option>`).join("")}
          <option value="__other__"${o?" selected":""}>অন্য কেউ…</option>
        </select>
      </div>
      ${u("b2b-qty-"+e,"পরিমাণ","kg",.1)}
      ${u("b2b-value-"+e,"মূল্য","৳",100)}
    </div>
    ${o?`<div class="card" style="max-width:460px;width:100%;margin-top:8px">
      <div class="card-lbl">নাম লিখুন</div>
      <input class="ci-txt" type="text" id="f-${i}" value="${t.d[i]||""}" placeholder="ব্যবসার নাম" oninput="S.d['${i}']=this.value; S.d['${n}']=this.value;"/>
    </div>`:""}
    <div class="cg2" style="margin-top:8px">
      ${L("b2b-batch-"+e,t.d["b2b-batch-"+e])}
      <div></div>
    </div>
  </div>`}function R(){return t.b2bEntryIds.map(e=>fe(e)).join('<div class="he-sep"></div>')}function ge(){f(),document.getElementById("b2b-entries").innerHTML=R()}window.addB2bEntry=function(){f(),t.b2bEntryIds.push(t.b2bEntryNextId++),document.getElementById("b2b-entries").innerHTML=R()};window.removeB2bEntry=function(e){f(),t.b2bEntryIds=t.b2bEntryIds.filter(n=>n!==e),document.getElementById("b2b-entries").innerHTML=R()};window.onB2BBuyerChange=function(e,n){const i="b2b-name-"+n;t.d[i]=e.value==="__other__"?t.d["b2b-name-other-"+n]||"":e.value,ge()};function ye(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">এন্ট্রি ${e+1}</span>
      ${t.fnfEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeFnfEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="cg3">
      <div class="card">
        <div class="card-lbl">কার কাছে</div>
        <input class="ci-txt" type="text" id="f-fnf-name-${e}" value="${t.d["fnf-name-"+e]||""}" placeholder="নাম" oninput="S.d['fnf-name-${e}']=this.value"/>
      </div>
      ${u("fnf-qty-"+e,"পরিমাণ","kg",.1)}
      ${u("fnf-value-"+e,"মূল্য","৳",50)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${L("fnf-batch-"+e,t.d["fnf-batch-"+e])}
      <div></div>
    </div>
  </div>`}function Q(){return t.fnfEntryIds.map(e=>ye(e)).join('<div class="he-sep"></div>')}window.addFnfEntry=function(){f(),t.fnfEntryIds.push(t.fnfEntryNextId++),document.getElementById("fnf-entries").innerHTML=Q()};window.removeFnfEntry=function(e){f(),t.fnfEntryIds=t.fnfEntryIds.filter(n=>n!==e),document.getElementById("fnf-entries").innerHTML=Q()};function _e(e){return`<div class="he-block">
    <div class="he-head">
      <span class="he-title">নমুনা এন্ট্রি ${e+1}</span>
      ${t.sampleEntryIds.length>1?`<button type="button" class="he-remove" onclick="removeSampleEntry(${e})">✕ সরান</button>`:""}
    </div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">কাকে/কেন দেওয়া হয়েছে</div>
      <input class="ci-txt" type="text" id="f-sample-recipient-${e}" value="${t.d["sample-recipient-"+e]||""}" placeholder="যেমন: রেস্টুরেন্ট ট্রায়াল, বন্ধু-পরিবার" oninput="S.d['sample-recipient-${e}']=this.value"/>
    </div>
    <div class="cg3">
      ${u("sample-fresh-"+e,"তাজা","kg",.01)}
      ${u("sample-dried-"+e,"শুকনো","kg",.01)}
      ${u("sample-powder-"+e,"পাউডার","kg",.01)}
    </div>
    <div class="cg2" style="margin-top:8px">
      ${L("sample-batch-"+e,t.d["sample-batch-"+e])}
      <div></div>
    </div>
  </div>`}function z(){return t.sampleEntryIds.map(e=>_e(e)).join('<div class="he-sep"></div>')}window.addSampleEntry=function(){f(),t.sampleEntryIds.push(t.sampleEntryNextId++),document.getElementById("sample-entries").innerHTML=z()};window.removeSampleEntry=function(e){f(),t.sampleEntryIds=t.sampleEntryIds.filter(n=>n!==e),document.getElementById("sample-entries").innerHTML=z()};function we(){const e=[["ex-substrate","Substrate"],["ex-packaging","Packaging"],["ex-labor","শ্রমিকের মজুরি (মাঝে মাঝে প্রয়োজন হলে)"],["ex-other","অন্যান্য"]],n=[];for(let i=0;i<e.length;i+=2)n.push(`<div class="cg2">
      ${u(e[i][0],e[i][1],"৳",100,"exp")}
      ${i+1<e.length?u(e[i+1][0],e[i+1][1],"৳",100,"exp"):"<div></div>"}
    </div>`);return`<div class="cards">
    ${n.join("")}
    <div class="tot exp"><span class="tot-lbl">মোট খরচ</span><span class="tot-val" id="exp-tot">৳ 0</span></div>
    <div class="card" style="max-width:460px;width:100%">
      <div class="card-lbl">খরচের মন্তব্য</div>
      <input class="ci-txt" type="text" id="f-ex-notes" value="${t.d["ex-notes"]||""}" placeholder="অন্যান্য খরচের বিস্তারিত..." oninput="S.d['ex-notes']=this.value"/>
    </div>
    <div class="divider"></div>
    <div class="sec-lbl">চ্যানেল অনুযায়ী খরচ (ঐচ্ছিক)</div>
    <div style="font-size:12px;color:rgba(245,239,230,.38);max-width:460px;margin-bottom:8px">অনলাইন (ওয়েবসাইট) বনাম অফলাইন (সরাসরি/B2B) বিক্রির প্রকৃত প্যাকেজিং ও ডেলিভারি খরচ আলাদা রাখলে চ্যানেল-ভিত্তিক লাভ-ক্ষতি দেখা যাবে।</div>
    <div class="cg2">
      ${u("ex-online-packaging","অনলাইন প্যাকেজিং","৳",50)}
      ${u("ex-online-delivery","অনলাইন ডেলিভারি","৳",50)}
    </div>
    <div class="cg2">
      ${u("ex-offline-packaging","অফলাইন প্যাকেজিং","৳",50)}
      ${u("ex-offline-delivery","অফলাইন ডেলিভারি","৳",50)}
    </div>
  </div>`}function $e(){return`<div class="cards">
    <div class="sec-lbl">আজকের মন্তব্য / নোট</div>
    <textarea class="txt" id="f-n-observations" rows="3" placeholder="মাশরুমের অবস্থা, রঙ, গন্ধ, কোনো অস্বাভাবিক কিছু থাকলে লিখুন…" oninput="S.d['n-observations']=this.value">${t.d["n-observations"]||""}</textarea>
    <div class="sec-lbl">কালকে কী করতে হবে?</div>
    <textarea class="txt" id="f-n-tomorrow" rows="2" placeholder="Harvest, উপকরণ কেনা, Batch check…" oninput="S.d['n-tomorrow']=this.value">${t.d["n-tomorrow"]||""}</textarea>
    <div class="sec-lbl">অন্য কোনো ঘটনা (optional)</div>
    <textarea class="txt" id="f-n-unusual" rows="2" placeholder="বিদ্যুৎ বিভ্রাট, কর্মী অনুপস্থিত, কোনো দর্শনার্থী…" oninput="S.d['n-unusual']=this.value">${t.d["n-unusual"]||""}</textarea>
  </div>`}const Ee={harvest:de,qc:ue,spawn:ve,processing:he,sales:be,expenses:we,notes:$e};function ke(e){if(e.type==="rooms"){const n=t.d["log-date"]||N();return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="date-chip" id="date-chip">
        <span class="date-txt" id="date-disp">${n}</span>
        <span class="date-edit-btn" onclick="editDate()">✏️ বদলান</span>
      </div>
      <input type="date" id="date-nat" class="date-nat" value="${n}" onchange="dateChanged()"/>
      <div class="step-sub" style="color:rgba(245,239,230,.3)">রুম স্বয়ংক্রিয়ভাবে যোগ হবে Batch ও Contamination থেকে</div>`}if(e.type==="summary"){const n=ee(),i=b("s-fresh-kg")*b("s-fresh-price")+b("s-dried-kg")*b("s-dried-price")+b("s-powder-kg")*b("s-powder-price")+t.b2bEntryIds.reduce((p,c)=>p+b("b2b-value-"+c),0)+t.fnfEntryIds.reduce((p,c)=>p+b("fnf-value-"+c),0)-b("s-returned-value"),o=["ex-substrate","ex-packaging","ex-labor","ex-other","ex-online-packaging","ex-online-delivery","ex-offline-packaging","ex-offline-delivery"].reduce((p,c)=>p+b(c),0),a=i-o,l=[["তারিখ",t.d["log-date"]||"—",""],["হার্ভেস্ট রুম",t.rooms.length?t.rooms.join(", "):"—",""],["মোট তাজা",n>0?n.toFixed(2)+" kg":"—","g"],["মোট বিক্রয়",i>0?B(i):"—","g"],["মোট খরচ",o>0?B(o):"—","r"]].map(([p,c,y])=>`<div class="sum-row"><span class="sum-k">${p}</span><span class="sum-v${y?" "+y:""}">${c}</span></div>`).join("");return`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.title}</div>
      <div class="step-sub">Submit করার আগে একবার দেখুন</div>
      <div class="sum-rows">
        ${l}
        <div class="net-box ${a>=0?"pr":"ls"}">
          <div class="net-lbl">নিট লাভ / ক্ষতি (আজকের)</div>
          <div class="net-val">${B(a)}</div>
        </div>
      </div>`}return e.type==="yn"?t.phase[e.id]==="form"?`
        <div class="step-icon">${e.icon}</div>
        <div class="step-q">${e.title}</div>
        ${(Ee[e.id]||(()=>""))()}`:`
      <div class="step-icon">${e.icon}</div>
      <div class="step-q">${e.q}</div>
      <div class="yesno">
        <button type="button" class="yn yn-y" onclick="ansYes()">✓ হ্যাঁ, হয়েছে</button>
        <button type="button" class="yn yn-n" onclick="ansNo()">✕ না, হয়নি</button>
      </div>`:""}function k(e="next"){const n=j[t.step],i=document.getElementById("wrap"),o=t.step===I-1,a=n.type==="yn"&&t.phase[n.id]==="form",l=n.type==="yn"&&!a;document.getElementById("prog-title").textContent=n.title,document.getElementById("prog-count").textContent=t.step+1+"/"+I,document.getElementById("prog-bar").style.width=(t.step+1)/I*100+"%",document.getElementById("hdr-back").style.visibility=t.step===0?"hidden":"";const p=document.getElementById("btn-next");p.textContent=o?"Submit করুন ✓":"পরবর্তী →",p.className="btn-next"+(o?" sub":""),p.disabled=!1,document.getElementById("btn-skip").style.display=l||n.type==="summary"?"none":"";const c=document.createElement("div"),y=i.querySelector(".slide");c.className=y?"slide "+(e==="back"?"in-l":"in-r"):"slide",c.innerHTML=ke(n),i.appendChild(c),y&&(y.classList.add(e==="back"?"out-r":"out-l"),setTimeout(()=>y.remove(),260)),requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.remove("in-r","in-l"))),n.id==="harvest"&&a&&T(),n.id==="sales"&&a&&V(),n.id==="expenses"&&a&&Z(),n.id==="processing"&&a&&F(),setTimeout(()=>{const $=c.querySelector('input[type="number"],input[type="text"],textarea');$&&$.focus({preventScroll:!0})},280)}window.ansYes=function(){t.phase[j[t.step].id]="form",k("next")};window.ansNo=function(){t.step<I-1?(t.step++,k("next")):Y()};function K(){f(),t.step<I-1?(t.step++,k("next")):Y()}function W(){f();const e=j[t.step];if(e.type==="yn"&&t.phase[e.id]==="form"){delete t.phase[e.id],k("back");return}t.step>0&&(t.step--,k("back"))}function f(){document.querySelectorAll('.slide:last-child [id^="f-"]').forEach(i=>{const o=i.id.slice(2);i.tagName==="SELECT"?i.value&&(t.d[o]=i.value):i.type==="checkbox"||(t.d[o]=i.value||"0")});const e=document.getElementById("date-disp");e&&(t.d["log-date"]=e.textContent),Object.entries({b2b:"tog-b2b",fnf:"tog-fnf",samples:"tog-samples"}).forEach(([i,o])=>{const a=document.getElementById(o);a&&(t.tog[i]=a.checked)})}window.recomputeRooms=function(){const e=new Set;t.harvestEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["h-batch-"+n]);i&&e.add(i.room)}),t.qcEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["qc-batch-"+n]);i?e.add(i.room):t.d["qc-room-"+n]&&e.add(t.d["qc-room-"+n])}),t.inocEntryIds.forEach(n=>{const i=_.find(o=>o.batch_number===t.d["inoc-batch-"+n]);i&&e.add(i.room),t.d["inoc-newroom-"+n]&&e.add(t.d["inoc-newroom-"+n])}),t.rooms=Array.from(e)};window.togC=function(e,n){t.tog[e]=n.checked;const i={b2b:"cond-b2b",fnf:"cond-fnf",samples:"cond-samples"},o=document.getElementById(i[e]);o&&o.classList.toggle("show",n.checked)};let C=null;async function Ie(){if(C!=null)return C;const{data:e}=await h.from("batches").select("batch_number");let n=0;return(e||[]).forEach(i=>{const o=parseInt((i.batch_number||"").split("-")[0],10);!isNaN(o)&&o>n&&(n=o)}),C=n+1,C}window.onInocNewBatchRoomChange=async function(e,n){const i=e.value,o=document.getElementById("inoc-newbatch-preview-"+n);if(!i){o.textContent="—",t.d["inoc-newroom-"+n]="",t.d["inoc-newbatch-number-"+n]="";return}o.textContent="হিসাব করা হচ্ছে…";const l=`${await Ie()}-${i}`;o.textContent=l,t.d["inoc-newroom-"+n]=i,t.d["inoc-newbatch-number-"+n]=l,recomputeRooms()};window.editDate=function(){document.getElementById("date-chip").style.display="none";const e=document.getElementById("date-nat");e.style.display="block",e.focus(),e.showPicker?.()};window.dateChanged=function(){const e=document.getElementById("date-nat");t.d["log-date"]=e.value,document.getElementById("date-disp").textContent=e.value,e.style.display="none",document.getElementById("date-chip").style.display=""};function Be(e,n="info"){const i=document.getElementById("toast-stack"),o=document.createElement("div");o.className=`toast ${n}`,o.textContent=e,i.appendChild(o),requestAnimationFrame(()=>o.classList.add("show")),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>o.remove(),300)},3e3)}function E(e){return t.harvestEntryIds.reduce((n,i)=>n+b(e+"-"+i),0)}function ee(){return E("h-fresh-a")+E("h-fresh-rej")+E("h-healthy-kg")+E("h-recovered-kg")}async function Y(){f();const e=document.getElementById("btn-next");e.disabled=!0,e.textContent="Submit হচ্ছে…";const n=t.d["log-date"]||N(),i=t.harvestEntryIds.map(s=>{const d=v("h-batch-"+s),g=_.find(w=>w.batch_number===d);return{log_date:n,batch_number:d||null,room:g?g.room:null,flush_num:r("h-flush-"+s),fresh_a_kg:r("h-fresh-a-"+s),fresh_rej_kg:r("h-fresh-rej-"+s),healthy_kg:r("h-healthy-kg-"+s),recovered_kg:r("h-recovered-kg-"+s),bags_removed_kg:r("h-bags-removed-kg-"+s)}}).filter(s=>s.batch_number||s.fresh_a_kg||s.fresh_rej_kg||s.healthy_kg||s.recovered_kg||s.bags_removed_kg),o=t.procEntryIds.map(s=>{const d=v("pr-batch-"+s),g=_.find(w=>w.batch_number===d);return{log_date:n,batch_number:d||null,room:g?g.room:null,fresh_in_kg:r("pr-fresh-in-"+s),dried_out_kg:r("pr-dried-out-"+s),dried_reject_kg:r("pr-dried-reject-"+s)}}).filter(s=>s.batch_number||s.fresh_in_kg||s.dried_out_kg||s.dried_reject_kg),a=t.qcEntryIds.map(s=>{const d=v("qc-batch-"+s),g=_.find(w=>w.batch_number===d);return{log_date:n,batch_number:d||null,room:g?g.room:v("qc-room-"+s),contam_type:v("qc-type-"+s),bags_kg:r("qc-bags-kg-"+s),action:v("qc-action-"+s)}}).filter(s=>s.batch_number||s.room||s.contam_type||s.bags_kg||s.action),l=t.inocEntryIds.filter(s=>t.d["inoc-batch-"+s]==="__new__"&&t.d["inoc-newbatch-number-"+s]).map(s=>({batch_number:t.d["inoc-newbatch-number-"+s],room:t.d["inoc-newroom-"+s],spawn_date:n,substrate_type:v("inoc-subtype-"+s),status:"active"})),p=t.inocEntryIds.map(s=>{const d=t.d["inoc-batch-"+s],g=d==="__new__",w=g?t.d["inoc-newbatch-number-"+s]:d,S=g?null:_.find(q=>q.batch_number===w);return{log_date:n,batch_number:w||null,room:g?t.d["inoc-newroom-"+s]:S?S.room:null,substrate_type:v("inoc-subtype-"+s),substrate_kg:r("inoc-substrate-kg-"+s),bags_count:r("inoc-bags-"+s),bags_discarded:r("inoc-bags-discarded-"+s),spawn_kg_used:r("inoc-spawn-kg-"+s),spawn_source:v("inoc-source-"+s),grain_spawn_batch_id:v("inoc-source-"+s)==="inhouse"&&v("inoc-grain-"+s)||null,spawn_purchase_id:v("inoc-source-"+s)==="purchased"&&v("inoc-purchase-"+s)||null}}).filter(s=>s.batch_number||s.substrate_kg||s.bags_count||s.spawn_kg_used),c=t.b2bEntryIds.map(s=>({log_date:n,business_name:v("b2b-name-"+s),qty:r("b2b-qty-"+s),value:r("b2b-value-"+s),batch_number:v("b2b-batch-"+s)})).filter(s=>s.business_name||s.qty||s.value),y=t.fnfEntryIds.map(s=>({log_date:n,person_name:v("fnf-name-"+s),qty:r("fnf-qty-"+s),value:r("fnf-value-"+s),batch_number:v("fnf-batch-"+s)})).filter(s=>s.person_name||s.qty||s.value),$=t.sampleEntryIds.map(s=>({log_date:n,recipient:v("sample-recipient-"+s),fresh_kg:r("sample-fresh-"+s),dried_kg:r("sample-dried-"+s),powder_kg:r("sample-powder-"+s),batch_number:v("sample-batch-"+s)})).filter(s=>s.recipient||s.fresh_kg||s.dried_kg||s.powder_kg),ie={log_date:n,submitted_by:t.userEmail||null,harvest_fresh_a:E("h-fresh-a"),harvest_fresh_rej:E("h-fresh-rej"),harvest_healthy_kg:E("h-healthy-kg"),harvest_recovered_kg:E("h-recovered-kg"),harvest_rooms:t.rooms.length?t.rooms:null,contam_event:a.length>0,contam_kg:t.qcEntryIds.reduce((s,d)=>s+b("qc-bags-kg-"+d),0),pr_fresh_in:o.reduce((s,d)=>s+(+d.fresh_in_kg||0),0),pr_dried_out:o.reduce((s,d)=>s+(+d.dried_out_kg||0),0),pr_dried_reject_kg:o.reduce((s,d)=>s+(+d.dried_reject_kg||0),0),pr_dried_in:r("pr-dried-in"),pr_powder_out:r("pr-powder-out"),pr_notes:v("pr-notes"),pr_powder_reject_kg:r("pr-powder-reject-kg"),s_fresh_kg:r("s-fresh-kg"),s_fresh_price:r("s-fresh-price"),s_fresh_batch_number:v("s-fresh-batch"),s_dried_kg:r("s-dried-kg"),s_dried_price:r("s-dried-price"),s_powder_kg:r("s-powder-kg"),s_powder_price:r("s-powder-price"),s_waste_kg:r("s-waste-kg"),s_returned_kg:r("s-returned-kg"),s_returned_value:r("s-returned-value"),s_b2b_qty:c.reduce((s,d)=>s+(+d.qty||0),0),s_b2b_value:c.reduce((s,d)=>s+(+d.value||0),0),fnf_qty:y.reduce((s,d)=>s+(+d.qty||0),0),fnf_value:y.reduce((s,d)=>s+(+d.value||0),0),sample_fresh_kg:$.reduce((s,d)=>s+(+d.fresh_kg||0),0),sample_dried_kg:$.reduce((s,d)=>s+(+d.dried_kg||0),0),sample_powder_kg:$.reduce((s,d)=>s+(+d.powder_kg||0),0),ex_substrate:r("ex-substrate"),ex_packaging:r("ex-packaging"),ex_labor:r("ex-labor"),ex_other:r("ex-other"),ex_notes:v("ex-notes"),online_packaging_cost:r("ex-online-packaging"),online_delivery_cost:r("ex-online-delivery"),offline_packaging_cost:r("ex-offline-packaging"),offline_delivery_cost:r("ex-offline-delivery"),n_observations:v("n-observations"),n_tomorrow:v("n-tomorrow"),n_unusual:v("n-unusual")};try{if(l.length){const{error:m}=await h.from("batches").insert(l);if(m)throw m}const{error:s}=await h.from("farm_daily_logs").upsert(ie,{onConflict:"log_date"});if(s)throw s;const{error:d}=await h.from("harvest_entries").delete().eq("log_date",n);if(d)throw d;if(i.length){const{error:m}=await h.from("harvest_entries").insert(i);if(m)throw m}const{error:g}=await h.from("processing_entries").delete().eq("log_date",n);if(g)throw g;if(o.length){const{error:m}=await h.from("processing_entries").insert(o);if(m)throw m}const{error:w}=await h.from("qc_entries").delete().eq("log_date",n);if(w)throw w;if(a.length){const{error:m}=await h.from("qc_entries").insert(a);if(m)throw m}const{error:S}=await h.from("inoculation_entries").delete().eq("log_date",n);if(S)throw S;if(p.length){const{error:m}=await h.from("inoculation_entries").insert(p);if(m)throw m}const{error:q}=await h.from("b2b_sale_entries").delete().eq("log_date",n);if(q)throw q;if(c.length){const{error:m}=await h.from("b2b_sale_entries").insert(c);if(m)throw m}const{error:G}=await h.from("fnf_sale_entries").delete().eq("log_date",n);if(G)throw G;if(y.length){const{error:m}=await h.from("fnf_sale_entries").insert(y);if(m)throw m}const{error:J}=await h.from("sample_entries").delete().eq("log_date",n);if(J)throw J;if($.length){const{error:m}=await h.from("sample_entries").insert($);if(m)throw m}document.getElementById("ftr").style.display="none";const X=document.getElementById("wrap"),H=X.querySelector(".slide");H&&H.classList.add("out-l");const x=document.createElement("div");x.className="slide in-r",x.innerHTML=`<div class="ok-wrap">
      <div class="ok-icon">✅</div>
      <div class="ok-title">Log জমা হয়েছে!</div>
      <div class="ok-sub">সফলভাবে save হয়েছে।<br>Home-এ ফিরে যাচ্ছেন…</div>
    </div>`,X.appendChild(x),requestAnimationFrame(()=>requestAnimationFrame(()=>x.classList.remove("in-r"))),setTimeout(()=>H?.remove(),260),setTimeout(()=>window.location.href="home.html",2800)}catch(s){e.disabled=!1,e.textContent="আবার চেষ্টা করুন",e.className="btn-next sub",Be("জমা হয়নি: "+s.message,"error")}}document.getElementById("btn-next").addEventListener("click",K);document.getElementById("btn-skip").addEventListener("click",()=>{f(),t.step<I-1?(t.step++,k("next")):Y()});document.getElementById("hdr-back").addEventListener("click",W);document.addEventListener("keydown",e=>{e.key==="Enter"&&e.target.tagName!=="TEXTAREA"&&e.target.tagName!=="SELECT"&&(e.preventDefault(),document.getElementById("btn-next").click())});async function Se(){try{const{data:e}=await h.from("farm_daily_logs").select("s_fresh_price,s_dried_price,s_powder_price").order("log_date",{ascending:!1}).limit(1).single();if(!e)return;e.s_fresh_price&&(t.d["s-fresh-price"]=String(e.s_fresh_price)),e.s_dried_price&&(t.d["s-dried-price"]=String(e.s_dried_price)),e.s_powder_price&&(t.d["s-powder-price"]=String(e.s_powder_price))}catch{}}let M=[];async function qe(){try{const{data:e}=await h.from("b2b_pipeline").select("business_name,contact_name").eq("status","won");M=e||[]}catch{}}let _=[];async function xe(){try{const{data:e}=await h.from("batches").select("batch_number,room").eq("status","active").order("batch_number");_=e||[]}catch{}}let te=[];async function Ce(){try{const{data:e}=await h.from("grain_spawn_batches").select("id,grain_type,start_date").in("status",["ready","incubating"]).order("start_date",{ascending:!1});te=e||[]}catch{}}let ne=[];async function Ne(){try{const e=new Date;e.setDate(e.getDate()-90);const{data:n}=await h.from("spawn_purchases").select("id,supplier_name,purchase_date,kg_purchased").gte("purchase_date",N(e)).order("purchase_date",{ascending:!1});ne=n||[]}catch{}}let se=0,oe=0;document.getElementById("wrap").addEventListener("touchstart",e=>{se=e.touches[0].clientX,oe=e.touches[0].clientY},{passive:!0});document.getElementById("wrap").addEventListener("touchend",e=>{const n=e.changedTouches[0].clientX-se,i=Math.abs(e.changedTouches[0].clientY-oe);Math.abs(n)>60&&i<80&&(n<0?K():W())},{passive:!0});document.getElementById("wrap").innerHTML=`<div class="slide" style="align-items:center;justify-content:center;flex-direction:column;gap:14px">
  <div style="font-size:40px">🍄</div>
  <div style="font-size:14px;color:rgba(245,239,230,.3);font-family:'Hind Siliguri',sans-serif">লোড হচ্ছে…</div>
</div>`;document.getElementById("btn-next").disabled=!0;document.getElementById("btn-skip").style.display="none";document.getElementById("hdr-back").style.visibility="hidden";(async()=>{const e=await ce(h);if(!e){window.location.href="orders.html";return}t.userEmail=e.user.email,t.d["log-date"]=N(),t.d["s-fresh-price"]="350",t.d["s-dried-price"]="2800",t.d["s-powder-price"]="3500",await Promise.all([Se(),qe(),xe(),Ce(),Ne()]),document.getElementById("wrap").innerHTML="",k("next")})();

import{s as _}from"./supabase-CAmyaeuo.js";function B(){const t=document.getElementById("nav");if(!t)return;window.addEventListener("scroll",()=>{t.classList.toggle("scrolled",window.scrollY>56)},{passive:!0});const n=document.querySelectorAll("section[id]"),e=document.querySelectorAll(".nav-links a");n.length&&e.length&&window.addEventListener("scroll",()=>{let o="";n.forEach(r=>{window.scrollY>=r.offsetTop-80&&(o=r.id)}),e.forEach(r=>{r.classList.toggle("active",r.getAttribute("href")==="#"+o)})},{passive:!0})}function O(){const t=document.getElementById("hamburger"),n=document.getElementById("mobileMenu");!t||!n||(t.addEventListener("click",()=>{const e=t.classList.toggle("open");n.classList.toggle("open",e),document.body.style.overflow=e?"hidden":""}),document.addEventListener("click",e=>{n.classList.contains("open")&&!n.contains(e.target)&&!t.contains(e.target)&&m()}),window.addEventListener("resize",()=>{window.innerWidth>=768&&m()}))}function m(){const t=document.getElementById("hamburger"),n=document.getElementById("mobileMenu");t&&t.classList.remove("open"),n&&n.classList.remove("open"),document.body.style.overflow=""}function M(){document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",n=>{const e=document.querySelector(t.getAttribute("href"));e&&(n.preventDefault(),e.scrollIntoView({behavior:"smooth"}),m())})})}async function $(){try{const{data:t,error:n}=await _.from("products").select("id, price, discount_price, active, inventory_count").eq("active",!0);if(n||!t?.length)return;t.forEach(e=>{const o=document.querySelector(`.pl-card[data-id="${e.id}"]`);if(!o)return;const r=o.querySelector(".pl-price"),i=o.querySelector(".add-to-cart-btn"),a=o.querySelector(".pl-stock"),s=e.discount_price||e.price;r&&e.price&&(e.discount_price?r.innerHTML=`<s class="pl-price-orig">৳${e.price}</s> <span class="pl-price-disc">৳${e.discount_price}</span>`:r.textContent=`${e.price} ৳`),i&&s&&(i.dataset.price=s),a&&e.inventory_count!==void 0&&(e.inventory_count===0?(a.textContent="Out of Stock",a.style.color="#e05a2b",i&&(i.disabled=!0,i.textContent="Out of Stock")):e.inventory_count<=10&&(a.textContent="Limited Stock"))})}catch{}}function A(){const t=document.querySelectorAll(".pl-filter"),n=document.querySelectorAll(".pl-card");t.length&&t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(r=>r.classList.remove("active")),e.classList.add("active");const o=e.getAttribute("data-filter");n.forEach(r=>{const i=o==="all"||r.getAttribute("data-category")===o;r.style.display=i?"flex":"none",i&&(r.classList.remove("show"),setTimeout(()=>r.classList.add("show"),50))})})})}function D(){const t=new IntersectionObserver(e=>{e.forEach((o,r)=>{o.isIntersecting&&setTimeout(()=>{o.target.classList.add("show")},r*70)})},{threshold:.08});document.querySelectorAll(".fi").forEach(e=>t.observe(e));const n=document.getElementById("recipeVid");n&&new IntersectionObserver(o=>{o.forEach(r=>{r.isIntersecting?r.target.play().catch(i=>console.warn("[SaFa] Autoplay blocked:",i)):r.target.pause()})},{threshold:.1}).observe(n)}const p=700,S=100,w="safaCart",b="activeCoupon",L={SAFA10:"10% discount applied!",WELCOME:"Welcome discount applied!"},H=`
  <div class="cart-overlay" id="cartOverlay" onclick="window.toggleCart()"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
      <h2 class="cart-title">Your Cart</h2>
      <button class="cart-close" onclick="window.toggleCart()" aria-label="Close Cart">✕</button>
    </div>
    <div class="cart-banner-wrapper">
      <p class="cart-banner-label">Add to your order</p>
      <div class="cart-banner-track">
        <div class="cart-banner-card">
          <div class="cart-banner-img">🍄</div>
          <div class="cart-banner-info">
            <h4>Fresh Oyster</h4>
            <span>350 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Fresh Oyster',350,'fresh_oyster','1kg')">+</button>
        </div>
        <div class="cart-banner-card">
          <div class="cart-banner-img">🌿</div>
          <div class="cart-banner-info">
            <h4>Dried Oyster</h4>
            <span>280 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Dried Oyster',280,'dried_oyster','100g')">+</button>
        </div>
        <div class="cart-banner-card">
          <div class="cart-banner-img">🫙</div>
          <div class="cart-banner-info">
            <h4>Mushroom Powder</h4>
            <span>350 ৳</span>
          </div>
          <button class="cart-banner-add"
            onclick="window.addToCart('Mushroom Powder',350,'mushroom_powder','100g')">+</button>
        </div>
      </div>
    </div>
    <div class="cart-items-container"></div>
    <div class="cart-footer">
      <div class="cart-subtotal"><span>Subtotal</span><span>0 ৳</span></div>
      <button class="cart-checkout-btn"
        onclick="window.location.href='checkout.html'">
        Proceed to Checkout →
      </button>
    </div>
  </div>`;function c(){try{return JSON.parse(localStorage.getItem(w)||"{}")}catch{return{}}}function f(t){localStorage.setItem(w,JSON.stringify(t))}function z(){localStorage.removeItem(w),localStorage.removeItem(b)}function I(t,n,e,o="",r=""){const i=c();i[e]?i[e].qty+=1:i[e]={name:t,price:Number(n),qty:1,unit:o,image:r},f(i),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cart-item-added",{detail:{name:t,image:r}}))}function F(t,n){const e=c();e[t]&&(e[t].qty+=n,e[t].qty<=0&&delete e[t],f(e))}function x(){return Object.values(c()).reduce((t,n)=>t+n.qty,0)}function P(){return Object.values(c()).reduce((t,n)=>t+n.price*n.qty,0)}function y(t,n={}){typeof window.gtag=="function"&&window.gtag("event",t,n)}function R(t,n,e,o=1){y("add_to_cart",{currency:"BDT",value:n*o,items:[{item_id:e,item_name:t,price:n,quantity:o,currency:"BDT"}]})}function J(t,n,e){y("view_item",{currency:"BDT",value:e||0,items:[{item_id:t,item_name:n,price:e||0}]})}function K(t,n){y("begin_checkout",{currency:"BDT",value:t,items:n.map(([e,o])=>({item_id:e,item_name:o.name,price:o.price,quantity:o.qty}))})}function X(t,n,e){y("purchase",{transaction_id:t,currency:"BDT",value:n,items:e.map(([o,r])=>({item_id:o,item_name:r.name,price:r.price,quantity:r.qty}))})}let v=null;function g(){const t=x();if(v!==null&&t>v){const l=document.querySelector(".nav-icon");l&&(l.classList.remove("cart-bounce"),l.offsetWidth,l.classList.add("cart-bounce"))}v=t;const n=document.querySelector(".cart-items-container"),e=document.querySelector(".cart-subtotal span:last-child");if(!n)return;const o=c(),r=Object.entries(o);if(!r.length){n.innerHTML=`
      <div class="cart-empty-state"
           style="text-align:center;padding:60px 20px;opacity:0.6;">
        <p style="font-size:32px;margin-bottom:12px;">🛒</p>
        <p style="font-size:13px;letter-spacing:0.06em;
                  font-family:'Syne',sans-serif;text-transform:uppercase;">
          Your cart is empty
        </p>
        <p style="font-size:11px;margin-top:6px;opacity:0.6;">
          Add mushrooms to get started
        </p>
      </div>`,e&&(e.textContent="0 ৳");return}let i=0,a="";r.forEach(([l,u])=>{const C=u.price*u.qty;i+=C,a+=`
      <div class="cart-item" style="
        display:flex;justify-content:space-between;align-items:center;
        padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:500;color:#f5efe6;
                      margin-bottom:8px;line-height:1.3;">${u.name}</div>
          <div style="display:flex;align-items:center;gap:12px;">

            <!-- Qty stepper -->
            <div style="display:flex;align-items:center;
              background:rgba(255,255,255,0.05);
              border:1px solid rgba(255,255,255,0.1);
              border-radius:4px;overflow:hidden;">
              <button
                onclick="window.updateQuantity('${l}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:#f5efe6;cursor:pointer;
                       width:28px;height:28px;font-size:16px;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:24px;text-align:center;
                           color:#f5efe6;">${u.qty}</span>
              <button
                onclick="window.updateQuantity('${l}', 1)"
                aria-label="Increase quantity"
                style="background:none;border:none;color:#f5efe6;cursor:pointer;
                       width:28px;height:28px;font-size:16px;transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">+</button>
            </div>

            ${u.unit?`<span style="font-size:10px;color:rgba(245,239,230,0.4);
                              text-transform:uppercase;letter-spacing:0.08em;">
                   ${u.unit}</span>`:""}
          </div>
        </div>

        <!-- Line total -->
        <div style="font-weight:600;color:#d9b254;font-size:15px;
                    margin-left:12px;white-space:nowrap;">
          ${C.toLocaleString()} ৳
        </div>
      </div>`});const s=p-i,d=Math.min(i/p*100,100),k=`
    <div style="margin-bottom:20px;background:rgba(196,154,60,0.05);
                padding:14px 16px;border-radius:8px;
                border:1px solid rgba(196,154,60,0.15);">
      <p style="font-size:11px;margin-bottom:10px;
                color:rgba(245,239,230,0.8);text-align:center;
                line-height:1.5;">${s>0?`Add <strong style="color:#d9b254;">${s} ৳</strong> more for
       <strong style="color:#d9b254;">Free Shipping</strong>`:`🎉 You've unlocked <strong style="color:#5fcf80;">Free Shipping!</strong>`}</p>
      <div style="width:100%;height:3px;background:rgba(255,255,255,0.08);
                  border-radius:10px;overflow:hidden;">
        <div style="
          width:${d}%;height:100%;
          background:${d>=100?"#5fcf80":"#d9b254"};
          border-radius:10px;
          transition:width 0.4s cubic-bezier(0.4,0,0.2,1);
        "></div>
      </div>
    </div>`,q=`
    <div style="margin-top:16px;padding-top:16px;
                border-top:1px solid rgba(255,255,255,0.06);
                font-size:11px;color:rgba(245,239,230,0.5);
                text-align:center;line-height:1.6;">
      🏷️ কুপন কোড চেকআউটে দিন
    </div>`;n.innerHTML=k+a+q,e&&(e.textContent=i.toLocaleString()+" ৳")}function V(){const t=document.getElementById("cartOverlay"),n=document.getElementById("cartDrawer");!t||!n||(t.classList.add("active"),n.classList.add("active"),document.body.style.overflow="hidden")}function j(){const t=document.getElementById("cartOverlay"),n=document.getElementById("cartDrawer");if(!t||!n)return;const e=n.classList.toggle("active");t.classList.toggle("active",e),document.body.style.overflow=e?"hidden":""}function N(){const t=document.getElementById("cartCoupon"),n=document.getElementById("couponMsg");if(!t||!n)return;const e=t.value.trim().toUpperCase();n.style.display="block",L[e]?(n.textContent="✓ "+L[e],n.style.color="#5fcf80",localStorage.setItem(b,e)):(n.textContent="✕ Invalid or expired coupon code.",n.style.color="#d0724f",localStorage.removeItem(b))}function Q(){document.getElementById("cartDrawer")||document.body.insertAdjacentHTML("afterbegin",H),g()}function E(){const t=document.getElementById("orderItems"),n=document.getElementById("emptyCart");if(!t)return;const e=c(),o=Object.entries(e);if(!o.length){t.innerHTML="",n&&(n.style.display="block"),h(0);return}n&&(n.style.display="none");let r=0;t.innerHTML=o.map(([i,a])=>{const s=a.price*a.qty;r+=s;const d=!!a.image;return`
      <div class="order-item">
        <!-- Thumbnail -->
        <div class="item-icon"
             style="overflow:hidden;padding:0;
                    border:1px solid rgba(255,255,255,.07);">
          ${d?`<img src="${a.image}" alt="${a.name}"
              style="width:100%;height:100%;object-fit:cover;
                     border-radius:7px;display:block;"
              onerror="this.style.display='none';
                       this.nextElementSibling.style.display='flex'">`:""}${`<span style="display:${d?"none":"flex"};
      width:100%;height:100%;align-items:center;
      justify-content:center;font-size:20px;">🍄</span>`}
        </div>

        <!-- Name + qty stepper -->
        <div style="flex:1;min-width:0;">
          <div class="item-name">${a.name}</div>
          <div style="display:flex;align-items:center;
                      gap:12px;margin-top:6px;">
            <div style="display:flex;align-items:center;
              background:rgba(255,255,255,.05);
              border:1px solid rgba(255,255,255,.1);
              border-radius:4px;overflow:hidden;">
              <button onclick="window.updateCheckoutQty('${i}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:22px;text-align:center;
                           font-family:'Syne',sans-serif;
                           color:var(--c);">${a.qty}</span>
              <button onclick="window.updateCheckoutQty('${i}', 1)"
                aria-label="Increase quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">+</button>
            </div>
            <span class="item-meta">${a.unit||"Pack"}</span>
          </div>
        </div>

        <!-- Line total -->
        <div class="item-price">৳${s.toLocaleString()}</div>
      </div>`}).join(""),h(r)}function h(t){const n=t>=p||t===0?0:S,e=t+n,o=document.getElementById("subtotalVal"),r=document.getElementById("deliveryVal"),i=document.getElementById("totalVal"),a=document.getElementById("freeDeliveryBadge");if(o&&(o.textContent="৳"+t.toLocaleString()),r&&(r.textContent=n===0?"Free 🎉":"৳"+n),i&&(i.textContent="৳"+e.toLocaleString()),a){const s=t>=p&&t>0;a.style.display=s?"flex":"none"}}function Y(t,n){const e=c();e[t]&&(e[t].qty+=n,e[t].qty<=0&&delete e[t],f(e),E(),g())}function W(){const t=document.querySelectorAll(".add-to-cart-btn");t.length&&(t.forEach(n=>{n.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();const o=this.dataset.name||"Product",r=parseInt(this.dataset.price,10)||0,i=this.dataset.id||"product_"+Date.now(),a=this.dataset.unit||"",s=this.dataset.image||"";if(!r){console.warn("[SaFa] add-to-cart: missing data-price on",this);return}I(o,r,i,a,s),R(o,r,i),g(),V();const d=this.innerHTML;this.innerHTML="✓ Added!",this.style.background="var(--g500, #2a5040)",this.style.color="#fff",setTimeout(()=>{this.innerHTML=d,this.style.background="",this.style.color=""},1400)})}),console.log(`[SaFa] Wired ${t.length} add-to-cart button(s)`))}function G(t,n){let e=document.getElementById("toast-container");e||(e=document.createElement("div"),e.id="toast-container",document.body.appendChild(e));const o=document.createElement("div");o.className="safa-toast";const r=n?`<img src="${n}" alt="${t}" class="toast-img" onerror="this.outerHTML='<div class=\\'toast-img\\'>🍄</div>'">`:'<div class="toast-img">🍄</div>';o.innerHTML=`
    ${r}
    <div class="toast-content">
      <span class="toast-title">✓ Added to Cart</span>
      <span class="toast-desc">${t}</span>
    </div>
  `,e.appendChild(o),o.offsetWidth,o.classList.add("show"),setTimeout(()=>{o.classList.remove("show"),setTimeout(()=>o.remove(),400)},3e3)}typeof window<"u"&&window.addEventListener("cart-item-added",t=>{G(t.detail.name,t.detail.image)});window.addToCart=I;window.updateQuantity=(t,n)=>{F(t,n),g()};window.toggleCart=j;window.applyCoupon=N;window.updateCheckoutQty=Y;window.closeMenu=m;window.playRV=function(){const t=document.getElementById("recipeVid"),n=document.getElementById("rvOverlay");!t||!n||(n.classList.add("hidden"),t.play())};window.getCart=c;window.saveCart=f;window.clearCart=z;window.getCartCount=x;window.getCartTotal=P;window.renderItems=E;window.updateTotals=h;window.renderCartDrawer=g;window.FREE_SHIPPING_THRESHOLD=p;window.DELIVERY_FEE=S;document.addEventListener("DOMContentLoaded",()=>{B(),O(),M(),Q(),A(),D(),W(),E(),$();const t=document.querySelector(".nav-dot");if(t){const n=x();t.style.display=n>0?"block":"none"}});export{K as a,X as b,J as t};

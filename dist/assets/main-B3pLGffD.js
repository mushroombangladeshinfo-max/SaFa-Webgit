(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();function O(){const t=document.getElementById("nav");if(!t)return;window.addEventListener("scroll",()=>{t.classList.toggle("scrolled",window.scrollY>56)},{passive:!0});const e=document.querySelectorAll("section[id]"),o=document.querySelectorAll(".nav-links a");e.length&&o.length&&window.addEventListener("scroll",()=>{let i="";e.forEach(n=>{window.scrollY>=n.offsetTop-80&&(i=n.id)}),o.forEach(n=>{n.classList.toggle("active",n.getAttribute("href")==="#"+i)})},{passive:!0})}function M(){const t=document.getElementById("hamburger"),e=document.getElementById("mobileMenu");!t||!e||(t.addEventListener("click",()=>{const o=t.classList.toggle("open");e.classList.toggle("open",o),document.body.style.overflow=o?"hidden":""}),document.addEventListener("click",o=>{e.classList.contains("open")&&!e.contains(o.target)&&!t.contains(o.target)&&g()}),window.addEventListener("resize",()=>{window.innerWidth>=768&&g()}))}function g(){const t=document.getElementById("hamburger"),e=document.getElementById("mobileMenu");t&&t.classList.remove("open"),e&&e.classList.remove("open"),document.body.style.overflow=""}function q(){document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",e=>{const o=document.querySelector(t.getAttribute("href"));o&&(e.preventDefault(),o.scrollIntoView({behavior:"smooth"}),g())})})}function A(){const t=document.querySelectorAll(".pl-filter"),e=document.querySelectorAll(".pl-card");t.length&&t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("active")),o.classList.add("active");const i=o.getAttribute("data-filter");e.forEach(n=>{const r=i==="all"||n.getAttribute("data-category")===i;n.style.display=r?"flex":"none",r&&(n.classList.remove("show"),setTimeout(()=>n.classList.add("show"),50))})})})}function B(){const t=new IntersectionObserver(o=>{o.forEach((i,n)=>{i.isIntersecting&&setTimeout(()=>{i.target.classList.add("show")},n*70)})},{threshold:.08});document.querySelectorAll(".fi").forEach(o=>t.observe(o));const e=document.getElementById("recipeVid");e&&new IntersectionObserver(i=>{i.forEach(n=>{n.isIntersecting?n.target.play().catch(r=>console.warn("[SaFa] Autoplay blocked:",r)):n.target.pause()})},{threshold:.1}).observe(e)}const p=500,k=60,h="safaCart",b="activeCoupon",L={SAFA10:"10% discount applied!",WELCOME:"Welcome discount applied!"},$=`
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
  </div>`;function c(){try{return JSON.parse(localStorage.getItem(h)||"{}")}catch{return{}}}function f(t){localStorage.setItem(h,JSON.stringify(t))}function D(){localStorage.removeItem(h),localStorage.removeItem(b)}function I(t,e,o,i="",n=""){const r=c();r[o]?r[o].qty+=1:r[o]={name:t,price:Number(e),qty:1,unit:i,image:n},f(r),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cart-item-added",{detail:{name:t,image:n}}))}function H(t,e){const o=c();o[t]&&(o[t].qty+=e,o[t].qty<=0&&delete o[t],f(o))}function w(){return Object.values(c()).reduce((t,e)=>t+e.qty,0)}function z(){return Object.values(c()).reduce((t,e)=>t+e.price*e.qty,0)}let y=null;function m(){const t=w();if(y!==null&&t>y){const l=document.querySelector(".nav-icon");l&&(l.classList.remove("cart-bounce"),l.offsetWidth,l.classList.add("cart-bounce"))}y=t;const e=document.querySelector(".cart-items-container"),o=document.querySelector(".cart-subtotal span:last-child");if(!e)return;const i=c(),n=Object.entries(i);if(!n.length){e.innerHTML=`
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
      </div>`,o&&(o.textContent="0 ৳");return}let r=0,s="";n.forEach(([l,u])=>{const C=u.price*u.qty;r+=C,s+=`
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
      </div>`});const a=p-r,d=Math.min(r/p*100,100),E=`
    <div style="margin-bottom:20px;background:rgba(196,154,60,0.05);
                padding:14px 16px;border-radius:8px;
                border:1px solid rgba(196,154,60,0.15);">
      <p style="font-size:11px;margin-bottom:10px;
                color:rgba(245,239,230,0.8);text-align:center;
                line-height:1.5;">${a>0?`Add <strong style="color:#d9b254;">${a} ৳</strong> more for
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
    </div>`,T=`
    <div style="margin-top:20px;padding-top:18px;
                border-top:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;gap:8px;">
        <input
          type="text"
          id="cartCoupon"
          placeholder="Coupon code"
          style="flex:1;background:rgba(255,255,255,0.03);
                 border:1px solid rgba(255,255,255,0.08);
                 border-radius:4px;padding:10px 12px;
                 color:#f5efe6;font-size:12px;
                 font-family:'DM Sans',sans-serif;
                 outline:none;transition:border 0.2s;"
          onfocus="this.style.borderColor='rgba(196,154,60,0.4)'"
          onblur="this.style.borderColor='rgba(255,255,255,0.08)'"
        >
        <button
          onclick="window.applyCoupon()"
          style="background:rgba(184,92,56,0.12);color:#d0724f;
                 border:1px solid rgba(184,92,56,0.28);
                 border-radius:4px;padding:0 16px;
                 font-size:10px;font-weight:700;
                 font-family:'Syne',sans-serif;
                 text-transform:uppercase;letter-spacing:0.1em;
                 cursor:pointer;transition:all 0.2s;white-space:nowrap;"
          onmouseover="this.style.background='rgba(184,92,56,0.22)'"
          onmouseout="this.style.background='rgba(184,92,56,0.12)'"
        >Apply</button>
      </div>
      <p id="couponMsg"
         style="font-size:11px;margin-top:8px;display:none;
                font-weight:500;letter-spacing:0.04em;"></p>
    </div>`;e.innerHTML=E+s+T,o&&(o.textContent=r.toLocaleString()+" ৳")}function F(){const t=document.getElementById("cartOverlay"),e=document.getElementById("cartDrawer");!t||!e||(t.classList.add("active"),e.classList.add("active"),document.body.style.overflow="hidden")}function P(){const t=document.getElementById("cartOverlay"),e=document.getElementById("cartDrawer");if(!t||!e)return;const o=e.classList.toggle("active");t.classList.toggle("active",o),document.body.style.overflow=o?"hidden":""}function _(){const t=document.getElementById("cartCoupon"),e=document.getElementById("couponMsg");if(!t||!e)return;const o=t.value.trim().toUpperCase();e.style.display="block",L[o]?(e.textContent="✓ "+L[o],e.style.color="#5fcf80",localStorage.setItem(b,o)):(e.textContent="✕ Invalid or expired coupon code.",e.style.color="#d0724f",localStorage.removeItem(b))}function R(){document.getElementById("cartDrawer")||document.body.insertAdjacentHTML("afterbegin",$),m()}function x(){const t=document.getElementById("orderItems"),e=document.getElementById("emptyCart");if(!t)return;const o=c(),i=Object.entries(o);if(!i.length){t.innerHTML="",e&&(e.style.display="block"),v(0);return}e&&(e.style.display="none");let n=0;t.innerHTML=i.map(([r,s])=>{const a=s.price*s.qty;n+=a;const d=!!s.image;return`
      <div class="order-item">
        <!-- Thumbnail -->
        <div class="item-icon"
             style="overflow:hidden;padding:0;
                    border:1px solid rgba(255,255,255,.07);">
          ${d?`<img src="${s.image}" alt="${s.name}"
              style="width:100%;height:100%;object-fit:cover;
                     border-radius:7px;display:block;"
              onerror="this.style.display='none';
                       this.nextElementSibling.style.display='flex'">`:""}${`<span style="display:${d?"none":"flex"};
      width:100%;height:100%;align-items:center;
      justify-content:center;font-size:20px;">🍄</span>`}
        </div>

        <!-- Name + qty stepper -->
        <div style="flex:1;min-width:0;">
          <div class="item-name">${s.name}</div>
          <div style="display:flex;align-items:center;
                      gap:12px;margin-top:6px;">
            <div style="display:flex;align-items:center;
              background:rgba(255,255,255,.05);
              border:1px solid rgba(255,255,255,.1);
              border-radius:4px;overflow:hidden;">
              <button onclick="window.updateCheckoutQty('${r}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:22px;text-align:center;
                           font-family:'Syne',sans-serif;
                           color:var(--c);">${s.qty}</span>
              <button onclick="window.updateCheckoutQty('${r}', 1)"
                aria-label="Increase quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">+</button>
            </div>
            <span class="item-meta">${s.unit||"Pack"}</span>
          </div>
        </div>

        <!-- Line total -->
        <div class="item-price">৳${a.toLocaleString()}</div>
      </div>`}).join(""),v(n)}function v(t){const e=t>=p||t===0?0:k,o=t+e,i=document.getElementById("subtotalVal"),n=document.getElementById("deliveryVal"),r=document.getElementById("totalVal"),s=document.getElementById("freeDeliveryBadge");if(i&&(i.textContent="৳"+t.toLocaleString()),n&&(n.textContent=e===0?"Free 🎉":"৳"+e),r&&(r.textContent="৳"+o.toLocaleString()),s){const a=t>=p&&t>0;s.style.display=a?"flex":"none"}}function N(t,e){const o=c();o[t]&&(o[t].qty+=e,o[t].qty<=0&&delete o[t],f(o),x(),m())}function j(){const t=document.querySelectorAll(".add-to-cart-btn");t.length&&(t.forEach(e=>{e.addEventListener("click",function(o){o.preventDefault(),o.stopPropagation();const i=this.dataset.name||"Product",n=parseInt(this.dataset.price,10)||0,r=this.dataset.id||"product_"+Date.now(),s=this.dataset.unit||"",a=this.dataset.image||"";if(!n){console.warn("[SaFa] add-to-cart: missing data-price on",this);return}I(i,n,r,s,a),m(),F();const d=this.innerHTML;this.innerHTML="✓ Added!",this.style.background="var(--g500, #2a5040)",this.style.color="#fff",setTimeout(()=>{this.innerHTML=d,this.style.background="",this.style.color=""},1400)})}),console.log(`[SaFa] Wired ${t.length} add-to-cart button(s)`))}function V(t,e){let o=document.getElementById("toast-container");o||(o=document.createElement("div"),o.id="toast-container",document.body.appendChild(o));const i=document.createElement("div");i.className="safa-toast";const n=e?`<img src="${e}" alt="${t}" class="toast-img" onerror="this.outerHTML='<div class=\\'toast-img\\'>🍄</div>'">`:'<div class="toast-img">🍄</div>';i.innerHTML=`
    ${n}
    <div class="toast-content">
      <span class="toast-title">✓ Added to Cart</span>
      <span class="toast-desc">${t}</span>
    </div>
  `,o.appendChild(i),i.offsetWidth,i.classList.add("show"),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>i.remove(),400)},3e3)}typeof window<"u"&&window.addEventListener("cart-item-added",t=>{V(t.detail.name,t.detail.image)});window.addToCart=I;window.updateQuantity=H;window.toggleCart=P;window.applyCoupon=_;window.updateCheckoutQty=N;window.closeMenu=g;window.playRV=function(){const t=document.getElementById("recipeVid"),e=document.getElementById("rvOverlay");!t||!e||(e.classList.add("hidden"),t.play())};window.getCart=c;window.saveCart=f;window.clearCart=D;window.getCartCount=w;window.getCartTotal=z;window.renderItems=x;window.updateTotals=v;window.renderCartDrawer=m;window.FREE_SHIPPING_THRESHOLD=p;window.DELIVERY_FEE=k;document.addEventListener("DOMContentLoaded",()=>{O(),M(),q(),R(),A(),B(),j(),x();const t=document.querySelector(".nav-dot");if(t){const e=w();t.style.display=e>0?"block":"none"}});

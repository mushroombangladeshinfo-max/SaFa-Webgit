import{c as M}from"./index-DshXEMtg.js";const O="https://uiwmerejtrdrykqpumdu.supabase.co",q="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpd21lcmVqdHJkcnlrcXB1bWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzQ1MjIsImV4cCI6MjA5MTM1MDUyMn0.bF1GPeGFhAphNFG-E6MfZCrZihT3iTeCFIDi6g3w0n0",W=M(O,q);function A(){const t=document.getElementById("nav");if(!t)return;window.addEventListener("scroll",()=>{t.classList.toggle("scrolled",window.scrollY>56)},{passive:!0});const e=document.querySelectorAll("section[id]"),n=document.querySelectorAll(".nav-links a");e.length&&n.length&&window.addEventListener("scroll",()=>{let r="";e.forEach(o=>{window.scrollY>=o.offsetTop-80&&(r=o.id)}),n.forEach(o=>{o.classList.toggle("active",o.getAttribute("href")==="#"+r)})},{passive:!0})}function B(){const t=document.getElementById("hamburger"),e=document.getElementById("mobileMenu");!t||!e||(t.addEventListener("click",()=>{const n=t.classList.toggle("open");e.classList.toggle("open",n),document.body.style.overflow=n?"hidden":""}),document.addEventListener("click",n=>{e.classList.contains("open")&&!e.contains(n.target)&&!t.contains(n.target)&&g()}),window.addEventListener("resize",()=>{window.innerWidth>=768&&g()}))}function g(){const t=document.getElementById("hamburger"),e=document.getElementById("mobileMenu");t&&t.classList.remove("open"),e&&e.classList.remove("open"),document.body.style.overflow=""}function $(){document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",e=>{const n=document.querySelector(t.getAttribute("href"));n&&(e.preventDefault(),n.scrollIntoView({behavior:"smooth"}),g())})})}function D(){const t=document.querySelectorAll(".pl-filter"),e=document.querySelectorAll(".pl-card");t.length&&t.forEach(n=>{n.addEventListener("click",()=>{t.forEach(o=>o.classList.remove("active")),n.classList.add("active");const r=n.getAttribute("data-filter");e.forEach(o=>{const i=r==="all"||o.getAttribute("data-category")===r;o.style.display=i?"flex":"none",i&&(o.classList.remove("show"),setTimeout(()=>o.classList.add("show"),50))})})})}function H(){const t=new IntersectionObserver(n=>{n.forEach((r,o)=>{r.isIntersecting&&setTimeout(()=>{r.target.classList.add("show")},o*70)})},{threshold:.08});document.querySelectorAll(".fi").forEach(n=>t.observe(n));const e=document.getElementById("recipeVid");e&&new IntersectionObserver(r=>{r.forEach(o=>{o.isIntersecting?o.target.play().catch(i=>console.warn("[SaFa] Autoplay blocked:",i)):o.target.pause()})},{threshold:.1}).observe(e)}const p=500,I=60,h="safaCart",b="activeCoupon",k={SAFA10:"10% discount applied!",WELCOME:"Welcome discount applied!"},z=`
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
  </div>`;function c(){try{return JSON.parse(localStorage.getItem(h)||"{}")}catch{return{}}}function m(t){localStorage.setItem(h,JSON.stringify(t))}function F(){localStorage.removeItem(h),localStorage.removeItem(b)}function L(t,e,n,r="",o=""){const i=c();i[n]?i[n].qty+=1:i[n]={name:t,price:Number(e),qty:1,unit:r,image:o},m(i),typeof window<"u"&&window.dispatchEvent(new CustomEvent("cart-item-added",{detail:{name:t,image:o}}))}function _(t,e){const n=c();n[t]&&(n[t].qty+=e,n[t].qty<=0&&delete n[t],m(n))}function w(){return Object.values(c()).reduce((t,e)=>t+e.qty,0)}function j(){return Object.values(c()).reduce((t,e)=>t+e.price*e.qty,0)}let y=null;function f(){const t=w();if(y!==null&&t>y){const l=document.querySelector(".nav-icon");l&&(l.classList.remove("cart-bounce"),l.offsetWidth,l.classList.add("cart-bounce"))}y=t;const e=document.querySelector(".cart-items-container"),n=document.querySelector(".cart-subtotal span:last-child");if(!e)return;const r=c(),o=Object.entries(r);if(!o.length){e.innerHTML=`
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
      </div>`,n&&(n.textContent="0 ৳");return}let i=0,s="";o.forEach(([l,u])=>{const C=u.price*u.qty;i+=C,s+=`
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
      </div>`});const a=p-i,d=Math.min(i/p*100,100),E=`
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
    </div>`;e.innerHTML=E+s+T,n&&(n.textContent=i.toLocaleString()+" ৳")}function R(){const t=document.getElementById("cartOverlay"),e=document.getElementById("cartDrawer");!t||!e||(t.classList.add("active"),e.classList.add("active"),document.body.style.overflow="hidden")}function V(){const t=document.getElementById("cartOverlay"),e=document.getElementById("cartDrawer");if(!t||!e)return;const n=e.classList.toggle("active");t.classList.toggle("active",n),document.body.style.overflow=n?"hidden":""}function P(){const t=document.getElementById("cartCoupon"),e=document.getElementById("couponMsg");if(!t||!e)return;const n=t.value.trim().toUpperCase();e.style.display="block",k[n]?(e.textContent="✓ "+k[n],e.style.color="#5fcf80",localStorage.setItem(b,n)):(e.textContent="✕ Invalid or expired coupon code.",e.style.color="#d0724f",localStorage.removeItem(b))}function N(){document.getElementById("cartDrawer")||document.body.insertAdjacentHTML("afterbegin",z),f()}function x(){const t=document.getElementById("orderItems"),e=document.getElementById("emptyCart");if(!t)return;const n=c(),r=Object.entries(n);if(!r.length){t.innerHTML="",e&&(e.style.display="block"),v(0);return}e&&(e.style.display="none");let o=0;t.innerHTML=r.map(([i,s])=>{const a=s.price*s.qty;o+=a;const d=!!s.image;return`
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
              <button onclick="window.updateCheckoutQty('${i}', -1)"
                aria-label="Decrease quantity"
                style="background:none;border:none;color:var(--c);
                       cursor:pointer;width:26px;height:26px;font-size:15px;
                       transition:background 0.15s;"
                onmouseover="this.style.background='rgba(255,255,255,0.08)'"
                onmouseout="this.style.background='none'">−</button>
              <span style="font-size:12px;width:22px;text-align:center;
                           font-family:'Syne',sans-serif;
                           color:var(--c);">${s.qty}</span>
              <button onclick="window.updateCheckoutQty('${i}', 1)"
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
      </div>`}).join(""),v(o)}function v(t){const e=t>=p||t===0?0:I,n=t+e,r=document.getElementById("subtotalVal"),o=document.getElementById("deliveryVal"),i=document.getElementById("totalVal"),s=document.getElementById("freeDeliveryBadge");if(r&&(r.textContent="৳"+t.toLocaleString()),o&&(o.textContent=e===0?"Free 🎉":"৳"+e),i&&(i.textContent="৳"+n.toLocaleString()),s){const a=t>=p&&t>0;s.style.display=a?"flex":"none"}}function Q(t,e){const n=c();n[t]&&(n[t].qty+=e,n[t].qty<=0&&delete n[t],m(n),x(),f())}function Y(){const t=document.querySelectorAll(".add-to-cart-btn");t.length&&(t.forEach(e=>{e.addEventListener("click",function(n){n.preventDefault(),n.stopPropagation();const r=this.dataset.name||"Product",o=parseInt(this.dataset.price,10)||0,i=this.dataset.id||"product_"+Date.now(),s=this.dataset.unit||"",a=this.dataset.image||"";if(!o){console.warn("[SaFa] add-to-cart: missing data-price on",this);return}L(r,o,i,s,a),f(),R();const d=this.innerHTML;this.innerHTML="✓ Added!",this.style.background="var(--g500, #2a5040)",this.style.color="#fff",setTimeout(()=>{this.innerHTML=d,this.style.background="",this.style.color=""},1400)})}),console.log(`[SaFa] Wired ${t.length} add-to-cart button(s)`))}function J(t,e){let n=document.getElementById("toast-container");n||(n=document.createElement("div"),n.id="toast-container",document.body.appendChild(n));const r=document.createElement("div");r.className="safa-toast";const o=e?`<img src="${e}" alt="${t}" class="toast-img" onerror="this.outerHTML='<div class=\\'toast-img\\'>🍄</div>'">`:'<div class="toast-img">🍄</div>';r.innerHTML=`
    ${o}
    <div class="toast-content">
      <span class="toast-title">✓ Added to Cart</span>
      <span class="toast-desc">${t}</span>
    </div>
  `,n.appendChild(r),r.offsetWidth,r.classList.add("show"),setTimeout(()=>{r.classList.remove("show"),setTimeout(()=>r.remove(),400)},3e3)}typeof window<"u"&&window.addEventListener("cart-item-added",t=>{J(t.detail.name,t.detail.image)});window.addToCart=L;window.updateQuantity=_;window.toggleCart=V;window.applyCoupon=P;window.updateCheckoutQty=Q;window.closeMenu=g;window.playRV=function(){const t=document.getElementById("recipeVid"),e=document.getElementById("rvOverlay");!t||!e||(e.classList.add("hidden"),t.play())};window.getCart=c;window.saveCart=m;window.clearCart=F;window.getCartCount=w;window.getCartTotal=j;window.renderItems=x;window.updateTotals=v;window.renderCartDrawer=f;window.FREE_SHIPPING_THRESHOLD=p;window.DELIVERY_FEE=I;document.addEventListener("DOMContentLoaded",()=>{A(),B(),$(),N(),D(),H(),Y(),x();const t=document.querySelector(".nav-dot");if(t){const e=w();t.style.display=e>0?"block":"none"}});export{W as s};

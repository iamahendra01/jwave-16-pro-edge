/* =========================================================
   J-Wave 16 Pro Desk — shared script
   ========================================================= */
// >>> Change the WhatsApp number here (country code + number, digits only) <<<
const WHATSAPP_NUMBER = "919872106782";
const BRAND_NAME = "J-Wave 16 Pro Edge";
const PAY_NOTE_NUMBER = "9872106782"; // shown to students for payment screenshots

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Build a wa.me link from a message */
function waLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}
/* Course message template */
function courseMessage(courseName) {
  return "Hello " + BRAND_NAME + ", I am interested in the course: " + courseName + ". Please share the details.";
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Other WhatsApp links: data-wa-message ---- */
  document.querySelectorAll("[data-wa-message]").forEach((el) => {
    el.href = waLink(el.dataset.waMessage);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  /* ---- Navbar: scroll style + mobile menu ---- */
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const topBtn = document.querySelector(".fab-top");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
    topBtn && topBtn.classList.toggle("show", window.scrollY > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.focus();
    }
  });
  topBtn && topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---- Page-load transition: fade out on internal navigation ---- */
  document.querySelectorAll('a[href$=".html"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || a.target === "_blank" || reduceMotion) return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => (window.location = a.href), 220);
    });
  });
  window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

  /* ---- Scroll reveal (staggered inside grids) ---- */
  const revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach((el) => {
    const idx = [...(el.parentElement ? el.parentElement.children : [])].indexOf(el);
    el.style.setProperty("--d", Math.min(idx, 5) * 0.09 + "s");
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Animated counters (21+, 100%) ---- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = +el.dataset.count;
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
    });
  });


  /* ---- Enroll / Pay dialog (form -> WhatsApp, QR shown only on click) ---- */
  const dlg = document.getElementById("enroll-dialog");
  if (dlg) {
    const qrPanel = document.getElementById("qr-panel");
    const payToggle = document.getElementById("pay-toggle");
    const ssBtn = document.getElementById("ss-btn");
    const form = document.getElementById("enroll-form");
    const status = document.getElementById("enroll-status");
    let course = "", price = "";
    const setQr = (show) => {
      qrPanel.hidden = !show;
      payToggle.setAttribute("aria-expanded", String(show));
      payToggle.textContent = show ? "Hide payment QR" : "Pay " + price + " via QR";
    };
    const astro = document.getElementById("astro-fields");
    const setAstro = (on) => {
      if (!astro) return;
      astro.hidden = !on;
      astro.querySelectorAll("input").forEach((i) => { i.disabled = !on; i.required = on; });
    };
    const openDlg = (c, p, mode, extra) => {
      course = c; price = p;
      setAstro(extra === "birth");
      dlg.querySelectorAll("[data-dlg-course]").forEach((n) => (n.textContent = c));
      dlg.querySelectorAll("[data-dlg-price]").forEach((n) => (n.textContent = p));
      const paymentAmount = p.toLowerCase().includes("enquiry") ? "the fee confirmed by your team" : p;
      ssBtn.href = waLink("Hello " + BRAND_NAME + ", I have paid " + paymentAmount + " for the course: " + c + ". I am sharing the payment screenshot here.");
      status.textContent = "";
      setQr(mode === "pay");
      dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
      if (mode === "pay") qrPanel.scrollIntoView({ block: "nearest" });
    };
    document.querySelectorAll("[data-open]").forEach((b) =>
      b.addEventListener("click", () => openDlg(b.dataset.course, b.dataset.price, b.dataset.open, b.dataset.extra)));
    payToggle.addEventListener("click", () => setQr(qrPanel.hidden));
    dlg.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dlg.close()));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); /* click on backdrop */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const msg = "Hello " + BRAND_NAME + ", I want to enroll in the course: " + course + " (" + price + ").\n" +
        "Name: " + d.get("name") + "\nEmail: " + d.get("email") + "\nPhone: +91 " + d.get("phone") +
        "\nAge: " + d.get("age") + "\nCity: " + d.get("city") +
        (d.get("dob") ? "\nDate of Birth: " + d.get("dob") + "\nExact Birth Time: " + d.get("birth_time") + "\nBirth Place: " + d.get("birth_place") + "\nCurrent Profession: " + d.get("profession") : "") +
        "\nPlease share the next steps.";
      window.open(waLink(msg), "_blank", "noopener");
      status.textContent = "Your details are ready in WhatsApp. Press send there. For courses with fee on enquiry, confirm the exact amount and billing cycle before paying by QR.";
    });
  }

  /* ---- Lightbox for infographics ---- */
  const lb = document.getElementById("lightbox");
  if (lb) {
    const lbImg = lb.querySelector("img"), lbCap = document.getElementById("lb-cap");
    document.querySelectorAll("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
      lbImg.src = b.dataset.zoom; lbImg.alt = b.querySelector("img").alt; lbCap.textContent = b.dataset.caption;
      lb.showModal ? lb.showModal() : lb.setAttribute("open", "");
    }));
    lb.querySelector("[data-close-lb]").addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  }

  /* ---- Contact form -> prefilled WhatsApp message (front-end only) ---- */
  const cf = document.getElementById("contact-form");
  if (cf) {
    cf.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(cf);
      const msg = "Hello " + BRAND_NAME + ", my name is " + d.get("name") + ". My mobile number is " + d.get("phone") + ". " + d.get("message");
      window.open(waLink(msg), "_blank", "noopener");
    });
  }
  /* ---- Student login: UI only ---- */
  const lf = document.getElementById("login-form");
  if (lf) lf.addEventListener("submit", (e) => { e.preventDefault(); lf.querySelector(".note").textContent = "Login portal coming soon."; });

  /* ---- Hero background: animated candlestick chart (canvas) ---- */
  const cv = document.getElementById("chart-bg");
  if (cv) {
    const ctx = cv.getContext("2d");
    let W, H, candles = [], offset = 0;
    const CW = 22, GAP = 10, STEP = CW + GAP;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(W / STEP) + 3; candles = []; let p = H * 0.62;
      for (let i = 0; i < n; i++) { p = nextCandle(p); }
    };
    function nextCandle(prev) {
      const drift = -3, o = prev, c = Math.max(H * 0.2, Math.min(H * 0.85, o + rnd(-26, 26) + drift));
      candles.push({ o, c, hi: Math.min(o, c) - rnd(4, 22), lo: Math.max(o, c) + rnd(4, 22) });
      return c;
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      candles.forEach((k, i) => {
        const x = i * STEP - offset, up = k.c < k.o, col = up ? "rgba(214,173,74," : "rgba(140,28,53,";
        ctx.strokeStyle = col + ".7)"; ctx.fillStyle = col + (up ? ".55)" : ".8)");
        ctx.beginPath(); ctx.moveTo(x + CW / 2, k.hi); ctx.lineTo(x + CW / 2, k.lo); ctx.stroke();
        ctx.fillRect(x, Math.min(k.o, k.c), CW, Math.max(Math.abs(k.c - k.o), 2));
      });
    };
    const loop = () => {
      offset += 0.35;
      if (offset >= STEP) { offset -= STEP; candles.shift(); nextCandle(candles[candles.length - 1].c); }
      draw(); requestAnimationFrame(loop);
    };
    resize(); draw();
    window.addEventListener("resize", () => { resize(); draw(); });
    if (!reduceMotion) requestAnimationFrame(loop);
  }
});

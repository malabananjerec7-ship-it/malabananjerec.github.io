

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initBootSequence(prefersReducedMotion);
  initScrollReveal(prefersReducedMotion);
  initNavToggle();
  initActiveNavOnScroll();
  initCopyEmail();
  initVCardDownload();
  document.getElementById("year").textContent = new Date().getFullYear();
});


function initBootSequence(prefersReducedMotion) {
  const el = document.getElementById("bootLine");
  if (!el) return;

  const lines = [
    "> initializing profile...",
    "> loading modules: [office] [hardware] [networking] [web] ...ok",
    "> running self-check...",
    "> status: READY"
  ];

  if (prefersReducedMotion) {
    el.textContent = lines[lines.length - 1];
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let skipped = false;
  const typeSpeed = 22; 
  const linePause = 380; 

  el.style.cursor = "pointer";
  el.title = "Click to skip";
  el.addEventListener("click", () => { skipped = true; });

  function typeNextChar() {
    if (skipped) {
      el.textContent = lines[lines.length - 1];
      return;
    }

    const currentLine = lines[lineIndex];

    if (charIndex <= currentLine.length) {
      el.textContent = currentLine.slice(0, charIndex);
      charIndex++;
      window.setTimeout(typeNextChar, typeSpeed);
    } else if (lineIndex < lines.length - 1) {
      lineIndex++;
      charIndex = 0;
      window.setTimeout(typeNextChar, linePause);
    }
 
  }

  typeNextChar();
}


function initScrollReveal(prefersReducedMotion) {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}


function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) => document.querySelector(`.nav-link[data-section="${id}"]`);

  if (!("IntersectionObserver" in window)) {
    
    const homeLink = linkFor("home");
    if (homeLink) homeLink.classList.add("active");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = linkFor(entry.target.id);
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}


function initCopyEmail() {
  const btn = document.getElementById("copyEmailBtn");
  const feedback = document.getElementById("copyFeedback");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const email = btn.getAttribute("data-copy");
    const originalLabel = btn.textContent;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      btn.textContent = "copied!";
      if (feedback) feedback.textContent = "Email copied to clipboard.";
    } catch (err) {
      btn.textContent = "couldn't copy";
      if (feedback) feedback.textContent = "Copy failed — please copy the address manually.";
    }

    window.setTimeout(() => {
      btn.textContent = originalLabel;
      if (feedback) feedback.textContent = "";
    }, 2200);
  });
}


function initVCardDownload() {
  const btn = document.getElementById("vcardBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const vCardLines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Malabanan;Jerec;B.;;",
      "FN:Jerec B. Malabanan",
      "TITLE:IT Graduate",
      "TEL;TYPE=CELL:+639981695240",
      "EMAIL:jerecmalabanan@gmail.com",
      "ADR;TYPE=HOME:;;Niyugan;Laurel;Batangas;;Philippines",
      "END:VCARD"
    ];

    const blob = new Blob([vCardLines.join("\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "jerec-malabanan.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const feedback = document.getElementById("copyFeedback");
    if (feedback) {
      feedback.textContent = "Contact card downloaded.";
      window.setTimeout(() => { feedback.textContent = ""; }, 2200);
    }
  });
}
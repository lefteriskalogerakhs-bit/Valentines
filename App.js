(function () {
  const qs = new URLSearchParams(window.location.search); // MDN: URLSearchParams  [oai_citation:2‡developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams?utm_source=chatgpt.com)

  const to = (qs.get("to") || "").trim();
  const from = (qs.get("from") || "").trim();
  const msg = (qs.get("msg") || "").trim();
  const photo = (qs.get("photo") || "").trim();

  const builder = document.getElementById("builder");
  const valentine = document.getElementById("valentine");

  // Elements (valentine view)
  const subtitle = document.getElementById("subtitle");
  const fromLine = document.getElementById("fromLine");
  const msgEl = document.getElementById("msg");
  const photoImg = document.getElementById("photo");
  const photoFallback = document.getElementById("photoFallback");
  const questionText = document.getElementById("questionText");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const result = document.getElementById("result");
  const replayBtn = document.getElementById("replayBtn");

  // Elements (builder)
  const builderForm = document.getElementById("builderForm");
  const linkBox = document.getElementById("linkBox");
  const finalLink = document.getElementById("finalLink");
  const copyBtn = document.getElementById("copyBtn");

  const hasParams = to && from && msg;

  if (!hasParams) {
    // Show builder
    builder.classList.remove("hidden");
    valentine.classList.add("hidden");

    builderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(builderForm);

      const p = new URLSearchParams();
      p.set("to", String(fd.get("to") || "").trim());
      p.set("from", String(fd.get("from") || "").trim());
      p.set("msg", String(fd.get("msg") || "").trim());
      const photoVal = String(fd.get("photo") || "").trim();
      if (photoVal) p.set("photo", photoVal);

      const url = `${window.location.origin}${window.location.pathname}?${p.toString()}`;
      finalLink.value = url;
      linkBox.classList.remove("hidden");
      finalLink.focus();
      finalLink.select();
    });

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(finalLink.value);
        copyBtn.textContent = "Αντιγράφηκε ✓";
        setTimeout(() => (copyBtn.textContent = "Αντιγραφή"), 1200);
      } catch {
        // fallback
        finalLink.focus();
        finalLink.select();
        document.execCommand("copy");
        copyBtn.textContent = "Αντιγράφηκε ✓";
        setTimeout(() => (copyBtn.textContent = "Αντιγραφή"), 1200);
      }
    });

    return;
  }

  // Show valentine card
  builder.classList.add("hidden");
  valentine.classList.remove("hidden");

  subtitle.textContent = `${to}, αυτό είναι για σένα.`;
  fromLine.textContent = `Από: ${from}`;
  msgEl.textContent = msg;
  questionText.textContent = `${to}, θα γίνεις η Βαλεντίνα μου;`;

  if (photo) {
    photoImg.src = photo;
    photoImg.onload = () => {
      photoImg.style.display = "block";
      photoFallback.style.display = "none";
    };
    photoImg.onerror = () => {
      photoImg.style.display = "none";
      photoFallback.style.display = "flex";
    };
  } else {
    photoFallback.style.display = "flex";
  }

  // "No" button escape + make "Yes" bigger each time
  let noClicks = 0;
  let yesScale = 1;

  const noPhrases = [
    "Σίγουρα; 😏",
    "Το ξανασκέφτεσαι; 👀",
    "Μη το πατάς αυτό… 🙃",
    "Τελευταία ευκαιρία 😄",
    "ΟΚ, σε αφήνω… (λέμε τώρα) 😈",
  ];

  function moveNoButton() {
    // Move within the button container boundaries
    const container = document.getElementById("buttons");
    const rect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxX = Math.max(0, rect.width - btnRect.width);
    const maxY = Math.max(0, rect.height - btnRect.height);

    const x = Math.floor(Math.random() * (maxX + 1));
    const y = Math.floor(Math.random() * (maxY + 1));

    noBtn.style.position = "absolute";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  noBtn.addEventListener("mouseenter", () => {
    // On hover (desktop): escape
    if (window.matchMedia("(hover: hover)").matches) moveNoButton();
  });

  noBtn.addEventListener("click", () => {
    noClicks++;
    const idx = Math.min(noClicks - 1, noPhrases.length - 1);
    noBtn.textContent = `ΟΧΙ 🙃 (${noPhrases[idx]})`;

    yesScale = Math.min(1.0 + noClicks * 0.12, 2.2);
    yesBtn.style.transform = `scale(${yesScale})`;

    moveNoButton();
  });

  // Yes = confetti + result
  function boomConfetti() {
    if (typeof confetti !== "function") return;

    const duration = 900;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        spread: 80,
        startVelocity: 40,
        scalar: 1,
        origin: { x: Math.random(), y: 0.15 + Math.random() * 0.2 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  yesBtn.addEventListener("click", () => {
    boomConfetti();
    result.classList.remove("hidden");
    document.getElementById("resultTitle").textContent = "ΤΕΛΕΙΑ 😄";
    document.getElementById("resultText").textContent =
      `${to}, έκλεισε. Από σήμερα είμαστε επίσημα 💘`;
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.style.opacity = "0.8";
    noBtn.style.opacity = "0.5";
  });

  replayBtn.addEventListener("click", () => boomConfetti());
})();

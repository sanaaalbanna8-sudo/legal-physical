const $app = document.getElementById("app");

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function graphic(svg, cap) {
  return `<figure class="graphic">${svg}<figcaption>${esc(cap)}</figcaption></figure>`;
}

function video(id, title, cap) {
  return `<figure class="vid"><iframe src="https://www.youtube.com/embed/${id}" title="${esc(title)}" allowfullscreen loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe><figcaption>${esc(cap)}</figcaption></figure>`;
}

/** فيديوهات توضيحية لقسم البرمجيات فقط (أ5) */
const A5_VIDEOS = {
  antivirus: {
    id: "7TgRETma4fU",
    title: "What Is Antivirus Software?",
    channel: "Keeper Security",
    time: "دقيقتان",
    why: "يوضّح كيف يفحص البرنامج الملفات، يقارنها بقاعدة التهديدات، ثم يعزلها أو يحذفها — ولماذا التحديث المستمر ضروري.",
    focus: ["توقيعات الفيروسات", "العزل أو الحذف", "حدود الحماية أمام فيروس جديد"],
  },
  firewall: {
    id: "kDEX1HXybrU",
    title: "What is a Firewall?",
    channel: "PowerCert Animated Videos",
    time: "6 دقائق",
    why: "رسم متحرك يبيّن جدار الحماية كحاجز بين الشبكة الخاصة والإنترنت، والفرق بين جدار على جهاز واحد وجدار يحمي الشبكة كلها.",
    focus: ["قواعد السماح والمنع", "حزم البيانات", "جدار برمجي وجدار شبكي"],
  },
  auth: {
    id: "mMKo-fG89jQ",
    title: "What is Two-Factor Authentication (2FA)?",
    channel: "Eye on Tech",
    time: "دقيقتان",
    why: "يفصل عوامل إثبات الهوية: شيء تعرفه، شيء تملكه، وشيء أنت عليه — وهذا أساس كلمة المرور والرمز والبصمة.",
    focus: ["عامل المعرفة", "عامل الحيازة", "العامل البيومتري"],
  },
  access: {
    id: "HDNKuQ0ji94",
    title: "Authentication, Authorization, and Accounting",
    channel: "CertBros",
    time: "شرح AAA",
    why: "يفرّق بين إثبات الهوية (من أنت؟) والصلاحيات (ماذا يُسمح لك أن تفعل؟) بعد الدخول.",
    focus: ["Authentication", "Authorization", "قراءة مقابل تعديل"],
  },
  encrypt: {
    id: "ZghMPWGXexs",
    title: "The Internet: Encryption & Public Keys",
    channel: "Code.org",
    time: "6 دقائق",
    why: "يشرح التشفير من مثال بسيط حتى المفتاح العام والخاص، ولماذا يظهر القفل في المتصفح.",
    focus: ["تشفير وفك تشفير", "مفتاح عام وخاص", "قفل HTTPS"],
  },
  wlan: {
    id: "bMQ3W0Vxy3o",
    title: "WiFi Security: WEP, WPA, WPA2, WPA3 and WPS",
    channel: "Florian Dalwigk",
    time: "مقارنة المعايير",
    why: "يقارن معايير تشفير الواي فاي، ويوضّح لماذا WEP ضعيف ولماذا WPS ثغرة يجب إغلاقها.",
    focus: ["WEP ضعيف", "WPA2 هو الأنسب", "عطّل WPS"],
  },
};

function watchBlock(topicId) {
  const v = A5_VIDEOS[topicId];
  if (!v) return "";
  return `
    <section class="watch" aria-label="فيديو توضيحي">
      <div class="watch-body">
        <div class="watch-top">
          <span class="watch-badge">شاهد لنفهم</span>
          <span class="watch-meta">${esc(v.time)} · <span class="ltr">${esc(v.channel)}</span></span>
        </div>
        <h2 class="watch-title ltr">${esc(v.title)}</h2>
        <p class="watch-why">${esc(v.why)}</p>
      </div>
      ${video(v.id, v.title, "الفيديو بالإنجليزية. المصطلحات نفسها الموجودة في الدرس.")}
      <ul class="watch-focus">
        ${v.focus.map((item) => `<li>${esc(item)}</li>`).join("")}
      </ul>
    </section>`;
}

function findTerm(key) {
  return GLOSSARY.find((x) => x.en === key) || GLOSSARY.find((x) => x.en.startsWith(key + " "));
}

function speakBtn(text) {
  return `<button type="button" class="speak-btn" data-speak="${esc(text)}" title="استمع للنطق" aria-label="استمع: ${esc(text)}">🔊</button>`;
}

/** كلمة إنجليزية + سماعة بجانب العربية في مكانها */
function en(key) {
  const g = findTerm(key);
  if (!g) return `<span class="tw-en ltr"><b>${esc(key)}</b></span>`;
  const label = g.exam || g.en;
  return `<span class="tw-en ltr">${speakBtn(g.say || label)}<b>${esc(label)}</b></span>`;
}

function speakEnglish(text) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.88;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find((x) => /^en(-|_)/i.test(x.lang) && /GB|UK|British/i.test(x.name + x.lang))
    || voices.find((x) => /^en(-|_)/i.test(x.lang));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function pathIndex(id) {
  return PATH.findIndex((p) => p.id === id);
}

function lessonChrome(id) {
  const i = pathIndex(id);
  if (i < 0) return "";
  const cur = PATH[i];
  const groupLabel = cur.group === "a3" ? "أ3 · المسؤوليات القانونية" : cur.group === "a4" ? "أ4 · الأمان المادي" : "أ5 · أمان البرامج والأجهزة";
  return `
    <div class="lesson-bar">
      <span class="meta">${esc(groupLabel)} · ${i + 1} / ${PATH.length}</span>
      ${i > 0 ? `<a class="ghost" href="#/${PATH[i - 1].id}">→ السابق</a>` : ""}
      ${i < PATH.length - 1 ? `<a href="#/${PATH[i + 1].id}">التالي ←</a>` : `<a href="#/think">إلى التفكير ←</a>`}
    </div>`;
}

function pager(id) {
  const i = pathIndex(id);
  if (i < 0) return "";
  const prev = PATH[i - 1];
  const next = PATH[i + 1];
  return `<nav class="pager">
    ${prev ? `<a class="ghost" href="#/${prev.id}">→ ${esc(prev.label)}</a>` : `<span></span>`}
    ${next ? `<a href="#/${next.id}">${esc(next.label)} ←</a>` : `<a href="#/think">أسئلة التفكير ←</a>`}
  </nav>`;
}

function groupNav(group, active) {
  const list = group === "a3" ? A3 : group === "a4" ? A4 : A5;
  return `<nav class="subnav">${list.map((t) =>
    `<a class="${t.id === active ? "active" : ""}" href="#/${t.id}">${esc(t.short)}</a>`
  ).join("")}</nav>`;
}

const SVG = {
  vectors: `<svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="12" y="28" width="170" height="124" rx="14" fill="#c43c28"/><text x="97" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">Wi‑Fi / Bluetooth</text><text x="97" y="108" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">بثّ · أسهل نسبيًا</text>
    <rect x="198" y="28" width="170" height="124" rx="14" fill="#c49a2a"/><text x="283" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">إنترنت سلكي</text><text x="283" y="108" text-anchor="middle" fill="#fff" font-size="12" font-family="Cairo,sans-serif">أصعب</text>
    <rect x="384" y="28" width="170" height="124" rx="14" fill="#1c2a44"/><text x="469" y="80" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">LAN داخلية</text><text x="469" y="108" text-anchor="middle" fill="#c9d3e0" font-size="12" font-family="Cairo,sans-serif">مهاجم داخلي</text>
    <rect x="570" y="48" width="136" height="84" rx="14" fill="#0f7a74"/><text x="638" y="90" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">النظام</text>
  </svg>`,
  backup: `<svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="30" width="200" height="110" rx="14" fill="#1c2a44"/><text x="120" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">داخل الموقع</text><text x="120" y="106" text-anchor="middle" fill="#c9d3e0" font-size="12" font-family="Cairo,sans-serif">استعادة سريعة</text>
    <rect x="260" y="30" width="200" height="110" rx="14" fill="#c43c28"/><text x="360" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">خارج الموقع</text><text x="360" y="106" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">حريق / فيضان</text>
    <rect x="500" y="30" width="200" height="110" rx="14" fill="#0f7a74"/><text x="600" y="80" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">سحابي</text><text x="600" y="106" text-anchor="middle" fill="#e8faf7" font-size="12" font-family="Cairo,sans-serif">طرف ثالث</text>
  </svg>`,
  firewall: `<svg viewBox="0 0 720 160" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="20" y="40" width="180" height="80" rx="12" fill="#5c6574"/><text x="110" y="88" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">الإنترنت</text>
    <rect x="250" y="30" width="200" height="100" rx="12" fill="#c43c28"/><text x="350" y="75" text-anchor="middle" fill="#fff" font-size="16" font-family="Cairo,sans-serif">جدار الحماية</text><text x="350" y="100" text-anchor="middle" fill="#ffe8e4" font-size="12" font-family="Cairo,sans-serif">يفحص ويمرّر / يحظر</text>
    <rect x="500" y="40" width="200" height="80" rx="12" fill="#0f7a74"/><text x="600" y="88" text-anchor="middle" fill="#fff" font-size="15" font-family="Cairo,sans-serif">LAN المؤسسة</text>
  </svg>`,
};

function route() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const id = hash.split("/").filter(Boolean)[0] || "home";
  const item = PATH.find((p) => p.id === id);
  let nav = id;
  if (item) nav = item.group;
  if (["a3", "a4", "a5"].includes(id)) nav = id;
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === nav || (id === "home" && a.dataset.nav === "home"));
  });
  const pages = {
    home: renderHome,
    a3: () => renderHub("a3"),
    a4: renderA4,
    a5: () => renderHub("a5"),
    vectors: renderVectors,
    gdpr: renderGdpr,
    misuse: renderMisuse,
    comms: renderComms,
    fraud: renderFraud,
    health: renderHealth,
    site: renderSite,
    backup: renderBackup,
    antivirus: renderAntivirus,
    firewall: renderFirewall,
    auth: renderAuth,
    access: renderAccess,
    encrypt: renderEncrypt,
    wlan: renderWlan,
    glossary: renderGlossary,
    think: renderThink,
  };
  (pages[id] || renderHome)();
  window.scrollTo(0, 0);
  bindInteractions();
}

function bindInteractions() {
  document.querySelectorAll("[data-reveal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.parentElement.querySelector(".answer");
      if (box) box.classList.toggle("on");
    });
  });
  document.querySelectorAll(".quiz-card").forEach((card) => {
    const correct = Number(card.dataset.correct);
    const feedback = card.querySelector(".feedback");
    card.querySelectorAll(".quiz-opts button").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        card.querySelectorAll(".quiz-opts button").forEach((b) => { b.disabled = true; b.classList.remove("correct", "wrong"); });
        if (i === correct) {
          btn.classList.add("correct");
          feedback.textContent = card.dataset.ok || "صحيح.";
        } else {
          btn.classList.add("wrong");
          card.querySelectorAll(".quiz-opts button")[correct].classList.add("correct");
          feedback.textContent = card.dataset.bad || "راجعي الفكرة مرة أخرى.";
        }
        feedback.classList.add("on");
      });
    });
  });
  document.querySelectorAll(".speak-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      speakEnglish(btn.getAttribute("data-speak") || "");
      btn.classList.add("playing");
      setTimeout(() => btn.classList.remove("playing"), 1200);
    });
  });
}

if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

/* ========== HOME & HUBS ========== */
function renderHome() {
  $app.innerHTML = `
    <p class="kicker">${esc(SITE.unit)} · ${esc(SITE.grade)}</p>
    <h1>المسؤوليات القانونية وتدابير الأمان</h1>
    <p class="lead">نتعلّم الحماية على ثلاث طبقات واضحة: ماذا يفرض القانون؟ كيف نحمي المكان والأجهزة ماديًا؟ وكيف نحمي النظام بالبرامج والأجهزة؟</p>

    <figure class="hero-art">
      <img src="img/castle-network.jpg" alt="قلعة تمثّل الشبكة الداخلية ونواقل الهجوم" width="1408" height="768" decoding="async" fetchpriority="high" />
      <figcaption class="hero-art-overlay">
        <span class="tag">مدخل الدرس</span>
        <h2>الهجوم على الشبكة الداخلية: كيف يصبح الخارجي داخليًا؟</h2>
        <p>الأسوار وحدها لا تكفي. القانون يحدد المسؤولية، والأمان المادي والبرمجي يغلقان الفجوات.</p>
      </figcaption>
    </figure>

    <h2>مسار التعلم</h2>
    <div class="path">
      <a href="#/a3">
        <span class="num">أ3</span>
        <strong>المسؤوليات القانونية</strong>
        <span class="path-en ltr">${speakBtn("legal responsibilities")} Legal responsibilities</span>
        <small class="path-mean">ماذا يعني؟ القوانين التي تلزم المؤسسة والأفراد عند التعامل مع البيانات والأنظمة الرقمية.</small>
        <small>حماية البيانات الشخصية · منع الاختراق ونشر الفيروسات · مراقبة بريد/هاتف العمل بشروط · مكافحة الاحتيال الإلكتروني · الصحة والسلامة في مكان العمل</small>
      </a>
      <a href="#/a4">
        <span class="num">أ4</span>
        <strong>الأمان المادي</strong>
        <span class="path-en ltr">${speakBtn("physical security measures")} Physical security measures</span>
        <small class="path-mean">ماذا يعني؟ حماية المكان والأجهزة والبيانات من السرقة أو الدخول غير المصرح أو الكوارث.</small>
        <small>أقفال وبطاقات وقياسات حيوية · كاميرات CCTV وأمن وإنذار · كابلات وخزائن محمية · نسخ احتياطي داخل/خارج الموقع والسحابة</small>
      </a>
      <a href="#/a5">
        <span class="num">أ5</span>
        <strong>أمان البرامج والأجهزة</strong>
        <span class="path-en ltr">${speakBtn("software and hardware security measures")} Software and hardware security measures</span>
        <small class="path-mean">ماذا يعني؟ أدوات تقنية تحمي النظام رقميًا: من يدخل؟ ماذا يمر على الشبكة؟ وكيف تُخفى البيانات؟</small>
        <small>مكافحة الفيروسات · جدران الحماية · مصادقة المستخدم · التحكم بالوصول · التشفير · حماية شبكة Wi‑Fi</small>
      </a>
    </div>

    <h2>خريطة المواضيع</h2>
    <div class="scheme">
      <section class="scheme-block">
        <header>
          <span class="num">أ3</span>
          <div>
            <strong>المسؤوليات القانونية</strong>
            <p>القوانين التي تلزم المؤسسة والأفراد عند التعامل مع البيانات والأنظمة الرقمية.</p>
          </div>
        </header>
        <div class="scheme-topics">
          ${A3.map((t) => `<a href="#/${t.id}">${esc(t.label)}</a>`).join("")}
        </div>
      </section>
      <section class="scheme-block">
        <header>
          <span class="num">أ4</span>
          <div>
            <strong>الأمان المادي</strong>
            <p>حماية المكان والأجهزة والبيانات من السرقة أو الدخول غير المصرح أو الكوارث.</p>
          </div>
        </header>
        <div class="scheme-topics">
          <a href="#/a4">أمان الموقع</a>
          <a href="#/a4">تخزين ونسخ احتياطي</a>
        </div>
      </section>
      <section class="scheme-block">
        <header>
          <span class="num">أ5</span>
          <div>
            <strong>أمان البرامج والأجهزة</strong>
            <p>أدوات تقنية: تفحص الملفات، تحرس حدود الشبكة، تتأكد من هوية المستخدم، تشفّر البيانات، وتحمي الـ Wi‑Fi.</p>
          </div>
        </header>
        <div class="scheme-topics">
          ${A5.map((t) => `<a href="#/${t.id}">${esc(t.label)}</a>`).join("")}
        </div>
      </section>
    </div>
    <p><a class="card" href="#/vectors"><b>→</b><strong>التالي</strong><small>نواقل الهجوم</small></a></p>
  `;
}

function renderA5() {
  $app.innerHTML = `
    <p class="kicker">نتاج التعلم A5 · Software and hardware security</p>
    <h1>تدابير أمان البرامج والأجهزة</h1>
    <p class="lead">ست طبقات تحمي النظام من الداخل: فحص الملفات، حراسة حدود الشبكة، إثبات الهوية، تحديد الصلاحيات، تشفير البيانات، وتأمين شبكة Wi‑Fi. كل درس يبدأ بفيديو قصير ثم الشرح.</p>
    ${groupNav("a5", "")}
    <div class="grid grid-2">
      ${A5.map((t, i) => `
        <a class="card" href="#/${t.id}"><b>${String(i + 1).padStart(2, "0")}</b><strong>${esc(t.label)}</strong><small>${esc(t.short)} · فيديو توضيحي</small></a>
      `).join("")}
    </div>
    <h2>مكتبة الفيديو</h2>
    <p class="lead">شاهدي المقطع أولًا، ثم ارجعي للنص لتربطي الصورة بالمصطلح الإنجليزي.</p>
    <div class="video-lib">
      ${A5.map((t) => {
        const v = A5_VIDEOS[t.id];
        return `
          <a class="video-card" href="#/${t.id}">
            <span class="video-thumb">
              <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" />
              <span class="play" aria-hidden="true"></span>
            </span>
            <span class="video-copy">
              <span class="watch-badge">شاهد لنفهم</span>
              <strong>${esc(t.label)}</strong>
              <small class="ltr">${esc(v.title)}</small>
              <small>${esc(v.why)}</small>
            </span>
          </a>`;
      }).join("")}
    </div>
    <p style="margin-top:16px"><a class="card" href="#/antivirus"><b>→</b><strong>ابدئي من هنا</strong><small>مكافحة الفيروسات</small></a></p>
  `;
}

function renderHub(group) {
  if (group === "a4") return renderA4();
  if (group === "a5") return renderA5();
  const meta = {
    a3: { title: "أ3 · المسؤوليات القانونية", lead: "طبّقي فهم المسؤوليات القانونية للمؤسسات على سيناريوهات قطاعية ومهنية تتعلق بالأمن السيبراني.", list: A3, start: "vectors" },
  }[group];
  $app.innerHTML = `
    <p class="kicker">نتاج التعلم ${group.toUpperCase()}</p>
    <h1>${esc(meta.title)}</h1>
    <p class="lead">${esc(meta.lead)}</p>
    ${groupNav(group, "")}
    <div class="grid grid-2">
      ${meta.list.map((t, i) => `
        <a class="card" href="#/${t.id}"><b>${String(i + 1).padStart(2, "0")}</b><strong>${esc(t.label)}</strong><small>${esc(t.short)}</small></a>
      `).join("")}
    </div>
    <p style="margin-top:16px"><a class="card" href="#/${meta.start}"><b>→</b><strong>التالي</strong><small>${esc(meta.list[0].label)}</small></a></p>
  `;
}

/* ========== A4 (صفحة واحدة بالتفاصيل كاملة) ========== */
function renderA4() {
  $app.innerHTML = `
    <p class="kicker">نتاج التعلم أ4 · Physical security measures</p>
    <h1>تدابير الأمان المادي</h1>
    <p class="lead">حماية المكان والأجهزة والبيانات من السرقة أو الدخول غير المصرح أو الكوارث — في المستشفى، المدرسة، البنك، وأي مؤسسة.</p>
    <span class="path-en ltr" style="margin-bottom:14px">${speakBtn("physical security measures")} Physical security measures</span>
    <aside class="def"><strong>الهدف</strong><p>منع السرقة والحفاظ على أمان البيانات عبر التحكم في من يصل إلى الأجهزة والأماكن الحساسة، مع نسخ احتياطي يحمي من الفقدان.</p></aside>

    <h2>1) أمان الموقع <span class="tw-en ltr">${speakBtn("site security")} <b>Site security</b></span></h2>
    <h3>غرف الحاسوب والخوادم</h3>
    <ul class="ticks">
      <li><b>أقفال أمان الموقع</b> ${en("site security locks")}: الغرف مقفلة ولا يدخلها إلا المصرح لهم.</li>
      <li><b>الدخول بالبطاقة</b> ${en("card entry")}: بطاقة ذكية تسجّل اسم الشخص ووقت الدخول.</li>
      <li><b>الكابلات المحمية والخزائن</b> ${en("protected cabling")} ${en("cabinets")}: المعدات الشبكية والكابلات في خزائن مقفلة — خاصة في المساحات المشتركة لأنها عرضة للتنصت.</li>
    </ul>
    <h3>طرق أخرى لأمان الموقع</h3>
    <div class="grid grid-2">
      <article class="measure"><div class="ico">👆</div><div><strong>القياسات الحيوية</strong> ${en("biometrics")}<small>بصمة أو مسح قزحية بدل المفتاح — خصائص بشرية فريدة يصعب تقليدها.</small></div></article>
      <article class="measure"><div class="ico">📹</div><div><strong>كاميرات المراقبة</strong> ${en("CCTV")}<small>مراقبة مساحات واسعة، تسجيل اللقطات كدليل، وأحيانًا تعرّف وجوه لتتبع الحركة داخل المبنى.</small></div></article>
      <article class="measure"><div class="ico">🧍</div><div><strong>موظفو الأمن</strong> ${en("security staff")}<small>تفتيش الزوار عند الوصول والقيام بدوريات في الموقع.</small></div></article>
      <article class="measure"><div class="ico">🚨</div><div><strong>أجهزة الإنذار</strong> ${en("alarms")}<small>على الأبواب والنوافذ، أو مستشعرات حركة تكشف وجود شخص في وقت لا ينبغي أن يكون فيه.</small></div></article>
    </div>
    <article class="scene">
      <h3>سيناريو مستشفى</h3>
      <p>غرفة سجلات المرضى: بطاقة للموظفين المصرح لهم فقط + سجل دخول. زائر بلا بطاقة لا يدخل. الوصول الفيزيائي للخادم ≈ وصول محتمل لكل البيانات.</p>
      <p class="punch">الأمان المادي يغلق الباب الحقيقي قبل أن يبدأ الاختراق الرقمي.</p>
    </article>

    <h2>2) تخزين البيانات والنسخ الاحتياطي ${en("data storage")} ${en("backup")}</h2>
    <p class="lead">البيانات من أهم موارد المؤسسة — وفقدانها صعب التعويض. نحميها بنسخ احتياطي منتظم يُفضَّل أن يعمل تلقائيًا.</p>
    ${graphic(SVG.backup, "ثلاث استراتيجيات تكمل بعضها: داخل الموقع · خارج الموقع · سحابة")}
    <div class="backup-flow">
      <div class="step"><div class="n">1</div><strong>تلقائي مخطّط</strong> ${en("automated backup")}<p style="color:var(--muted);margin:8px 0 0;font-size:0.9rem">يقلل نسيان الإنسان.</p></div>
      <div class="step"><div class="n">2</div><strong>خارج الموقع</strong> ${en("off-site")}<p style="color:var(--muted);margin:8px 0 0;font-size:0.9rem">حماية من حريق أو فيضان (مثل قرص ${en("USB")} خارج المبنى).</p></div>
      <div class="step"><div class="n">3</div><strong>سحابي</strong> ${en("cloud storage")}<p style="color:var(--muted);margin:8px 0 0;font-size:0.9rem">نسخ عبر الإنترنت لموقع بعيد — مسؤولية مشتركة مع مزوّد الخدمة.</p></div>
    </div>
    <div class="compare">
      <div class="yes"><h3>لماذا خارج الموقع ${en("off-site")}؟</h3><p>إذا احترق المبنى والنسخ كلها داخله ${en("on-site")}، تضيع الأصل والنسخة معًا.</p></div>
      <div class="no"><h3>تحفّظ السحابة</h3><p>نفس مخاوف الخدمات السحابية: جزء من أمان البيانات يصبح عند طرف ثالث.</p></div>
    </div>
    <article class="scene">
      <h3>سيناريو مدرسة</h3>
      <p>نسخ ليلي تلقائي للدرجات + نسخة أسبوعية في فرع آخر + نسخة سحابية مشفّرة. احترق المختبر — الدرجات لم تُفقد.</p>
    </article>
    <div class="quiz-card" data-correct="1" data-ok="صح: كارثة المبنى قد تمحو الأصل والنسخ معًا." data-bad="خارج الموقع يحمي من كوارث المكان الواحد.">
      <h3>اختبر نفسك</h3>
      <p>كل النسخ بجانب الخادم في نفس الغرفة فقط. ما الخطر الأكبر؟</p>
      <div class="quiz-opts">
        <button type="button">النسخ تصبح أبطأ</button>
        <button type="button">كارثة المبنى قد تمحو الأصل والنسخ</button>
        <button type="button">السحابة تصبح مجانية</button>
      </div>
      <div class="feedback"></div>
    </div>

    <nav class="pager">
      <a class="ghost" href="#/health">→ الصحة والسلامة</a>
      <a href="#/antivirus">مكافحة الفيروسات ←</a>
    </nav>
  `;
}

/* ========== A3 ========== */
function renderVectors() {
  $app.innerHTML = `
    ${lessonChrome("vectors")}
    ${groupNav("a3", "vectors")}
    <p class="kicker">قبل القانون — كيف يدخل المهاجم؟</p>
    <h1>نواقل الهجوم ${en("attack vector")}</h1>
    <aside class="def"><strong>تعريف مبسّط</strong><p>ناقل الهجوم = الطريق الذي يصل منه القرصان إلى النظام لاستغلال ثغرة أمنية ${en("vulnerability")}. غالبًا عبر اتصال شبكي واضح.</p></aside>
    ${graphic(SVG.vectors, "ثلاثة مسارات شائعة: لاسلكي · إنترنت سلكي · شبكة داخلية")}
    <div class="grid grid-3">
      <article class="panel"><strong>لاسلكي</strong> ${en("Wi‑Fi")} / Bluetooth<p>طبيعته بثّية؛ الوصول إليه أسهل نسبيًا إن لم يُؤمَّن جيدًا.</p></article>
      <article class="panel"><strong>إنترنت سلكي</strong><p>أصعب من اللاسلكي، لكنه ما زال مسارًا خارجيًا شائعًا.</p></article>
      <article class="panel"><strong>شبكة داخلية</strong> ${en("LAN")}<p>الوصول عبر الشبكة المحلية يتطلب عادة مهاجمًا داخليًا.</p></article>
    </div>
    <article class="scene">
      <h3>مثال</h3>
      <p>مقهى يوفّر ${en("Wi‑Fi")} مفتوحًا. شخص على نفس الشبكة يحاول اعتراض حركة ضعيفة التشفير — ناقل لاسلكي، بلا حاجة لبطاقة موظف.</p>
      <p class="punch">القانون يعاقب؛ الأمان يغلق الناقل.</p>
    </article>
    ${pager("vectors")}
  `;
}

function renderGdpr() {
  $app.innerHTML = `
    ${lessonChrome("gdpr")}
    ${groupNav("a3", "gdpr")}
    <p class="kicker">تشريعات حماية البيانات</p>
    <h1>حماية البيانات ${en("data protection")}</h1>
    <p class="lead">كثير من الدول تضع قوانين تحمي بيانات الأفراد على أنظمة الحاسوب. في أوروبا: ${en("GDPR")}.</p>
    ${video("MJ_Qj4H9ixc", "What is GDPR?", "نظرة متحركة مبسّطة على GDPR.")}
    <h2>خمسة مبادئ رئيسة للبيانات الشخصية</h2>
    <ol class="flow-list">
      <li><div>تُعالَج بشكل قانوني.</div></li>
      <li><div>تُجمع لأغراض محددة فقط.</div></li>
      <li><div>ذات صلة وتقتصر على ما هو ضروري للغرض.</div></li>
      <li><div>تُحتفظ بالمدة الضرورية فقط.</div></li>
      <li><div>يُحافظ على أمانها.</div></li>
    </ol>
    <h2>حقوق الفرد</h2>
    <div class="grid grid-2">
      <article class="panel">
        <strong>الإبلاغ بجمع البيانات</strong>
        <p>الحق أن تعرف أن بياناتك تُجمع، ولماذا، ومن يجمعها.</p>
        <p class="ex"><b>مثال:</b> تطبيق بنك يخبرك قبل التسجيل: «سنجمع رقم هويتك ورقم هاتفك للتحقق من الحساب»، ويعرض سياسة الخصوصية بوضوح.</p>
      </article>
      <article class="panel">
        <strong>الوصول عند الطلب</strong>
        <p>الحق أن تطلب نسخة مما هو مخزَّن عنك.</p>
        <p class="ex"><b>مثال:</b> طالبة تراسل المدرسة: «ما البيانات المسجّلة عني؟» فترسل الإدارة ملفًا فيه الاسم، الصف، ورقم ولي الأمر فقط.</p>
      </article>
      <article class="panel">
        <strong>محو البيانات</strong>
        <p>الحق أن تطلب حذف بياناتك عندما لم يعد هناك سبب مشروع للاحتفاظ بها.</p>
        <p class="ex"><b>مثال:</b> عميل يغلق حساب متجر إلكتروني ويطلب حذف عنوانه وبطاقة الدفع؛ المتجر يحذفها خلال المدة القانونية.</p>
      </article>
      <article class="panel">
        <strong>الاعتراض (مثل الإعلانات)</strong>
        <p>الحق أن ترفض استخدام بياناتك لغرض معيّن، مثل الرسائل الترويجية.</p>
        <p class="ex"><b>مثال:</b> تصلك إيميلات عروض يوميًا فتضغط «Unsubscribe / إلغاء الاشتراك»؛ الشركة تتوقف عن إرسال الإعلانات إليك.</p>
      </article>
    </div>
    <div class="compare">
      <div class="yes"><h3>مثال صحيح</h3><p>مدرسة تجمع هواتف أولياء الأمور للتواصل الطارئ فقط، وتحذفها بعد التخرج، وتؤمّن الملف.</p></div>
      <div class="no"><h3>انتهاك</h3><p>متجر يبيع قائمة عملائه لشركة إعلانات دون موافقة.</p></div>
    </div>
    <aside class="discuss"><h3>فكّر مليًّا</h3><p>ما قوانين حماية البيانات في بلدك؟ هل تشبه مبادئ GDPR؟ لمَ هي مهمة لك وللمؤسسة؟</p></aside>
    ${pager("gdpr")}
  `;
}

function renderMisuse() {
  const acts = [
    {
      t: "وصول غير مصرح به إلى بيانات الحاسوب",
      ex: "طالب يخمن كلمة مرور حساب زميل ويقرأ رسائله دون إذن — حتى لو «للمزاح».",
    },
    {
      t: "وصول غير مصرح به بقصد ارتكاب جرائم أخرى",
      ex: "شخص يخترق بريد موظف ليسرق بيانات بنكية ويستخدمها لاحقًا في احتيال.",
    },
    {
      t: "أعمال غير مصرح بها بقصد تعطيل النظام",
      ex: "مهاجم يشن هجومًا يوقف موقع مدرسة عن العمل أثناء التسجيل الإلكتروني.",
    },
    {
      t: "أعمال غير مصرح بها بقصد أضرار جسيمة",
      ex: "تعطيل أنظمة مستشفى أو شبكة طوارئ بحيث يتأثر المرضى أو السلامة العامة.",
    },
    {
      t: "تعديل غير مصرح به لبيانات الحاسوب",
      ex: "طالب يدخل نظام الدرجات ويغيّر علامته أو علامة زميل دون صلاحية.",
    },
    {
      t: "صنع أو توريد أو الحصول على أدوات لهذه الجرائم",
      ex: "تحميل أو بيع برنامج اختراق جاهز، أو أدوات لصناعة فيروسات، لاستخدامها في الجرائم أعلاه.",
    },
  ];
  $app.innerHTML = `
    ${lessonChrome("misuse")}
    ${groupNav("a3", "misuse")}
    <p class="kicker">قانون إساءة استخدام الحاسوب</p>
    <h1>إساءة استخدام الحاسوب ${en("Computer Misuse Act")}</h1>
    <aside class="def"><strong>ببساطة</strong><p>يجعل الاختراق ونشر الفيروسات وما شابهها غير قانونية ${en("illegal practices")}. في المملكة المتحدة: قانون 1990 — واستُخدم نموذجًا لدول أخرى.</p></aside>
    <h2>أفعال غير قانونية</h2>
    <div class="grid grid-2">
      ${acts.map((a, i) => `
        <article class="measure">
          <div class="ico">${i + 1}</div>
          <div>
            <strong>${esc(a.t)}</strong>
            <p class="ex" style="margin-top:8px"><b>مثال:</b> ${esc(a.ex)}</p>
          </div>
        </article>
      `).join("")}
    </div>
    <article class="case" style="margin-top:16px">
      <h3>دراسة حالة</h3>
      <p>2014: اتهام مواطن بريطاني باختراق أنظمة أمريكية (منها FBI والجيش ووكالة الدفاع الصاروخي) بحثًا عن أدلة عن <span class="ltr">UFOs</span>.</p>
      <aside class="abbr" style="margin-top:12px;box-shadow:none">
        <div class="en ltr">${speakBtn("U F O, unidentified flying object")} <span>UFO — Unidentified Flying Object</span></div>
        <div class="ar"><b>جسم طائر مجهول</b> — جسم يُرى في السماء ولا يُعرف مصدره فورًا (يُربط غالبًا بأحاديث عن كائنات فضائية). في القضية: المتهم كان يبحث عن وثائق/أدلة عن هذه الأجسام داخل أنظمة حكومية.</div>
      </aside>
      <p class="punch" style="margin-top:10px;font-weight:800">الفضول لا يبرّر الوصول غير المصرح به.</p>
    </article>
    <div class="quiz-card" data-correct="1" data-ok="صح: الوصول غير المصرح به جريمة بحد ذاته." data-bad="حتى بدون سرقة مال، الدخول غير المصرح غير قانوني.">
      <h3>اختبر نفسك</h3>
      <p>طالب يخمن كلمة مرور زميل «للمزاح» ويقرأ الرسائل فقط. هل هذا قانوني؟</p>
      <div class="quiz-opts">
        <button type="button">نعم، لأنه لم يسرق مالًا</button>
        <button type="button">لا — وصول غير مصرح به</button>
        <button type="button">نعم إن كانا في نفس الصف</button>
      </div>
      <div class="feedback"></div>
    </div>
    ${pager("misuse")}
  `;
}

function renderComms() {
  $app.innerHTML = `
    ${lessonChrome("comms")}
    ${groupNav("a3", "comms")}
    <p class="kicker">تشريعات الاتصالات</p>
    <h1>مراقبة اتصالات الموظف ${en("telecommunications legislation")}</h1>
    <p class="lead">في المملكة المتحدة، يسمح القانون لأصحاب العمل بمراقبة ${en("monitor")} الاتصالات عبر شبكاتهم الخاصة ضمن لوائح 2000 (الممارسات التجارية المشروعة).</p>
    <div class="compare">
      <div class="yes"><h3>ما يجوز عادة؟</h3><ul class="ticks"><li>اعتراض بريد على شبكة الشركة.</li><li>تسجيل مكالمات عبر شبكة الشركة.</li></ul></div>
      <div class="no" style="border-inline-start-color:var(--teal);background:color-mix(in srgb,var(--teal) 10%,var(--card))"><h3>شرط أساسي</h3><ul class="ticks"><li>الموظفون على دراية بإمكانية الاعتراض.</li><li>غالبًا يُذكر في عقد العمل.</li></ul></div>
    </div>
    <article class="scene">
      <h3>سيناريو</h3>
      <p>شركة تشتبه بتسريب أسرار. تراقب بريد العمل بعد توقيع سياسة واضحة. هذا مختلف عن قراءة واتساب على هاتف شخصي خارج الشبكة.</p>
      <p class="punch">المراقبة القانونية ≈ شبكة الشركة + إبلاغ الموظف.</p>
    </article>
    ${pager("comms")}
  `;
}

function renderFraud() {
  $app.innerHTML = `
    ${lessonChrome("fraud")}
    ${groupNav("a3", "fraud")}
    <p class="kicker">تشريعات مكافحة الاحتيال</p>
    <h1>الاحتيال السيبراني ${en("fraud")}</h1>
    <aside class="def"><strong>تعريف</strong><p>الاحتيال = محاولة متعمدة لتحقيق فائدة مالية أو غيرها بوسائل غير قانونية ${en("fraudulent purposes")}. الهجمات مثل ${en("phishing")} قد تندرج تحت تشريعات الاحتيال.</p></aside>
    <div class="chain">
      <div class="box"><strong>1. سرقة معلومات</strong><span>اسم · عنوان · حساب</span></div>
      <div class="arr">←</div>
      <div class="box"><strong>2. انتحال</strong><span>طلب قرض باسم الضحية</span></div>
      <div class="arr">←</div>
      <div class="box"><strong>3. فائدة غير قانونية</strong><span>مال بالخداع</span></div>
    </div>
    <article class="scene">
      <h3>مثال</h3>
      <p>مجرم يجمع اسمًا وعنوانًا ورقم حساب، ثم يتقدم بقرض بنكي باسم شخص آخر.</p>
      <p class="punch">حماية البيانات تقلل «المادة الخام» للاحتيال.</p>
    </article>
    ${pager("fraud")}
  `;
}

function renderHealth() {
  $app.innerHTML = `
    ${lessonChrome("health")}
    ${groupNav("a3", "health")}
    <p class="kicker">الصحة والسلامة</p>
    <h1>حقوق وواجبات في العمل ${en("health and safety")}</h1>
    <p class="lead">معظم الدول تفرض تشريعات تحمي ${en("employers")} و${en("employees")}، وتُلزم الموظفين بألا يعرّضوا الآخرين للخطر.</p>
    <div class="compare">
      <div class="yes"><h3>صاحب العمل</h3><ul class="ticks"><li>بيئة آمنة قدر الإمكان.</li><li>تدريب وإرشادات.</li><li>معدات وإجراءات مناسبة.</li></ul></div>
      <div class="no" style="border-inline-start-color:var(--teal);background:color-mix(in srgb,var(--teal) 10%,var(--card))"><h3>الموظف</h3><ul class="ticks"><li>اتباع تعليمات السلامة.</li><li>عدم تعريض الزملاء للخطر.</li><li>الإبلاغ عن مخاطر ظاهرة.</li></ul></div>
    </div>
    <article class="scene">
      <h3>سيناريو مختبر</h3>
      <p>كابلات مبعثرة في ممرات المختبر → تعثر → تلف أجهزة. السلامة هنا تربط حماية الناس وحماية الأجهزة معًا.</p>
    </article>
    ${pager("health")}
  `;
}

/* ========== A4 ========== */
function renderSite() { renderA4(); }
function renderBackup() { renderA4(); }

/* ========== A5 ========== */
function renderAntivirus() {
  $app.innerHTML = `
    ${lessonChrome("antivirus")}
    ${groupNav("a5", "antivirus")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>برامج مكافحة الفيروسات ${en("antivirus software")}</h1>
    <aside class="def"><strong>فكّري فيها هكذا</strong><p>مثل حارس يفحص كل ملف يدخل الجهاز: هل هذا الملف سليم أم فيروس؟ إذا شكّ فيه، يعزله أو يحذفه قبل أن يؤذي النظام.</p></aside>
    ${watchBlock("antivirus")}
    <p class="lead">لماذا نحتاجه؟ لأن الفيروسات والبرامج الضارة تصل عبر الإيميل، التحميل، أو ${en("USB")} — وبدون فحص قد تسرق بيانات أو تعطّل الجهاز.</p>
    <h2>كيف يكتشف التهديد؟ (ثلاث طرق)</h2>
    <ol class="flow-list">
      <li><div><strong>توقيعات الفيروسات</strong> ${en("virus signatures")}<p>لكل فيروس معروف «بصمة» أو نمط في ملفه. البرنامج يقارن ملفاتك بقائمة البصمات. لذلك يجب تحديث القائمة باستمرار — الفيروسات الجديدة تظهر كل يوم.</p></div></li>
      <li><div><strong>الموجِّهات / الاستدلال</strong> ${en("heuristics")}<p>ماذا لو الفيروس جديد وما له بصمة بعد؟ هنا يبحث البرنامج عن سلوك مشبوه (أوامر غريبة لا تظهر عادة في برامج سليمة) فيقول: هذا ملف مريب.</p></div></li>
      <li><div><strong>التعامل مع التهديد</strong> ${en("identified threats")}<p>بعد الاكتشاف: إما <b>حذف</b> الملف، أو وضعه في <b>العزل</b> ${en("quarantine")} (سجّان صغير يمنع الملف من العمل دون حذفه فورًا). الحالات الصعبة: إعادة التشغيل بالوضع الآمن أو قرص إنقاذ.</p></div></li>
    </ol>
    <article class="scene">
      <h3>سيناريو</h3>
      <p>موظفة تفتح مرفق «فاتورة.pdf». الملف في الحقيقة برنامج ضار جديد. التوقيعات لم تعرفه بعد، لكن الموجّهات رأت أوامر غريبة → وضعته في العزل → الجهاز سليم.</p>
      <p class="punch">التحديث المستمر لمكافحة الفيروسات = قائمة بصمات حديثة.</p>
    </article>
    ${pager("antivirus")}
  `;
}

function renderFirewall() {
  $app.innerHTML = `
    ${lessonChrome("firewall")}
    ${groupNav("a5", "firewall")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>جدار الحماية ${en("firewall")}</h1>
    <aside class="def"><strong>فكّري فيها هكذا</strong><p>بوابة أمن بين شبكة المؤسسة والإنترنت. تفحص كل بيانات داخلة أو خارجة: المسموح يمر، والمشبوه يُحظر.</p></aside>
    ${watchBlock("firewall")}
    ${graphic(SVG.firewall, "الإنترنت ← جدار الحماية ← شبكة المؤسسة")}
    <p class="lead">نوعان: ${en("software firewall")} يعمل برنامجًا على جهاز واحد، و${en("hardware firewall")} جهاز واحد يفحص بيانات كل الحواسيب على الشبكة المحلية ${en("LAN")}.</p>
    <h2>تقنيات التصفية (كيف يقرر؟)</h2>
    <div class="grid grid-2">
      <article class="panel"><strong>تصفية الحزم وفحصها</strong> ${en("packet filtering")}<p>البيانات تسافر على شكل ${en("packet")}. الجدار ينظر لكل حزمة: من أين؟ إلى أين؟ أي ${en("port")}؟ أي ${en("protocol")}؟ ثم يسمح أو يمنع حسب القواعد.</p></article>
      <article class="panel"><strong>الوعي بطبقة التطبيقات</strong> ${en("application layer awareness")}<p>قواعد حسب التطبيق نفسه — مثل: امنع برنامج الاتصال عن بُعد، واسمح بالمتصفح فقط.</p></article>
      <article class="panel"><strong>قواعد واردة وصادرة</strong> ${en("inbound rules")} ${en("outbound rules")}<p><b>واردة:</b> من الإنترنت إلى شبكتك. <b>صادرة:</b> من شبكتك إلى الإنترنت. مدير الشبكة يعدّل القواعد حسب سياسة المؤسسة.</p></article>
      <article class="panel"><strong>عنوان الشبكة</strong> ${en("network address")}<p>تخفي عناوين الأجهزة الداخلية ${en("IP")} خلف عنوان عام واحد. اسم التقنية ${en("NAT")}. القرصان من الخارج يصعب عليه معرفة أجهزة الشبكة واحدًا واحدًا.</p></article>
    </div>
    <article class="scene">
      <h3>سيناريو مكتب</h3>
      <p>قاعدة: «امنع الاتصالات الواردة على منفذ سطح المكتب البعيد إلا من شبكة الإدارة». محاولة اختراق من الإنترنت تُحظر عند الجدار قبل أن تصل لأجهزة الموظفين.</p>
      <p class="punch">جدار الحماية يحرس الحدود؛ مكافحة الفيروسات تحرس داخل الجهاز.</p>
    </article>
    ${pager("firewall")}
  `;
}

function renderAuth() {
  $app.innerHTML = `
    ${lessonChrome("auth")}
    ${groupNav("a5", "auth")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>مصادقة المستخدم ${en("user authentication")}</h1>
    <aside class="def"><strong>فكّري فيها هكذا</strong><p>قبل أن تدخل النظام: أثبت أنك أنتِ. الهدف دخول الشرعيين بسهولة نسبيًا، ومنع غير المصرح ${en("unauthorised access")}.</p></aside>
    ${watchBlock("auth")}
    <h2>الطرق من الأبسط إلى الأقوى</h2>
    <div class="grid grid-2">
      <article class="panel"><strong>تسجيل الدخول</strong> ${en("login")}<p>اسم مستخدم + كلمة مرور (طبقة واحدة). مناسبة للبداية، وغالبًا غير كافية وحدها لأنظمة حساسة.</p></article>
      <article class="panel"><strong>كلمة مرور قوية</strong> ${en("strong password")}<p>طويلة + أحرف + أرقام + رموز. تجنّبي كلمات القاموس والقصيرة (أقل من 8). غيّريها دوريًا.</p></article>
      <article class="panel"><strong>نصية ورسومية</strong> ${en("graphical password")}<p>النص: تكتبينها. الرسومية: ترسمين نمطًا على الشاشة (شائع على اللمس).</p></article>
      <article class="panel"><strong>بيومترية</strong> ${en("biometric authentication")}<p>بصمة، وجه، قزحية، صوت. ميزة: لا تنسينها. عيب خطير: إذا سُرقت البيانات البيومترية لا يمكن «تغيير بصمتك» مثل كلمة المرور.</p></article>
      <article class="panel"><strong>التحقق بخطوتين</strong> ${en("two-step verification")} ${en("2FA")}<p>شيء تعرفينه (كلمة المرور) + شيء معك (رمز من الجوال أو بصمة). طبقة إضافية قوية.</p></article>
      <article class="panel"><strong>رموز الأمان</strong> ${en("security tokens")}<p>جهاز صغير يولّد شفرة لمرة واحدة. النوعان في المواصفة: مفتاح يوصل عبر ${en("USB")}، ومفتاح يُقرَّب من القارئ ${en("near field key")} باستخدام ${en("NFC")}.</p></article>
      <article class="panel"><strong>قائمة على المعرفة</strong> ${en("knowledge-based authentication")}<p>تعتمد على ${en("question and response")}: سؤال محفوظ مسبقًا وجواب لا يعرفه إلا صاحب الحساب، مثل «مدينة الميلاد؟». شائعة في البنوك واستعادة كلمة المرور.</p></article>
      <article class="panel"><strong>كيربيروس</strong> ${en("Kerberos")}<p>في شبكات ويندوز/لينكس: لا تُرسل كلمة المرور بلا تشفير. الحسابات تُدار عبر ${en("Active Directory")}.</p></article>
      <article class="panel"><strong>مستندة إلى الشهادات</strong> ${en("certificate-based authentication")}<p>الموقع يثبت هويته بشهادة رقمية ${en("digital certificate")} من هيئة شهادات ${en("certificate authority")} ضمن ${en("HTTPS")}.</p></article>
    </div>
    <article class="scene">
      <h3>سيناريو بنك</h3>
      <p>الدخول: كلمة مرور + رمز يصل للجوال (خطوتان) + أحيانًا سؤال أمان. حتى لو سُرقت كلمة المرور وحدها، المهاجم يحتاج الجوال أيضًا.</p>
    </article>
    <aside class="discuss"><h3>مناقشة</h3><p>ما مزايا وعيوب المصادقة البيومترية لموقع إلكتروني؟</p></aside>
    ${pager("auth")}
  `;
}

function renderAccess() {
  $app.innerHTML = `
    ${lessonChrome("access")}
    ${groupNav("a5", "access")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>التحكم في الوصول ${en("access controls")}</h1>
    <aside class="def"><strong>فكّري فيها هكذا</strong><p>حتى بعد تسجيل الدخول: ليس كل شخص يرى كل شيء. نحدد من يصل إلى أي مورد، وهل يقرأ فقط أم يعدّل.</p></aside>
    ${watchBlock("access")}
    <p class="lead">التحكم في الوصول يقيّد المستخدم عن: ${en("applications")} و${en("folders")} و${en("files")} و${en("physical resources")} مثل غرفة الخادم أو الخزنة.</p>
    <ul class="ticks">
      <li><b>قراءة فقط:</b> يشاهد الملف ولا يغيّره.</li>
      <li><b>كتابة:</b> يستطيع التعديل.</li>
      <li><b>تحكم كامل:</b> يعدّل ويغيّر الصلاحيات أحيانًا.</li>
      <li>ويندوز: أذونات ${en("NTFS")} والمجلدات المشتركة على الشبكة.</li>
      <li>لينكس: أذونات من «لا وصول» إلى قراءة/كتابة/تنفيذ.</li>
    </ul>
    <article class="scene">
      <h3>مثال</h3>
      <p>مجلد «درجات الصف 12»: المعلمون = قراءة وكتابة، الطلاب = لا وصول، الإدارة = قراءة فقط. حتى لو دخل طالب الشبكة، المجلد مقفل عليه.</p>
    </article>
    <h2>الحوسبة الموثوقة ${en("trusted computing")}</h2>
    <aside class="def"><strong>ببساطة</strong><p>تحسين الأمن عبر عتاد + برمجيات معًا (ليس برنامجًا فقط). مثال عملي: شريحة ${en("TPM")} في اللوحة الأم تساعد على تشفير القرص بالكامل.</p></aside>
    ${pager("access")}
  `;
}

function renderEncrypt() {
  $app.innerHTML = `
    ${lessonChrome("encrypt")}
    ${groupNav("a5", "encrypt")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>التشفير ${en("encryption")}</h1>
    <aside class="def"><strong>الغرض</strong><p>إخفاء البيانات حتى لا يقرأها إلا الشخص المقصود. معظم الطرق تعتمد على مفتاح، والمفتاح رقم ثنائي: يُستخدم للتشفير ولإعادة البيانات إلى شكلها المقروء.</p></aside>
    ${watchBlock("encrypt")}

    <h2>الفرق الأساسي: مفتاح واحد أم مفتاحان؟</h2>
    <p class="lead">هذا هو الفرق الذي يُطلب فهمه قبل حفظ الأسماء. الطريقتان صحيحتان، وكل واحدة تحل مشكلة مختلفة.</p>
    <div class="grid grid-2">
      <article class="panel">
        <strong>تشفير متماثل</strong> ${en("symmetric encryption")}
        <p>مفتاح واحد يشفّر ويفك التشفير. الطرفان يحتاجان المفتاح نفسه، ويتفقان عليه سرًا قبل الإرسال.</p>
        <p><b>ميزته:</b> سريع، لذلك يُستخدم مع الملفات والقرص وكميات البيانات الكبيرة.</p>
        <p><b>مشكلته:</b> إذا سُرق المفتاح أثناء نقله، سقطت السرية كلها.</p>
      </article>
      <article class="panel">
        <strong>تشفير غير متماثل</strong> ${en("asymmetric encryption")}
        <p>زوج مفاتيح مرتبط رياضيًا: ${en("public key")} يُنشر لأي شخص، و${en("private key")} يبقى سرًا على الخادم. ما شُفّر بالعام لا يُفتح إلا بالخاص.</p>
        <p><b>ميزته:</b> لا حاجة لإرسال المفتاح السري عبر الشبكة.</p>
        <p><b>مشكلته:</b> بطيء، لذلك لا يُشفَّر به كل المحتوى.</p>
      </article>
    </div>
    <aside class="def"><strong>كيف يعملان معًا في الموقع؟</strong><p>غير المتماثل ينقل ${en("session key")} فقط بين المتصفح والخادم. بعد ذلك تُشفَّر بقية الجلسة بالمفتاح المتماثل لأنه أسرع. المفتاح القصير أسهل كسرًا كلما صارت الحواسيب أقوى، لذلك طول المفتاح مهم.</p></aside>

    <h2>أربعة استخدامات — والفرق بينها</h2>
    <p class="lead">ليست بدائل لبعضها. كل واحدة تحمي البيانات في مكان مختلف.</p>
    <div class="cmp-wrap">
      <table class="cmp">
        <thead>
          <tr>
            <th>الاستخدام</th>
            <th>ماذا يحمي؟</th>
            <th>متى ينفع؟</th>
            <th>الفرق عن غيره</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>تخزين كلمات المرور ${en("safe password storage")}</td>
            <td>السر داخل قاعدة بيانات الخادم</td>
            <td>إذا وصل متسلل إلى الجدول، لا يرى الكلمة كنص واضح</td>
            <td>يحمي الكلمة وهي مخزّنة، ولا يحميها وهي تسير على الشبكة</td>
          </tr>
          <tr>
            <td>إدارة الحقوق ${en("DRM")}</td>
            <td>منع نسخ البرامج والأفلام والموسيقى</td>
            <td>مفتاح منتج، أو خدمة مثل متجر موسيقى وأفلام</td>
            <td>يحمي عملًا محميًا بحقوق النشر، وليس ملفات المؤسسة</td>
          </tr>
          <tr>
            <td>ملفات ومجلدات وأقراص ${en("disc encryption")}</td>
            <td>البيانات وهي محفوظة على الجهاز: ملف أو مجلد أو القرص كله</td>
            <td>إذا سُرق اللابتوب أو فُصل القرص وركّب على جهاز آخر</td>
            <td>يحمي النسخة المخزّنة. تشفير الاتصالات يحمي الطريق فقط</td>
          </tr>
          <tr>
            <td>القرص كاملًا ${en("BitLocker")}</td>
            <td>كل ما على القرص قبل ظهور ويندوز</td>
            <td>لابتوب أو قرص معرّض للسرقة، مع شريحة ${en("TPM")}</td>
            <td>يحمي من ${en("offline attack")} الذي تتجاوزه الأذونات وحدها</td>
          </tr>
          <tr>
            <td>تشفير الاتصالات ${en("communications encryption")}</td>
            <td>البيانات وهي تنتقل بين جهازين</td>
            <td>إنترنت، اتصال بعيد، صفحة ويب، مكالمة</td>
            <td>يحمي الطريق، لا النسخة المخزّنة على القرص</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>الفرق بين تشفير الملف وتشفير القرص</h2>
    <div class="grid grid-2">
      <article class="panel">
        <strong>نظام الملفات المشفرة</strong> ${en("EFS")}
        <p>يشفّر ملفًا أو مجلدًا، ويُقفل مفتاح التشفير بكلمة مرور المستخدم. من لم يسجّل الدخول لا يصل إلى المفتاح.</p>
        <p>الأذونات تكفي عادة والجهاز على الشبكة. لكن إذا سُرق القرص ورُكب على جهاز آخر، يمكن تجاوز الأذونات. التشفير هنا يوقف تلك القراءة.</p>
        <p>إذا أُعيد تعيين كلمة المرور لأن صاحبها نسيها، تضيع الملفات المشفّرة معه.</p>
      </article>
      <article class="panel">
        <strong>تشفير القرص</strong> ${en("BitLocker")}
        <p>الأفضل للحاسوب المحمول. يشفّر القرص كاملًا، ويطلب كلمة مرور عند كل تشغيل قبل شاشة الدخول. يعمل مع ${en("TPM")} في اللوحة الأم، وهو متاح في إصدارات برو وإنتربرايز لا في هوم.</p>
        <p>يمكن أن يكون المفتاح كلمة مرور أو شريحة ${en("USB")}. يُنشأ أيضًا مفتاح استرداد يُحفظ أو يُطبع، لأن نسيان كلمة المرور يعني فقدان الوصول للجهاز.</p>
      </article>
    </div>
    <article class="scene">
      <h3>مثال يفرّق بينهما</h3>
      <p>مجلد رواتب مشفّر بـ EFS: الموظفة تفتحه وهي داخلة بحسابها، وزميلها على نفس الجهاز لا يفتحه. إذا سُرق اللابتوب وأُقلع من نظام آخر، EFS ما زال يقفل تلك الملفات، لكن باقي القرص قد يُقرأ. BitLocker يقفل القرص كله قبل أن يبدأ أي نظام.</p>
    </article>

    <h2>تشفير الاتصالات: أربع أدوات، وأربع وظائف</h2>
    <div class="grid grid-2">
      <article class="panel">
        <strong>مدمج في الجهاز</strong> ${en("built-in encryption")}
        <p>الهاتف والجهاز اللوحي يشفّران البيانات داخل الجهاز نفسه، لا عبر برنامج تثبّته لاحقًا. مثال الشبكة الخلوية ${en("GSM")} بخوارزمية A5/1: التشفير موجود، لكنه ضعيف ويُكسر، فيصير التنصت ممكنًا أثناء المكالمة.</p>
      </article>
      <article class="panel">
        <strong>تور</strong> ${en("Tor")}
        <p>أداة مجانية ${en("open source")} تخفي مكان المستخدم وما يزوره وما يراسله عن من يراقب الشبكة. الفرق: هدفها الخصوصية وإخفاء الهوية، لا تشفير ملف محفوظ على القرص.</p>
      </article>
      <article class="panel">
        <strong>شبكة خاصة افتراضية</strong> ${en("VPN")}
        <p>مكتبان لكل منهما شبكة محلية، والرابط بينهما إنترنت عام. الـ VPN تحوّل هذا الطريق العام إلى قناة خاصة بالتشفير، عبر ${en("tunneling protocol")} يغلّف البيانات ويصادق المستخدم ويتفق على المفاتيح. تستخدمها المؤسسة أيضًا لمن يعمل من البيت.</p>
        <p>الفرق عن تور: تربط طرفين معروفين (الموظف والمؤسسة)، ولا تخفي التصفح عن الشركة.</p>
      </article>
      <article class="panel">
        <strong>صفحات الويب</strong> ${en("HTTPS")}
        <p>النسخة الآمنة من طلب صفحات الويب. شهادة رقمية ${en("digital certificate")} من ${en("certificate authority")} تثبت أن الموقع حقيقي، والبيانات بينك وبين الصفحة تُشفَّر بالمفتاح العام والخاص حتى لا تُعترَض.</p>
        <p>الفرق عن VPN: يحمي زيارة موقع واحد، لا كل اتصالك بشبكة المؤسسة.</p>
      </article>
    </div>

    <h2>ماذا يحدث عند فتح موقع HTTPS؟</h2>
    <ol class="flow-list">
      <li><div><strong>طلب الموقع</strong><p>المتصفح يتصل بالخادم ويطلب إثبات هويته.</p></div></li>
      <li><div><strong>الشهادة والمفتاح العام</strong><p>الخادم يرسل شهادته. المفتاح العام مكشوف، والمفتاح الخاص يبقى على الخادم.</p></div></li>
      <li><div><strong>التحقق</strong><p>المتصفح يتأكد أن الشهادة صادرة من هيئة يثق بها، وأن الموقع هو المقصود.</p></div></li>
      <li><div><strong>مفتاح الجلسة</strong><p>يُنشأ مفتاح جلسة متماثل ويُرسل مشفّرًا بالمفتاح العام. الخادم وحده يفكه بمفتاحه الخاص.</p></div></li>
      <li><div><strong>بقية البيانات</strong><p>الصفحات والنماذج تُشفَّر بمفتاح الجلسة لأنه أسرع من تشفير كل شيء بالمفتاح العام.</p></div></li>
    </ol>

    <aside class="discuss">
      <h3>وقفة للتفكير</h3>
      <ul class="ticks">
        <li>كيف يُبقي التشفير البيانات آمنة حتى لو وصلت إلى الشخص الخطأ؟</li>
        <li>ما الفرق العملي بين مفتاح واحد ومفتاحين؟ أيهما تستخدمه لنقل ملف كبير، وأيهما لتسليم المفتاح نفسه؟</li>
        <li>لماذا يصير المفتاح القصير أسهل كسرًا كلما قويت أجهزة الحاسوب؟</li>
      </ul>
    </aside>

    <article class="case">
      <h3>دراسة حالة: سان برناردينو</h3>
      <p>بعد هجوم عام 2015 أرادت جهة تحقيق فتح هاتف مشفّر لمعرفة إن كان هناك متورطون آخرون. الشركة رفضت إضعاف التشفير أو فتح «باب خلفي»، لأن ثغرة للحكومة تصبح ثغرة لكل الزبائن. قبل المحكمة، قالت الجهة إنها وصلت إلى البيانات عبر طرف آخر.</p>
      <p>أسئلة للنقاش: هل طلب فتح الهاتف مبرر؟ هل يكفي «أنا لا أخالف القانون» حتى نسمح للحكومة بكل البيانات؟ ولماذا تتمسك الشركة بطريقة التشفير حتى لو أزعج ذلك جهة أمنية؟</p>
    </article>
    ${pager("encrypt")}
  `;
}

function renderWlan() {
  $app.innerHTML = `
    ${lessonChrome("wlan")}
    ${groupNav("a5", "wlan")}
    <p class="kicker">أ5 · أمان البرامج والأجهزة</p>
    <h1>حماية الشبكة اللاسلكية ${en("WLAN")}</h1>
    <aside class="def"><strong>فكّري فيها هكذا</strong><p>الـ ${en("Wi‑Fi")} يبث بالراديو — أي شخص قريب قد يحاول التنصت. لذلك نغلق الشبكة بكلمة مرور قوية ومعايير حديثة، ونفصل شبكة الزوار عن الموظفين.</p></aside>
    ${watchBlock("wlan")}
    <h2>احتياطات مهمة</h2>
    <div class="grid grid-2">
      <article class="panel"><strong>إخفاء اسم الشبكة</strong> ${en("SSID")}<p>لا تبثّي اسم الشبكة للجميع. أمان أساسي فقط — ليس كافيًا وحده.</p></article>
      <article class="panel"><strong>تصفية العناوين</strong> ${en("MAC address filtering")}<p>اسمحي لأجهزة معتمدة فقط عبر ${en("MAC")}. مفيد، لكن المهاجم الماهر قد يزوّر العنوان.</p></article>
      <article class="panel"><strong>تشفير قديم</strong> ${en("WEP")}<p>ضعيف ويُكسر بسرعة — لا تستخدمينه.</p></article>
      <article class="panel"><strong>المعيار الموصى به</strong> ${en("WPA2")} ${en("AES")}<p>${en("WPA")} أفضل من WEP، وWPA2 هو الأنسب للمنازل والمؤسسات حاليًا.</p></article>
      <article class="panel"><strong>إعداد سهل وفيه ثغرة</strong> ${en("WPS")}<p>زر أو ${en("PIN")} لربط الجهاز بسرعة، لكن يمكن كسره بهجوم ${en("brute-force attack")} — عطّليه إن أمكن.</p></article>
      <article class="panel"><strong>مكان الراوتر</strong><p>كلمة المرور مطبوعة خلف الجهاز. إن كان في مكان مفتوح، أي زائر قد يقرأها.</p></article>
    </div>
    <h2>فروقات التشفير اللاسلكي</h2>
    <p class="lead">هذه ليست مستويات لنفس الشيء. WPS أصلًا ليس تشفيرًا، وWEP وWPA وWPA2 معايير مختلفة القوة.</p>
    <div class="cmp-wrap">
      <table class="cmp">
        <thead>
          <tr>
            <th>المعيار</th>
            <th>ماذا يفعل؟</th>
            <th>نقطة الضعف</th>
            <th>الحكم</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${en("WEP")}</td>
            <td>المعيار الأصلي. مفتاح قصير (64 أو 128 بت) والمفتاح نفسه لكل حزمة.</td>
            <td>يُكسر خلال دقائق بأدوات شائعة.</td>
            <td class="tag-bad">لا يُستخدم</td>
          </tr>
          <tr>
            <td>${en("WPA")}</td>
            <td>جاء حوالي 2003 ليغلق ثغرات WEP. مفتاح 256 بت، ومفتاح مختلف لكل حزمة.</td>
            <td>صُمّم ليشتغل على أجهزة WEP القديمة، لذلك بقي قابلًا للكسر بسهولة نسبية.</td>
            <td>أفضل من WEP، وغير كافٍ</td>
          </tr>
          <tr>
            <td>${en("WPA2")}</td>
            <td>أصبح معيارًا رسميًا عام 2006، ويشفّر بـ ${en("AES")}.</td>
            <td>ما زال يحتاج كلمة مرور قوية. المعيار نفسه أقوى الخيارات في هذا الدرس.</td>
            <td class="tag-ok">المطلوب للبيت والمؤسسة</td>
          </tr>
          <tr>
            <td>${en("WPS")}</td>
            <td>زر على الراوتر أو ${en("PIN")} من 8 أرقام لربط الجهاز بسرعة. ليس معيار تشفير.</td>
            <td>الرقم يُكسر بهجوم ${en("brute-force attack")} في مدة قد لا تتجاوز أربع ساعات.</td>
            <td class="tag-bad">عطّليه إن وُجد</td>
          </tr>
        </tbody>
      </table>
    </div>
    <aside class="discuss">
      <h3>من مرحلة التصميم ${en("security by design")}</h3>
      <p>تخفيف الثغرات المعروفة ${en("wireless vulnerabilities")} لا يُترك لما بعد التشغيل: نختار ${en("WPA2")}، نعطّل ${en("WPS")}، ونخفي ${en("SSID")} إن لزم، قبل أن يستخدم أحد الشبكة.</p>
      <ul class="ticks">
        <li>هل الشبكة للموظفين فقط أم للزوار أيضًا؟</li>
        <li>هل يتشارك الزوار نفس شبكة الموظفين؟ (الأفضل: شبكة منفصلة)</li>
        <li>كلمة مرور ثابتة أم فردية؟ من يراقب الأجهزة المتصلة؟</li>
      </ul>
    </aside>
    <article class="scene">
      <h3>سيناريو مقهى / مكتب</h3>
      <p>الزوار على Wi‑Fi منفصل بـ WPA2، والموظفون على شبكة أخرى خلف جدار حماية. لا يصل الزائر لملفات الشركة حتى وهو في نفس المبنى.</p>
    </article>
    ${pager("wlan")}
  `;
}

/* ========== GLOSSARY & THINK ========== */
function renderGlossary() {
  $app.innerHTML = `
    <p class="kicker">مرجع سريع</p>
    <h1>المصطلحات والاختصارات</h1>
    <p class="lead">مصطلحات الأمن السيبراني بالإنجليزي مع المعنى بالعربي. اضغطي 🔊 لسماع اللفظ الصحيح.</p>
    <div class="grid grid-2">
      ${GLOSSARY.map((g) => `
        <aside class="abbr">
          <div class="en ltr">${speakBtn(g.say || g.en)} <span>${esc(g.en)}</span></div>
          <div class="ar"><b class="ltr">${esc(g.full)}</b><br />${esc(g.ar)}</div>
        </aside>
      `).join("")}
    </div>
  `;
}

function renderThink() {
  $app.innerHTML = `
    <p class="kicker">تفكير ناقد · تحليل</p>
    <h1>ثبّتي الفهم</h1>
    <p class="lead">أسئلة للتفكير والتحليل — أجيبي ثم اكشفي التلميح.</p>

    <article class="case">
      <h3>سيناريو شامل: بنك</h3>
      <p>تصيّد يسرق بيانات عميل → قرض باسمه. غرفة الخوادم بلا بطاقة. النسخ كلها في نفس المبنى. Wi‑Fi للزوار بنفس شبكة الموظفين وبـ WEP.</p>
      <div class="reveal"><button type="button" data-reveal>اربطي أ3 · أ4 · أ5</button>
        <div class="answer"><ul class="ticks">
          <li><b>أ3:</b> احتيال + حماية بيانات.</li>
          <li><b>أ4:</b> بطاقات لغرفة الخوادم + نسخ خارج الموقع/سحابة.</li>
          <li><b>أ5:</b> فصل شبكة الزوار، WPA2، جدار حماية، مصادقة قوية/2FA.</li>
        </ul></div>
      </div>
    </article>

    <article class="discuss">
      <h3>1) لمَ حماية البيانات مهمة للفرد وللمؤسسة؟</h3>
      <div class="reveal"><button type="button" data-reveal>تلميح</button>
        <div class="answer">للفرد: خصوصية ومنع انتحال الهوية. للمؤسسة: ثقة وغرامات وسمعة عند الانتهاك.</div>
      </div>
    </article>
    <article class="discuss">
      <h3>2) لمَ ينجذب قراصنة لمؤسسات مثل FBI؟</h3>
      <div class="reveal"><button type="button" data-reveal>تلميح</button>
        <div class="answer">بيانات عالية القيمة، تحدٍّ، أو دوافع أيديولوجية — والوصول غير المصرح يبقى جريمة.</div>
      </div>
    </article>
    <article class="discuss">
      <h3>3) هل يجب أن تصل الحكومة لبياناتنا عبر «منفذ خلفي» في التشفير؟</h3>
      <div class="reveal"><button type="button" data-reveal>تلميح</button>
        <div class="answer">وازن بين الأمن العام وخصوصية الجميع: أي منفذ خلفي قد يستغله مجرمون أيضًا.</div>
      </div>
    </article>

    <div class="quiz-card" data-correct="0" data-ok="صح: WPA2 مع AES هو الموصى به." data-bad="WEP ضعيف؛ WPS فيه ثغرة.">
      <h3>سؤال سريع</h3>
      <p>أي معيار تشفير لاسلكي يُنصح به للشبكات الحالية؟</p>
      <div class="quiz-opts">
        <button type="button">WPA2</button>
        <button type="button">WEP</button>
        <button type="button">WPS فقط</button>
      </div>
      <div class="feedback"></div>
    </div>
    <p><a class="card" href="#/"><b>✓</b><strong>العودة للبداية</strong><small>مسار أ3 → أ4 → أ5</small></a></p>
  `;
}

document.getElementById("theme-btn").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", dark ? "light" : "dark");
  document.getElementById("theme-btn").textContent = dark ? "☾" : "☀";
});

window.addEventListener("hashchange", route);
route();

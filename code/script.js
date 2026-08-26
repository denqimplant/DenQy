// ═══════════════════════════════════════════════════════════════════
//  DenQ Chatbot  —  UI Logic & Navigation
//  Data is loaded from:  data/company.js  |  data/implant.js
// ═══════════════════════════════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const userInput    = document.getElementById('user-input');
const sendButton   = document.getElementById('send-button');

// ── Modal zoom state ───────────────────────────────────────────────
const _z = { s: 1, x: 0, y: 0, drag: false, mx: 0, my: 0, pinch: 0 };

// ── Language ────────────────────────────────────────────────────────
let LANG = 'en';

function tr(en, loKey, ...args) {
    if (LANG !== 'lo' || !window.LO) return en;
    const v = window.LO[loKey];
    if (v === undefined) return en;
    return typeof v === 'function' ? v(...args) : v;
}

function getProductInfo(key) {
    const base = PRODUCT_DETAIL[key];
    if (LANG === 'lo' && window.LO?.products?.[key]) return { ...base, ...window.LO.products[key] };
    return base;
}
function getEndoInfo(key) {
    const base = ENDO_DETAIL[key];
    if (LANG === 'lo' && window.LO?.endo?.[key]) return { ...base, ...window.LO.endo[key] };
    return base;
}
function getPackingInfo(key) {
    const base = PACKING_DETAIL[key];
    if (LANG === 'lo' && window.LO?.packing?.[key]) return { ...base, ...window.LO.packing[key] };
    return base;
}
function getLangFaq()         { return (LANG === 'lo' && window.LO?.faq) ? window.LO.faq : FAQ_CURATED; }
function getLangCeoData()     { return (LANG === 'lo' && window.LO) ? { ...CEO_DATA, vision: window.LO.ceoVision || CEO_DATA.vision, highlights: window.LO.ceoHighlights || CEO_DATA.highlights } : CEO_DATA; }
function getLangCompanyData() {
    if (LANG !== 'lo' || !window.LO) return COMPANY_DATA;
    return {
        ...COMPANY_DATA,
        name:         window.LO.companyName         || COMPANY_DATA.name,
        address:      window.LO.companyAddress      || COMPANY_DATA.address,
        mainBusiness: window.LO.companyMainBusiness || COMPANY_DATA.mainBusiness,
        timeline:     window.LO.companyTimeline     || COMPANY_DATA.timeline,
    };
}

function toggleLangDropdown() {
    const trigger = document.getElementById('lang-trigger');
    const menu = document.getElementById('lang-menu');
    const open = menu.classList.toggle('open');
    trigger.classList.toggle('open', open);
}

function selectLang(lang, flag, label) {
    document.getElementById('lang-flag').textContent = flag;
    document.getElementById('lang-label').textContent = label;
    document.getElementById('lang-menu').classList.remove('open');
    document.getElementById('lang-trigger').classList.remove('open');
    document.querySelectorAll('.lang-option').forEach(btn => btn.classList.remove('lang-option-active'));
    event.currentTarget.classList.add('lang-option-active');
    switchLang(lang);
}

document.addEventListener('click', (e) => {
    const dd = document.getElementById('lang-dropdown');
    if (dd && !dd.contains(e.target)) {
        document.getElementById('lang-menu')?.classList.remove('open');
        document.getElementById('lang-trigger')?.classList.remove('open');
    }
});

function switchLang(lang) {
    LANG = lang;
    document.body.classList.toggle('lang-lo-active', lang === 'lo');
    document.getElementById('chat-messages').innerHTML = '';
    const ig = document.querySelector('.input-guide-text');
    if (ig) ig.textContent = lang === 'lo' ? (window.LO?.inputGuide || '') : '👆 Please use the buttons above to explore DenQ';
    _updateRightPanel();
    showIntro();
}

function _updateRightPanel() {
    const lo = window.LO;
    const isLo = LANG === 'lo' && !!lo;
    const $ = (sel) => document.querySelector(sel);
    const set = (sel, en, loVal) => { const el = $(sel); if (el) el.textContent = isLo ? (loVal || en) : en; };
    const setHTML = (sel, en, loVal) => { const el = $(sel); if (el) el.innerHTML = isLo ? (loVal || en) : en; };

    // ── Left sidebar ───────────────────────────────────────────────
    set('.panel-tagline',         'High Precision Dental Implant', lo?.companyMainBusiness);
    set('.side-categories-label', 'Product Categories',  lo?.sideCategories);
    set('.side-lbl-fixture',      'DenQ Fixture',        lo?.sideFixture);
    set('.side-lbl-cement',       'Cement Retained',     lo?.sideCement);
    set('.side-lbl-screw',        'Screw Retained',      lo?.sideScrew);
    set('.side-lbl-over',         'Overdenture',         lo?.sideOver);
    set('.side-lbl-surgical',     'Surgical Kits',       lo?.sideSurgical);
    set('.side-lbl-endo',         'Endo',                lo?.sideEndo);

    // ── Right panel info ───────────────────────────────────────────
    set('.rp-address',  'Busandaehak-ro 63beon-gil, Geumjeong-gu, Busan, Republic of Korea', lo?.companyAddress);
    set('.rp-business', 'High-Precision Dental Implants', lo?.companyMainBusiness);

    // ── Right panel catalog & contact ──────────────────────────────
    set('.rp-catalog-title',        'Product Catalog',   lo?.rpCatalogTitle);
    set('.rp-catalog-desc',         'Download our complete catalog & brochure for full product specifications and technical data.', lo?.rpCatalogDesc);
    setHTML('.rp-dl-btn.primary',   '📥 Download Catalog',  lo?.rpDlCatalog);
    setHTML('.rp-dl-btn.secondary', '📄 Download Brochure', lo?.rpDlBrochure);
    set('.rp-contact-title',        'Customer Service',  lo?.rpService);
}

// ── Folder paths (relative to index.html inside ode/) ─────────────
const IMG = '../pictures/';  // all product/CEO/packing images
const PDF = '../';           // catalog & brochure PDFs

// ── Typing indicator state ─────────────────────────────────────────
let typingEl = null;

function showTypingIndicator() {
    typingEl = document.createElement('div');
    typingEl.classList.add('typing-wrapper');
    typingEl.innerHTML = `
        <div class="typing-bubble">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>`;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
}

// ── Conversation state tracker ─────────────────────────────────────
const chatState = {
    level:          0,
    section:        null,
    subSection:     null,
    currentProduct: null,
};

// ── Main menu definition ───────────────────────────────────────────
const MAIN_MENU = [
    { label: 'Products',     onClick: showImplantMenu    },
    { label: 'Endo',         onClick: showEndoMenu        },
    { label: 'Company',      onClick: showCompanyProfile  },
    { label: 'Certificates', onClick: showCertificateInfo },
    { label: 'Catalog',      onClick: showCatalogInfo     },
    { label: 'FAQs',         onClick: showOtherMenu       },
    { label: 'Contact Us',   onClick: showContactInfo     },
];

// ═══════════════════════════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════════════════════════

function getCurrentTimestamp() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// On mobile/tablet: scroll the page so the chat container is visible at the top
function scrollPageToChat() {
    if (window.innerWidth <= 820) {
        document.querySelector('.chat-container')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function appendMessage(text, senderType, isHTML = false, showTimestamp = true) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', senderType === 'bot' ? 'wrapper-bot' : 'wrapper-user');

    const bubble = document.createElement('div');
    bubble.classList.add('message', senderType === 'bot' ? 'bot-message' : 'user-message');
    if (isHTML) { bubble.innerHTML  = text; }
    else        { bubble.textContent = text; }

    wrapper.appendChild(bubble);

    if (showTimestamp) {
        const time = document.createElement('div');
        time.classList.add('timestamp');
        time.textContent = getCurrentTimestamp();
        wrapper.appendChild(time);
    }

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (senderType === 'bot') scrollPageToChat();
}

function showButtons(buttons, containerClass = '') {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', 'wrapper-bot', 'wrapper-buttons');

    const container = document.createElement('div');
    container.classList.add('btn-chip-container');
    if (containerClass) container.classList.add(containerClass);

    buttons.forEach(btn => {
        const el = document.createElement('button');
        el.classList.add('btn-chip');
        el.textContent = btn.label;
        el.addEventListener('click', () => {
            appendMessage(btn.label, 'user', false);
            scrollPageToChat();           // snap back to chat immediately on tap
            showTypingIndicator();
            setTimeout(() => { removeTypingIndicator(); btn.onClick(); }, 3000);
        });
        container.appendChild(el);
    });

    wrapper.appendChild(container);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════
//  CARD BUILDERS
// ═══════════════════════════════════════════════════════════════════

function buildProductCard(key) {
    const info = getProductInfo(key);
    if (!info) return '<p>Product information not found.</p>';

    const zoomable = key === 'fixture' || key === 'surgical';
    const zp = zoomable ? ',true' : '';

    const imgHtml = info.image
        ? info.sideImage
            ? `<div class="bot-product-img-row">
                <img src="${IMG}${info.sideImage}" alt="${info.title}" class="bot-product-img-side"
                     onclick="openImageModal('${IMG}${info.sideImage}','${info.title}'${zp})">
                <img src="${IMG}${info.image}" alt="${info.title}" class="bot-product-img-main"
                     onclick="openImageModal('${IMG}${info.image}','${info.title}'${zp})">
               </div>`
            : `<img src="${IMG}${info.image}" alt="${info.title}" class="bot-product-image"
                    onclick="openImageModal('${IMG}${info.image}','${info.title}'${zp})">`
        : '';
    const featuresHtml = (info.specs || []).map(s => `<li>${s}</li>`).join('');

    return `
        <div class="bot-product-card">
            ${imgHtml}
            <div class="bot-product-body">
                <div class="bot-product-title">${info.title}</div>
                ${featuresHtml ? `<ul class="bot-product-features">${featuresHtml}</ul>` : ''}
            </div>
        </div>`;
}

function buildSizeCard(key) {
    const info = PRODUCT_DETAIL[key];
    if (!info) return '<p>Product information not found.</p>';

    // Render interactive HTML tables if sizeData is defined
    if (info.sizeData && info.sizeData.diameters && info.sizeData.diameters.length > 0) {
        const cols = info.sizeData.columns || ['Length', 'Product Code'];

        const tablesHtml = info.sizeData.diameters.map(d => {
            const header = d.label !== null && d.label !== undefined
                ? `Diameter ∅${d.label}`
                : (d.title || cols[0]);
            const rowsHtml = (d.rows || []).map(r =>
                `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`
            ).join('');
            return `
                <div class="size-tbl-wrap">
                    <div class="size-tbl-head">${header}</div>
                    <table class="size-tbl">
                        <thead><tr><th>${cols[0]}</th><th>${cols[1]}</th></tr></thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>`;
        }).join('');

        return `
            <div class="bot-product-card size-chart-card">
                <div class="bot-product-card-header">
                    <div class="bot-product-copy" style="padding:0">
                        <div class="bot-product-title">📐 Size &amp; Code Chart</div>
                        <div class="bot-product-subtitle">${info.title}</div>
                    </div>
                </div>
                <div class="bot-product-body">
                    <div class="size-tbl-grid">${tablesHtml}</div>
                </div>
            </div>`;
    }

    // Fallback to image
    if (!info.sizeImage) return '<p>Size chart not available.</p>';
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">📐 Size &amp; Code Chart</div>
                    <div class="bot-product-subtitle">${info.title}</div>
                </div>
            </div>
            <div class="bot-product-body">
                <img src="${IMG}${info.sizeImage}" alt="Size Chart"
                     onclick="openImageModal('${IMG}${info.sizeImage}','${info.title} — Size & Code')"
                     style="cursor:pointer; width:100%; border-radius:12px; border:1px solid #eee;">
            </div>
        </div>`;
}

function buildCeoCard() {
    const d = getLangCeoData();
    const imgHtml    = d.image
        ? `<img src="${IMG}${d.image}" alt="${d.name}" class="bot-founder-image"
               onclick="openImageModal('${IMG}${d.image}','${d.name}')"
               style="cursor:pointer;">`
        : '';
    const highlights = d.highlights.map(h => `<li>${h}</li>`).join('');
    return `
        <div class="bot-history-card">
            <div class="bot-history-photo-block">
                ${imgHtml}
                <div class="bot-founder-info">
                    <div class="bot-founder-name">${d.name}</div>
                    <div class="bot-founder-title">${d.title}</div>
                </div>
            </div>
            <div class="bot-history-text">
                <h3 class="bot-history-company">${d.company}</h3>
                <p class="bot-history-vision">"${d.vision}"</p>
            </div>
            <div class="bot-history-content">
                <div class="bot-history-timeline">
                    <span class="bot-timeline-year">Est. ${d.founded}</span>
                </div>
                <ul class="bot-history-highlights">${highlights}</ul>
            </div>
        </div>`;
}

function buildCompanyCard() {
    const d = getLangCompanyData();
    const lo = window.LO?.companyInfo;
    const lbl = (enText, loKey) => LANG === 'lo' && lo?.[loKey] ? lo[loKey] : enText;
    const timelineHtml = d.timeline.map(t => `
        <div class="timeline-entry">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
        </div>`).join('');
    return `
        <div class="bot-history-card">
            <div class="bot-history-text">
                <h3 class="bot-history-company">${d.name}</h3>
            </div>
            <p class="company-meta">
                <strong>🏢 ${lbl('Company', 'label_company')}:</strong> ${d.name}
            </p>
            <p class="company-meta">
                <strong>🏭 ${lbl('Business', 'label_business')}:</strong> ${d.mainBusiness}
            </p>
            <p class="company-meta">
                <strong>📍 ${lbl('Address', 'label_address')}:</strong> ${d.address}
            </p>
            <h4 class="section-heading">${lbl('📅 Company Timeline', 'label_timeline')}</h4>
            <div class="timeline-scroll">${timelineHtml}</div>
        </div>`;
}

function buildCatalogCard() {
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${tr('📋 DenQ Documents', 'catalogTitle')}</div>
                    <div class="bot-product-subtitle">${tr('Catalog &amp; Brochure Downloads', 'catalogSubtitle')}</div>
                </div>
            </div>
            <div class="bot-product-body">
                <div class="catalog-btn-group">
                    <a href="${CATALOG_DATA.catalog}"  target="_blank" class="catalog-dl-btn primary">${tr('Catalog', 'catalogBtn')}</a>
                    <a href="${CATALOG_DATA.brochure}" target="_blank" class="catalog-dl-btn secondary">${tr('Brochure', 'brochureBtn')}</a>
                </div>
            </div>
        </div>`;
}

function buildContactCard() {
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${tr('📞 Contact DenQ', 'contactTitle')}</div>
                    <div class="bot-product-subtitle">${tr("We're here to help", 'contactSubtitle')}</div>
                </div>
            </div>
            <div class="bot-product-body">
                <a href="https://forms.gle/YqpKAZYyjtHKLxL49" target="_blank" class="contact-form-btn">${tr('Fill out the Form', 'contactFormBtn')}</a>
                <div class="contact-row"><span class="contact-icon">💬</span><div class="contact-info"><span class="contact-label">${tr('WhatsApp (Consultation)', 'contactWaLabel')}</span><span class="contact-value"><a href="https://wa.me/821082109792" target="_blank">+82 10 8210 9792</a></span></div></div>
                <div class="contact-row"><span class="contact-icon">📧</span><div class="contact-info"><span class="contact-label">${tr('Email', 'contactEmailLbl')}</span><span class="contact-value"><a href="mailto:biz@denq.kr">biz@denq.kr</a></span></div></div>
                <div class="contact-row"><span class="contact-icon">🌐</span><div class="contact-info"><span class="contact-label">${tr('Website', 'contactWebLbl')}</span><span class="contact-value"><a href="https://denq.kr" target="_blank">denq.kr</a></span></div></div>
            </div>
        </div>`;
}

function buildPackingCard(key) {
    const info = getPackingInfo(key);
    if (!info) return '<p>Packaging information not found.</p>';
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${info.title}</div>
                    <div class="bot-product-subtitle">${info.subtitle || ''}</div>
                </div>
            </div>
            <div class="bot-product-body">
                ${info.image ? `<img src="${IMG}${info.image}" alt="${info.title}"
                    class="packing-product-image"
                    onclick="openImageModal('${IMG}${info.image}','${info.title}')">` : ''}
                <p class="bot-product-details">${info.description || ''}</p>
            </div>
        </div>`;
}

function toggleFaqItem(el) {
    const answer = el.nextElementSibling;
    const arrow  = el.querySelector('.faq-acc-arrow');
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-acc-answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-acc-arrow').forEach(a => a.textContent = '▼');
    if (!isOpen) { answer.classList.add('open'); arrow.textContent = '▲'; }
}

function buildFaqAccordion() {
    const itemsHtml = getLangFaq().map(item => `
        <div class="faq-acc-item">
            <div class="faq-acc-question" onclick="toggleFaqItem(this)">
                <span class="faq-acc-q-text">${item.q}</span>
                <span class="faq-acc-arrow">▼</span>
            </div>
            <div class="faq-acc-answer">
                <p>${item.a}</p>
            </div>
        </div>`).join('');
    return `
        <div class="faq-card">
            <div class="faq-card-header">${tr('💡 Frequently Asked Questions', 'faqCardTitle')}</div>
            <div class="faq-acc-list">${itemsHtml}</div>
        </div>`;
}

// ═══════════════════════════════════════════════════════════════════
//  LEVEL 0 — MAIN MENU
// ═══════════════════════════════════════════════════════════════════

function showIntro() {
    const checks = (LANG === 'lo' && window.LO?.checks) ? window.LO.checks : [
        '24/7 Dental Implant Assistance',
        'Get Product Information in Seconds',
        'Instant Access to Catalogs &amp; Brochures',
        'Quick Answers to Your Product Questions',
    ];
    const checkHtml = checks.map(c => `<span style="color:var(--denq-pink);font-weight:700;">✓</span> <em>${c}</em>`).join('<br>');

    setTimeout(() => appendMessage(`<em>${tr('Welcome to DenQ Implant AI-assistant', 'welcome')}</em>`, 'bot', true, false), 0);
    setTimeout(() => appendMessage(`<em>${tr('Here is what DenQy can do for you:', 'capabilites')}</em>`, 'bot', true, false), 1500);
    setTimeout(() => appendMessage(checkHtml, 'bot', true, true), 2800);
    setTimeout(() => showMainMenu(), 3800);
}

function showMainMenu() {
    chatState.level = 0; chatState.section = null; chatState.subSection = null; chatState.currentProduct = null;
    const lo = LANG === 'lo' && window.LO;
    const labels = lo
        ? [lo.menuProducts, lo.menuEndo, lo.menuCompany, lo.menuCerts, lo.menuCatalog, lo.menuFaqs, lo.menuContact]
        : ['Products','Endo','Company','Certificates','Catalog','FAQs','Contact Us'];
    showButtons(MAIN_MENU.map((item, i) => ({ label: labels[i] || item.label, onClick: item.onClick })), 'btn-chip-main-menu');
}

// ── Sidebar quick-link helper ──────────────────────────────────────
// Called by onclick on the left-panel <li> items.
function sidebarNav(label, fn) {
    appendMessage(label, 'user', false);
    showTypingIndicator();
    setTimeout(() => { removeTypingIndicator(); fn(); }, 800);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 1: IMPLANT
// ═══════════════════════════════════════════════════════════════════

function showImplantMenu() {
    chatState.level = 1; chatState.section = 'implant'; chatState.subSection = null;
    appendMessage(tr('Please select a product to see full details:', 'selectProduct'), 'bot', false);
    const submenu = (LANG === 'lo' && window.LO?.implantSubMenu) ? window.LO.implantSubMenu : IMPLANT_SUBMENU;
    const btns = submenu.map(item => ({ label: item.label, onClick: () => handleImplantProduct(item.key) }));
    btns.push(
        { label: tr('Contact', 'menuContact'),   onClick: showContactInfo },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    );
    showButtons(btns);
}

function handleImplantProduct(key) {
    chatState.subSection = key;
    const handlers = {
        fixture:     showFixtureDetail,
        cement:      showCementSubMenu,
        screw:       showScrewSubMenu,
        overdenture: showOverdentureSubMenu,
        surgical:    showSurgicalDetail,
    };
    if (handlers[key]) handlers[key]();
}

// ── Fixture ────────────────────────────────────────────────────────

function showFixtureDetail() {
    chatState.currentProduct = 'fixture';
    const info = getProductInfo('fixture');
    appendMessage(tr(`Here is the ${info.title}.`, 'hereIs', info.title), 'bot', false);
    appendMessage(buildProductCard('fixture'), 'bot', true);
    showButtons([
        { label: tr('Screw',     'btnScrew'),    onClick: () => showRelatedProduct('cement_screw',   showFixtureDetail) },
        { label: tr('Healing',   'btnHealing'),  onClick: () => showRelatedProduct('cement_healing', showFixtureDetail) },
        { label: tr('◀ Back',    'btnBack'),     onClick: showImplantMenu  },
        { label: tr('Catalog',   'btnCatalog'),  onClick: showCatalogInfo  },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu     },
    ]);
}

function showRelatedProduct(key, backFn) {
    chatState.currentProduct = key;
    const info = getProductInfo(key);
    appendMessage(tr(`Here is the ${info?.title}.`, 'hereIs', info?.title), 'bot', false);
    appendMessage(buildProductCard(key), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: backFn          },
        { label: tr('Catalog',   'btnCatalog'),  onClick: showCatalogInfo },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    ]);
}

// ── Sub-menus (Cement / Screw / Digital / Overdenture) ─────────────

function showCementSubMenu() {
    chatState.subSection = 'cement';
    appendMessage(tr('Please select a Cement Retained component:', 'selectCement'), 'bot', false);
    const btns = CEMENT_ITEMS.map(item => ({ label: item.label, onClick: () => showImplantItemDetail(item.key, showCementSubMenu) }));
    btns.push({ label: tr('◀ Back', 'btnBack'), onClick: showImplantMenu }, { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu });
    showButtons(btns);
}

function showScrewSubMenu() {
    chatState.subSection = 'screw';
    appendMessage(tr('Please select a Screw Retained component:', 'selectScrew'), 'bot', false);
    const btns = SCREW_ITEMS.map(item => ({ label: item.label, onClick: () => showImplantItemDetail(item.key, showScrewSubMenu) }));
    btns.push({ label: tr('◀ Back', 'btnBack'), onClick: showImplantMenu }, { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu });
    showButtons(btns);
}

function showOverdentureSubMenu() {
    chatState.subSection = 'overdenture';
    appendMessage(tr('Please select an Overdenture component:', 'selectOverden'), 'bot', false);
    const btns = OVERDENTURE_ITEMS.map(item => ({ label: item.label, onClick: () => showImplantItemDetail(item.key, showOverdentureSubMenu) }));
    btns.push({ label: tr('◀ Back', 'btnBack'), onClick: showImplantMenu }, { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu });
    showButtons(btns);
}

// ── Surgical Kit ───────────────────────────────────────────────────

function showSurgicalDetail() {
    chatState.currentProduct = 'surgical';
    const info = getProductInfo('surgical');
    appendMessage(tr(`Here is the ${info.title}.`, 'hereIs', info.title), 'bot', false);
    appendMessage(buildProductCard('surgical'), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showImplantMenu  },
        { label: tr('Catalog',   'btnCatalog'),  onClick: showCatalogInfo  },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu     },
    ]);
}

// ── Generic item detail ────────────────────────────────────────────

function showImplantItemDetail(key, backFn) {
    chatState.currentProduct = key;
    const info = getProductInfo(key);
    appendMessage(tr(`Here is the ${info?.title}.`, 'hereIs', info?.title), 'bot', false);
    appendMessage(buildProductCard(key), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: backFn          },
        { label: tr('Catalog',   'btnCatalog'),  onClick: showCatalogInfo },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 2: ENDO  (stub)
// ═══════════════════════════════════════════════════════════════════

function buildEndoCard(key) {
    const info = getEndoInfo(key);
    if (!info) return '<p>Product not found.</p>';
    const specsHtml = (info.specs || []).map(s => `<li>${s}</li>`).join('');
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${info.title}</div>
                    <div class="bot-product-subtitle">${info.subtitle || ''}</div>
                </div>
            </div>
            <div class="bot-product-body">
                ${info.image ? `<img src="${IMG}${info.image}" alt="${info.title}"
                    class="bot-product-image"
                    onclick="openImageModal('${IMG}${info.image}','${info.title}')">` : ''}
                ${info.details ? `<p class="bot-product-details">${info.details}</p>` : ''}
                ${specsHtml ? `<ul class="bot-product-features">${specsHtml}</ul>` : ''}
            </div>
        </div>`;
}

function showEndoMenu() {
    chatState.level = 1; chatState.section = 'endo'; chatState.subSection = null;
    appendMessage(tr('Please select an Endo product:', 'selectEndo'), 'bot', false);
    const btns = ENDO_SUBMENU.map(item => ({ label: item.label, onClick: () => showEndoItemDetail(item.key) }));
    btns.push(
        { label: tr('Contact',   'btnContact'),  onClick: showContactInfo },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    );
    showButtons(btns);
}

function showEndoItemDetail(key) {
    chatState.currentProduct = key;
    appendMessage(buildEndoCard(key), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showEndoMenu    },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
        { label: tr('Contact',   'btnContact'),  onClick: showContactInfo },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 3: CATALOG
// ═══════════════════════════════════════════════════════════════════

function showCatalogInfo() {
    chatState.level   = 1;
    chatState.section = 'catalog';
    appendMessage(buildCatalogCard(), 'bot', true);
    showButtons([
        { label: tr('Implant',   'btnImplant'),  onClick: showImplantMenu },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 4: COMPANY PROFILE  (sub-menu: History | R&D | Organization)
// ═══════════════════════════════════════════════════════════════════

function buildCompanyHistoryCard() {
    const d = getLangCompanyData();
    const ci = (LANG === 'lo' && window.LO?.companyInfo) || { label_company: 'Company', label_business: 'Business', label_address: 'Address', label_timeline: '📅 Company Timeline' };
    const timelineHtml = d.timeline.map(t => `
        <div class="timeline-entry">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
        </div>`).join('');
    return `
        <div class="bot-history-card">
            <div class="company-info-row">
                <span class="company-info-label">${ci.label_company}</span>
                <span class="company-info-value">${d.name}</span>
            </div>
            <div class="company-info-row">
                <span class="company-info-label">${ci.label_business}</span>
                <span class="company-info-value">${d.mainBusiness}</span>
            </div>
            <div class="company-info-row">
                <span class="company-info-label">${ci.label_address}</span>
                <span class="company-info-value">${d.address}</span>
            </div>
            <h4 class="section-heading" style="margin-top:16px;">${ci.label_timeline}</h4>
            <div class="timeline-scroll">${timelineHtml}</div>
        </div>`;
}

function showCompanyHistory() {
    chatState.section = 'company_history';
    appendMessage(tr('DenQ Company History:', 'historyTitle'), 'bot', false);
    appendMessage(buildCompanyHistoryCard(), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showCompanyProfile },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu       },
    ]);
}

function buildCompanyRDCard() {
    const items = (LANG === 'lo' && window.LO?.rdItems) ? window.LO.rdItems : [
        'Established a Cooperate R&D Center (2021)',
        'PCT International Patent — "Dental Implant Surface Treatment Method" (2022)',
        'Low-temperature Plasma Surface Treatment Tool for CNC Machines (2023)',
        'Cold Atmospheric Pressure Plasma Surface Modificaton Machine and Surface Modification Method (2023)',
        'Dental implant Surface Treatment Method (2024)',
    ];
    const heading = tr('R&D Achievements', 'rdHeading');
    return `
        <div class="bot-history-card">
            <h4 class="section-heading"> ${heading}</h4>
            <ul class="bot-history-highlights">${items.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>`;
}

function showCompanyRD() {
    chatState.section = 'company_rd';
    appendMessage(tr('DenQ Research and Development:', 'rdTitle'), 'bot', false);
    appendMessage(buildCompanyRDCard(), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showCompanyProfile },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu       },
    ]);
}

function buildCompanyOrgCard() {
    return `
        <div class="bot-history-card" style="padding:0; overflow:hidden;">
            <div style="padding:14px 16px 10px; border-bottom:1px solid rgba(240,121,140,0.1);">
                <div class="bot-product-title"> ${tr('DenQ Organization Chart', 'orgCardTitle')}</div>
            </div>
            <img src="${IMG}Organization.png" alt="DenQ Organization Chart"
                 class="org-chart-image"
                 onclick="openImageModal('${IMG}Organization.png','DenQ Organization Chart')">
        </div>`;
}

function showCompanyOrg() {
    chatState.section = 'company_org';
    appendMessage(tr('DenQ Organization:', 'orgTitle'), 'bot', false);
    appendMessage(buildCompanyOrgCard(), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showCompanyProfile },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu       },
    ]);
}

function buildExhibitionCard() {
    const EXPO_DATA = [
        { year: '2019', events: [
            { name: 'Dentech China',       code: 'cn' },
        ]},
        { year: '2020', events: [
            { name: 'AEEDC',               code: 'ae' },
        ]},
        { year: '2022', events: [
            { name: 'AEEDC',               code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'Expodent Mumbai',     code: 'in' },
            { name: 'Expodent New Delhi',  code: 'in' },
        ]},
        { year: '2023', events: [
            { name: 'AEEDC',               code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'IDEC',                code: 'id' },
            { name: 'CADEX',               code: 'kz' },
            { name: 'WDC',                 code: 'in' },
        ]},
        { year: '2024', events: [
            { name: 'Arab Health',         code: 'ae' },
            { name: 'AEEDC',               code: 'ae' },
            { name: 'IDEX',                code: 'tr' },
            { name: 'Dentech China',       code: 'cn' },
            { name: 'WCOI',                code: 'in' },
        ]},
        { year: '2025', events: [
            { name: 'SIDC',                code: 'sa' },
            { name: 'AEEDC',               code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'VIDEC',               code: 'vn' },
            { name: 'CADEX',               code: 'kz' },
            { name: 'BIBAN',               code: 'sa' },
        ]},
        { year: '2026', events: [
            { name: 'AEEDC',               code: 'ae' },
        ]},
    ];

    const total     = EXPO_DATA.reduce((sum, y) => sum + y.events.length, 0);
    const countries = [...new Set(EXPO_DATA.flatMap(y => y.events.map(e => e.code)))].length;

    const timelineHtml = EXPO_DATA.map(y => `
        <div class="expo-year-block">
            <div class="expo-year-badge">${y.year}</div>
            <div class="expo-events">
                ${y.events.map(e => `
                    <div class="expo-event-chip">
                        <img src="https://flagcdn.com/20x15/${e.code}.png"
                             srcset="https://flagcdn.com/40x30/${e.code}.png 2x"
                             width="20" height="15"
                             alt="${e.code}"
                             class="expo-flag-img">
                        <span class="expo-event-name">${e.name}</span>
                    </div>`).join('')}
            </div>
        </div>`).join('');

    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${tr('🌍 Global Exhibition Presence', 'exhCardTitle')}</div>
                    <div class="bot-product-subtitle">${tr(`${total} exhibitions · ${countries} countries · 2019–2026`, 'exhCardSubtitle', total, countries)}</div>
                </div>
            </div>
            <div class="expo-timeline">${timelineHtml}</div>
        </div>`;
}

function showCompanyExhibition() {
    chatState.section = 'company_exhibition';
    appendMessage(tr('DenQ Global Exhibition History:', 'exhTitle'), 'bot', false);
    appendMessage(buildExhibitionCard(), 'bot', true);
    showButtons([
        { label: tr('◀ Back',    'btnBack'),     onClick: showCompanyProfile },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu       },
    ]);
}

function showCompanyProfile() {
    chatState.level   = 1;
    chatState.section = 'company';
    appendMessage(tr('Select a topic about DenQ:', 'selectCompany'), 'bot', false);
    showButtons([
        { label: tr('History',      'coHistory'),    onClick: showCompanyHistory    },
        { label: tr('R&D',          'coRD'),         onClick: showCompanyRD         },
        { label: tr('Organization', 'coOrg'),        onClick: showCompanyOrg        },
        { label: tr('Exhibition',   'coExhibition'), onClick: showCompanyExhibition },
        { label: tr('Main Menu',    'btnMainMenu'),  onClick: showMainMenu          },
    ]);
}


// ═══════════════════════════════════════════════════════════════════
//  PART 6: FAQs  (accordion — FAQ_CURATED)
// ═══════════════════════════════════════════════════════════════════

function showOtherMenu() {
    chatState.level   = 1;
    chatState.section = 'faqs';
    appendMessage(tr('Here are the most asked questions about DenQ:', 'faqTitle'), 'bot', false);
    appendMessage(buildFaqAccordion(), 'bot', true);
    showButtons([
        { label: tr('Contact',   'btnContact'),  onClick: showContactInfo },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  CERTIFICATE
// ═══════════════════════════════════════════════════════════════════

function showCertificateInfo() {
    chatState.level   = 1;
    chatState.section = 'certificate';
    appendMessage(tr("Here are DenQ's official certifications:", 'certsTitle'), 'bot', false);
    appendMessage(`
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">${tr('🏅 DenQ Certificates', 'certsCardTitle')}</div>
                    <div class="bot-product-subtitle">${tr('FDA · ISO 13485 · MFDS Approved', 'certsCardSubtitle')}</div>
                </div>
            </div>
            <div class="bot-product-body" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                <img src="${IMG}FDA.png" alt="FDA Certificate"
                     onclick="openImageModal('${IMG}FDA.png','FDA Certificate')"
                     style="cursor:pointer; width:30%; min-width:80px; border-radius:10px; border:1px solid #eee;">
                <img src="${IMG}ISO.png" alt="ISO 13485"
                     onclick="openImageModal('${IMG}ISO.png','ISO 13485')"
                     style="cursor:pointer; width:30%; min-width:80px; border-radius:10px; border:1px solid #eee;">
                <img src="${IMG}MFDS.png" alt="MFDS Certificate"
                     onclick="openImageModal('${IMG}MFDS.png','MFDS Certificate')"
                     style="cursor:pointer; width:30%; min-width:80px; border-radius:10px; border:1px solid #eee;">
            </div>
        </div>`, 'bot', true);
    showButtons([
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
        { label: tr('Contact',   'btnContact'),  onClick: showContactInfo },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════════════════════════════

function showContactInfo() {
    appendMessage(buildContactCard(), 'bot', true);
    showButtons([
        { label: tr('Implant',   'btnImplant'),  onClick: showImplantMenu },
        { label: tr('Main Menu', 'btnMainMenu'), onClick: showMainMenu    },
    ]);
}

function showBusinessInquiry() {
    appendMessage(`
        <div class="info-guide-card">
            <div class="info-guide-head">
                <span class="info-guide-icon"></span>
                <div class="info-guide-title">Pricing &amp; Distribution Inquiry</div>
                <div class="info-guide-subtitle">Connect directly with our team</div>
            </div>
            <div class="info-guide-body">
                <p class="info-guide-text">
                    Thank you for your interest in DenQ! For pricing, distribution rights, or exclusive agency inquiries, please reach out to us directly via WhatsApp — our team is ready to assist you.
                </p>
                <div class="info-guide-wa">
                    <span>💬</span>
                    <span>WhatsApp &nbsp;<span class="info-guide-wa-number">+82 10 8210 9792</span></span>
                </div>
                <div class="info-guide-divider">Please include in your message</div>
                <ul class="info-guide-list">
                    <li><span class="info-guide-num">1</span><span>Full Name</span></li>
                    <li><span class="info-guide-num">2</span><span>Job Title &amp; Position</span></li>
                    <li><span class="info-guide-num">3</span><span>Email Address</span></li>
                    <li><span class="info-guide-num">4</span><span>Company Name &amp; Portfolio</span></li>
                    <li><span class="info-guide-num">5</span><span>Website or Social Media (SNS)</span></li>
                    <li><span class="info-guide-num">6</span><span>Have you traded with any Korean dental brands?</span></li>
                    <li><span class="info-guide-num">7</span><span>Estimated monthly or annual purchase volume</span></li>
                </ul>
                <div class="info-guide-footer">
                    We'll get back to you as soon as possible. We look forward to connecting with you! 😊
                </div>
            </div>
        </div>`, 'bot', true);
    showButtons([
        { label: 'Contact',   onClick: showContactInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

function showFallbackGuide() {
    appendMessage(`
        <div class="info-guide-card">
            <div class="info-guide-head">
                <span class="info-guide-icon">👋</span>
                <div class="info-guide-title">Not sure what to look for?</div>
                <div class="info-guide-subtitle">Here's what the DenQY can do</div>
            </div>
            <div class="info-guide-body">
                <p class="info-guide-text">
                    DenQY is here to help you explore everything about DenQ Implant Co., Ltd — who we are, what we make, and how we can help you.
                </p>
                <div class="info-guide-divider">What you can explore</div>
                <ul class="info-guide-list">
                    <li><span class="info-guide-num">1</span><span> Implant — Fixtures, abutments, surgical kits &amp; more</span></li>
                    <li><span class="info-guide-num">2</span><span> Endo — Endodontic remover &amp; condenser instruments</span></li>
                    <li><span class="info-guide-num">3</span><span> Company — CEO profile, history &amp; R&amp;D achievements</span></li>
                    <li><span class="info-guide-num">4</span><span> Certificates — FDA, ISO 13485 &amp; MFDS certifications</span></li>
                    <li><span class="info-guide-num">5</span><span> Catalog — Download our full product catalog &amp; brochure</span></li>
                    <li><span class="info-guide-num">6</span><span> FAQs — Frequently asked questions &amp; resources</span></li>
                </ul>
                <div class="info-guide-footer">
                    Tap a button below or type a product name to get started!
                </div>
            </div>
        </div>`, 'bot', true);
    showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })), 'btn-chip-main-menu');
}

// ═══════════════════════════════════════════════════════════════════
//  FREE-TEXT INPUT HANDLER
// ═══════════════════════════════════════════════════════════════════

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user', false);
    userInput.value = '';
    showTypingIndicator();
    setTimeout(() => { removeTypingIndicator(); handleFreeText(text); }, 3000);
}

// ── Keyword → product map (used by smart search) ──────────────────
const PRODUCT_KEYWORD_MAP = [
    { pattern: /\b(sla fixture|denq fixture|sub sla|implant fixture|fixture)\b/i, key: 'fixture',            ctx: 'implant' },
    { pattern: /\b(healing abutment|healing)\b/i,                         key: 'cement_healing',     ctx: 'implant' },
    { pattern: /\b(cover screw|cement screw abutment)\b/i,                key: 'cement_screw',       ctx: 'implant' },
    { pattern: /\b(cement abutment|cementable|transfer|dual abutment|couple|couple abutment|dual|transfer abutment|Transfer|Dual|Cement)\b/i,                                  key: 'cement_cement',      ctx: 'implant' },
    { pattern: /\b(angled abutment|angled)\b/i,                           key: 'cement_angled',      ctx: 'implant' },
    { pattern: /\b(freemill)\b/i,                                         key: 'cement_freemill',    ctx: 'implant' },
    { pattern: /\b(ccm)\b/i,                                              key: 'cement_ccm',         ctx: 'implant' },
    { pattern: /\b(temporary abutment|temporary)\b/i,                     key: 'cement_temporary',   ctx: 'implant' },
    { pattern: /\b(pick.?up coping|pick.?up)\b/i,                         key: 'cement_pickup',      ctx: 'implant' },
    { pattern: /\b(transfer coping|transfer)\b/i,                         key: 'cement_transfer',    ctx: 'implant' },
    { pattern: /\b(straight abutment)\b/i,                                key: 'screw_straight',     ctx: 'implant' },
    { pattern: /\b(multiple angled abutment|multi angled|multiunit angled)\b/i, key: 'screw_angled', ctx: 'implant' },
    { pattern: /\b(ti cylinder|ticylinder)\b/i,                           key: 'screw_ticylinder',   ctx: 'implant' },
    { pattern: /\b(burn.?out|plastic abutment)\b/i,                       key: 'screw_plastic',      ctx: 'implant' },
    { pattern: /\b(ball attachment|ball abutment)\b/i,                    key: 'overdenture_ball',   ctx: 'implant' },
    { pattern: /\b(locator abutment|locator)\b/i,                         key: 'overdenture_locator',ctx: 'implant' },
    { pattern: /\b(surgical kit|surgical drill)\b/i,                      key: 'surgical',           ctx: 'implant' },
    { pattern: /\b(endo remover|remover)\b/i,                             key: 'remover',            ctx: 'endo'    },
    { pattern: /\b(endo condenser|condenser)\b/i,                         key: 'condenser',          ctx: 'endo'    },
];

function handleFreeText(text) {
    const t = text.toLowerCase();

    // ── Greetings ──────────────────────────────────────────────────
    if (/\b(hi|hello|hey|start|menu|help)\b/.test(t)) { showMainMenu(); return; }

    // ── Thank you ──────────────────────────────────────────────────
    if (/\b(thanks|thank you|thank u|thx|ty|appreciate|appreciated|grateful|cheers|much appreciated)\b/i.test(t)) {
        const replies = [
            "You're very welcome! 😊 Feel free to ask if you need anything else.",
            "No problem at all! Happy to help. 😊",
            "Of course! It's our pleasure. Let us know if there's anything else we can assist you with. 😊",
            "Glad I could help! Don't hesitate to reach out anytime. 😊",
        ];
        appendMessage(replies[Math.floor(Math.random() * replies.length)], 'bot', false);
        showButtons([
            { label: 'Main Menu', onClick: showMainMenu    },
            { label: 'Contact',   onClick: showContactInfo },
        ]);
        return;
    }

    // ── Guide Kit ──────────────────────────────────────────────────
    if (/\b(guide kit|guide drill kit|guided kit|guide surgery kit)\b/i.test(t)) {
        appendMessage("We don't carry a Guide Kit at the moment — but we do offer our Taper Surgical Kit, which covers your surgical needs. Here's the full detail:", 'bot', false);
        appendMessage(buildProductCard('surgical'), 'bot', true);
        showButtons([
            { label: 'Surgical KIT', onClick: showSurgicalDetail },
            { label: 'Implant',      onClick: showImplantMenu    },
            { label: 'Main Menu',    onClick: showMainMenu       },
        ]);
        return;
    }

    // ── Smart product search ───────────────────────────────────────
    for (const item of PRODUCT_KEYWORD_MAP) {
        if (item.pattern.test(t)) {
            if (item.ctx === 'endo') {
                const info = ENDO_DETAIL[item.key];
                appendMessage(`Here's the info on **${info?.title}**:`, 'bot', false);
                appendMessage(buildEndoCard(item.key), 'bot', true);
                showButtons([
                    { label: 'Main Menu', onClick: showMainMenu    },
                    { label: 'Contact',   onClick: showContactInfo },
                ]);
            } else {
                const info = PRODUCT_DETAIL[item.key];
                appendMessage(`Here's the info on ${info?.title}:`, 'bot', false);
                appendMessage(buildProductCard(item.key), 'bot', true);
                if (info?.sizeData) {
                    setTimeout(() => {
                        appendMessage('Would you like to see the Size & Code?', 'bot', false);
                        showButtons([
                            { label: 'Yes',       onClick: () => { appendMessage(buildSizeCard(item.key), 'bot', true); showButtons([{ label: 'Main Menu', onClick: showMainMenu }]); }},
                            { label: 'No',        onClick: showMainMenu    },
                            { label: 'Main Menu', onClick: showMainMenu    },
                        ]);
                    }, 600);
                } else {
                    showButtons([
                        { label: 'Main Menu', onClick: showMainMenu    },
                        { label: 'Contact',   onClick: showContactInfo },
                    ]);
                }
            }
            return;
        }
    }

    // ── Section navigation ─────────────────────────────────────────
    if (/\b(implant|abutment|implants)\b/.test(t))                               { showImplantMenu();    return; }
    if (/\b(endo|endodontic|root canal)\b/.test(t))                              { showEndoMenu();       return; }
    if (/\b(catalog|catalogue|brochure|download|pdf)\b/.test(t))                 { showCatalogInfo();    return; }
    if (/\b(timeline|founding)\b/.test(t))                                                      { showCompanyHistory();    return; }
    if (/\b(r&d|research|development|patent|innovation|plasma)\b/i.test(t))                   { showCompanyRD();         return; }
    if (/\b(organization|organisation|ceo|founder|bio|team)\b/.test(t))                        { showCompanyOrg();        return; }
    if (/\b(exhibition|expo|fair|trade show|aeedc|ids|dentech|expodent|idec|cadex)\b/i.test(t)){ showCompanyExhibition(); return; }
    if (/\b(history|company|about|introduction|intro|founded)\b/.test(t))                      { showCompanyProfile();    return; }
    if (/\b(faq|faqs|question|questions|ask)\b/.test(t))                                 { showOtherMenu();      return; }
    if (/\bce\b.*\b(mark|marks|marking|certificate|cert|certified)\b|\b(ce mark|ce marks|ce certificate)\b/.test(t)) {
        appendMessage("DenQ's CE Mark certification is currently in progress — we're actively working on it and expect to have it available soon. In the meantime, DenQ holds FDA, ISO 13485, and MFDS certifications. Feel free to contact us if you need more details!", 'bot', false);
        showButtons([
            { label: 'Certificate', onClick: showCertificateInfo },
            { label: 'Contact',     onClick: showContactInfo     },
            { label: 'Main Menu',   onClick: showMainMenu        },
        ]);
        return;
    }
    if (/\b(certificate|certificates|certification|certifications|certified|fda|iso|mfds)\b/.test(t)) { showCertificateInfo(); return; }
    if (/\b(contact|whatsapp|email|phone|reach)\b/.test(t))               { showContactInfo();      return; }

    // ── Business inquiries ─────────────────────────────────────────
    if (/\b(price|prices|pricing|pricelist|price list|cost|costs|how much|quote|quotation)\b/.test(t) ||
        /\b(distributor|distributors|distribution|dealer|dealers|agent|agents|exclusive|reseller|resellers|partner|partnership|stockist|import|importer)\b/.test(t)) {
        showBusinessInquiry(); return;
    }

    // ── Fallback guide ─────────────────────────────────────────────
    showFallbackGuide();
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });

// ═══════════════════════════════════════════════════════════════════
//  IMAGE MODAL
// ═══════════════════════════════════════════════════════════════════

function openImageModal(src, title, zoomable) {
    const modal     = document.getElementById('image-modal');
    const modalImg  = document.getElementById('modal-image');
    const captionEl = document.getElementById('modal-caption');
    const zoomBtns  = document.getElementById('modal-zoom-btns');

    modal.style.display          = 'flex';
    modalImg.src                 = src;
    captionEl.textContent        = title;
    document.body.style.overflow = 'hidden';

    _z.s = 1; _z.x = 0; _z.y = 0; _z.drag = false;
    modalImg.style.transform  = '';
    modalImg.style.transition = '';
    modalImg.style.cursor     = zoomable ? 'zoom-in' : 'default';
    modalImg.classList.toggle('zoomable', !!zoomable);
    if (zoomBtns) zoomBtns.style.display = zoomable ? 'flex' : 'none';
}

function closeImageModal() {
    const modal    = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const zoomBtns = document.getElementById('modal-zoom-btns');
    modal.style.display          = 'none';
    document.body.style.overflow = 'auto';
    _z.s = 1; _z.x = 0; _z.y = 0; _z.drag = false;
    modalImg.style.transform = '';
    modalImg.classList.remove('zoomable');
    if (zoomBtns) zoomBtns.style.display = 'none';
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    showIntro();

    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeImageModal);

    const modal    = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeImageModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });

    // ── Zoom helpers ───────────────────────────────────────────────
    function applyZ() {
        modalImg.style.transform  = `translate(${_z.x}px,${_z.y}px) scale(${_z.s})`;
        modalImg.style.cursor     = _z.s > 1 ? (_z.drag ? 'grabbing' : 'grab') : 'zoom-in';
    }

    // Scroll-wheel zoom (laptop)
    if (modalImg) modalImg.addEventListener('wheel', e => {
        if (!modalImg.classList.contains('zoomable')) return;
        e.preventDefault();
        const step = e.deltaY < 0 ? 0.2 : -0.2;
        _z.s = Math.min(Math.max(1, _z.s + step), 4);
        if (_z.s === 1) { _z.x = 0; _z.y = 0; }
        applyZ();
    }, { passive: false });

    // Zoom buttons
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
        _z.s = Math.min(_z.s + 0.5, 4);
        applyZ();
    });
    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
        _z.s = Math.max(_z.s - 0.5, 1);
        if (_z.s === 1) { _z.x = 0; _z.y = 0; }
        applyZ();
    });
    document.getElementById('zoom-reset-btn')?.addEventListener('click', () => {
        _z.s = 1; _z.x = 0; _z.y = 0;
        modalImg.style.transform = '';
        modalImg.style.cursor    = 'zoom-in';
    });

    // Drag to pan (when zoomed in)
    if (modalImg) {
        modalImg.addEventListener('mousedown', e => {
            if (!modalImg.classList.contains('zoomable') || _z.s <= 1) return;
            e.preventDefault();
            _z.drag = true;
            _z.mx   = e.clientX - _z.x;
            _z.my   = e.clientY - _z.y;
            modalImg.style.transition = 'none';
        });
    }
    document.addEventListener('mousemove', e => {
        if (!_z.drag) return;
        _z.x = e.clientX - _z.mx;
        _z.y = e.clientY - _z.my;
        applyZ();
    });
    document.addEventListener('mouseup', () => {
        if (!_z.drag) return;
        _z.drag = false;
        modalImg.style.transition = '';
        if (modalImg.classList.contains('zoomable')) applyZ();
    });

    // Pinch-to-zoom (mobile)
    if (modalImg) {
        modalImg.addEventListener('touchstart', e => {
            if (!modalImg.classList.contains('zoomable') || e.touches.length !== 2) return;
            e.preventDefault();
            _z.pinch = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }, { passive: false });

        modalImg.addEventListener('touchmove', e => {
            if (!modalImg.classList.contains('zoomable') || e.touches.length !== 2) return;
            e.preventDefault();
            const d = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            _z.s = Math.min(Math.max(1, _z.s * (d / _z.pinch)), 4);
            _z.pinch = d;
            if (_z.s === 1) { _z.x = 0; _z.y = 0; }
            applyZ();
        }, { passive: false });
    }
});

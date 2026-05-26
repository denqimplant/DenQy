// ═══════════════════════════════════════════════════════════════════
//  DenQ Chatbot  —  UI Logic & Navigation
//  Data is loaded from:  data/company.js  |  data/implant.js
// ═══════════════════════════════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const userInput    = document.getElementById('user-input');
const sendButton   = document.getElementById('send-button');

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

function appendMessage(text, senderType, isHTML = false) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', senderType === 'bot' ? 'wrapper-bot' : 'wrapper-user');

    const bubble = document.createElement('div');
    bubble.classList.add('message', senderType === 'bot' ? 'bot-message' : 'user-message');
    if (isHTML) { bubble.innerHTML  = text; }
    else        { bubble.textContent = text; }

    const time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = getCurrentTimestamp();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // On mobile: bring chat into view whenever bot replies
    if (senderType === 'bot') scrollPageToChat();
}

function showButtons(buttons) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', 'wrapper-bot');

    const container = document.createElement('div');
    container.classList.add('btn-chip-container');

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
    const info = PRODUCT_DETAIL[key];
    if (!info) return '<p>Product information not found.</p>';

    const imgHtml      = info.image
        ? `<img src="${IMG}${info.image}" alt="${info.title}" class="bot-product-image"
               onclick="openImageModal('${IMG}${info.image}','${info.title}')">`
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
    const d = CEO_DATA;
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
    const d = COMPANY_DATA;
    const timelineHtml = d.timeline.map(t => `
        <div class="timeline-entry">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
        </div>`).join('');
    return `
        <div class="bot-history-card">
            <div class="bot-history-text">
                <h3 class="bot-history-company">${d.name}</h3>
                <p class="bot-history-vision">"${d.vision}"</p>
            </div>
            <p class="company-about">${d.about}</p>
            <p class="company-meta">
                <strong>📍 Location:</strong> ${d.location} &nbsp;|&nbsp;
                <strong>📅 Founded:</strong> ${d.founded}
            </p>
            <h4 class="section-heading">🎯 Our Mission</h4>
            <p class="company-about">${d.mission}</p>
            <h4 class="section-heading">📅 Company Timeline</h4>
            <div class="timeline-scroll">${timelineHtml}</div>
        </div>`;
}

function buildCatalogCard() {
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">📋 DenQ Documents</div>
                    <div class="bot-product-subtitle">Catalog &amp; Brochure Downloads</div>
                </div>
            </div>
            <div class="bot-product-body">
                <div class="catalog-btn-group">
                    <a href="${CATALOG_DATA.catalog}" target="_blank" class="catalog-dl-btn primary">Catalog</a>
                    <a href="${CATALOG_DATA.brochure}" target="_blank" class="catalog-dl-btn secondary">Brochure</a>
                </div>
            </div>
        </div>`;
}

function buildContactCard() {
    return `
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">📞 Contact DenQ</div>
                    <div class="bot-product-subtitle">We're here to help · 24 / 7</div>
                </div>
            </div>
            <div class="bot-product-body">
                <a href="https://forms.gle/NDG1ERtjvv9GmX2HA" target="_blank" class="contact-form-btn">📝 Send an Inquiry</a>
                <div class="contact-row"><span class="contact-icon">💬</span><span class="contact-label">WhatsApp</span><span class="contact-value"><a href="https://wa.me/821082109792" target="_blank">+82 10 8210 9792</a></span></div>
                <div class="contact-row"><span class="contact-icon">📧</span><span class="contact-label">Email</span><span class="contact-value"><a href="mailto:biz@denq.kr">biz@denq.kr</a></span></div>
                <div class="contact-row"><span class="contact-icon">🌐</span><span class="contact-label">Website</span><span class="contact-value"><a href="https://denq.kr" target="_blank">denq.kr</a></span></div>
            </div>
        </div>`;
}

function buildPackingCard(key) {
    const info = PACKING_DETAIL[key];
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
    const itemsHtml = FAQ_CURATED.map(item => `
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
            <div class="faq-card-header">💡 Frequently Asked Questions</div>
            <div class="faq-acc-list">${itemsHtml}</div>
        </div>`;
}

// ═══════════════════════════════════════════════════════════════════
//  LEVEL 0 — MAIN MENU
// ═══════════════════════════════════════════════════════════════════

function showMainMenu() {
    chatState.level          = 0;
    chatState.section        = null;
    chatState.subSection     = null;
    chatState.currentProduct = null;

    appendMessage('Welcome to DenQy Info Provider 😊', 'bot', false);
    showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
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
    chatState.level      = 1;
    chatState.section    = 'implant';
    chatState.subSection = null;

    appendMessage('Please select a product to see full details:', 'bot', false);

    const btns = IMPLANT_SUBMENU.map(item => ({
        label:   item.label,
        onClick: () => handleImplantProduct(item.key),
    }));
    btns.push(
        { label: 'Contact',   onClick: showContactInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
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
    const info = PRODUCT_DETAIL['fixture'];
    appendMessage(`Here is the ${info.title}.`, 'bot', false);
    appendMessage(buildProductCard('fixture'), 'bot', true);
    showButtons([
        { label: 'Screw',   onClick: () => showRelatedProduct('cement_screw',   showFixtureDetail) },
        { label: 'Healing', onClick: () => showRelatedProduct('cement_healing', showFixtureDetail) },
        { label: '◀ Back',              onClick: showImplantMenu  },
        { label: 'Catalog',          onClick: showCatalogInfo  },
        { label: 'Main Menu',        onClick: showMainMenu     },
    ]);
}

function showRelatedProduct(key, backFn) {
    chatState.currentProduct = key;
    const info = PRODUCT_DETAIL[key];
    appendMessage(`Here is the ${info?.title}.`, 'bot', false);
    appendMessage(buildProductCard(key), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: backFn          },
        { label: 'Catalog',   onClick: showCatalogInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

// ── Sub-menus (Cement / Screw / Digital / Overdenture) ─────────────

function showCementSubMenu() {
    chatState.subSection = 'cement';
    appendMessage('Please select a Cement Retained component:', 'bot', false);
    const btns = CEMENT_ITEMS.map(item => ({
        label:   item.label,
        onClick: () => showImplantItemDetail(item.key, showCementSubMenu),
    }));
    btns.push(
        { label: '◀ Back', onClick: showImplantMenu },
        { label: 'Main Menu',       onClick: showMainMenu    },
    );
    showButtons(btns);
}

function showScrewSubMenu() {
    chatState.subSection = 'screw';
    appendMessage('Please select a Screw Retained component:', 'bot', false);
    const btns = SCREW_ITEMS.map(item => ({
        label:   item.label,
        onClick: () => showImplantItemDetail(item.key, showScrewSubMenu),
    }));
    btns.push(
        { label: '◀ Back', onClick: showImplantMenu },
        { label: 'Main Menu',       onClick: showMainMenu    },
    );
    showButtons(btns);
}


function showOverdentureSubMenu() {
    chatState.subSection = 'overdenture';
    appendMessage('Please select an Overdenture component:', 'bot', false);
    const btns = OVERDENTURE_ITEMS.map(item => ({
        label:   item.label,
        onClick: () => showImplantItemDetail(item.key, showOverdentureSubMenu),
    }));
    btns.push(
        { label: '◀ Back', onClick: showImplantMenu },
        { label: 'Main Menu',       onClick: showMainMenu    },
    );
    showButtons(btns);
}

// ── Surgical Kit ───────────────────────────────────────────────────

function showSurgicalDetail() {
    chatState.currentProduct = 'surgical';
    const info = PRODUCT_DETAIL['surgical'];
    appendMessage(`Here is the ${info.title}.`, 'bot', false);
    appendMessage(buildProductCard('surgical'), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showImplantMenu  },
        { label: 'Catalog',   onClick: showCatalogInfo  },
        { label: 'Main Menu', onClick: showMainMenu     },
    ]);
}

// ── Generic item detail ────────────────────────────────────────────

function showImplantItemDetail(key, backFn) {
    chatState.currentProduct = key;
    const info = PRODUCT_DETAIL[key];
    appendMessage(`Here is the ${info?.title}.`, 'bot', false);
    appendMessage(buildProductCard(key), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: backFn          },
        { label: 'Catalog',   onClick: showCatalogInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 2: ENDO  (stub)
// ═══════════════════════════════════════════════════════════════════

function buildEndoCard(key) {
    const info = ENDO_DETAIL[key];
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
                    class="endo-product-image-large"
                    onclick="openImageModal('${IMG}${info.image}','${info.title}')">` : ''}
                ${info.details ? `<p class="bot-product-details">${info.details}</p>` : ''}
                ${specsHtml ? `<ul class="bot-product-specs">${specsHtml}</ul>` : ''}
            </div>
        </div>`;
}

function showEndoMenu() {
    chatState.level      = 1;
    chatState.section    = 'endo';
    chatState.subSection = null;

    appendMessage('Please select an Endo product:', 'bot', false);
    const btns = ENDO_SUBMENU.map(item => ({
        label:   item.label,
        onClick: () => showEndoItemDetail(item.key),
    }));
    btns.push(
        { label: 'Contact',   onClick: showContactInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
    );
    showButtons(btns);
}

function showEndoItemDetail(key) {
    chatState.currentProduct = key;
    appendMessage(buildEndoCard(key), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showEndoMenu    },
        { label: 'Main Menu', onClick: showMainMenu    },
        { label: 'Contact',   onClick: showContactInfo },
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
        { label: 'Implant',   onClick: showImplantMenu },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  PART 4: COMPANY PROFILE  (sub-menu: History | R&D | Organization)
// ═══════════════════════════════════════════════════════════════════

function buildCompanyHistoryCard() {
    const d = COMPANY_DATA;
    const timelineHtml = d.timeline.map(t => `
        <div class="timeline-entry">
            <div class="timeline-year">${t.year}</div>
            <div class="timeline-event">${t.event}</div>
        </div>`).join('');
    return `
        <div class="bot-history-card">
            <div class="company-info-row">
                <span class="company-info-label">Company</span>
                <span class="company-info-value">${d.name}</span>
            </div>
            <div class="company-info-row">
                <span class="company-info-label">Business</span>
                <span class="company-info-value">${d.mainBusiness}</span>
            </div>
            <div class="company-info-row">
                <span class="company-info-label">Address</span>
                <span class="company-info-value">${d.address}</span>
            </div>
            <h4 class="section-heading" style="margin-top:16px;">📅 Company Timeline</h4>
            <div class="timeline-scroll">${timelineHtml}</div>
        </div>`;
}

function showCompanyHistory() {
    chatState.section = 'company_history';
    appendMessage(' DenQ Company History:', 'bot', false);
    appendMessage(buildCompanyHistoryCard(), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showCompanyProfile },
        { label: 'Main Menu', onClick: showMainMenu       },
    ]);
}

function buildCompanyRDCard() {
    const rdItems = [
        'Established a Cooperate R&D Center (2021)',
        'PCT International Patent — "Dental Implant Surface Treatment Method" (2022)',
        'Low-temperature Plasma Surface Treatment Tool for CNC Machines (2023)',
        'Cold Atmospheric Pressure Plasma Surface Modificaton Machine and Surface Modification Method (2023)',
        'Dental implant Surface Treatment Method (2024)',
    ].map(a => `<li>${a}</li>`).join('');
    return `
        <div class="bot-history-card">
            <h4 class="section-heading"> R&D Achievements</h4>
            <ul class="bot-history-highlights">${rdItems}</ul>
        </div>`;
}

function showCompanyRD() {
    chatState.section = 'company_rd';
    appendMessage('🔬 DenQ Research and Development:', 'bot', false);
    appendMessage(buildCompanyRDCard(), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showCompanyProfile },
        { label: 'Main Menu', onClick: showMainMenu       },
    ]);
}

function buildCompanyOrgCard() {
    return `
        <div class="bot-history-card" style="padding:0; overflow:hidden;">
            <div style="padding:14px 16px 10px; border-bottom:1px solid rgba(240,121,140,0.1);">
                <div class="bot-product-title"> DenQ Organization Chart</div>
            </div>
            <img src="${IMG}Organization.png" alt="DenQ Organization Chart"
                 class="org-chart-image"
                 onclick="openImageModal('${IMG}Organization.png','DenQ Organization Chart')">
        </div>`;
}

function showCompanyOrg() {
    chatState.section = 'company_org';
    appendMessage('DenQ Organization:', 'bot', false);
    appendMessage(buildCompanyOrgCard(), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showCompanyProfile },
        { label: 'Main Menu', onClick: showMainMenu       },
    ]);
}

function buildExhibitionCard() {
    const EXPO_DATA = [
        { year: '2019', events: [
            { name: 'Dentech China',       code: 'cn' },
        ]},
        { year: '2020', events: [
            { name: 'AEEDC Dubai',         code: 'ae' },
        ]},
        { year: '2022', events: [
            { name: 'AEEDC Dubai',         code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'Expodent Mumbai',     code: 'in' },
            { name: 'Expodent New Delhi',  code: 'in' },
        ]},
        { year: '2023', events: [
            { name: 'AEEDC Dubai',         code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'IDEC',                code: 'id' },
            { name: 'CADEX',               code: 'kz' },
            { name: 'WDC',                 code: 'in' },
        ]},
        { year: '2024', events: [
            { name: 'Arab Health',         code: 'ae' },
            { name: 'AEEDC Dubai',         code: 'ae' },
            { name: 'IDEX',                code: 'tr' },
            { name: 'Dentech China',       code: 'cn' },
            { name: 'WCOI',                code: 'in' },
        ]},
        { year: '2025', events: [
            { name: 'SIDC',                code: 'sa' },
            { name: 'AEEDC Dubai',         code: 'ae' },
            { name: 'IDS',                 code: 'de' },
            { name: 'VIDEC',               code: 'vn' },
            { name: 'CADEX',               code: 'kz' },
            { name: 'BIBAN',               code: 'sa' },
        ]},
        { year: '2026', events: [
            { name: 'AEEDC Dubai',         code: 'ae' },
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
        <div class="bot-history-card" style="padding:0; overflow:hidden;">
            <div style="background:#EC6D75; padding:14px 18px;">
                <div style="color:#fff; font-weight:700; font-size:0.95rem;">🌍 Global Exhibition Presence</div>
                <div style="color:rgba(255,255,255,0.82); font-size:0.74rem; margin-top:3px;">${total} exhibitions · ${countries} countries · 2019–2026</div>
            </div>
            <div class="expo-timeline">${timelineHtml}</div>
        </div>`;
}

function showCompanyExhibition() {
    chatState.section = 'company_exhibition';
    appendMessage('DenQ Global Exhibition History:', 'bot', false);
    appendMessage(buildExhibitionCard(), 'bot', true);
    showButtons([
        { label: '◀ Back',       onClick: showCompanyProfile },
        { label: 'Main Menu', onClick: showMainMenu       },
    ]);
}

function showCompanyProfile() {
    chatState.level   = 1;
    chatState.section = 'company';
    appendMessage('Select a topic about DenQ:', 'bot', false);
    showButtons([
        { label: 'History',      onClick: showCompanyHistory    },
        { label: 'R&D',          onClick: showCompanyRD         },
        { label: 'Organization', onClick: showCompanyOrg        },
        { label: 'Exhibition',   onClick: showCompanyExhibition },
        { label: 'Main Menu',    onClick: showMainMenu          },
    ]);
}


// ═══════════════════════════════════════════════════════════════════
//  PART 6: FAQs  (accordion — FAQ_CURATED)
// ═══════════════════════════════════════════════════════════════════

function showOtherMenu() {
    chatState.level   = 1;
    chatState.section = 'faqs';
    appendMessage('Here are the most asked questions about DenQ:', 'bot', false);
    appendMessage(buildFaqAccordion(), 'bot', true);
    showButtons([
        { label: 'Contact',   onClick: showContactInfo },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  CERTIFICATE
// ═══════════════════════════════════════════════════════════════════

function showCertificateInfo() {
    chatState.level   = 1;
    chatState.section = 'certificate';
    appendMessage("Here are DenQ's official certifications:", 'bot', false);
    appendMessage(`
        <div class="bot-product-card">
            <div class="bot-product-card-header">
                <div class="bot-product-copy" style="padding:0">
                    <div class="bot-product-title">🏅 DenQ Certificates</div>
                    <div class="bot-product-subtitle">FDA · ISO 13485 · MFDS Approved</div>
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
        { label: 'Main Menu', onClick: showMainMenu    },
        { label: 'Contact',   onClick: showContactInfo },
    ]);
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════════════════════════════

function showContactInfo() {
    appendMessage(buildContactCard(), 'bot', true);
    showButtons([
        { label: 'Implant',   onClick: showImplantMenu },
        { label: 'Main Menu', onClick: showMainMenu    },
    ]);
}

function showBusinessInquiry() {
    appendMessage(`
        <div class="info-guide-card">
            <div class="info-guide-head">
                <span class="info-guide-icon">💼</span>
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
                    <li><span class="info-guide-num">1</span><span>🦷 Implant — Fixtures, abutments, surgical kits &amp; more</span></li>
                    <li><span class="info-guide-num">2</span><span>🔬 Endo — Endodontic remover &amp; condenser instruments</span></li>
                    <li><span class="info-guide-num">3</span><span>🏢 Company — CEO profile, history &amp; R&amp;D achievements</span></li>
                    <li><span class="info-guide-num">4</span><span>🏅 Certificates — FDA, ISO 13485 &amp; MFDS certifications</span></li>
                    <li><span class="info-guide-num">5</span><span>📋 Catalog — Download our full product catalog &amp; brochure</span></li>
                    <li><span class="info-guide-num">6</span><span>💡 FAQs — Frequently asked questions &amp; resources</span></li>
                </ul>
                <div class="info-guide-footer">
                    Tap a button below or type a product name to get started!
                </div>
            </div>
        </div>`, 'bot', true);
    showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
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

function openImageModal(src, title) {
    const modal     = document.getElementById('image-modal');
    const modalImg  = document.getElementById('modal-image');
    const captionEl = document.getElementById('modal-caption');
    modal.style.display          = 'block';
    modalImg.src                 = src;
    captionEl.textContent        = title;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    showMainMenu();

    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeImageModal);

    const modal = document.getElementById('image-modal');
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeImageModal(); });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });
});

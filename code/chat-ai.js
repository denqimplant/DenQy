// ═══════════════════════════════════════════════════════════════════
//  chat-ai.js  —  DenQy Conversational AI Layer  (v1.0)
//
//  Load order: AFTER script.js
//  • Overrides handleFreeText() with richer NLP logic
//  • Adds multi-turn sales consultation flow
//  • Handles trick / off-topic questions gracefully
//  • Remembers last product for contextual "tell me more"
// ═══════════════════════════════════════════════════════════════════

// ── AI conversation state ──────────────────────────────────────────
const aiState = {
    lastProduct:  null,   // last product key the user asked about
    lastSection:  null,   // last section visited
    inConsult:    false,  // currently in sales consultation flow
    consultStep:  0,      // which consultation step we're on
    consultData:  {},     // collected consultation answers
    msgCount:     0,      // total messages sent by user
};

// ── Utility helpers ────────────────────────────────────────────────
function randPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ═══════════════════════════════════════════════════════════════════
//  SALES CONSULTATION FLOW
// ═══════════════════════════════════════════════════════════════════

const CONSULT_STEPS = [
    {
        field:    'name',
        prompt:   "Sure! Let me help connect you. First, could you share your full name? 😊",
        validate: v => v.trim().length >= 2,
        error:    "Please enter your full name (at least 2 characters).",
    },
    {
        field:    'company',
        prompt:   "Thanks! And what's your company name, clinic, or hospital?",
        validate: v => v.trim().length >= 2,
        error:    "Please enter your company or clinic name.",
    },
    {
        field:    'country',
        prompt:   "Which country are you based in?",
        validate: v => v.trim().length >= 2,
        error:    "Please enter your country.",
    },
    {
        field:    'inquiry',
        prompt:   "Last one — what is your main inquiry? (e.g. pricing, distribution, exclusive dealership, bulk order, product consultation, etc.)",
        validate: v => v.trim().length >= 3,
        error:    "Please briefly describe your inquiry.",
    },
];

function startConsultFlow() {
    aiState.inConsult   = true;
    aiState.consultStep = 0;
    aiState.consultData = {};

    appendMessage(
        "Of course! Our sales team would love to assist you. Let me collect a few quick details first. 😊",
        'bot', false
    );
    setTimeout(() => {
        appendMessage(CONSULT_STEPS[0].prompt, 'bot', false);
    }, 600);
}

function handleConsultStep(text) {
    const step = CONSULT_STEPS[aiState.consultStep];
    const val  = text.trim();

    // Allow user to cancel consultation mid-flow
    if (/^(cancel|stop|exit|quit|nevermind|never mind|main menu)$/i.test(val)) {
        aiState.inConsult   = false;
        aiState.consultStep = 0;
        aiState.consultData = {};
        appendMessage("No problem! The inquiry was cancelled. How else can I help you? 😊", 'bot', false);
        showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
        return;
    }

    if (!step.validate(val)) {
        appendMessage(step.error, 'bot', false);
        return;
    }

    aiState.consultData[step.field] = val;
    aiState.consultStep++;

    if (aiState.consultStep < CONSULT_STEPS.length) {
        setTimeout(() => {
            appendMessage(CONSULT_STEPS[aiState.consultStep].prompt, 'bot', false);
        }, 400);
    } else {
        aiState.inConsult = false;
        finishConsultFlow();
    }
}

function finishConsultFlow() {
    const d         = aiState.consultData;
    const msgBody   = `Hello DenQ Team! 👋\n\nMy name is ${d.name}\nCompany: ${d.company}\nCountry: ${d.country}\nInquiry: ${d.inquiry}\n\nI was referred via the DenQy AI Assistant.`;
    const waLink    = `https://wa.me/821082109792?text=${encodeURIComponent(msgBody)}`;

    appendMessage(`Thank you, ${d.name}! Here's a summary of your inquiry:`, 'bot', false);

    setTimeout(() => {
        appendMessage(`
            <div class="info-guide-card" style="max-width:420px;">
                <div class="info-guide-head">
                    <span class="info-guide-icon">💼</span>
                    <div class="info-guide-title">Inquiry Summary</div>
                    <div class="info-guide-subtitle">Ready to connect with DenQ Sales Team</div>
                </div>
                <div class="info-guide-body">
                    <ul class="info-guide-list">
                        <li><span class="info-guide-num">👤</span><span><strong>Name:</strong> ${d.name}</span></li>
                        <li><span class="info-guide-num">🏢</span><span><strong>Company:</strong> ${d.company}</span></li>
                        <li><span class="info-guide-num">🌍</span><span><strong>Country:</strong> ${d.country}</span></li>
                        <li><span class="info-guide-num">💬</span><span><strong>Inquiry:</strong> ${d.inquiry}</span></li>
                    </ul>
                    <div class="info-guide-divider">Next Step</div>
                    <div class="info-guide-footer">
                        Tap <strong>Send via WhatsApp</strong> below to forward this directly to our sales team — they'll reply as soon as possible. 😊
                    </div>
                </div>
            </div>`, 'bot', true);

        setTimeout(() => {
            showButtons([
                { label: 'Send via WhatsApp', onClick: () => window.open(waLink, '_blank') },
                { label: 'Contact',           onClick: showContactInfo },
                { label: 'Main Menu',         onClick: showMainMenu    },
            ]);
        }, 400);
    }, 700);
}

// ═══════════════════════════════════════════════════════════════════
//  TRICK / PERSONALITY PATTERNS
// ═══════════════════════════════════════════════════════════════════

const TRICK_PATTERNS = [
    {
        test: t => /\b(who (are|r) you|what are you|who made you|what('s| is) your name|are you (a bot|an ai|a robot|real|human|person)|you a bot)\b/i.test(t),
        replies: [
            "I'm DenQy — your AI guide for DenQ Implant Co., Ltd! I know all about our products, certifications, and company. How can I help you today? 😊",
            "Great question! I'm DenQy, DenQ's digital assistant. I'm here to help you explore implant products and connect you with our team. 🦷",
            "I'm an AI assistant built specifically for DenQ Implant. Think of me as your 24/7 product and company expert! 😊",
        ],
        menu: true,
    },
    {
        test: t => /\b(what can you do|how can you help|your (features?|capabilities?)|help me|what do you know)\b/i.test(t),
        replies: [
            "Here's what I can help you with:\n\n🦷 Implant products — fixtures, abutments, surgical kits\n🔬 Endo instruments — remover & condenser\n🏢 Company info — history, R&D, certifications\n🌍 Global exhibitions — where DenQ has exhibited\n📋 Catalog & brochure downloads\n💬 Connecting you with our sales team\n\nJust type or tap a button to get started!",
        ],
        menu: true,
    },
    {
        test: t => /\b(good morning|good afternoon|good evening|good night|gm|gn)\b/i.test(t),
        replies: [
            "Good to see you! Welcome to DenQy Support. What would you like to explore today? 😊",
            "Hello and welcome! I'm DenQy, ready to help with DenQ implant products and company info. 🦷",
        ],
        menu: true,
    },
    {
        test: t => /\b(how are you|how r u|how do you do|how's it going|how are things|you okay)\b/i.test(t),
        replies: [
            "I'm doing great and fully charged to help! 😄 What would you like to know about DenQ today?",
            "All systems running perfectly! 😄 How can I assist you with DenQ implants today?",
            "Fantastic! Ready to help you find exactly what you need. 😊",
        ],
    },
    {
        test: t => /\b(weather|forecast|rain|sunny|temperature|hot|cold outside)\b/i.test(t),
        replies: [
            "Ha, checking the weather is outside my skill set! 😄 I'm specialized in dental implants though — can I help you explore DenQ products or company info instead?",
        ],
        menu: true,
    },
    {
        test: t => /\b(joke|jokes|funny|make me laugh|humor|comedy)\b/i.test(t),
        replies: [
            "I'm better with implants than comedy, but here's one 😄: Why did the tooth go to the dentist? Because it was feeling a bit 'crown' down! 🦷 Anyway — what can I help you with?",
            "Here's a dental one: What do you call a dentist who doesn't like tea? Denis! 😄 Okay, back to implants — how can I assist you?",
        ],
        menu: true,
    },
    {
        test: t => /\b(food|eat|hungry|restaurant|pizza|burger|lunch|dinner)\b/i.test(t),
        replies: [
            "You're making me hungry! 😄 The only thing I can help you 'bite into' is our product catalog though. Want to explore DenQ implants?",
        ],
        menu: true,
    },
    {
        test: t => /\b(i (love|like) you|you're (great|awesome|amazing|the best)|great bot|amazing)\b/i.test(t),
        replies: [
            "Aw, that's so kind! 😊 I'm always here to help. Is there anything about DenQ I can assist you with?",
            "You're too kind! 😄 Now, let me keep being helpful — what would you like to know about DenQ?",
        ],
    },
    {
        test: t => /^(bye|goodbye|see you|cya|take care|quit|exit|farewell|later|ttyl)\b/i.test(t),
        replies: [
            "Goodbye! 👋 It was a pleasure assisting you. Come back anytime — DenQy is always here! 😊",
            "Take care! 😊 Don't hesitate to return if you have more questions about DenQ implants. Have a great day! 👋",
        ],
    },
    {
        test: t => /\b(no|nope|nah|not really|never mind|nevermind|not now|maybe later)\b/i.test(t),
        replies: [
            "No problem at all! 😊 Feel free to ask whenever you're ready.",
            "That's alright! Let me know if there's anything else I can help with. 😊",
        ],
        menu: true,
    },
    {
        test: t => /^(ok|okay|alright|sure|got it|understood|i see|sounds good|makes sense)\b/i.test(t),
        replies: [
            "Great! 😊 Is there anything else you'd like to know about DenQ?",
            "Perfect! Let me know if you have any other questions. 😊",
        ],
        menu: true,
    },
    {
        test: t => /\b(cool|nice|wow|great|excellent|perfect|awesome|interesting|impressive)\b/i.test(t),
        replies: [
            "Glad you think so! 😊 DenQ puts a lot of care into product quality and innovation. Anything else I can show you?",
            "Thank you! 😊 DenQ is committed to precision and quality. Want to see more products or learn about our certifications?",
        ],
        menu: true,
    },
    {
        test: t => /\b(what('s| is) (denq|denq implant)|tell me about denq|introduce (denq|yourself)|about denq)\b/i.test(t),
        replies: [
            "DenQ Implant Co., Ltd is a precision dental implant manufacturer based in Busan, South Korea — founded in 2019 by CEO Lee Tae Hoon. We hold FDA, ISO 13485, and MFDS certifications, and actively export to the Middle East, Central Asia, and beyond. 🌍",
        ],
        action: () => showCompanyProfile(),
        menu: false,
    },
];

// ═══════════════════════════════════════════════════════════════════
//  TECHNICAL / CLINICAL QUESTION HANDLERS
// ═══════════════════════════════════════════════════════════════════

function handleTechnicalQuestion(t) {

    // Brand compatibility
    if (/\b(osstem|dentium|straumann|zimmer|nobel|biomet|megagen|dentis|dio|hiossen)\b/i.test(t)) {
        if (/\b(compatible|compatibility|work with|fit|use with|match|same connection)\b/i.test(t)) {
            appendMessage(
                "DenQ implants are compatible with **Osstem and Dentium** prosthetic components. For other brand compatibility, our technical team can advise on specific cases — please reach out directly. 😊",
                'bot', false
            );
        } else {
            appendMessage(
                "DenQ is a Korean dental implant brand known for precision and value. Our implants are compatible with Osstem and Dentium components, and we hold FDA, ISO 13485, and MFDS certifications.",
                'bot', false
            );
        }
        showButtons([
            { label: 'Products',     onClick: showImplantMenu     },
            { label: 'Certificates', onClick: showCertificateInfo },
            { label: 'Contact',      onClick: showContactInfo     },
        ]);
        return true;
    }

    // Warranty
    if (/\b(warranty|guarantee|guarantee period|warranty period|how long warranty)\b/i.test(t)) {
        appendMessage(
            "DenQ provides a **3-year warranty** for implant fixtures from the date of purchase. For full warranty terms and conditions, please contact us directly. 😊",
            'bot', false
        );
        showButtons([
            { label: 'Contact',   onClick: showContactInfo },
            { label: 'Main Menu', onClick: showMainMenu    },
        ]);
        return true;
    }

    // Placement torque
    if (/\b(torque|placement torque|insertion torque|final torque|ncm|n.cm)\b/i.test(t)) {
        appendMessage(
            "The recommended placement torque for DenQ fixtures is **30–40 Ncm** for final fixture placement. Always follow the DenQ surgical protocol for best results.",
            'bot', false
        );
        showButtons([
            { label: 'DenQ Fixture', onClick: showFixtureDetail },
            { label: 'Catalog',      onClick: showCatalogInfo   },
            { label: 'Main Menu',    onClick: showMainMenu      },
        ]);
        return true;
    }

    // Material
    if (/\b(material|titanium|grade 4|ti grade|implant material|what('s| is) (it made|the material))\b/i.test(t)) {
        appendMessage(
            "DenQ fixtures are manufactured from **Grade 4 Titanium** with an SLA (Sandblasted, Large-grit, Acid-etched) surface treatment — providing excellent biocompatibility and osseointegration.",
            'bot', false
        );
        showButtons([
            { label: 'DenQ Fixture', onClick: showFixtureDetail },
            { label: 'Main Menu',    onClick: showMainMenu      },
        ]);
        return true;
    }

    // Osseointegration
    if (/\b(osseointegration|bone integration|bone healing|bio.?compatible|biocompat)\b/i.test(t)) {
        appendMessage(
            "DenQ fixtures feature **SLA surface treatment** and Platform Switching design — both clinically proven to enhance osseointegration and long-term implant stability.",
            'bot', false
        );
        showButtons([
            { label: 'DenQ Fixture', onClick: showFixtureDetail },
            { label: 'Main Menu',    onClick: showMainMenu      },
        ]);
        return true;
    }

    // Surface treatment / plasma
    if (/\b(surface|sla surface|surface treatment|plasma treatment|sandblasted|acid.?etched)\b/i.test(t)) {
        appendMessage(
            "DenQ uses **SLA Surface Treatment** (Sandblasted, Large-grit, Acid-etched) on all fixtures. Our patented low-temperature plasma technology further enhances surface bioactivity for faster osseointegration.",
            'bot', false
        );
        showButtons([
            { label: 'R&D',          onClick: showCompanyRD     },
            { label: 'DenQ Fixture', onClick: showFixtureDetail },
            { label: 'Main Menu',    onClick: showMainMenu      },
        ]);
        return true;
    }

    // Internal hex / connection type
    if (/\b(internal hex|connection type|implant connection|hex connection|platform|platform switching)\b/i.test(t)) {
        appendMessage(
            "DenQ fixtures use an **Internal Hex 2.5 connection** with Platform Switching design. This connection is compatible with Osstem and Dentium prosthetics. Torque: 30–40 Ncm.",
            'bot', false
        );
        showButtons([
            { label: 'DenQ Fixture', onClick: showFixtureDetail },
            { label: 'Main Menu',    onClick: showMainMenu      },
        ]);
        return true;
    }

    // Location / address
    if (/\b(where (is|are) (denq|you)|location|address|country|korea|busan|headquarter|office|where.*based)\b/i.test(t)) {
        appendMessage(
            "DenQ Implant Co., Ltd is headquartered in **Busan, Republic of Korea** — at Busandaehak-ro 63beon-gil, Geumjeong-gu, Busan. We are a proudly Korean dental implant manufacturer. 🇰🇷",
            'bot', false
        );
        showButtons([
            { label: 'Company',   onClick: showCompanyProfile },
            { label: 'Contact',   onClick: showContactInfo    },
            { label: 'Main Menu', onClick: showMainMenu       },
        ]);
        return true;
    }

    // Founded / established
    if (/\b(when (was|is) (denq|it|the company) (founded|established|started|created|set up)|founding year|established in|since when|how old|how long)\b/i.test(t)) {
        appendMessage(
            "DenQ Implant Co., Ltd was **founded in 2019** by CEO Lee Tae Hoon, who brings over 20 years of dentistry industry experience. Since then the company has earned FDA, ISO 13485, and MFDS certifications and expanded to global markets.",
            'bot', false
        );
        showButtons([
            { label: 'History',   onClick: showCompanyHistory },
            { label: 'Main Menu', onClick: showMainMenu       },
        ]);
        return true;
    }

    // CEO / founder
    if (/\b(ceo|founder|lee tae hoon|president|owner|who (founded|owns|runs|heads|is behind) (denq|the company))\b/i.test(t)) {
        appendMessage(
            "DenQ was founded by **Lee Tae Hoon** (CEO & Founder), who has 20+ years in the dentistry industry. Under his leadership, DenQ received the $1 million Export Tower Award in 2022 and enrolled in Dubai's Global Business Center in 2024.",
            'bot', false
        );
        appendMessage(buildCeoCard(), 'bot', true);
        showButtons([
            { label: '◀ Back',    onClick: showCompanyProfile },
            { label: 'Main Menu', onClick: showMainMenu       },
        ]);
        return true;
    }

    // CE Mark
    if (/\b(ce mark|ce marks|ce certificate|ce marking|ce certified|ce approval)\b/i.test(t)) {
        appendMessage(
            "DenQ's CE Mark certification is currently **in progress** — we're actively working on it. In the meantime, DenQ holds FDA (510k), ISO 13485, and MFDS certifications. Feel free to contact us if you need more details!",
            'bot', false
        );
        showButtons([
            { label: 'Certificates', onClick: showCertificateInfo },
            { label: 'Contact',      onClick: showContactInfo     },
            { label: 'Main Menu',    onClick: showMainMenu        },
        ]);
        return true;
    }

    // Countries / distribution markets
    if (/\b(which countries|what countries|where do you (sell|ship|export|distribute)|market|markets|global|international)\b/i.test(t)) {
        appendMessage(
            "DenQ is currently active in the **Middle East** (UAE, Saudi Arabia) and **Central Asia** (Kazakhstan, Uzbekistan), with ongoing global expansion. We've participated in major trade shows across Asia, Europe, and the Middle East.",
            'bot', false
        );
        showButtons([
            { label: 'Exhibition', onClick: showCompanyExhibition },
            { label: 'Contact',    onClick: showContactInfo       },
            { label: 'Main Menu',  onClick: showMainMenu          },
        ]);
        return true;
    }

    // Distributor / become agent
    if (/\b(how to (become|be|apply|get) (a|an) (distributor|dealer|agent|representative|rep|reseller)|become (a|an) (distributor|dealer|agent)|distributor application|dealership application)\b/i.test(t)) {
        appendMessage(
            "Interested in becoming a DenQ distributor or dealer? Great! Our team would love to discuss this with you. Let me collect a few details to get you connected. 😊",
            'bot', false
        );
        setTimeout(() => startConsultFlow(), 800);
        return true;
    }

    return false;
}

// ═══════════════════════════════════════════════════════════════════
//  PRODUCT KEYWORD MAP  (enhanced — covers all products + digital lib)
// ═══════════════════════════════════════════════════════════════════

const AI_PRODUCT_MAP = [
    { pattern: /\b(sla fixture|denq fixture|sub sla|fixture)\b/i,               key: 'fixture',             ctx: 'implant' },
    { pattern: /\b(healing abutment|healing)\b/i,                                key: 'cement_healing',      ctx: 'implant' },
    { pattern: /\b(cover screw|cement screw)\b/i,                                key: 'cement_screw',        ctx: 'implant' },
    { pattern: /\b(cement abutment|cementable|dual abutment|couple abutment)\b/i,key: 'cement_cement',       ctx: 'implant' },
    { pattern: /\b(angled abutment|15 degree|25 degree|angle abutment)\b/i,     key: 'cement_angled',       ctx: 'implant' },
    { pattern: /\b(freemill|free.?mill|cad.?cam abutment)\b/i,                   key: 'cement_freemill',     ctx: 'implant' },
    { pattern: /\b(ccm casting|ccm abutment|casting abutment)\b/i,              key: 'cement_ccm',          ctx: 'implant' },
    { pattern: /\b(temporary abutment|temp abutment|provisional abutment)\b/i,  key: 'cement_temporary',    ctx: 'implant' },
    { pattern: /\b(pick.?up coping|pickup coping|open tray|open.?tray)\b/i,     key: 'cement_pickup',       ctx: 'implant' },
    { pattern: /\b(transfer coping|closed tray|closed.?tray)\b/i,               key: 'cement_transfer',     ctx: 'implant' },
    { pattern: /\b(fixture level lab analog|fixture analog)\b/i,                 key: 'cement_analog',       ctx: 'implant' },
    { pattern: /\b(straight abutment)\b/i,                                       key: 'screw_straight',      ctx: 'implant' },
    { pattern: /\b(healing cap|multiunit healing)\b/i,                           key: 'screw_healing',       ctx: 'implant' },
    { pattern: /\b(multiunit angled|multiple angled|multi.?unit angled|multi angled)\b/i, key: 'screw_angled', ctx: 'implant' },
    { pattern: /\b(ccm (casting )?cylinder|casting cylinder)\b/i,               key: 'screw_ccm',           ctx: 'implant' },
    { pattern: /\b(temporary cylinder|temp cylinder|provisional cylinder)\b/i,  key: 'screw_temporary',     ctx: 'implant' },
    { pattern: /\b(burn.?out|plastic (abutment|cylinder))\b/i,                  key: 'screw_plastic',       ctx: 'implant' },
    { pattern: /\b(ti cylinder|ticylinder|titanium cylinder)\b/i,               key: 'screw_ticylinder',    ctx: 'implant' },
    { pattern: /\b(abutment level lab analog|multiunit analog|multi.?unit analog)\b/i, key: 'screw_analog',  ctx: 'implant' },
    { pattern: /\b(multiunit pickup|multi.?unit pick.?up)\b/i,                  key: 'screw_pickup',        ctx: 'implant' },
    { pattern: /\b(multiunit transfer|multi.?unit transfer)\b/i,                key: 'screw_transfer',      ctx: 'implant' },
    { pattern: /\b(ball attachment|ball abutment)\b/i,                          key: 'overdenture_ball',    ctx: 'implant' },
    { pattern: /\b(locator abutment|locator)\b/i,                               key: 'overdenture_locator', ctx: 'implant' },
    { pattern: /\b(surgical kit|surgical drill|surgery kit|taper kit|taper surgical)\b/i, key: 'surgical',   ctx: 'implant' },
    { pattern: /\b(scan body|scanbody|scan.?body)\b/i,                          key: 'digital_scanbody',    ctx: 'implant' },
    { pattern: /\b(lab analog)\b/i,                                              key: 'digital_labanalog',   ctx: 'implant' },
    { pattern: /\b(ti.?base|titanium base for cad|tibase)\b/i,                  key: 'digital_tibase',      ctx: 'implant' },
    { pattern: /\b(endo remover|gp remover|gp cutter)\b/i,                      key: 'remover',             ctx: 'endo'    },
    { pattern: /\b(endo condenser|warm condensation|gp condenser)\b/i,          key: 'condenser',           ctx: 'endo'    },
];

// ═══════════════════════════════════════════════════════════════════
//  MAIN OVERRIDE: handleFreeText()
//  Replaces the version in script.js (this file loads after)
// ═══════════════════════════════════════════════════════════════════

function handleFreeText(text) {
    const t = text.toLowerCase().trim();
    aiState.msgCount++;

    // ── 0. Active sales consultation multi-turn flow ───────────────
    if (aiState.inConsult) {
        handleConsultStep(text);
        return;
    }

    // ── 1. Greetings ───────────────────────────────────────────────
    if (/^(hi+|hello+|hey+|yo+|hiya|howdy|sup|안녕|こんにちは|مرحبا|سلام|hola|bonjour|ciao|namaste)\b/i.test(t)) {
        const greetings = [
            "Hello! 👋 Welcome to DenQy Support! I'm here to help you explore DenQ implant products, certifications, company info, and more. What can I help you with today?",
            "Hi there! 😊 Great to have you here. I'm DenQy — your guide to everything DenQ Implant. How can I assist?",
            "Hey! 👋 Welcome to DenQ! Feel free to ask about our implant products, certifications, company history, or anything else.",
        ];
        appendMessage(randPick(greetings), 'bot', false);
        showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
        return;
    }

    // ── 2. Start / Main menu ───────────────────────────────────────
    if (/^(start|menu|main menu|go back|home|restart|reset|back)$/i.test(t)) {
        showMainMenu(); return;
    }

    // ── 3. Thank you ───────────────────────────────────────────────
    if (/\b(thanks|thank you|thank u|thx|ty|appreciate|appreciated|grateful|cheers|much appreciated|شكراً|감사합니다|merci|gracias|danke)\b/i.test(t)) {
        const replies = [
            "You're very welcome! 😊 Feel free to ask if you need anything else.",
            "No problem at all! Happy to help. 😊",
            "Of course! It's our pleasure. Let us know if there's anything else we can assist you with. 😊",
            "Glad I could help! Don't hesitate to reach out anytime. 😊",
        ];
        appendMessage(randPick(replies), 'bot', false);
        showButtons([
            { label: 'Main Menu', onClick: showMainMenu    },
            { label: 'Contact',   onClick: showContactInfo },
        ]);
        return;
    }

    // ── 4. Trick / personality patterns ───────────────────────────
    for (const trick of TRICK_PATTERNS) {
        if (trick.test(t)) {
            appendMessage(randPick(trick.replies), 'bot', false);
            if (trick.action) {
                setTimeout(() => trick.action(), 700);
            } else if (trick.menu) {
                showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
            }
            return;
        }
    }

    // ── 5. Sales / consultation intent ────────────────────────────
    if (/\b(talk to (sales|someone|a person|human|agent|rep(resentative)?|team)|speak (with|to) (sales|someone|a (person|human))|connect (me|us) (with|to)|consult(ation)?|sales team|want to (buy|purchase|order)|interested in (buying|ordering|purchasing)|place an order|i need help buying|get a quote from)\b/i.test(t)) {
        startConsultFlow();
        return;
    }

    // ── 6. Price / business inquiry (show business guide card) ────
    if (/\b(price|prices|pricing|pricelist|price.?list|cost|costs|how much|quote|quotation|سعر|قيمت)\b/i.test(t) ||
        /\b(distributor|distribution|dealer|agent|exclusive|reseller|partner(ship)?|stockist|import(er)?|become (a|an))\b/i.test(t)) {
        showBusinessInquiry();
        return;
    }

    // ── 7. Technical / clinical / company questions ────────────────
    if (handleTechnicalQuestion(t)) return;

    // ── 8. Guide Kit special case ──────────────────────────────────
    if (/\b(guide kit|guide drill kit|guided kit|guided surgery kit|guided surgery)\b/i.test(t)) {
        appendMessage(
            "We don't offer a Guide Kit at the moment — but our **DenQ Taper Surgical Kit** covers your surgical needs. Here's the full detail:",
            'bot', false
        );
        appendMessage(buildProductCard('surgical'), 'bot', true);
        showButtons([
            { label: 'Surgical KIT', onClick: showSurgicalDetail },
            { label: 'Implant',      onClick: showImplantMenu    },
            { label: 'Main Menu',    onClick: showMainMenu       },
        ]);
        return;
    }

    // ── 9. Smart product keyword search ───────────────────────────
    for (const item of AI_PRODUCT_MAP) {
        if (item.pattern.test(t)) {
            aiState.lastProduct = item.key;
            const intros = [
                "Here's the info on ",
                "Let me pull up ",
                "Great choice! Here's ",
                "Sure! Here's everything about ",
                "Found it! Here's ",
            ];
            const intro = randPick(intros);

            if (item.ctx === 'endo') {
                const info = ENDO_DETAIL[item.key];
                appendMessage(`${intro}${info?.title}:`, 'bot', false);
                appendMessage(buildEndoCard(item.key), 'bot', true);
                showButtons([
                    { label: 'Other Endo', onClick: showEndoMenu    },
                    { label: 'Contact',    onClick: showContactInfo  },
                    { label: 'Main Menu',  onClick: showMainMenu     },
                ]);
            } else {
                const info = PRODUCT_DETAIL[item.key];
                appendMessage(`${intro}${info?.title}:`, 'bot', false);
                appendMessage(buildProductCard(item.key), 'bot', true);
                if (info?.sizeData || info?.sizeImage) {
                    setTimeout(() => {
                        appendMessage('Would you also like to see the Size & Code chart? 📐', 'bot', false);
                        showButtons([
                            { label: 'Yes, show sizes', onClick: () => {
                                appendMessage(buildSizeCard(item.key), 'bot', true);
                                showButtons([
                                    { label: 'More Products', onClick: showImplantMenu  },
                                    { label: 'Contact',       onClick: showContactInfo  },
                                    { label: 'Main Menu',     onClick: showMainMenu     },
                                ]);
                            }},
                            { label: 'No thanks',     onClick: () => {
                                appendMessage("No problem! Let me know if there's anything else I can help with. 😊", 'bot', false);
                                showButtons([
                                    { label: 'More Products', onClick: showImplantMenu },
                                    { label: 'Main Menu',     onClick: showMainMenu    },
                                ]);
                            }},
                            { label: 'Contact',       onClick: showContactInfo },
                        ]);
                    }, 700);
                } else {
                    showButtons([
                        { label: 'More Products', onClick: showImplantMenu },
                        { label: 'Contact',       onClick: showContactInfo },
                        { label: 'Main Menu',     onClick: showMainMenu   },
                    ]);
                }
            }
            return;
        }
    }

    // ── 10. Section / category navigation ─────────────────────────
    if (/\b(implants?|abutments?|products?|product list|implant products?)\b/i.test(t)) { showImplantMenu();     return; }
    if (/\b(endo|endodontic|root canal|endodontia|gp)\b/i.test(t))                     { showEndoMenu();        return; }
    if (/\b(catalog|catalogue|brochure|download|pdf|document)\b/i.test(t))             { showCatalogInfo();     return; }
    if (/\b(faq|faqs|questions?|common questions?|frequently asked)\b/i.test(t))       { showOtherMenu();       return; }
    if (/\b(certificate|certification|fda|iso|mfds|approved|certified|approval)\b/i.test(t)) { showCertificateInfo(); return; }
    if (/\b(contact|whatsapp|email|phone|reach us|call us|get in touch)\b/i.test(t))   { showContactInfo();     return; }
    if (/\b(r&d|research|development|patent|innovation|plasma|low.?temp)\b/i.test(t)) { showCompanyRD();       return; }
    if (/\b(organization|org chart|team structure|management)\b/i.test(t))             { showCompanyOrg();      return; }
    if (/\b(exhibition|expo|trade fair|trade show|aeedc|ids|dentech|expodent|idec|cadex|biban|sidc|videc)\b/i.test(t)) { showCompanyExhibition(); return; }
    if (/\b(history|timeline|milestone|founded|founding|company info|about us)\b/i.test(t)) { showCompanyHistory(); return; }
    if (/\b(company|about|profile|who (is|are) denq|introduction)\b/i.test(t))         { showCompanyProfile();  return; }
    if (/\b(cement retained|cement.?retained|cement prosthetics?)\b/i.test(t))         { showCementSubMenu();   return; }
    if (/\b(screw retained|screw.?retained|screw prosthetics?)\b/i.test(t))            { showScrewSubMenu();    return; }
    if (/\b(overdenture|over denture|over-denture)\b/i.test(t))                       { showOverdentureSubMenu(); return; }

    // ── 11. "Tell me more" / contextual follow-up ──────────────────
    if (/\b(more|tell me more|more info|more details|more about|expand|elaborate|explain more)\b/i.test(t)) {
        if (aiState.lastProduct) {
            const info = PRODUCT_DETAIL[aiState.lastProduct] || ENDO_DETAIL[aiState.lastProduct];
            if (info) {
                appendMessage(`Here are more details about the ${info.title}:`, 'bot', false);
                appendMessage(buildProductCard(aiState.lastProduct), 'bot', true);
                showButtons([
                    { label: 'Contact',   onClick: showContactInfo },
                    { label: 'Main Menu', onClick: showMainMenu    },
                ]);
                return;
            }
        }
        appendMessage("Sure! What would you like to know more about? Here's what I can help with:", 'bot', false);
        showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
        return;
    }

    // ── 12. "Size" / "code" / "dimensions" follow-up ──────────────
    if (/\b(size|sizes|dimension|dimensions|code|product code|size chart|size table)\b/i.test(t)) {
        if (aiState.lastProduct && (PRODUCT_DETAIL[aiState.lastProduct]?.sizeData || PRODUCT_DETAIL[aiState.lastProduct]?.sizeImage)) {
            appendMessage("Here's the Size & Code chart:", 'bot', false);
            appendMessage(buildSizeCard(aiState.lastProduct), 'bot', true);
            showButtons([
                { label: 'Main Menu', onClick: showMainMenu    },
                { label: 'Contact',   onClick: showContactInfo },
            ]);
            return;
        }
        appendMessage("Which product's sizes would you like to see? Please select from our product list:", 'bot', false);
        showButtons(IMPLANT_SUBMENU.map(item => ({
            label:   item.label,
            onClick: () => handleImplantProduct(item.key),
        })).concat([{ label: 'Main Menu', onClick: showMainMenu }]));
        return;
    }

    // ── 13. "Image" / "photo" / "picture" follow-up ───────────────
    if (/\b(image|photo|picture|picture of|show me|let me see|visual)\b/i.test(t)) {
        if (aiState.lastProduct) {
            const info = PRODUCT_DETAIL[aiState.lastProduct] || ENDO_DETAIL[aiState.lastProduct];
            if (info) {
                appendMessage(`Here's the product image for ${info.title}:`, 'bot', false);
                appendMessage(buildProductCard(aiState.lastProduct), 'bot', true);
                showButtons([
                    { label: 'Main Menu', onClick: showMainMenu    },
                    { label: 'Contact',   onClick: showContactInfo },
                ]);
                return;
            }
        }
        appendMessage("Which product image would you like to see? Here are our product categories:", 'bot', false);
        showButtons(MAIN_MENU.map(item => ({ label: item.label, onClick: item.onClick })));
        return;
    }

    // ── 14. Fallback with friendly message ────────────────────────
    const fallbacks = [
        "Hmm, I didn't quite catch that. Here's what I can help you with! 😊",
        "I'm not sure I understood that — let me show you what I can do! 😊",
        "That's a bit outside my expertise, but here's what I know well:",
        "I may have missed that one! Here are the topics I can assist you with:",
    ];
    appendMessage(randPick(fallbacks), 'bot', false);
    showFallbackGuide();
}

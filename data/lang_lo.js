// ═══════════════════════════════════════════════════════════════════
//  LAO LANGUAGE PACK  —  all Lao strings for the DenQ chatbot
//  Technical specs (torque, hex, mm) stay in English by design.
// ═══════════════════════════════════════════════════════════════════

window.LO = {

    // ── Intro ──────────────────────────────────────────────────────
    welcome:     'ຍິນດີຕ້ອນຮັບສູ່ DenQ Implant AI-assistant',
    capabilites: 'ສິ່ງທີ່ DenQy ສາມາດຊ່ວຍທ່ານໄດ້ຄື:',
    checks: [
        'ໃຫ້ຂໍ້ມູນພື້ນຖານກ່ຽວກັບ Dental Implant ໄດ້ຕະຫຼອດ 24/7',
        'ເຂົ້າເຖິງສິນຄ້າຂອງພວກເຮົາໄດ້ທັນທີ',
        'ສາມາດດາວໂຫຼດ Catalog & Brochure',
        'ຮູ້ຈັກສິນຄ້າ ແລະ ບໍລິສັດຂອງພວກເຮົາໄດ້ດີຂຶ້ນ',
    ],

    // ── Main menu labels ───────────────────────────────────────────
    menuProducts: 'ສິນຄ້າ',
    menuEndo:     'Endo',
    menuCompany:  'ກ່ຽວກັບບໍລິສັດ',
    menuCerts:    'ໃບຢັ້ງຢືນ',
    menuCatalog:  'ໂບຊົວ',
    menuFaqs:     'ຄຳຖາມທີ່ພົບເລື້ອຍ',
    menuContact:  'ຕິດຕໍ່ພວກເຮົາ',

    // ── Common button labels ───────────────────────────────────────
    btnMainMenu:   'ເມນູຫຼັກ',
    btnBack:       '◀ ກັບຄືນ',
    btnCatalog:    'ໂບຊົວ',
    btnContact:    'ຕິດຕໍ່',
    btnImplant:    'ຮາກແຂ້ວທຽມ',
    btnYes:        'ແມ່ນ',
    btnNo:         'ບໍ່',
    btnSizeCode:   'ຂະໜາດ & ລະຫັດ',
    btnPacking:    'ການຫຸ້ມຫໍ່',
    btnScrew:      'Screw',
    btnHealing:    'Healing Abutment',

    // ── Bot messages ───────────────────────────────────────────────
    selectProduct:  'ກະລຸນາເລືອກສິນຄ້າເພື່ອເບິ່ງລາຍລະອຽດ:',
    hereIs:         (title) => `ນີ້ແມ່ນ ${title}.`,
    selectCement:   'ກະລຸນາເລືອກອຸປະກອນ Cement Retained:',
    selectScrew:    'ກະລຸນາເລືອກອຸປະກອນ Screw Retained:',
    selectOverden:  'ກະລຸນາເລືອກອຸປະກອນ Overdenture:',
    selectEndo:     'ກະລຸນາເລືອກສິນຄ້າ Endo:',
    selectCompany:  'ເລືອກຫົວຂໍ້ກ່ຽວກັບ DenQ:',
    faqTitle:       'ຄຳຖາມທີ່ຖືກຖາມເລື້ອຍໆກ່ຽວກັບ DenQ:',
    certsTitle:     'ໃບຢັ້ງຢືນທາງການຂອງ DenQ:',
    historyTitle:   'ປະຫວັດຂອງ DenQ:',
    rdTitle:        'ການຄົ້ນຄວ້າ ແລະ ພັດທະນາ DenQ:',
    orgTitle:       'ໂຄງສ້າງອົງກອນ DenQ:',
    exhTitle:       'ປະຫວັດການສະແດງສິນຄ້າທົ່ວໂລກ DenQ:',
    sizeCodeQ:      'ທ່ານຕ້ອງການເບິ່ງຂໍ້ມູນ Size & Code ບໍ?',

    // ── Company submenu buttons ────────────────────────────────────
    coHistory:    'ປະຫວັດ',
    coRD:         'ການຄົ້ນຄວ້າ & ວິໄຈ',
    coOrg:        'ແຜນຜັງໂຄງສ້າງ',
    coExhibition: 'ເຂົ້າຮ່ວມງານມະຫາກຳສະແດງສິນຄ້າ',

    // ── Implant submenu (labels only — keys unchanged) ─────────────
    implantSubMenu: [
        { label: 'ຮາກແຂ້ວທຽມ DenQ',         key: 'fixture'     },
        { label: 'Cement Retained',       key: 'cement'      },
        { label: 'Screw Retained',        key: 'screw'       },
        { label: 'Overdenture',           key: 'overdenture' },
        { label: 'ຊຸດເຄື່ອງມືຜ່າຕັດ',  key: 'surgical'   },
    ],

    // ── CEO & company data ─────────────────────────────────────────
    ceoVision: 'ການໃຫ້ການແກ້ໄຂທີ່ດີຂຶ້ນສຳລັບການດູແລທາງທັນຕະກຳ',
    ceoHighlights: [
        '20+ ປີ ຂອງປະສົບການໃນອຸດສາຫະກຳທາງທັນຕະກຳ',
        'ຕົວແທນ Tech Startup ຂອງ Busan (Million Club)',
        'ໄດ້ຮັບລາງວັນ Export Tower ມູນຄ່າ $1 ລ້ານ ປີ 2022',
        'ລົງທະບຽນ Dubai Global Business Center (GBC) ປີ 2024',
        'ເຊັນ MOU ສົ່ງອອກ $3 ລ້ານ ກັບ ອາຊີກາງ',
    ],
    companyTimeline: [
        { year: 2019, event: 'ສ້າງຕັ້ງ ບໍລິສັດ DenQ ອິມແພລນ ຈໍາກັດຜູ້ດຽວ' },
        { year: 2021, event: 'ໄດ້ຖືກຮັບຮອງໂດຍ ISO 9001, ISO 13485' },
        { year: 2022, event: 'ຮັບສິດທິບັດ PCT International "ວິທີການປິ່ນຜິວ Dental Implant"' },
        { year: 2023, event: 'ເຄື່ອງມືປັບປຸງ Plasma Surface ດ້ວຍອຸນຫະພູມຕ່ຳ ສໍາລັບເຄຶ່ອງຈັກ CNC' },
        { year: 2024, event: 'ໄດ້ຖືກຮັບຮອງໂດຍ FDA 510(k)'},
        { year: 2025, event: 'ໄດ້ຖືກຮັບຮອງໂດຍ MFDS' },
    ],
    companyInfo: {
        label_company:  'ບໍລິສັດ',
        label_business: 'ທຸລະກິດ',
        label_address:  'ທີ່ຢູ່',
        label_timeline: '📅 ໄທມ໌ລາຍຂອງບໍລິສັດ',
    },
    companyName:         'ບໍລິສັດ DenQ ອິມແພລນ ຈຳກັດຜູ້ດຽວ',
    companyAddress:      'Busandaehak-ro 63, ເຂດ Geumjeong-gu, ເມືອງ Busan, ສາທາລະນະລັດເກົາຫຼີ',
    companyMainBusiness: 'ໂຮງງານຊ່ຽວຊານດ້ານການຜະລິດອຸປະກອນຮາກແຂ້ວທຽມ',
    // ── R&D items ──────────────────────────────────────────────────
    rdItems: [
        'ສ້າງຕັ້ງຫ້ອງເລັບ R&D ໃນປີ 2021',
        'ໄດ້ຮັບສິດທິບັດ PCT International — "ວິທີການປັບປຸງ Dental Implant Surface" ໃນປີ 2022',
        'ເຄື່ອງມືປັບປຸງ Plasma Surface ອຸນຫະພູມຕໍ່າ ສຳລັບເຄື່ອງຈັກ CNC ໃນປີ 2023',
        'ເຄື່ອງຈັກ ແລະ ວິທີການປັບປຸງສະພາບ Plasma Surface ຄວາມດັນບັນຍາກາດແບບເຢັນ ໃນປີ 2023',
        'ວິທີການປັບປຸງ Dental Implant Surface ໃນປີ 2024',
    ],
    rdHeading: 'ຜົນສຳເລັດດ້ານ R&D',

    // ── Exhibition card ────────────────────────────────────────────
    exhCardTitle:    '🌍 ປະຫວັດການຮ່ວມງານສະແດງສິນຄ້າ',
    exhCardSubtitle: (total, countries) => `${total} ງານສະແດງ · ${countries} ປະເທດ · 2019–2026`,

    // ── FAQ ────────────────────────────────────────────────────────
    faqCardTitle: '💡 ຄຳຖາມທີ່ຖາມປະຈໍາ',
    faq: [
        { q: 'DenQ Implant ເຮັດຫຍັງ?',
          a: 'DenQ Implant ແມ່ນບໍລິສັດທີ່ຊ່ຽວຊານໃນການຜະລິດ ແລະ ສົ່ງອອກລະບົບ Dental Implant.' },
        { q: 'DenQ Implant ຕັ້ງຢູ່ໃສ?',
          a: 'DenQ Implant ຕັ້ງຢູ່ທີ່ Busan, ສາທາລະນະລັດເກົາຫຼີ.' },
        { q: 'DenQ fixtures ໃຊ້ວັດຖຸຫຍັງ?',
          a: 'DenQ fixtures ຜະລິດຈາກ Carpenter Titanium Grade 4.' },
        { q: 'DenQ Implant ເຂົ້າກັນໄດ້ກັບຍີ່ຫໍ້ອື່ນບໍ?',
          a: 'ໄດ້, DenQ Sub SLA Fixture ເຂົ້າກັນໄດ້ກັບ 11° morse taper & 2.5 internal Hex Regular Connection.' },
        { q: 'DenQ ມີໃບຢັ້ງຢືນຫຍັງແດ່?',
          a: 'DenQ Implant ໄດ້ຮັບ FDA 510(k), MFDS (Korean FDA), ISO 13485.' },
        { q: 'DenQ Implant ມີການຮັບປະກັນສິນຄ້າບໍ?',
          a: 'ມີ, DenQ Implant ຮັບປະກັນສິນຄ້າທຸກຊິ້ນ 5 ປີ.' },
        { q: 'DenQ ຄ້າຂາຍກັບປະທດໃດໃນປະຈຸບັນ?',
          a: 'DenQ Implant ເຮັດທຸລະກຳຂາຍຢູ່ຕາເວັນອອກກາງ ແລະ ເຂດ CIS.' },
        { q: 'ຈະສອບຖາມກ່ຽວກັບການຊື້ສິນຄ້າໄດ້ແນວໃດ?',
          a: 'ກະລຸນາໄປທີ່ [DenQy ຕິດຕໍ່ພວກເຮົາ] ແລ້ວສົ່ງ Google Form. ຕົວແທນຈະຕິດຕໍ່ກັບທ່ານ.' },
        { q: 'ຈະສ້າງບັນຊີສະມາຊິກໃໝ່ໄດ້ແນວໃດ?',
          a: 'ໄປທີ່ໜ້າເວັບໄຊ "Main" ແລ້ວກົດປຸ່ມ [Join]. ຕື່ມຂໍ້ມູນໃນ Form ເພື່ອສຳເລັດການລົງທະບຽນ.' },
    ],

    // ── Endo products ──────────────────────────────────────────────
    endo: {
        remover: {
            title:    'ອຸປະກອນ Endo Remover',
            subtitle: 'G.P Cutter ສິດທິບັດເລກ 0317420',
            details:  'ສ່ວນປະກອບ Endo-Remover:',
            specs: [
                'Remover 1 ອັນ',
                'ອຸປະກອນສາກໄຟ 1 ອັນ',
                'ຖ່ານໄຟຟ້າ 2 ອັນ',
                'ຫົວຕັດ 4 ອັນ',
                'ຄູ່ມືການໃຊ້ງານ ແລະ ການຮັບປະກັນ',
            ],
        },
        condenser: {
            title:    'ອຸປະກອນ Endo Condenser',
            subtitle: 'ການອອກແບບເພື່ອຄວາມສະດວກ (Utility Design)',
            details:  'ສ່ວນປະກອບ Endo-Condenser:',
            specs: [
                'Condenser 1 ອັນ',
                'ອຸປະກອນສາກໄຟ 1 ອັນ',
                'ຖ່ານໄຟຟ້າ 2 ອັນ',
                'ຫົວ 2 ອັນ: Fine, Fine Medium',
                'ຄູ່ມືການໃຊ້ງານ ແລະ ການຮັບປະກັນ',
            ],
        },
    },


    // ── Product text (titles/subtitles/specs) ─────────────────────
    products: {
        fixture: {
            subtitle: 'ການແກ້ໄຂ Dental Implant ຊັ້ນສູງ',
            details:  'ຄຸນສົມບັດທີ່ໂດດເດັ່ນ',
            specs: [
                'ຂອບຕັດ / ຄົມຕັດ (Cutting Edge)',
                'ກຽວຄູ່ (Double Thread)',
                'ໄທເທນຽມເກຣດ 4',
                'SLA Surface Treatment',
                'Fixture + Cover Screw',
                'ແຮງບິດ: 30-40 Ncm',
                'ການດີໄຊທີ່ຄຸ້ມຄ່າ',
                'Platform Switching',
                'ຈຸດເຊື່ອມຕໍ່ຫົກຫຼ່ຽມດ້ານໃນຂະໜາດ 2.5 ມມ. (Internal Hex 2.5)',
            ],
        },
    },

    // ── Catalog card ───────────────────────────────────────────────
    catalogTitle:    '📋 ເອກະສານ DenQ',
    catalogSubtitle: 'ດາວໂຫຼດ Catalog & Brochure',
    catalogBtn:      'Catalog',
    brochureBtn:     'Brochure',

    // ── Contact card ───────────────────────────────────────────────
    contactTitle:    '📞 ຕິດຕໍ່ DenQ',
    contactSubtitle: 'ພວກເຮົາພ້ອມຊ່ວຍເຫຼືອທ່ານ 24/7',
    contactFormBtn:  'ປະກອບຟອມປຶກສາທີ່ນີ້',
    contactWaLabel:  'WhatsApp (ເພື່ອປຶກສາ)',
    contactEmailLbl: 'ອີເມລ',
    contactWebLbl:   'ເວັບໄຊ',

    // ── Certificates card ──────────────────────────────────────────
    certsCardTitle:    '🏅 ໃບຢັ້ງຢືນ DenQ',
    certsCardSubtitle: 'ຮັບຮອງໂດຍ FDA 510(k) · ISO 13485 · MFDS',

    // ── Org chart ──────────────────────────────────────────────────
    orgCardTitle: 'ແຜນຜັງໂຄງສ້າງ DenQ',

    // ── Size & Code card ───────────────────────────────────────────
    sizeCardTitle: '📐 ຕາຕະລາງຂະໜາດ & ລະຫັດ',

    // ── Input guide (bottom of chat) ───────────────────────────────
    inputGuide: '👆 ກະລຸນາໃຊ້ປຸ່ມດ້ານເທິງເພື່ອຊອກຮູ້ກ່ຽວກັບ DenQ',

    // ── Right panel ────────────────────────────────────────────────
    rpTagline:      'High Precision Dental Implant',
    rpCatalogTitle: 'ໂບຊົວສິນຄ້າ',
    rpCatalogDesc:  'ດາວໂຫຼດ Catalog ແລະ Brochure ຂອງພວກເຮົາ ເພື່ອລາຍລະອຽດ ແລະ ຂໍ້ມູນດ້ານວິຊາການ.',
    rpDlCatalog:    '📥 ດາວໂຫຼດ Catalog',
    rpDlBrochure:   '📄 ດາວໂຫຼດ Brochure',
    rpService:      'ສອບຖາມ ແລະ ຕິດຕໍ່ຫາພວກເຮົາ',

    // ── Sidebar ────────────────────────────────────────────────────
    sideCategories: 'ໝວດໝູ່ສິນຄ້າ',
    sideFixture:    'ຮາກແຂ້ວທຽມ DenQ',
    sideCement:     'Cement Retained',
    sideScrew:      'Screw Retained',
    sideOver:       'Overdenture',
    sideSurgical:   'ຊຸດເຄື່ອງມືຜ່າຕັດ',
    sideEndo:       'Endo',
};

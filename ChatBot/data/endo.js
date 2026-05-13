// ═══════════════════════════════════════════════════════════════════
//  ENDO DATA  —  Remover and Condenser products
// ═══════════════════════════════════════════════════════════════════

const ENDO_SUBMENU = [
    { label: '🔧 Endo Remover',   key: 'remover'   },
    { label: '🔬 Endo Condenser', key: 'condenser' },
];

const ENDO_DETAIL = {
    remover: {
        image:    'Remover.png',    // ← update to your actual image filename
        title:    'Endo Remover',
        subtitle: 'Endodontic Removal System',
        details:  'Professional Endodontic Remover for Efficient Root Canal Treatment.',
        specs: [
            // Add your product specs here, e.g.:
            // 'Size: #15 – #40',
            // 'Material: NiTi',
        ],
    },
    condenser: {
        image:    'Condenser.png',  // ← update to your actual image filename
        title:    'Endo Condenser',
        subtitle: 'Endodontic Condensation System',
        details:  'High-precision Condenser for Optimal Root Canal Obturation.',
        specs: [
            // Add your product specs here
        ],
    },
};

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
        subtitle: 'G.P Cutter Patent NO.0317420',
        details:  'Endo-Remover Includes:',
        specs: [
            'Remover 1EA',
            'Charger 1EA',
            'Battery Cell 2EA',
            'Cutting Tips 4EA',
            'IFU and Warranty Information',
        ],
    },
    condenser: {
        image:    'Condenser.png',  // ← update to your actual image filename
        title:    'Endo Condenser',
        subtitle: 'Utility Design Application',
        details:  'Endo-Condenser Includes:',
        specs: [
            'Condenser 1EA',
            'Charger 1EA',
            'Battery Cell 2EA',
            'Tip 2EA: Fine, Fine Medium',
            'IFU and Warranty Information',
        ],
    },
};

// ═══════════════════════════════════════════════════════════════════
//  IMPLANT DATA  —  menus, sub-items, and product details
// ═══════════════════════════════════════════════════════════════════

const IMPLANT_SUBMENU = [
    { label: '🔩 DenQ Fixture',     key: 'fixture'    },
    { label: '🦷 Cement Retained',  key: 'cement'     },
    { label: '🔧 Screw Retained',   key: 'screw'      },
    { label: '🦷 Overdenture',      key: 'overdenture'},
    { label: '🧰 Surgical KIT',     key: 'surgical'   },
];

const CEMENT_ITEMS = [
    { label: 'Cement',     key: 'cement_cement'    },
    { label: 'Angled',     key: 'cement_angled'    },
    { label: 'Freemill',   key: 'cement_freemill'  },
    { label: 'CCM',        key: 'cement_ccm'       },
    { label: 'Temporary',  key: 'cement_temporary' },
    { label: 'Analog',     key: 'cement_analog'    },
    { label: 'Pick-up',    key: 'cement_pickup'    },
    { label: 'Transfer',   key: 'cement_transfer'  },
];

const SCREW_ITEMS = [
    { label: 'Straight',    key: 'screw_straight'   },
    { label: 'Healing',     key: 'screw_healing'    },
    { label: 'Angled',      key: 'screw_angled'     },
    { label: 'CCM',         key: 'screw_ccm'        },
    { label: 'Temporary',   key: 'screw_temporary'  },
    { label: 'Plastic',     key: 'screw_plastic'    },
    { label: 'Ti Cylinder', key: 'screw_ticylinder' },
    { label: 'Analog',      key: 'screw_analog'     },
    { label: 'Pick-up',     key: 'screw_pickup'     },
    { label: 'Transfer',    key: 'screw_transfer'   },
];

const DIGITAL_ITEMS = [
    { label: '📡 Scan Body',   key: 'digital_scanbody'  },
    { label: '🔬 Lab Analog',  key: 'digital_labanalog' },
    { label: '🔧 Ti-BASE',     key: 'digital_tibase'    },
];

const OVERDENTURE_ITEMS = [
    { label: '⚙️ Ball',    key: 'overdenture_ball'    },
    { label: '🔒 Locator', key: 'overdenture_locator' },
];

// ── Product detail data ────────────────────────────────────────────
//
//  HOW TO ADD A SIZE TABLE to any product:
//
//  sizeData: {
//      columns: ['Length', 'Product Code'],   ← column header labels
//      diameters: [
//          {
//              label: '3.5',                  ← shown as "Diameter ∅3.5"
//                                               set null for no diameter header
//              rows: [
//                  ['7.0',  'DSSDR37070S'],   ← [length/size, product code]
//                  ['8.5',  'DSSDR37085S'],
//                  ['10.0', 'DSSDR37100S'],
//              ]
//          },
//          // add more diameter objects for each diameter group
//      ]
//  },
//
//  Leave sizeData out (or set to null) to use the image fallback instead.
// ──────────────────────────────────────────────────────────────────

const PRODUCT_DETAIL = {

    // FIXTURE
    fixture: {
        image:     'SLA_Fixture.png',
        title:     'DenQ Sub SLA Fixture',
        subtitle:  'Premium Dental Implant Solution',
        details:   'Typically Emphasized Features',
        specs: [
            'Economical Design',
            'SLA Surface Treatment',
            'Titanium Grade 4',
            'Platform Switching',
            'Double Thread',
            'Cutting Edge',
            'Internal Hex 2.5',
            'Torque: 30-40 Ncm',
            'Packing Unit: Fixture + Cover Screw'
        ],
    },

    // CEMENT RETAINED
    cement_screw: {
        image: 'Screw.png', sizeImage: 'Cement_Screw_Size.png',
        title: 'Cover Screw', subtitle: 'Cement-retained screw interface',
        details: 'Fixture Cover Screw',
        specs: ['Driver: Hex 1.2 Screw Driver', 'Torque: 5-8 Ncm'],
  
    },
    cement_healing: {
        image: 'Healing Abutment.png', sizeImage: 'Healing_Size.png',
        title: 'Healing Abutment', subtitle: 'Soft tissue shaping abutment',
        details: 'DenQ Healing Abutment.',
        specs: ['Packing Unit: Abutment','Driver: Hex 1.2 Screw Driver', 'Torque: 10 Ncm'], 
        
    },
    cement_cement: {
        image: 'Cement.png', sizeImage: 'Cement_Size.png',
        title: 'Cement Abutment', subtitle: 'Cement-retained restoration interface',
        details: 'Abutment Connetor',
        specs: ['Packing Unit: Abutment + Screw', 'Driver: Hex 1.2 Screw Driver', 'Torque: 30 Ncm'],

    },
    cement_angled: {
        image: 'Angle15.png', sizeImage: 'Angled_Size.png',
        title: 'Cement – Angled Abutment', subtitle: 'Angular restorative alignment',
        details: 'Angled Abutment',
        specs: ['Angles: 15° · 25°',
                'Packing Unit: Abutment + Screw',
                'Driver: Hex 1.2 Screw Driver',
                'Torque: 30 Ncm'
            ],
    },
    cement_freemill: {
        image: 'Freemill.png', sizeImage: 'Freemill_Size.png',
        title: 'Freemill Abutment', subtitle: 'CAD/CAM milling cement interface',
        details: 'Cement-retained Freemill Abutment',
        specs: ['Packing Unit: Abutment + Screw', 'Driver: Hex 1.2 Screw Driver', 'Torque: 30 Ncm'],
    },
    cement_ccm: {
        image: 'ccm.png', sizeImage: 'CCM_Size.png',
        title: 'CCM Abutment (Cement)', subtitle: 'Cast metal cement abutment',
        details: 'Custom Cast Metal',
        specs: ['Packing Unit: Cylinder + Screw', 'Driver: 1.2 Hex Screw Driver', 'Torque: 20 Ncm'],
    },
    cement_temporary: {
        image: 'temporary.png', sizeImage: 'Temporary_Size.png',
        title: 'Temporary Abutment (Cement)', subtitle: 'Provisional cement-retained interface',
        details: 'Abutment Connector',
        specs: ['Packing Unit: Abutment + Screw', 'Driver: Hex 1.2 Screw Driver', 'Torque: 20 Ncm'],
         
    },
    cement_analog: {
        image: 'FixtureLabAnalog.png', sizeImage: 'FixtureLabAnalog_Size.png',
        title: 'Lab Analog (Cement)', subtitle: 'Lab replica for model fabrication',
        details: 'Fixture Level Lab Analog',
        specs: ['Packing Unit: Analog'],
    },
    cement_pickup: {
        image: 'pickup.png', sizeImage: 'pickup_Size.png',
        title: 'Pick-up Impression Coping (Cement)', subtitle: 'Open-tray impression transfer',
        details: 'Open-tray pick-up coping',
        specs: ['Packing Unit: Impression Coping + Guide pin', 'Driver: Hex 1.2 Screw Driver'],

    },
    cement_transfer: {
        image: 'transfer.png', sizeImage: 'Transfer_Size.png',
        title: 'Transfer Impression Coping (Cement)', subtitle: 'Closed-tray impression transfer',
        details: 'Closed-tray transfer coping',
        specs: ['Packing Unit: Impression Coping + Guide Pin', 'Driver: Hex 1.2 Screw Driver'],

    },

    // SCREW RETAINED
    screw_straight: {
        image: 'Straight.png', sizeImage: 'Screw_Straight_Size.png',
        title: 'Straight Abutment (Screw)', subtitle: 'Screw-retained straight abutment',
        details: 'Standard Straight Abutment',
        specs: ['Packing Unit: Abutment + Carrier','Driver: internal hex driver', 'Torque: 30 Ncm'],
        
    },
    screw_healing: {
        image: 'healingcap.png', sizeImage: 'Healingcap_Size.png',
        title: 'Healing Abutment (Screw)', subtitle: 'Soft tissue shaping abutment',
        details: 'Multiunit Healing Cap',
        specs: ['Packing Unit: Healing Cap','Driver: 1.2 Hex Screw Driver' ,'Torque: 20 Ncm'],
    },
    screw_angled: {
        image: 'MultiunitAngled.png', sizeImage: 'Angled_Size.png',
        title: 'Angled Abutment (Screw)', subtitle: 'Screw-retained angular alignment',
        details: 'Multiunit Angled Abutment',
        specs: ['Packing Unit: Abutment + Screw + Ti-Carrier','Torque: 30 Ncm','Angles: 17° · 30°', 'Driver: Hex 1.2 Screw Driver'],

    },
    screw_ccm: {
        image: 'multiccm.png', sizeImage: 'MultiCCM_Size.png',
        title: 'CCM Abutment (Screw)', subtitle: 'Cast metal screw abutment',
        details: 'Custom Cast Metal',
        specs: ['Packing Unit: Cylinder + Screw', 'Driver: 1.2 Hex Screw Driver', 'Torque: 20 Ncm'],
    },
    screw_temporary: {
        image: 'multitem.png', sizeImage: 'MultiTem_Size.png',
        title: 'Temporary Abutment (Screw)', subtitle: 'Provisional screw-retained interface',
        details: 'Provisional Abutment During Healing.',
        specs: ['Packing Unit: Cylinder + Screw', 'Driver: 1.2 Hex Screw Driver', 'Torque: 20 Ncm'],
    },
    screw_plastic: {
        image: 'Plastic.png', sizeImage: 'Plastic_Size.png',
        title: 'Plastic Abutment', //subtitle: 'Burn-out pattern for custom castings',
        details: 'DenQ Plastic Abutment',
        specs: ['Packing Unit: Cylinder + Screw', 'Driver: 1.2 Hex Screw Driver', 'Torque: 20 Ncm'],
    },
    screw_ticylinder: {
        image: 'Ticylinder.png', sizeImage: 'TiCylinder_Size.png',
        title: 'Ti Cylinder', subtitle: 'Titanium cylinder for CAD/CAM frameworks',
        details: 'Titanium Cylinder Abutment',
        specs: ['Packing Unit: Cylinder + Screw', 'Driver: 1.2 Hex Screw Driver', 'Torque: 20 Ncm'],
    },
    screw_analog: {
        image: 'MultipleLab Analog.png', sizeImage: 'MultiAnalog_Size.png',
        title: 'Lab Analog (Screw)', //subtitle: 'Lab replica for model fabrication',
        details: 'Abutment Level Lab Analog',
        specs: ['Packing Unit: Lab Analog' ],
    },
    screw_pickup: {
        image: 'multipickup.png', sizeImage: 'MultiPickup_Size.png',
        title: 'Pick-up Impression Coping (Screw)', subtitle: 'Open-tray impression transfer',
        details: 'Open-tray pick-up coping',
        specs: ['Packing Unit: Impression Coping + Guide Pin', 'Driver: Hex 1.2 Screw Driver'],
    },
    screw_transfer: {
        image: 'multitransfer.png', sizeImage: 'MultiTransfer_Size.png',
        title: 'Transfer Impression Coping (Screw)', subtitle: 'Closed-tray impression transfer',
        details: 'Closed-tray coping',
        specs: ['Packing Unit: Impression Coping + Guide Pin', 'Driver: Hex 1.2 Screw Driver'],
    },

    // DIGITAL LIBRARY
    digital_scanbody: {
        image: 'ScanBody.png', sizeImage: 'ScanBody_Size.png',
        title: 'Scan Body', subtitle: 'Digital scan reference for intraoral scanners',
        details: 'Digital Library',
        specs: ['Durable Surface', 'Shape(Half Straight, Half Taper)'],
    },
    digital_labanalog: {
        image: 'Analog.png', sizeImage: 'Analog_Size.png',
        title: 'Lab Analog', subtitle: 'Fixture replica for digital workflows',
        details: 'Digital Library',
        specs: ['Anti-rotation', 'Product Identification Line on Post ', 'Insertion Assuring Notch',],
    },
    digital_tibase: {
        image: 'Ti-base.png', sizeImage: 'TiBase_Size.png',
        title: 'Ti-BASE', subtitle: 'Titanium base for CAD/CAM restorations',
        details: 'Digital Library.',
        specs: ['Mini: 4.0mm','Regular: 4.5mm','Anti-rotation ridge', 'Strong Bonding', 'Tighter Retention in Top Portion','Compatible with Original Screws'],
    },

    // OVERDENTURE
    overdenture_ball: {
        image: 'ball.png', sizeImage: 'Ball_Size.png',
        title: 'Ball Attachment', subtitle: 'Overdenture ball-type retention',
        details: 'DenQ Overdenture Product',

    },
    overdenture_locator: {
        image: 'locator.png', sizeImage: 'Locator_Size.png',
        title: 'Locator Abutment', subtitle: 'Dual-retention overdenture attachment',
        details: 'DenQ Overdenture Product',
    },

    // SURGICAL KIT
    surgical: {
        image: 'DenQTaper.jpeg', sizeImage: 'Surgical_Size.jpeg',
        title: 'DenQ Surgical KIT', subtitle: 'Complete Implant Placement System',
        details: 'DenQ Taper Surgical KIT',
        specs: [
            'Simple KIT: 13 drills',
            'Full KIT: 25 drills',
        ],
    },
};

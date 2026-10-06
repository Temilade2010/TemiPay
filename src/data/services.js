export const TELCO_NETWORKS = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', textColor: '#000000', discount: '3% Cashback', tag: 'Fast 5G' },
  { id: 'airtel', name: 'Airtel', color: '#ED1C24', textColor: '#FFFFFF', discount: '2% Cashback', tag: 'Popular' },
  { id: 'glo', name: 'Glo', color: '#27AE60', textColor: '#FFFFFF', discount: '5% Cashback', tag: 'Grandmasters' },
  { id: '9mobile', name: '9mobile', color: '#00693E', textColor: '#FFFFFF', discount: '4% Cashback', tag: 'Bonus' },
];

export const DATA_PLANS = {
  mtn: [
    { id: 'm1', name: '1.5GB Daily', validity: '24 Hours', price: 500, category: 'Daily' },
    { id: 'm2', name: '2.5GB 2-Days', validity: '2 Days', price: 750, category: 'Daily' },
    { id: 'm3', name: '3.5GB Weekly', validity: '7 Days', price: 1500, category: 'Weekly', popular: true },
    { id: 'm4', name: '6GB Weekly', validity: '7 Days', price: 2500, category: 'Weekly' },
    { id: 'm5', name: '12GB Monthly', validity: '30 Days', price: 4500, category: 'Monthly', popular: true },
    { id: 'm6', name: '20GB Monthly', validity: '30 Days', price: 7000, category: 'Monthly' },
    { id: 'm7', name: '40GB Monthly Super', validity: '30 Days', price: 12500, category: 'Monthly' },
  ],
  airtel: [
    { id: 'a1', name: '1GB Daily Binge', validity: '24 Hours', price: 500, category: 'Daily' },
    { id: 'a2', name: '3GB Weekly', validity: '7 Days', price: 1500, category: 'Weekly', popular: true },
    { id: 'a3', name: '10GB Monthly', validity: '30 Days', price: 4000, category: 'Monthly', popular: true },
    { id: 'a4', name: '18GB Monthly', validity: '30 Days', price: 6500, category: 'Monthly' },
  ],
  glo: [
    { id: 'g1', name: '2GB Daily Gosh', validity: '24 Hours', price: 500, category: 'Daily' },
    { id: 'g2', name: '4GB Weekly Super', validity: '7 Days', price: 1500, category: 'Weekly', popular: true },
    { id: 'g3', name: '14GB Mega Monthly', validity: '30 Days', price: 4500, category: 'Monthly', popular: true },
  ],
  '9mobile': [
    { id: 'n1', name: '1GB Daily Lite', validity: '24 Hours', price: 500, category: 'Daily' },
    { id: 'n2', name: '3.5GB Weekly', validity: '7 Days', price: 1500, category: 'Weekly' },
    { id: 'n3', name: '11GB Monthly', validity: '30 Days', price: 4000, category: 'Monthly' },
  ]
};

export const ELECTRICITY_DISCOS = [
  { id: 'ekedc', name: 'Eko Electricity (EKEDC)', state: 'Lagos Island, Lekki, Apapa' },
  { id: 'ikedc', name: 'Ikeja Electric (IKEDC)', state: 'Lagos Mainland, Ikeja, Ikorodu' },
  { id: 'aedc', name: 'Abuja Electricity (AEDC)', state: 'FCT Abuja, Kogi, Nasarawa' },
  { id: 'ibedc', name: 'Ibadan Electricity (IBEDC)', state: 'Oyo, Ogun, Osun, Kwara' },
  { id: 'eedc', name: 'Enugu Electricity (EEDC)', state: 'Enugu, Abia, Imo, Anambra' },
  { id: 'phed', name: 'Port Harcourt (PHED)', state: 'Rivers, Bayelsa, Cross River' },
  { id: 'kedco', name: 'Kano Electricity (KEDCO)', state: 'Kano, Katsina, Jigawa' },
];

export const CABLE_PROVIDERS = [
  {
    id: 'dstv',
    name: 'DStv',
    packages: [
      { id: 'p1', name: 'DStv Padi', price: 3600 },
      { id: 'p2', name: 'DStv Yanga', price: 5100 },
      { id: 'p3', name: 'DStv Confam', price: 9300 },
      { id: 'p4', name: 'DStv Compact', price: 15700 },
      { id: 'p5', name: 'DStv Compact Plus', price: 25000 },
      { id: 'p6', name: 'DStv Premium', price: 37000 },
    ]
  },
  {
    id: 'gotv',
    name: 'GOtv',
    packages: [
      { id: 'g1', name: 'GOtv Smallie', price: 1575 },
      { id: 'g2', name: 'GOtv Jinja', price: 3300 },
      { id: 'g3', name: 'GOtv Jolli', price: 4850 },
      { id: 'g4', name: 'GOtv Max', price: 7200 },
      { id: 'g5', name: 'GOtv Supa', price: 9600 },
      { id: 'g6', name: 'GOtv Supa+', price: 15700 },
    ]
  },
  {
    id: 'startimes',
    name: 'StarTimes',
    packages: [
      { id: 's1', name: 'Nova (Antenna)', price: 1700 },
      { id: 's2', name: 'Basic (Antenna)', price: 3300 },
      { id: 's3', name: 'Classic (Antenna)', price: 5000 },
      { id: 's4', name: 'Super (Dish)', price: 8200 },
    ]
  },
  {
    id: 'showmax',
    name: 'Showmax',
    packages: [
      { id: 'sh1', name: 'Showmax Entertainment Mobile', price: 1600 },
      { id: 'sh2', name: 'Showmax Premier League Mobile', price: 3200 },
      { id: 'sh3', name: 'Showmax All Screens Pro', price: 5400 },
    ]
  }
];

export const BETTING_PLATFORMS = [
  { id: 'sportybet', name: 'SportyBet', popular: true },
  { id: 'bet9ja', name: 'Bet9ja', popular: true },
  { id: '1xbet', name: '1xBet', popular: true },
  { id: 'betking', name: 'BetKing', popular: false },
  { id: 'msport', name: 'MSport', popular: false },
  { id: 'bangbet', name: 'BangBet', popular: false },
];

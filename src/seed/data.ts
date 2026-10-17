/**
 * Starting content, copied word for word from design/prototype/prototype.html.
 *
 * PLACEHOLDERS: confirm with Pratik Davda before launch: phone/WhatsApp, address,
 * every price, spec and stock status, the stats, all awards, all reviews and the
 * subsidy amount (verify on i-Khedut).
 */

export const products = [
  {
    modelId: 'KS-07', cat: '3', price: 135000, stock: true, best: false,
    specs: { hp: 7, gearsFwd: 5, gearsRev: 1, load: 1, tank: 20, start: 'kick', warranty: 1 },
    name: { gu: 'દવડા સાથી', hi: 'दवडा साथी', en: 'Davada Saathi' },
    desc: {
      gu: 'નાના ખેતર અને રોજિંદી હેરફેર માટે હલકો અને ઓછું ડીઝલ વાપરતો સનેડો.',
      hi: 'छोटे खेत और रोज़ाना ढुलाई के लिए हल्का और कम डीज़ल खाने वाला सनेडो।',
      en: 'Light and easy on diesel, for small farms and daily hauling.',
    },
  },
  {
    modelId: 'KS-10', cat: '3', price: 165000, stock: true, best: true,
    specs: { hp: 10, gearsFwd: 5, gearsRev: 1, load: 1.5, tank: 20, start: 'self', warranty: 1 },
    name: { gu: 'દવડા શક્તિ', hi: 'दवडा शक्ति', en: 'Davada Shakti' },
    desc: {
      gu: 'ખેડ અને માલવહન બંને માટે સૌથી વધુ પસંદ થતું મોડેલ.',
      hi: 'जुताई और माल ढुलाई, दोनों के लिए सबसे पसंदीदा मॉडल।',
      en: 'Our most chosen model for both tilling and hauling.',
    },
  },
  {
    modelId: 'KS-12', cat: '3', price: 195000, stock: true, best: false,
    specs: { hp: 12, gearsFwd: 8, gearsRev: 2, load: 2, tank: 22, start: 'self', warranty: 1 },
    name: { gu: 'દવડા બુલેટ', hi: 'दवडा बुलेट', en: 'Davada Bullet' },
    desc: {
      gu: 'ભારે માલ અને લાંબા અંતર માટે વધુ ખેંચાણશક્તિ ધરાવતો સનેડો.',
      hi: 'भारी माल और लंबी दूरी के लिए ज़्यादा खिंचाव वाला सनेडो।',
      en: 'Extra pulling power for heavy loads and longer trips.',
    },
  },
  {
    modelId: 'KB-10', cat: '4', price: 225000, stock: false, best: false,
    specs: { hp: 10, gearsFwd: 8, gearsRev: 2, load: 2.5, tank: 25, start: 'self', warranty: 1 },
    name: { gu: 'મિની બુલેટ ટ્રેક્ટર', hi: 'मिनी बुलेट ट्रैक्टर', en: 'Mini Bullet Tractor' },
    desc: {
      gu: 'ચાર પૈડાંનું મિની ટ્રેક્ટર. ઢોળાવ અને કાચા રસ્તા પર પણ સ્થિર અને ભરોસાપાત્ર.',
      hi: 'चार पहियों वाला मिनी ट्रैक्टर। ढलान और कच्चे रास्तों पर भी स्थिर और भरोसेमंद।',
      en: 'Four-wheel mini tractor, steady and dependable on slopes and dirt tracks.',
    },
  },
  {
    modelId: 'KT-15', cat: 'impl', price: 45000, stock: true, best: false,
    specs: { load: 1.5, tipping: true, warranty: 1 },
    name: { gu: 'હાઇડ્રોલિક ટ્રોલી', hi: 'हाइड्रोलिक ट्रॉली', en: 'Hydraulic trolley' },
    desc: {
      gu: 'હાઇડ્રોલિક ટિપિંગવાળી મજબૂત ટ્રોલી, માલ ઉતારવો સરળ.',
      hi: 'हाइड्रोलिक टिपिंग वाली मज़बूत ट्रॉली, माल उतारना आसान।',
      en: 'Sturdy tipping trolley that makes unloading easy.',
    },
  },
  {
    modelId: 'KC-05', cat: 'impl', price: null, hidePrice: true, stock: true, best: false,
    specs: { width: 5, warranty: 1 },
    name: { gu: 'કલ્ટિવેટર', hi: 'कल्टीवेटर', en: 'Cultivator' },
    desc: {
      gu: 'ખેતર તૈયાર કરવા માટે સનેડા સાથે જોડી શકાય તેવું કલ્ટિવેટર.',
      hi: 'खेत तैयार करने के लिए सनेडो के साथ जोड़ा जाने वाला कल्टीवेटर।',
      en: 'A cultivator that hitches to our sanedos to prepare your field.',
    },
  },
] as const

export const awards = [
  { year: 2024, icon: 'trophy', title: { gu: 'શ્રેષ્ઠ કૃષિ સાધન ઉત્પાદક', hi: 'सर्वश्रेष्ठ कृषि उपकरण निर्माता', en: 'Best farm equipment maker' }, by: { gu: 'અમરેલી જિલ્લા ઉદ્યોગ સંઘ', hi: 'अमरेली ज़िला उद्योग संघ', en: 'Amreli District Industries Association' } },
  { year: 2023, icon: 'medal', title: { gu: '૩,૦૦૦મા સનેડાની ડિલિવરી', hi: '3,000वें सनेडो की डिलीवरी', en: '3,000th sanedo delivered' }, by: { gu: 'ગ્રાહકોના વિશ્વાસથી', hi: 'ग्राहकों के भरोसे से', en: 'Thanks to our customers' } },
  { year: 2022, icon: 'trophy', title: { gu: 'કૃષિ મેળામાં શ્રેષ્ઠ સ્ટૉલ', hi: 'कृषि मेले में सर्वश्रेष्ठ स्टॉल', en: 'Best stall at the district farm fair' }, by: { gu: 'જિલ્લા કૃષિ મેળો, અમરેલી', hi: 'ज़िला कृषि मेला, अमरेली', en: 'Amreli' } },
  { year: 2019, icon: 'cert', title: { gu: 'ISO 9001:2015 પ્રમાણપત્ર', hi: 'ISO 9001:2015 प्रमाणपत्र', en: 'ISO 9001:2015 certified' }, by: { gu: 'ગુણવત્તા વ્યવસ્થાપન', hi: 'गुणवत्ता प्रबंधन', en: 'Quality management' } },
  { year: 2015, icon: 'medal', title: { gu: 'ગ્રાહક સંતોષ સન્માન', hi: 'ग्राहक संतुष्टि सम्मान', en: 'Customer satisfaction award' }, by: { gu: 'સૌરાષ્ટ્ર વેપારી મંડળ', hi: 'सौराष्ट्र व्यापारी मंडल', en: "Saurashtra Traders' Association" } },
] as const

export const reviews = [
  {
    quote: { gu: '૬ વર્ષથી અમારો સનેડો રોજ ખેતરમાં ચાલે છે. સર્વિસ માટે ફોન કરીએ એટલે તરત માણસ આવી જાય.', hi: '6 साल से हमारा सनेडो रोज़ खेत में चलता है। सर्विस के लिए फ़ोन करते ही तुरंत आदमी आ जाता है।', en: 'Our sanedo has worked the field every day for six years. One call for service and someone is here right away.' },
    name: { gu: 'રમેશભાઈ પટેલ', hi: 'रमेशभाई पटेल', en: 'Rameshbhai Patel' },
    village: { gu: 'લાઠી', hi: 'लाठी', en: 'Lathi' },
  },
  {
    quote: { gu: 'મગફળીની સીઝનમાં યાર્ડ સુધી માલ લઈ જવામાં ખૂબ કામ આવે છે. ડીઝલ પણ ઓછું ખાય છે.', hi: 'मूँगफली के सीज़न में यार्ड तक माल ले जाने में बहुत काम आता है। डीज़ल भी कम खाता है।', en: "In groundnut season it carries our crop to the market yard, and it's easy on diesel." },
    name: { gu: 'ભરતભાઈ સોજીત્રા', hi: 'भरतभाई सोजित्रा', en: 'Bharatbhai Sojitra' },
    village: { gu: 'બાબરા', hi: 'बाबरा', en: 'Babra' },
  },
  {
    quote: { gu: 'સહાયનું ફોર્મ ભરવામાં પણ એમણે પૂરી મદદ કરી. ભરોસાપાત્ર વેપારી છે.', hi: 'सहायता का फ़ॉर्म भरने में भी उन्होंने पूरी मदद की। भरोसेमंद व्यापारी हैं।', en: 'They even helped us fill in the subsidy form. A dealer you can trust.' },
    name: { gu: 'મનસુખભાઈ ડોબરિયા', hi: 'मनसुखभाई डोबरिया', en: 'Mansukhbhai Dobariya' },
    village: { gu: 'અમરેલી', hi: 'अमरेली', en: 'Amreli' },
  },
] as const

export const homeText = {
  blessing: { gu: '॥ જય ધારેશ્વર મહાદેવ ॥', hi: '॥ जय धारेश्वर महादेव ॥', en: '॥ Jai Dhareshwar Mahadev ॥' },
  heroTitle: { gu: 'ખેતરથી બજાર સુધી, ભરોસાનો સાથી', hi: 'खेत से मंडी तक, भरोसे का साथी', en: 'From field to market, a partner you can trust' },
  heroSub: {
    gu: 'ચિતલથી સૌરાષ્ટ્રના ખેડૂતો માટે મજબૂત, ટકાઉ અને ઓછા ખર્ચે ચાલતા સનેડા.',
    hi: 'चितल से सौराष्ट्र के किसानों के लिए मज़बूत, टिकाऊ और कम खर्च में चलने वाले सनेडो।',
    en: "Sturdy, long-lasting sanedos that cost little to run, built in Chital for Saurashtra's farmers.",
  },
}

export const subsidy = {
  title: { gu: 'સનેડાની ખરીદી પર સરકારી સહાય', hi: 'सनेडो की खरीद पर सरकारी सहायता', en: 'Government subsidy on your sanedo' },
  body: {
    gu: 'ગુજરાત સરકારની કિસાન પરિવહન યોજના હેઠળ સામાન્ય વર્ગના ખેડૂતોને સનેડાની કુલ કિંમતના ૪૦ ટકા અથવા વધુમાં વધુ ₹૬૦,૦૦૦ સુધીની સહાય મળે છે.',
    hi: 'गुजरात सरकार की किसान परिवहन योजना के तहत सामान्य वर्ग के किसानों को सनेडो की कुल कीमत का 40 प्रतिशत या अधिकतम ₹60,000 तक की सहायता मिलती है।',
    en: "Under the Gujarat government's Kisan Parivahan Yojana, general-category farmers receive 40% of the sanedo's total cost, up to ₹60,000.",
  },
  note: {
    gu: 'યોજનાની શરતો અને રકમ સમયાંતરે બદલાઈ શકે છે. અરજી કરતાં પહેલાં i-ખેડૂત પોર્ટલ પર ખાતરી કરો.',
    hi: 'योजना की शर्तें और राशि समय-समय पर बदल सकती हैं। आवेदन से पहले i-खेडूत पोर्टल पर पुष्टि करें।',
    en: 'Scheme terms and amounts can change. Confirm on the i-Khedut portal before you apply.',
  },
  steps: [
    { text: { gu: 'i-ખેડૂત પોર્ટલ પર ઑનલાઇન અરજી કરો', hi: 'i-खेडूत पोर्टल पर ऑनलाइन आवेदन करें', en: 'Apply online on the i-Khedut portal' } },
    { text: { gu: 'મંજૂરી મળ્યા બાદ માન્ય મોડેલ ખરીદો', hi: 'मंज़ूरी मिलने के बाद मान्य मॉडल खरीदें', en: 'Once approved, buy an eligible model' } },
    { text: { gu: 'બિલ અને જરૂરી દસ્તાવેજો જમા કરાવો', hi: 'बिल और ज़रूरी दस्तावेज़ जमा करें', en: 'Submit the bill and required documents' } },
  ],
  help: {
    gu: 'અરજીમાં મૂંઝવણ હોય તો અમને પૂછો, અમે માર્ગદર્શન આપીશું.',
    hi: 'आवेदन में कोई उलझन हो तो हमसे पूछें, हम मार्गदर्शन करेंगे।',
    en: "Stuck on the application? Ask us and we'll guide you through it.",
  },
}

export const stats = {
  items: [
    { value: '12+', label: { gu: 'વર્ષનો અનુભવ', hi: 'साल का अनुभव', en: 'years of experience' } },
    { value: '3,200+', label: { gu: 'સનેડાની ડિલિવરી', hi: 'सनेडो की डिलीवरी', en: 'sanedos delivered' } },
    { value: '450+', label: { gu: 'ગામડાંમાં ગ્રાહકો', hi: 'गाँवों में ग्राहक', en: 'villages with our customers' } },
    { value: '12', label: { gu: 'પુરસ્કાર અને સન્માન', hi: 'पुरस्कार और सम्मान', en: 'awards and honours' } },
  ],
}

export const contact = {
  phone: '9876543210',
  whatsapp: '9876543210',
  address: {
    gu: 'દુકાન નં. ૨૭૦૬, અમરેલી રોડ, ચિતલ, જિ. અમરેલી – ૩૬૫૬૨૦',
    hi: 'दुकान नं. 2706, अमरेली रोड, चितल, ज़िला अमरेली – 365620',
    en: 'Shop No. 2706, Amreli Road, Chital, Dist. Amreli – 365620',
  },
  hours: { gu: 'સોમવારથી શનિવાર, સવારે ૯ થી સાંજે ૭', hi: 'सोमवार से शनिवार, सुबह 9 से शाम 7', en: 'Monday to Saturday, 9 am to 7 pm' },
  closed: { gu: 'રવિવારે બંધ', hi: 'रविवार बंद', en: 'Closed on Sunday' },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Davada+Agro+Industries+Chital+Amreli',
}

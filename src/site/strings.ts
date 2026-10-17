/**
 * Site text. PROTOTYPE is copied word for word from design/prototype/prototype.html and is locked:
 * never rewrite or machine-translate it. Text the owner edits (hero, subsidy, stats, address, hours)
 * comes from the admin instead; the prototype copy stays here as the fallback.
 */

const PROTOTYPE = {
gu:{
  brandName:"દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ", brandPlace:"ચિતલ, અમરેલી",
  navProducts:"સનેડા", navSubsidy:"સરકારી સહાય", navAwards:"સિદ્ધિઓ", navContact:"સંપર્ક",
  call:"ફોન કરો", blessing:"॥ જય ધારેશ્વર મહાદેવ ॥",
  heroTitle:"ખેતરથી બજાર સુધી, ભરોસાનો સાથી",
  heroSub:"ચિતલથી સૌરાષ્ટ્રના ખેડૂતો માટે મજબૂત, ટકાઉ અને ઓછા ખર્ચે ચાલતા સનેડા.",
  heroCta:"સનેડા જુઓ", askWa:"વૉટ્સઍપ પર પૂછો",
  statYears:"વર્ષનો અનુભવ", statSold:"સનેડાની ડિલિવરી", statVillages:"ગામડાંમાં ગ્રાહકો", statAwards:"પુરસ્કાર અને સન્માન",
  productsTitle:"અમારા સનેડા", productsSub:"દરેક સનેડો અમારા પોતાના વર્કશૉપમાં તૈયાર અને ચકાસાયેલો છે.",
  fAll:"બધા", f3:"ત્રણ પૈડાં", f4:"ચાર પૈડાં", fImpl:"ઓજારો અને ટ્રોલી",
  bestSeller:"સૌથી વધુ વેચાતો", inStock:"સ્ટૉકમાં", toOrder:"ઑર્ડર પર તૈયાર",
  exShowroom:"એક્સ-શોરૂમ કિંમત", askPrice:"કિંમત માટે પૂછો",
  enquire:"વૉટ્સઍપ પર પૂછપરછ", details:"વિગતો જુઓ", sendFriend:"મિત્રને મોકલો", close:"બંધ કરો",
  specPower:"પાવર", specGears:"ગિયર", specLoad:"વહન ક્ષમતા", specTank:"ડીઝલ ટાંકી", specStart:"સ્ટાર્ટ", specWarranty:"વૉરંટી",
  specWidth:"કામની પહોળાઈ", specFits:"જોડાણ", specTipping:"ટિપિંગ",
  self:"સેલ્ફ સ્ટાર્ટ", kick:"કિક સ્ટાર્ટ", fitsAll:"અમારા બધા સનેડા સાથે", hydraulic:"હાઇડ્રોલિક",
  ton:"ટન", litre:"લિટર", feet:"ફૂટ", year:"વર્ષ",
  gears:(f:string|number,r:string|number)=>`${f} આગળ, ${r} રિવર્સ`,
  subTitle:"સનેડાની ખરીદી પર સરકારી સહાય",
  subBody:"ગુજરાત સરકારની કિસાન પરિવહન યોજના હેઠળ સામાન્ય વર્ગના ખેડૂતોને સનેડાની કુલ કિંમતના ૪૦ ટકા અથવા વધુમાં વધુ ₹૬૦,૦૦૦ સુધીની સહાય મળે છે.",
  subNote:"યોજનાની શરતો અને રકમ સમયાંતરે બદલાઈ શકે છે. અરજી કરતાં પહેલાં i-ખેડૂત પોર્ટલ પર ખાતરી કરો.",
  step1:"i-ખેડૂત પોર્ટલ પર ઑનલાઇન અરજી કરો", step2:"મંજૂરી મળ્યા બાદ માન્ય મોડેલ ખરીદો", step3:"બિલ અને જરૂરી દસ્તાવેજો જમા કરાવો",
  subHelp:"અરજીમાં મૂંઝવણ હોય તો અમને પૂછો, અમે માર્ગદર્શન આપીશું.", subCta:"સહાય વિશે પૂછો",
  awardsTitle:"અમારી સિદ્ધિઓ", awardsSub:"વર્ષોની મહેનત અને ગ્રાહકોના વિશ્વાસનું પરિણામ.",
  templeAlt:"શ્રી ધારેશ્વર મહાદેવ મંદિર, ચિતલ", reviewsTitle:"ખેડૂતો શું કહે છે", reviewsSub:"IndiaMART પર ગ્રાહકોનું રેટિંગ ૫.૦ ★",
  visitTitle:"વર્કશૉપની મુલાકાત લો", visitSub:"સનેડો જાતે જુઓ, ચલાવીને ખાતરી કરો. સર્વિસ અને સ્પેરપાર્ટ્સ પણ અહીં જ મળશે.",
  addrLabel:"સરનામું", address:"દુકાન નં. ૨૭૦૬, અમરેલી રોડ, ચિતલ, જિ. અમરેલી – ૩૬૫૬૨૦",
  hoursLabel:"સમય", hours:"સોમવારથી શનિવાર, સવારે ૯ થી સાંજે ૭", sunday:"રવિવારે બંધ", phoneLabel:"ફોન",
  directions:"નકશામાં રસ્તો જુઓ", service:"સર્વિસ માટે પૂછો",
  footer:"© ૨૦૨૬ દવડા ઍગ્રો ઇન્ડસ્ટ્રીઝ. સર્વ હક સ્વાધીન.",
  waProduct:(n:string,id:string,p:string,l:string)=>`નમસ્તે, મારે આ મોડેલ વિશે જાણવું છે:\n*${n}* (${id})\nકિંમત: ${p}\n${l}\n\nમારું નામ:\nમારું ગામ:`,
  waShare:(n:string,l:string)=>`આ સનેડો જુઓ: ${n}\n${l}`,
  wa:{general:"નમસ્તે, મારે સનેડા વિશે માહિતી જોઈએ છે.", subsidy:"નમસ્તે, સનેડાની ખરીદી પર મળતી સરકારી સહાય વિશે માહિતી જોઈએ છે.", service:"નમસ્તે, મારે સનેડાની સર્વિસ કરાવવી છે."}
},
hi:{
  brandName:"दवडा एग्रो इंडस्ट्रीज़", brandPlace:"चितल, अमरेली",
  navProducts:"सनेडो", navSubsidy:"सरकारी सहायता", navAwards:"उपलब्धियाँ", navContact:"संपर्क",
  call:"कॉल करें", blessing:"॥ जय धारेश्वर महादेव ॥",
  heroTitle:"खेत से मंडी तक, भरोसे का साथी",
  heroSub:"चितल से सौराष्ट्र के किसानों के लिए मज़बूत, टिकाऊ और कम खर्च में चलने वाले सनेडो।",
  heroCta:"सनेडो देखें", askWa:"व्हाट्सऐप पर पूछें",
  statYears:"साल का अनुभव", statSold:"सनेडो की डिलीवरी", statVillages:"गाँवों में ग्राहक", statAwards:"पुरस्कार और सम्मान",
  productsTitle:"हमारे सनेडो", productsSub:"हर सनेडो हमारी अपनी वर्कशॉप में तैयार और जाँचा हुआ है।",
  fAll:"सभी", f3:"तीन पहिया", f4:"चार पहिया", fImpl:"औज़ार और ट्रॉली",
  bestSeller:"सबसे ज़्यादा बिकने वाला", inStock:"स्टॉक में", toOrder:"ऑर्डर पर तैयार",
  exShowroom:"एक्स-शोरूम कीमत", askPrice:"कीमत के लिए पूछें",
  enquire:"व्हाट्सऐप पर पूछताछ", details:"विवरण देखें", sendFriend:"दोस्त को भेजें", close:"बंद करें",
  specPower:"पावर", specGears:"गियर", specLoad:"भार क्षमता", specTank:"डीज़ल टंकी", specStart:"स्टार्ट", specWarranty:"वारंटी",
  specWidth:"काम की चौड़ाई", specFits:"जोड़", specTipping:"टिपिंग",
  self:"सेल्फ़ स्टार्ट", kick:"किक स्टार्ट", fitsAll:"हमारे सभी सनेडो के साथ", hydraulic:"हाइड्रोलिक",
  ton:"टन", litre:"लीटर", feet:"फ़ुट", year:"साल",
  gears:(f:string|number,r:string|number)=>`${f} आगे, ${r} रिवर्स`,
  subTitle:"सनेडो की खरीद पर सरकारी सहायता",
  subBody:"गुजरात सरकार की किसान परिवहन योजना के तहत सामान्य वर्ग के किसानों को सनेडो की कुल कीमत का 40 प्रतिशत या अधिकतम ₹60,000 तक की सहायता मिलती है।",
  subNote:"योजना की शर्तें और राशि समय-समय पर बदल सकती हैं। आवेदन से पहले i-खेडूत पोर्टल पर पुष्टि करें।",
  step1:"i-खेडूत पोर्टल पर ऑनलाइन आवेदन करें", step2:"मंज़ूरी मिलने के बाद मान्य मॉडल खरीदें", step3:"बिल और ज़रूरी दस्तावेज़ जमा करें",
  subHelp:"आवेदन में कोई उलझन हो तो हमसे पूछें, हम मार्गदर्शन करेंगे।", subCta:"सहायता के बारे में पूछें",
  awardsTitle:"हमारी उपलब्धियाँ", awardsSub:"सालों की मेहनत और ग्राहकों के भरोसे का नतीजा।",
  templeAlt:"श्री धारेश्वर महादेव मंदिर, चितल", reviewsTitle:"किसान क्या कहते हैं", reviewsSub:"IndiaMART पर ग्राहकों की रेटिंग 5.0 ★",
  visitTitle:"वर्कशॉप पर आइए", visitSub:"सनेडो खुद देखें, चलाकर तसल्ली करें। सर्विस और स्पेयर पार्ट्स भी यहीं मिलेंगे।",
  addrLabel:"पता", address:"दुकान नं. 2706, अमरेली रोड, चितल, ज़िला अमरेली – 365620",
  hoursLabel:"समय", hours:"सोमवार से शनिवार, सुबह 9 से शाम 7", sunday:"रविवार बंद", phoneLabel:"फ़ोन",
  directions:"नक्शे में रास्ता देखें", service:"सर्विस के लिए पूछें",
  footer:"© 2026 दवडा एग्रो इंडस्ट्रीज़। सर्वाधिकार सुरक्षित।",
  waProduct:(n:string,id:string,p:string,l:string)=>`नमस्ते, मुझे इस मॉडल के बारे में जानना है:\n*${n}* (${id})\nकीमत: ${p}\n${l}\n\nमेरा नाम:\nमेरा गाँव:`,
  waShare:(n:string,l:string)=>`यह सनेडो देखिए: ${n}\n${l}`,
  wa:{general:"नमस्ते, मुझे सनेडो के बारे में जानकारी चाहिए।", subsidy:"नमस्ते, सनेडो की खरीद पर मिलने वाली सरकारी सहायता के बारे में जानकारी चाहिए।", service:"नमस्ते, मुझे सनेडो की सर्विस करवानी है।"}
},
en:{
  brandName:"Davada Agro Industries", brandPlace:"Chital, Amreli",
  navProducts:"Sanedos", navSubsidy:"Government subsidy", navAwards:"Awards", navContact:"Contact",
  call:"Call", blessing:"॥ Jai Dhareshwar Mahadev ॥",
  heroTitle:"From field to market, a partner you can trust",
  heroSub:"Sturdy, long-lasting sanedos that cost little to run, built in Chital for Saurashtra's farmers.",
  heroCta:"See our sanedos", askWa:"Ask on WhatsApp",
  statYears:"years of experience", statSold:"sanedos delivered", statVillages:"villages with our customers", statAwards:"awards and honours",
  productsTitle:"Our sanedos", productsSub:"Every sanedo is built and tested in our own workshop.",
  fAll:"All", f3:"Three-wheel", f4:"Four-wheel", fImpl:"Implements and trolleys",
  bestSeller:"Best seller", inStock:"In stock", toOrder:"Made to order",
  exShowroom:"Ex-showroom price", askPrice:"Ask for price",
  enquire:"Enquire on WhatsApp", details:"View details", sendFriend:"Send to a friend", close:"Close",
  specPower:"Power", specGears:"Gears", specLoad:"Load capacity", specTank:"Diesel tank", specStart:"Start", specWarranty:"Warranty",
  specWidth:"Working width", specFits:"Fits", specTipping:"Tipping",
  self:"Self start", kick:"Kick start", fitsAll:"All our sanedos", hydraulic:"Hydraulic",
  ton:"tonne", litre:"litres", feet:"ft", year:"year",
  gears:(f:string|number,r:string|number)=>`${f} forward, ${r} reverse`,
  subTitle:"Government subsidy on your sanedo",
  subBody:"Under the Gujarat government's Kisan Parivahan Yojana, general-category farmers receive 40% of the sanedo's total cost, up to ₹60,000.",
  subNote:"Scheme terms and amounts can change. Confirm on the i-Khedut portal before you apply.",
  step1:"Apply online on the i-Khedut portal", step2:"Once approved, buy an eligible model", step3:"Submit the bill and required documents",
  subHelp:"Stuck on the application? Ask us and we'll guide you through it.", subCta:"Ask about the subsidy",
  awardsTitle:"Awards and recognition", awardsSub:"Years of hard work and our customers' trust.",
  templeAlt:"Shri Dhareshwar Mahadev temple, Chital", reviewsTitle:"What farmers say", reviewsSub:"Rated 5.0 ★ by customers on IndiaMART",
  visitTitle:"Visit our workshop", visitSub:"See a sanedo in person and take it for a test drive. Servicing and spare parts are available here too.",
  addrLabel:"Address", address:"Shop No. 2706, Amreli Road, Chital, Dist. Amreli – 365620",
  hoursLabel:"Hours", hours:"Monday to Saturday, 9 am to 7 pm", sunday:"Closed on Sunday", phoneLabel:"Phone",
  directions:"Get directions", service:"Ask about servicing",
  footer:"© 2026 Davada Agro Industries. All rights reserved.",
  waProduct:(n:string,id:string,p:string,l:string)=>`Hello, I'd like to know more about this model:\n*${n}* (${id})\nPrice: ${p}\n${l}\n\nName:\nVillage:`,
  waShare:(n:string,l:string)=>`Take a look at this sanedo: ${n}\n${l}`,
  wa:{general:"Hello, I'd like some information about your sanedos.", subsidy:"Hello, I'd like to know about the government subsidy on buying a sanedo.", service:"Hello, I need to get my sanedo serviced."}
}};

/**
 * New strings for the gallery and the light/dark switch (not in the prototype). DRAFTS for Pratik Davda to review;
 * the Hindi and English were written, not machine-translated, and still need his approval.
 */
const GALLERY = {
  gu: {
    navGallery: 'ગેલેરી', morePhotos: 'વધુ ફોટા જુઓ', galTitle: 'ફોટો ગેલેરી',
    galSub: 'વર્કશૉપથી ખેતર સુધી: અમારા સનેડા, ગામેગામ ડિલિવરી અને સન્માનની ઝલક.',
    gAll: 'બધા', gSanedo: 'સનેડા', gImpl: 'ટ્રોલી અને ઓજારો', gDelivery: 'ડિલિવરી', gWorkshop: 'વર્કશૉપ', gHonours: 'સન્માન',
    galEmpty: 'આ વિભાગમાં હજી ફોટા ઉમેરાયા નથી.', galAll: 'બધા ફોટા જુઓ', galNone: 'ફોટા જલદી આવશે.',
    askModel: 'આ મોડેલ વિશે પૂછો', share: 'લિંક શેર કરો', prev: 'પાછલો ફોટો', next: 'આગળનો ફોટો', video: 'વિડિયો',
    linkCopied: 'લિંક કૉપી થઈ',
    toLight: 'લાઇટ મોડ', toDark: 'ડાર્ક મોડ',
  },
  hi: {
    navGallery: 'गैलरी', morePhotos: 'और फ़ोटो देखें', galTitle: 'फ़ोटो गैलरी',
    galSub: 'वर्कशॉप से खेत तक: हमारे सनेडो, गाँव-गाँव डिलीवरी और सम्मान की झलक।',
    gAll: 'सभी', gSanedo: 'सनेडो', gImpl: 'ट्रॉली और औज़ार', gDelivery: 'डिलीवरी', gWorkshop: 'वर्कशॉप', gHonours: 'सम्मान',
    galEmpty: 'इस श्रेणी में अभी फ़ोटो नहीं जोड़े गए हैं।', galAll: 'सभी फ़ोटो देखें', galNone: 'फ़ोटो जल्द आएँगे।',
    askModel: 'इस मॉडल के बारे में पूछें', share: 'लिंक शेयर करें', prev: 'पिछला फ़ोटो', next: 'अगला फ़ोटो', video: 'वीडियो',
    linkCopied: 'लिंक कॉपी हो गया',
    toLight: 'लाइट मोड', toDark: 'डार्क मोड',
  },
  en: {
    navGallery: 'Gallery', morePhotos: 'See more photos', galTitle: 'Photo gallery',
    galSub: 'From the workshop to the field: our sanedos, deliveries across the villages, and our honours.',
    gAll: 'All', gSanedo: 'Sanedos', gImpl: 'Trolleys and implements', gDelivery: 'Deliveries', gWorkshop: 'Workshop', gHonours: 'Honours',
    galEmpty: 'No photos in this category yet.', galAll: 'See all photos', galNone: 'Photos coming soon.',
    askModel: 'Ask about this model', share: 'Share link', prev: 'Previous photo', next: 'Next photo', video: 'Video',
    linkCopied: 'Link copied',
    toLight: 'Light mode', toDark: 'Dark mode',
  },
}

export type SiteLang = 'gu' | 'hi' | 'en'
export const SITE_LANGS: SiteLang[] = ['gu', 'hi', 'en']

export const T = {
  gu: { ...PROTOTYPE.gu, ...GALLERY.gu },
  hi: { ...PROTOTYPE.hi, ...GALLERY.hi },
  en: { ...PROTOTYPE.en, ...GALLERY.en },
}
export type SiteStrings = (typeof T)['gu']

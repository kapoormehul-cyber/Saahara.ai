/**
 * Multilingual definitions for Saahara AI Support Navigator & "Find My Help" discovery.
 * Supports English and Hindi with verified statutory information across India.
 */

export type SupportLanguage = 'en' | 'hi';

export type HelpCategoryId = 
  | 'all'
  | 'immediate_danger'
  | 'domestic_violence'
  | 'cybercrime'
  | 'legal_assistance'
  | 'emotional_support'
  | 'other_support';

export interface HelpCategoryDef {
  id: HelpCategoryId;
  iconType: 'emergency' | 'domestic' | 'cyber' | 'legal' | 'emotional' | 'other';
  labelEn: string;
  labelHi: string;
  subEn: string;
  subHi: string;
  actionStepsEn: string[];
  actionStepsHi: string[];
  matchedResourceIds: string[];
}

export const HELP_CATEGORIES: HelpCategoryDef[] = [
  {
    id: 'immediate_danger',
    iconType: 'emergency',
    labelEn: 'Immediate danger or emergency',
    labelHi: 'तत्काल खतरा या आपातकाल',
    subEn: 'Urgent physical threat, active stalking, or emergency intervention',
    subHi: 'शारीरिक खतरा, पीछा किया जाना या तुरंत पुलिस सुरक्षा',
    actionStepsEn: [
      'Move to a populated, well-lit public space immediately if you are able to do so.',
      'Dial 112 (National Emergency) or 1091 (Women Police Patrol) immediately.',
      'Keep your phone battery charged and share your real-time location with a trusted contact.',
      'If you cannot speak safely, send an SMS to 112 or use the 112 India emergency mobile app.'
    ],
    actionStepsHi: [
      'यदि संभव हो, तो तुरंत किसी भीड़-भाड़ वाली, अच्छी रोशनी वाली जगह पर जाएं।',
      'तुरंत 112 (राष्ट्रीय आपातकाल) या 1091 (महिला पुलिस गश्ती) पर कॉल करें।',
      'फोन चार्ज रखें और किसी विश्वसनीय संपर्क के साथ अपनी लाइव लोकेशन साझा करें।',
      'यदि आप सुरक्षित रूप से बोल नहीं सकते, तो 112 पर SMS भेजें या 112 इंडिया ऐप का उपयोग करें।'
    ],
    matchedResourceIds: ['res_112', 'res_1091', 'res_181']
  },
  {
    id: 'domestic_violence',
    iconType: 'domestic',
    labelEn: 'Domestic violence or abuse',
    labelHi: 'घरेलू हिंसा या उत्पीड़न',
    subEn: 'Safe emergency shelter, crisis intervention, and distress support',
    subHi: 'सुरक्षित आश्रय, संकट निवारण और आपातकालीन सहायता',
    actionStepsEn: [
      'Call WHL 181 (toll-free 24x7) for immediate crisis rescue and placement into One Stop Shelter Centres.',
      'Locate your nearest Sakhi One Stop Centre (OSC) at the district hospital for up to 5 days free shelter and medical care.',
      'Keep identity documents (Aadhaar, voter ID, bank passbook) in a secure, accessible location or cloud drive.',
      'Under the Protection of Women from Domestic Violence Act (PWDVA), you have a statutory right to free protection orders and legal assistance.'
    ],
    actionStepsHi: [
      'तुरंत बचाव, परामर्श और सुरक्षित आश्रय के लिए महिला हेल्पलाइन 181 (टोल-फ्री 24x7) पर कॉल करें।',
      '5 दिनों के मुफ्त आश्रय और चिकित्सा के लिए जिला अस्पताल स्थित नजदीकी सखी वन स्टॉप सेंटर से संपर्क करें।',
      'पहचान दस्तावेज (आधार, बैंक पासबुक) किसी सुरक्षित और आसानी से मिलने वाले स्थान पर रखें।',
      'घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम (PWDVA) के तहत आपको मुफ्त कानूनी सहायता का अधिकार है।'
    ],
    matchedResourceIds: ['res_181', 'res_sakhi_osc', 'res_1091']
  },
  {
    id: 'cybercrime',
    iconType: 'cyber',
    labelEn: 'Cybercrime or online harassment',
    labelHi: 'साइबर अपराध या ऑनलाइन उत्पीड़न',
    subEn: 'Morphing, blackmail, non-consensual images, or digital fraud',
    subHi: 'मॉर्फिंग, ब्लैकमेल, आपत्तिजनक सामग्री या ऑनलाइन धमकी',
    actionStepsEn: [
      'Capture unedited full-screen screenshots displaying URL, usernames, phone handles, and timestamps.',
      'Do not delete harassing messages, emails, or call logs — they serve as crucial digital evidence.',
      'Dial 1930 immediately or lodge a confidential complaint at cybercrime.gov.in under the Women & Child Special Redressal Track.',
      'Under IT Rules 2021 (Rule 3(2)(b)), platforms are legally mandated to remove non-consensual explicit material within 24 hours of notification.'
    ],
    actionStepsHi: [
      'URL, यूजरनेम, फोन नंबर और समय दिखाते हुए बिना कांट-छांट के पूरे स्क्रीनशॉट लें।',
      'धमकी भरे संदेशों, ईमेल या कॉल लॉग को हटाएं नहीं — यह आवश्यक डिजिटल साक्ष्य हैं।',
      'तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर महिला एवं बाल विशेष श्रेणी में शिकायत दर्ज करें।',
      'आईटी नियम 2021 के तहत, डिजिटल प्लेटफॉर्म को सूचना मिलने के 24 घंटे के भीतर आपत्तिजनक सामग्री हटानी होगी।'
    ],
    matchedResourceIds: ['res_cybercrime', 'res_ncw']
  },
  {
    id: 'legal_assistance',
    iconType: 'legal',
    labelEn: 'Legal assistance',
    labelHi: 'कानूनी सहायता',
    subEn: 'Free court lawyers, legal advice, and statutory protection under Indian law',
    subHi: 'मुफ्त सरकारी वकील, कानूनी सलाह और विधिक सहायता',
    actionStepsEn: [
      'Dial NALSA Helpline 15100 — all women in India are statutorily entitled to free government lawyers under Section 12 of the Legal Services Authorities Act.',
      'You never have to pay court fees, drafting charges, or advocate fees for legal aid representation.',
      'You can request a paralegal volunteer to accompany you to the police station for filing an FIR.',
      'For workplace sexual harassment, internal complaint committee (ICC) inquiries must be completed within 90 days.'
    ],
    actionStepsHi: [
      'NALSA हेल्पलाइन 15100 पर कॉल करें — धारा 12 के तहत भारत में सभी महिलाएं मुफ्त सरकारी वकील की हकदार हैं।',
      'कानूनी सहायता के लिए आपको कोई अदालती शुल्क, ड्राफ्टिंग शुल्क या वकील की फीस नहीं देनी होगी।',
      'एफआईआर दर्ज कराने के लिए थाने जाते समय आप पैरा-लीगल स्वयंसेवक की सहायता मांग सकते हैं।',
      'कार्यस्थल पर यौन उत्पीड़न की शिकायतों की जांच आंतरिक शिकायत समिति (ICC) को 90 दिनों में पूरी करनी होती है।'
    ],
    matchedResourceIds: ['res_nalsa', 'res_ncw']
  },
  {
    id: 'emotional_support',
    iconType: 'emotional',
    labelEn: 'Emotional support and guidance',
    labelHi: 'भावनात्मक समर्थन और मार्गदर्शन',
    subEn: 'Confidential 24x7 trauma recovery and mental health counseling',
    subHi: 'गोपनीय 24x7 मानसिक स्वास्थ्य परामर्श और मनोवैज्ञानिक सहायता',
    actionStepsEn: [
      'Dial Tele-MANAS toll-free 14416 or 1800-891-4416 (24x7) for confidential psychological first aid in 20+ regional languages.',
      'You are in full control: you can speak anonymously at your own pace with certified mental health professionals.',
      'If you are experiencing panic, trauma, grief, or distress, professional tele-counselors are available immediately.',
      'Reach out to trusted friends, community members, or Saheli Circle connections for accompaniment.'
    ],
    actionStepsHi: [
      '20+ क्षेत्रीय भाषाओं में मानसिक प्राथमिक सहायता के लिए टेली-मानस 14416 या 1800-891-4416 पर कॉल करें।',
      'यह पूरी तरह गोपनीय है: आप प्रमाणित काउंसलरों से अपनी गति से और अनाम रूप से बात कर सकते हैं।',
      'यदि आप घबराहट, आघात या अत्यधिक तनाव महसूस कर रहे हैं, तो पेशेवर परामर्शदाता तुरंत उपलब्ध हैं।',
      'सहानुभूति और संबल के लिए अपने विश्वसनीय संपर्कों या सहेली सर्कल से जुड़ें।'
    ],
    matchedResourceIds: ['res_telemanas']
  },
  {
    id: 'other_support',
    iconType: 'other',
    labelEn: 'Other support needs',
    labelHi: 'अन्य सहायता आवश्यकताएं',
    subEn: 'Institutional guidance, statutory complaints, and evidence preservation',
    subHi: 'साक्ष्य संरक्षण, संस्थागत मदद और अन्य मार्गदर्शन',
    actionStepsEn: [
      'Review the Evidence Preservation Guide to secure physical and digital records in compliance with Indian law.',
      'Contact the National Commission for Women (7827170170) for inquiries into administrative or police inaction.',
      'Visit district hospital Sakhi One Stop Centres for combined medical, police, shelter, and legal support under one roof.',
      'Bookmark critical resources on this page so you can access them quickly from your dashboard overview.'
    ],
    actionStepsHi: [
      'भारतीय कानून के अनुसार डिजिटल और भौतिक रिकॉर्ड सुरक्षित करने के लिए साक्ष्य संरक्षण गाइड देखें।',
      'प्रशासनिक या पुलिस निष्क्रियता की शिकायतों के लिए राष्ट्रीय महिला आयोग (7827170170) से संपर्क करें।',
      'चिकित्सा, पुलिस, आश्रय और कानूनी मदद एक ही छत के नीचे पाने के लिए जिला अस्पताल के सखी केंद्र जाएं।',
      'भविष्य में तुरंत सहायता के लिए आवश्यक संसाधनों को अपने डैशबोर्ड पर बुकमार्क करें।'
    ],
    matchedResourceIds: ['res_sakhi_osc', 'res_ncw', 'res_181']
  }
];

export const UI_STRINGS = {
  en: {
    title: 'Survivor Support Navigator',
    subtitle: 'A confidential, calm, and trauma-informed directory of official statutory authorities, verified helplines, free legal aid, and safe evidence-preservation protocols across India.',
    evidenceBtn: 'Evidence Preservation Guide',
    directoryBtn: 'Helpline Directory',
    dangerNoticeTitle: 'Immediate Danger Notice:',
    dangerNoticeBody: 'SAAHARA AI does not replace emergency dispatch services. If you or someone you know is in immediate physical danger, dial 112 immediately.',
    findMyHelpTitle: 'Find My Help',
    findMyHelpSubtitle: 'Choose the situation you or someone you are supporting is facing to view clear next steps and verified official resources.',
    showAllCategories: 'All Resources',
    actionPlanTitle: 'Actionable Next Steps & Safety Protocol',
    whatItHelpsWith: 'What this helps with:',
    eligibility: 'Eligibility / Access:',
    coverage: 'Coverage:',
    verifiedContact: 'Verified Contact:',
    callBtn: 'Call',
    copyBtn: 'Copy Details',
    copiedBtn: 'Copied Details!',
    verifiedVia: 'Verified via',
    lastChecked: 'Last checked:',
    searchPlaceholder: 'Search resources, services, helplines...',
    noResultsTitle: 'No support resources match your filter',
    noResultsText: 'Try selecting a different category or clearing your search keywords.',
    resetFilters: 'Reset All Filters',
    allResourcesCategory: 'All Resources',
    bookmarkedCategory: 'Bookmarked',
    bookmarkTitle: 'Bookmark resource',
    removeBookmarkTitle: 'Remove bookmark',
    quickHelplinesTitle: 'Immediate Emergency Dialers (Tap to Call)',
    languageSwitch: 'Language / भाषा'
  },
  hi: {
    title: 'सपोर्ट नेविगेटर (सहायता मार्गदर्शिका)',
    subtitle: 'भारत भर में आधिकारिक सरकारी प्राधिकरणों, सत्यापित हेल्पलाइन, मुफ्त कानूनी सहायता और सुरक्षित साक्ष्य-संरक्षण प्रोटोकॉल की गोपनीय और विश्वसनीय निर्देशिका।',
    evidenceBtn: 'साक्ष्य संरक्षण गाइड',
    directoryBtn: 'हेल्पलाइन निर्देशिका',
    dangerNoticeTitle: 'तत्काल खतरे की सूचना:',
    dangerNoticeBody: 'सहारा AI आपातकालीन पुलिस सेवा का विकल्प नहीं है। यदि आप या कोई परिचित तुरंत शारीरिक खतरे में है, तो तुरंत 112 डायल करें।',
    findMyHelpTitle: 'मेरी सहायता खोजें (Find My Help)',
    findMyHelpSubtitle: 'अपनी स्थिति का चयन करें ताकि तुरंत आवश्यक कदम और संबंधित सत्यापित सरकारी संसाधन देखे जा सकें।',
    showAllCategories: 'सभी संसाधन',
    actionPlanTitle: 'आवश्यक कदम और सुरक्षा मार्गदर्शन',
    whatItHelpsWith: 'यह किसमें मदद करता है:',
    eligibility: 'पात्रता और पहुंच:',
    coverage: 'कार्यक्षेत्र:',
    verifiedContact: 'सत्यापित संपर्क:',
    callBtn: 'कॉल करें',
    copyBtn: 'विवरण कॉपी करें',
    copiedBtn: 'विवरण कॉपी हो गया!',
    verifiedVia: 'सत्यापित स्रोत:',
    lastChecked: 'अंतिम जांच:',
    searchPlaceholder: 'संसाधन, सेवा या हेल्पलाइन खोजें...',
    noResultsTitle: 'आपके फिल्टर से मेल खाने वाले कोई संसाधन नहीं मिले',
    noResultsText: 'कृपया कोई अन्य श्रेणी चुनें या अपने सर्च शब्द रीसेट करें।',
    resetFilters: 'सभी फिल्टर रीसेट करें',
    allResourcesCategory: 'सभी संसाधन',
    bookmarkedCategory: 'बुकमार्क किए गए',
    bookmarkTitle: 'संसाधन बुकमार्क करें',
    removeBookmarkTitle: 'बुकमार्क हटाएं',
    quickHelplinesTitle: 'तत्काल आपातकालीन हेल्पलाइन (कॉल करने के लिए टैप करें)',
    languageSwitch: 'भाषा / Language'
  }
};

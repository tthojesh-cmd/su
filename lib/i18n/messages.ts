// Add a language = add one object. Use keys everywhere, never hard-coded UI text.
export const messages = {
  en: { "nav.organic": "Organic Farming", "nav.crops": "Crops", "nav.doctor": "Doctor", "nav.ai": "AI Assistant", "nav.articles": "Articles", "nav.about": "About", "nav.login": "Login",
    "home.title": "Your AI Assistant for Organic Farming", "home.subtitle": "Get simple, practical and organic farming guidance anytime.",
    "home.ask": "Ask AI", "home.start": "Get Started", "login.sendOtp": "Send OTP", "login.verifyOtp": "Verify OTP",
    "login.enterOtp": "Enter the 6-digit OTP sent to your mobile number", "ai.askQuestion": "Ask your farming question…",
    "ai.send": "Send", "ai.new": "New conversation", "ai.copy": "Copy",
    "footer.disclaimer": "This AI provides general educational information about organic farming and should not replace advice from qualified agricultural professionals. Crop conditions, soil, weather, local regulations and farming practices can vary.",
    "err.otpInvalid": "Please enter the correct OTP.", "err.otpExpired": "This OTP has expired. Please request a new OTP.",
    "err.tooMany": "Too many attempts. Please try again later.", "err.ai": "The AI service is temporarily unavailable. Please try again later." },
  te: { "nav.organic": "సేంద్రీయ వ్యవసాయం", "nav.crops": "పంటలు", "nav.doctor": "డాక్టర్", "nav.ai": "AI సహాయకుడు", "nav.articles": "వ్యాసాలు", "nav.about": "మా గురించి", "nav.login": "లాగిన్",
    "home.title": "సేంద్రీయ వ్యవసాయానికి మీ AI సహాయకుడు", "home.subtitle": "ఎప్పుడైనా సులభమైన, ఆచరణాత్మక సేంద్రీయ వ్యవసాయ సలహా పొందండి.",
    "home.ask": "AI ని అడగండి", "home.start": "ప్రారంభించండి", "login.sendOtp": "OTP పంపండి", "login.verifyOtp": "OTP ధృవీకరించండి",
    "login.enterOtp": "మీ మొబైల్ నంబర్‌కు వచ్చిన 6 అంకెల OTP ని నమోదు చేయండి", "ai.askQuestion": "మీ వ్యవసాయ ప్రశ్న అడగండి…",
    "ai.send": "పంపండి", "ai.new": "కొత్త సంభాషణ", "ai.copy": "కాపీ",
    "footer.disclaimer": "ఈ AI సేంద్రీయ వ్యవసాయం గురించి సాధారణ విద్యా సమాచారాన్ని అందిస్తుంది; అర్హత కలిగిన వ్యవసాయ నిపుణుల సలహాకు ప్రత్యామ్నాయం కాదు. పంట పరిస్థితులు, నేల, వాతావరణం, స్థానిక నిబంధనలు మారవచ్చు.",
    "err.otpInvalid": "దయచేసి సరైన OTP ని నమోదు చేయండి.", "err.otpExpired": "ఈ OTP గడువు ముగిసింది. కొత్త OTP అభ్యర్థించండి.",
    "err.tooMany": "చాలా ప్రయత్నాలు. దయచేసి తర్వాత ప్రయత్నించండి.", "err.ai": "AI సేవ తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి తర్వాత ప్రయత్నించండి." },
} as const;
export type Lang = keyof typeof messages;
export type Key = keyof typeof messages.en;

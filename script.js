// ===============================
// REFERRAL TRACKING
// ===============================
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('ref') && urlParams.has('partner')) {
    sessionStorage.setItem('referral_partner', urlParams.get('partner'));
    sessionStorage.setItem('referral_code', urlParams.get('ref'));
}

// ===============================
// MOBILE MENU TOGGLE
// ===============================
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    });
}

// Reset mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('active');
        }
    }
});

// ===============================
// CONTACT FORM VALIDATION & WHATSAPP
// ===============================
const bookingForm = document.getElementById("bookingForm");

// Pricing Logic
const pricingMatrix = {
    "Hatchback": {
        "Standard Wash": { "One Time": 200, "Monthly Package": 180 },
        "Premium Wash": { "One Time": 300, "Monthly Package": 270 },
        "Deep Cleaning": { "One Time": 600, "Monthly Package": 540 }
    },
    "Sedan": {
        "Standard Wash": { "One Time": 235, "Monthly Package": 212 },
        "Premium Wash": { "One Time": 350, "Monthly Package": 315 },
        "Deep Cleaning": { "One Time": 700, "Monthly Package": 630 }
    },
    "Compact SUV": {
        "Standard Wash": { "One Time": 270, "Monthly Package": 243 },
        "Premium Wash": { "One Time": 400, "Monthly Package": 360 },
        "Deep Cleaning": { "One Time": 800, "Monthly Package": 720 }
    },
    "SUV 5 Seater": {
        "Standard Wash": { "One Time": 300, "Monthly Package": 270 },
        "Premium Wash": { "One Time": 450, "Monthly Package": 405 },
        "Deep Cleaning": { "One Time": 900, "Monthly Package": 810 }
    },
    "SUV 7 Seater": {
        "Standard Wash": { "One Time": 335, "Monthly Package": 302 },
        "Premium Wash": { "One Time": 500, "Monthly Package": 450 },
        "Deep Cleaning": { "One Time": 1000, "Monthly Package": 900 }
    }
};

function updateGrandTotal() {
    const carTypeEl = document.querySelector('input[name="carType"]:checked');
    const packageTypeEl = document.querySelector('input[name="packageType"]:checked');
    const washTypeEl = document.querySelector('input[name="washType"]:checked');
    const totalAmountSpan = document.getElementById("totalAmount");
    
    if (carTypeEl && packageTypeEl && washTypeEl && totalAmountSpan) {
        const price = pricingMatrix[carTypeEl.value][washTypeEl.value][packageTypeEl.value];
        totalAmountSpan.innerText = price;
    }
}

if (bookingForm) {
    const radioInputs = bookingForm.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', updateGrandTotal);
    });

    // Auto-fill referral code if available
    const manualRefInput = document.getElementById('manualReferralCode');
    if (manualRefInput && sessionStorage.getItem('referral_code')) {
        manualRefInput.value = sessionStorage.getItem('referral_code');
    }

    bookingForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const submitBtn = e.submitter || document.getElementById("submitBtnWhatsApp");
        const isDirect = submitBtn.value === "direct";
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const name = document.getElementById("name").value;
        const mobile = document.getElementById("mobile").value;
        const area = document.getElementById("area").value;
        const house = document.getElementById("house").value;
        const car = document.getElementById("car").value;
        const carType = document.querySelector('input[name="carType"]:checked').value;
        const date = document.getElementById("date").value;
        const packageType = document.querySelector('input[name="packageType"]:checked').value;
        const washType = document.querySelector('input[name="washType"]:checked').value;
        const grandTotal = document.getElementById("totalAmount").innerText;
        
        let referredBy = null;
        const manualCode = document.getElementById("manualReferralCode") ? document.getElementById("manualReferralCode").value.trim() : "";

        if (manualCode) {
            // If it perfectly matches session storage, keep the full name format
            if (manualCode === sessionStorage.getItem('referral_code')) {
                referredBy = `${sessionStorage.getItem('referral_partner')} (${manualCode})`;
            } else {
                referredBy = manualCode;
            }
        } else if (sessionStorage.getItem('referral_partner')) {
            referredBy = `${sessionStorage.getItem('referral_partner')} (${sessionStorage.getItem('referral_code')})`;
        }
        
        const bookingData = { name, mobile, area, house, car, carType, date, packageType, washType, grandTotal, referredBy };

        try {
            // Send data to backend database
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            if (!response.ok) console.error("Failed to save booking to database.");
        } catch (error) {
            console.error("Error connecting to server:", error);
        }

        if (!isDirect) {
            const message =
`Hi Urban Shine,

I would like to book a Car Wash.

👤 Name: ${name}
📞 Mobile: ${mobile}
📍 Area: ${area}
🏠 Building & House: ${house}
🚗 Car Model: ${car}
🚙 Car Type: ${carType}
🗓️ Preferred Date: ${date}
📦 Type of Package: ${packageType}
✨ Type of Wash: ${washType}

💵 Grand Total: ₹${grandTotal}
${referredBy ? '\n🤝 Referred By: ' + referredBy + '\n' : ''}
Thank You.`;

            const whatsappURL = `https://wa.me/917567254083?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, "_blank");
        } else {
            alert("Thank you! Your booking has been received successfully.");
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        bookingForm.reset();
    });
}

// ===============================
// WATER SPLASH CLICK EFFECT (Optional Fun Feature)
// ===============================
let audioCtx;

function playWaterDropSound() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

document.addEventListener('click', function(e) {
    if(e.target.closest('.menu-toggle') || e.target.closest('a') || e.target.closest('button')) return;

    try {
        playWaterDropSound();
    } catch(e) {}

    let splash = document.createElement('div');
    splash.style.position = 'fixed';
    splash.style.width = '100px';
    splash.style.height = '100px';
    splash.style.borderRadius = '50%';
    splash.style.transform = 'translate(-50%, -50%) scale(0)';
    splash.style.pointerEvents = 'none';
    splash.style.zIndex = '9999';
    splash.style.background = 'rgba(0, 102, 255, 0.4)';
    splash.style.boxShadow = '0 0 10px rgba(0, 102, 255, 0.8), 0 0 20px rgba(0, 102, 255, 0.4)';
    splash.style.left = e.clientX + 'px';
    splash.style.top = e.clientY + 'px';
    
    // Animate
    splash.animate([
        { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0 }
    ], {
        duration: 600,
        easing: "ease-out"
    });
    
    document.body.appendChild(splash);
    
    setTimeout(() => {
        splash.remove();
    }, 600);
});

// ===============================
// CAR CATEGORY SEARCH
// ===============================
const carDatabase = {
    // Hatchbacks
    "altroz": "HATCHBACK", "baleno": "HATCHBACK", "swift": "HATCHBACK", "i20": "HATCHBACK", "polo": "HATCHBACK", 
    "tiago": "HATCHBACK", "glanza": "HATCHBACK", "kwid": "HATCHBACK", "celerio": "HATCHBACK", "wagonr": "HATCHBACK", 
    "ignis": "HATCHBACK", "alto": "HATCHBACK", "spresso": "HATCHBACK", "s-presso": "HATCHBACK", "figo": "HATCHBACK", 
    "grand i10": "HATCHBACK", "nios": "HATCHBACK", "eon": "HATCHBACK", "santro": "HATCHBACK", "brio": "HATCHBACK", 
    "jazz": "HATCHBACK", "beat": "HATCHBACK", "spark": "HATCHBACK", "micra": "HATCHBACK", "pulse": "HATCHBACK", 
    "punto": "HATCHBACK", "indica": "HATCHBACK", "vista": "HATCHBACK", "bolt": "HATCHBACK", "kicks": "HATCHBACK", 
    "ritz": "HATCHBACK", "a star": "HATCHBACK", "zen": "HATCHBACK", "estilo": "HATCHBACK", "nano": "HATCHBACK",
    "comet": "HATCHBACK", "tiago ev": "HATCHBACK", "punch ev": "HATCHBACK",
    
    // Sedans
    "city": "SEDAN", "verna": "SEDAN", "slavia": "SEDAN", "virtus": "SEDAN", "ciaz": "SEDAN", "dzire": "SEDAN", "swift dzire": "SEDAN", 
    "amaze": "SEDAN", "aura": "SEDAN", "tigor": "SEDAN", "rapid": "SEDAN", "octavia": "SEDAN", "civic": "SEDAN", 
    "accord": "SEDAN", "corolla": "SEDAN", "altis": "SEDAN", "camry": "SEDAN", "yaris": "SEDAN", "etios": "SEDAN", 
    "vento": "SEDAN", "jetta": "SEDAN", "passat": "SEDAN", "superb": "SEDAN", "laura": "SEDAN", "elantra": "SEDAN", 
    "sonata": "SEDAN", "accent": "SEDAN", "fiesta": "SEDAN", "ikon": "SEDAN", "aspire": "SEDAN", "sunny": "SEDAN", 
    "teana": "SEDAN", "cruze": "SEDAN", "optra": "SEDAN", "aveo": "SEDAN", "sail": "SEDAN", "manza": "SEDAN", 
    "zest": "SEDAN", "indigo": "SEDAN", "linea": "SEDAN", "esteem": "SEDAN", "baleno sedan": "SEDAN", "kizashi": "SEDAN",
    
    // Compact SUVs / Crossovers
    "nexon": "COMPACT SUV", "brezza": "COMPACT SUV", "breeza": "COMPACT SUV", "venue": "COMPACT SUV", "sonet": "COMPACT SUV", "punch": "COMPACT SUV", 
    "magnite": "COMPACT SUV", "kiger": "COMPACT SUV", "xuv300": "COMPACT SUV", "ecosport": "COMPACT SUV", "fronx": "COMPACT SUV", 
    "wr-v": "COMPACT SUV", "wrv": "COMPACT SUV", "br-v": "COMPACT SUV", "brv": "COMPACT SUV", "freestyle": "COMPACT SUV", 
    "cross polo": "COMPACT SUV", "i20 active": "COMPACT SUV", "etios cross": "COMPACT SUV", "urban cruiser": "COMPACT SUV", 
    "taisor": "COMPACT SUV", "xuv 3x0": "COMPACT SUV",
    
    // SUV 5 Seater
    "thar": "SUV 5 SEATER", "creta": "SUV 5 SEATER", "seltos": "SUV 5 SEATER", "harrier": "SUV 5 SEATER", "hector": "SUV 5 SEATER", 
    "kushaq": "SUV 5 SEATER", "taigun": "SUV 5 SEATER", "astor": "SUV 5 SEATER", "elevate": "SUV 5 SEATER", 
    "grand vitara": "SUV 5 SEATER", "hyryder": "SUV 5 SEATER", "compass": "SUV 5 SEATER", "tucson": "SUV 5 SEATER", 
    "tiguan": "SUV 5 SEATER", "karoq": "SUV 5 SEATER", "kicks": "SUV 5 SEATER", "captur": "SUV 5 SEATER", "duster": "SUV 5 SEATER", 
    "terrano": "SUV 5 SEATER", "s-cross": "SUV 5 SEATER", "scross": "SUV 5 SEATER", "zs ev": "SUV 5 SEATER", "kona": "SUV 5 SEATER", 
    "ioniq 5": "SUV 5 SEATER", "ev6": "SUV 5 SEATER", "nexon ev": "SUV 5 SEATER", "jimny": "SUV 5 SEATER", "macan": "SUV 5 SEATER",
    "q3": "SUV 5 SEATER", "q5": "SUV 5 SEATER", "x1": "SUV 5 SEATER", "x3": "SUV 5 SEATER", "gla": "SUV 5 SEATER", "glc": "SUV 5 SEATER",
    
    // SUV 7 Seater / MPV
    "xuv500": "SUV 7 SEATER", "xuv700": "SUV 7 SEATER", "safari": "SUV 7 SEATER", "scorpio": "SUV 7 SEATER", "innova": "SUV 7 SEATER", "inova": "SUV 7 SEATER", "crysta": "SUV 7 SEATER", "hycross": "SUV 7 SEATER", 
    "fortuner": "SUV 7 SEATER", "endeavour": "SUV 7 SEATER", "hector plus": "SUV 7 SEATER", "carens": "SUV 7 SEATER", 
    "ertiga": "SUV 7 SEATER", "xl6": "SUV 7 SEATER", "alcazar": "SUV 7 SEATER", "gloster": "SUV 7 SEATER", "bolero": "SUV 7 SEATER", 
    "marazzo": "SUV 7 SEATER", "hexa": "SUV 7 SEATER", "aria": "SUV 7 SEATER", "lodgy": "SUV 7 SEATER", "triber": "SUV 7 SEATER", 
    "mobilio": "SUV 7 SEATER", "enjoy": "SUV 7 SEATER", "tavera": "SUV 7 SEATER", "mu-x": "SUV 7 SEATER", "mux": "SUV 7 SEATER", 
    "kodiaq": "SUV 7 SEATER", "tiguan allspace": "SUV 7 SEATER", "meridian": "SUV 7 SEATER", "carnival": "SUV 7 SEATER", 
    "vellfire": "SUV 7 SEATER", "rumion": "SUV 7 SEATER", "invicto": "SUV 7 SEATER", "q7": "SUV 7 SEATER", "x5": "SUV 7 SEATER",
    "x7": "SUV 7 SEATER", "gls": "SUV 7 SEATER", "gle": "SUV 7 SEATER", "defender": "SUV 7 SEATER", "discovery": "SUV 7 SEATER"
,
    // Added Exhaustive Car List
    "a class": "HATCHBACK",
    "b class": "HATCHBACK",
    "1 series": "HATCHBACK",
    "a1": "HATCHBACK",
    "a3 hatchback": "HATCHBACK",
    "polo": "HATCHBACK",
    "golf": "HATCHBACK",
    "up": "HATCHBACK",
    "citroen c3": "HATCHBACK",
    "mini cooper": "HATCHBACK",
    "swift": "HATCHBACK",
    "baleno": "HATCHBACK",
    "celerio": "HATCHBACK",
    "wagonr": "HATCHBACK",
    "alto": "HATCHBACK",
    "s-presso": "HATCHBACK",
    "ignis": "HATCHBACK",
    "ritz": "HATCHBACK",
    "zen": "HATCHBACK",
    "estilo": "HATCHBACK",
    "a-star": "HATCHBACK",
    "tiago": "HATCHBACK",
    "altroz": "HATCHBACK",
    "indica": "HATCHBACK",
    "vista": "HATCHBACK",
    "bolt": "HATCHBACK",
    "nano": "HATCHBACK",
    "comet": "HATCHBACK",
    "i20": "HATCHBACK",
    "grand i10": "HATCHBACK",
    "nios": "HATCHBACK",
    "santro": "HATCHBACK",
    "eon": "HATCHBACK",
    "getz": "HATCHBACK",
    "brio": "HATCHBACK",
    "jazz": "HATCHBACK",
    "figo": "HATCHBACK",
    "beat": "HATCHBACK",
    "spark": "HATCHBACK",
    "uva": "HATCHBACK",
    "micra": "HATCHBACK",
    "datsun go": "HATCHBACK",
    "redi-go": "HATCHBACK",
    "kwid": "HATCHBACK",
    "pulse": "HATCHBACK",
    "fabia": "HATCHBACK",
    "3 series": "SEDAN",
    "5 series": "SEDAN",
    "7 series": "SEDAN",
    "m3": "SEDAN",
    "m5": "SEDAN",
    "c class": "SEDAN",
    "e class": "SEDAN",
    "s class": "SEDAN",
    "maybach s": "SEDAN",
    "cla": "SEDAN",
    "cls": "SEDAN",
    "a3": "SEDAN",
    "a4": "SEDAN",
    "a6": "SEDAN",
    "a8": "SEDAN",
    "s60": "SEDAN",
    "s90": "SEDAN",
    "es": "SEDAN",
    "ls": "SEDAN",
    "is": "SEDAN",
    "camry": "SEDAN",
    "corolla": "SEDAN",
    "yaris": "SEDAN",
    "etios": "SEDAN",
    "city": "SEDAN",
    "amaze": "SEDAN",
    "civic": "SEDAN",
    "accord": "SEDAN",
    "verna": "SEDAN",
    "elantra": "SEDAN",
    "aura": "SEDAN",
    "accent": "SEDAN",
    "sonata": "SEDAN",
    "slavia": "SEDAN",
    "rapid": "SEDAN",
    "octavia": "SEDAN",
    "superb": "SEDAN",
    "laura": "SEDAN",
    "virtus": "SEDAN",
    "vento": "SEDAN",
    "jetta": "SEDAN",
    "passat": "SEDAN",
    "ameo": "SEDAN",
    "dzire": "SEDAN",
    "ciaz": "SEDAN",
    "kizashi": "SEDAN",
    "esteem": "SEDAN",
    "sx4": "SEDAN",
    "tigor": "SEDAN",
    "zest": "SEDAN",
    "indigo": "SEDAN",
    "manza": "SEDAN",
    "aspire": "SEDAN",
    "fiesta": "SEDAN",
    "ikon": "SEDAN",
    "escort": "SEDAN",
    "sunny": "SEDAN",
    "teana": "SEDAN",
    "cruze": "SEDAN",
    "optra": "SEDAN",
    "aveo": "SEDAN",
    "sail": "SEDAN",
    "fluence": "SEDAN",
    "scala": "SEDAN",
    "x1": "COMPACT SUV",
    "x2": "COMPACT SUV",
    "gla": "COMPACT SUV",
    "glb": "COMPACT SUV",
    "q2": "COMPACT SUV",
    "q3": "COMPACT SUV",
    "xc40": "COMPACT SUV",
    "brezza": "COMPACT SUV",
    "fronx": "COMPACT SUV",
    "jimny": "COMPACT SUV",
    "gv": "COMPACT SUV",
    "grand vitara": "COMPACT SUV",
    "nexon": "COMPACT SUV",
    "punch": "COMPACT SUV",
    "curvv": "COMPACT SUV",
    "venue": "COMPACT SUV",
    "sonet": "COMPACT SUV",
    "kushaq": "COMPACT SUV",
    "taigun": "COMPACT SUV",
    "ecosport": "COMPACT SUV",
    "magnite": "COMPACT SUV",
    "kiger": "COMPACT SUV",
    "xuv300": "COMPACT SUV",
    "xuv 3x0": "COMPACT SUV",
    "wr-v": "COMPACT SUV",
    "duster": "COMPACT SUV",
    "astor": "COMPACT SUV",
    "x3": "SUV 5 SEATER",
    "x4": "SUV 5 SEATER",
    "x5": "SUV 5 SEATER",
    "glc": "SUV 5 SEATER",
    "gle": "SUV 5 SEATER",
    "q5": "SUV 5 SEATER",
    "q7": "SUV 5 SEATER",
    "q8": "SUV 5 SEATER",
    "xc60": "SUV 5 SEATER",
    "xc90": "SUV 5 SEATER",
    "macan": "SUV 5 SEATER",
    "cayenne": "SUV 5 SEATER",
    "range rover evoque": "SUV 5 SEATER",
    "velar": "SUV 5 SEATER",
    "discovery sport": "SUV 5 SEATER",
    "defender 90": "SUV 5 SEATER",
    "compass": "SUV 5 SEATER",
    "wrangler": "SUV 5 SEATER",
    "nx": "SUV 5 SEATER",
    "rx": "SUV 5 SEATER",
    "creta": "SUV 5 SEATER",
    "seltos": "SUV 5 SEATER",
    "tucson": "SUV 5 SEATER",
    "sportage": "SUV 5 SEATER",
    "harrier": "SUV 5 SEATER",
    "hector": "SUV 5 SEATER",
    "kicks": "SUV 5 SEATER",
    "terrano": "SUV 5 SEATER",
    "s-cross": "SUV 5 SEATER",
    "captur": "SUV 5 SEATER",
    "c5 aircross": "SUV 5 SEATER",
    "x7": "SUV 7 SEATER",
    "gls": "SUV 7 SEATER",
    "maybach gls": "SUV 7 SEATER",
    "range rover": "SUV 7 SEATER",
    "range rover sport": "SUV 7 SEATER",
    "defender 110": "SUV 7 SEATER",
    "defender 130": "SUV 7 SEATER",
    "discovery": "SUV 7 SEATER",
    "lx": "SUV 7 SEATER",
    "grand cherokee": "SUV 7 SEATER",
    "fortuner": "SUV 7 SEATER",
    "innova": "SUV 7 SEATER",
    "innova crysta": "SUV 7 SEATER",
    "innova hycross": "SUV 7 SEATER",
    "land cruiser": "SUV 7 SEATER",
    "vellfire": "SUV 7 SEATER",
    "rumion": "SUV 7 SEATER",
    "safari": "SUV 7 SEATER",
    "hexa": "SUV 7 SEATER",
    "aria": "SUV 7 SEATER",
    "xuv3XO": "Compact SUV",
    "xuv300": "Compact SUV",
    "xuv500": "SUV 7 SEATER",
    "xuv700": "SUV 7 SEATER",
    "scorpio": "SUV 7 SEATER",
    "Xylo": "SUV 7 SEATER",
    "scorpio-n": "SUV 7 SEATER",
    "scorpio classic": "SUV 7 SEATER",
    "bolero": "SUV 7 SEATER",
    "bolero neo": "SUV 7 SEATER",
    "marazzo": "SUV 7 SEATER",
    "alturas g4": "SUV 7 SEATER",
    "ertiga": "SUV 7 SEATER",
    "xl6": "SUV 7 SEATER",
    "invicto": "SUV 7 SEATER",
    "carens": "SUV 7 SEATER",
    "carnival": "SUV 7 SEATER",
    "alcazar": "SUV 7 SEATER",
    "endeavour": "SUV 7 SEATER",
    "everest": "SUV 7 SEATER",
    "hector": "SUV 5 SEATER",
    "hector plus": "SUV 7 SEATER",
    "gloster": "SUV 7 SEATER",
    "kodiaq": "SUV 7 SEATER",
    "tiguan allspace": "SUV 7 SEATER",
    "mu-x": "SUV 7 SEATER",
    "v-cross": "SUV 7 SEATER",
    "triber": "SUV 7 SEATER",
    "lodgy": "SUV 7 SEATER",
    "pajero": "SUV 7 SEATER",
    "pajero sport": "SUV 7 SEATER",
    "outlander": "SUV 7 SEATER",
    "trailblazer": "SUV 7 SEATER",
    "captiva": "SUV 7 SEATER",
    "enjoy": "SUV 7 SEATER",
    "tavera": "SUV 7 SEATER"
};

function findCarCategory() {
    const inputField = document.getElementById("carSearchInput");
    const resultDiv = document.getElementById("carSearchResult");
    
    if (!inputField || !resultDiv) return;
    
    const inputRaw = inputField.value.toLowerCase().trim();
    if (!inputRaw) {
        resultDiv.textContent = "";
        return;
    }
    const inputClean = inputRaw.replace(/\s+/g, '');

    let foundCategory = null;
    
    // Sort keys by length descending to match longer specific names first (e.g. "swift dzire" before "swift")
    const sortedModels = Object.keys(carDatabase).sort((a, b) => b.length - a.length);
    
    for (const model of sortedModels) {
        const cleanModel = model.replace(/\s+/g, '');
        if (inputClean.includes(cleanModel)) {
            foundCategory = carDatabase[model];
            break;
        }
    }

    if (foundCategory) {
        resultDiv.innerHTML = `Category: <span style="color: var(--primary);">${foundCategory}</span>`;
    } else {
        resultDiv.innerHTML = `<span style="color: #e74c3c;">Model not recognized. Please select based on size.</span>`;
    }
}

// Add Enter key listener for the search input
const carSearchInput = document.getElementById("carSearchInput");
if (carSearchInput) {
    carSearchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            findCarCategory();
        }
    });
}

// ===============================
// LIVE CATEGORY DETECTION ON CONTACT FORM
// ===============================
const contactCarInput = document.getElementById("car");
const liveCategoryResult = document.getElementById("liveCategoryResult");

if (contactCarInput && liveCategoryResult) {
    contactCarInput.addEventListener("input", function() {
        const inputRaw = this.value.toLowerCase().trim();
        if (!inputRaw) {
            liveCategoryResult.textContent = "";
            return;
        }
        
        const inputClean = inputRaw.replace(/\s+/g, '');
        let foundCategory = null;
        
        const sortedModels = Object.keys(carDatabase).sort((a, b) => b.length - a.length);
        for (const model of sortedModels) {
            const cleanModel = model.replace(/\s+/g, '');
            if (inputClean.includes(cleanModel)) {
                foundCategory = carDatabase[model];
                break;
            }
        }
        
        if (foundCategory) {
            liveCategoryResult.innerHTML = `Auto-Detected Category: <span style="color: var(--primary);">${foundCategory}</span>`;
        } else {
            liveCategoryResult.innerHTML = `<span style="color: #e74c3c; font-weight: normal; font-size: 13px;">Keep typing car model...</span>`;
        }
    });
}

// ===============================
// SECRET ADMIN PANEL TRIGGER
// ===============================
const logoLink = document.querySelector('.logo a');
if (logoLink) {
    let clickCount = 0;
    let clickTimer = null;

    logoLink.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        clickCount++;
        
        if (clickCount === 3) {
            window.location.href = 'admin.html';
            clickCount = 0;
            clearTimeout(clickTimer);
        } else {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount > 0 && clickCount < 3) {
                    window.location.href = logoLink.getAttribute('href');
                }
                clickCount = 0;
            }, 800); 
        }
    });
}

// ===============================
// FLOATING SLIDERS INJECTION
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    // 1. Left Slider (Feedback)
    const leftSlider = document.createElement("a");
    leftSlider.href = "reviews.html";
    leftSlider.className = "floating-slider-left";
    leftSlider.innerHTML = `
        <div class="slider-icon"><i class="fas fa-comment-dots"></i></div>
        <div class="slider-text">Feedback</div>
    `;
    
    // 2. Right Slider (Support Us)
    const rightSlider = document.createElement("div");
    rightSlider.className = "floating-slider-right";
    rightSlider.innerHTML = `
        <div class="slider-icon"><i class="fas fa-heart"></i></div>
        <div class="slider-content">
            <span style="font-weight: bold; margin-bottom: 5px; display: block; white-space: nowrap; font-size: 14px;">Support Us</span>
            <a href="#" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>
            <a href="https://wa.me/917567254083" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
    `;

    document.body.appendChild(leftSlider);
    document.body.appendChild(rightSlider);
});

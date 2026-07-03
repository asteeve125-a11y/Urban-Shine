// ===============================
// MOBILE MENU TOGGLE
// ===============================
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--dark)';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            navLinks.style.zIndex = '999';
        }
    });
}

// Reset mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = '';
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.background = '';
            navLinks.style.padding = '';
        }
    }
});

// ===============================
// CONTACT FORM VALIDATION & WHATSAPP
// ===============================
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
    bookingForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const submitBtn = e.submitter || document.getElementById("submitBtnWhatsApp");
        const isDirect = submitBtn.value === "direct";
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const name = document.getElementById("name").value;
        const area = document.getElementById("area").value;
        const house = document.getElementById("house").value;
        const car = document.getElementById("car").value;
        const date = document.getElementById("date").value;
        const packageType = document.querySelector('input[name="packageType"]:checked').value;
        const washType = document.querySelector('input[name="washType"]:checked').value;
        
        const bookingData = { name, area, house, car, date, packageType, washType };

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
📍 Area: ${area}
🏠 Building & House: ${house}
🚗 Car Model: ${car}
🗓️ Preferred Date: ${date}
📦 Type of Package: ${packageType}
✨ Type of Wash: ${washType}

Thank You.`;

            const whatsappURL = `https://wa.me/919033155566?text=${encodeURIComponent(message)}`;
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

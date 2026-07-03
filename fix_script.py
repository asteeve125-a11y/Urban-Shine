import os

filepath = r"c:\Users\DELL\Desktop\UShine\script.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find where the car search section begins
marker = "// ===============================\n// CAR CATEGORY SEARCH\n// ==============================="
index = content.find(marker)

if index == -1:
    # try with carriage return
    marker = "// ===============================\r\n// CAR CATEGORY SEARCH\r\n// ==============================="
    index = content.find(marker)

if index != -1:
    content = content[:index]

# Append the correct code
new_code = """// ===============================
// CAR CATEGORY SEARCH
// ===============================
const carDatabase = {
    // Hatchbacks
    "altroz": "HATCHBACK", "baleno": "HATCHBACK", "swift": "HATCHBACK", "i20": "HATCHBACK", "polo": "HATCHBACK", "tiago": "HATCHBACK", "glanza": "HATCHBACK", "kwid": "HATCHBACK", "celerio": "HATCHBACK", "wagonr": "HATCHBACK", "ignis": "HATCHBACK",
    
    // Sedans
    "city": "SEDAN", "verna": "SEDAN", "slavia": "SEDAN", "virtus": "SEDAN", "ciaz": "SEDAN", "dzire": "SEDAN", "amaze": "SEDAN", "aura": "SEDAN", "tigor": "SEDAN", "rapid": "SEDAN", "octavia": "SEDAN",
    
    // Compact SUVs
    "nexon": "COMPACT SUV", "brezza": "COMPACT SUV", "venue": "COMPACT SUV", "sonet": "COMPACT SUV", "punch": "COMPACT SUV", "magnite": "COMPACT SUV", "kiger": "COMPACT SUV", "xuv300": "COMPACT SUV", "ecosport": "COMPACT SUV", "fronx": "COMPACT SUV",
    
    // SUV 5 Seater
    "thar": "SUV 5 SEATER", "creta": "SUV 5 SEATER", "seltos": "SUV 5 SEATER", "harrier": "SUV 5 SEATER", "hector": "SUV 5 SEATER", "kushaq": "SUV 5 SEATER", "taigun": "SUV 5 SEATER", "astor": "SUV 5 SEATER", "elevate": "SUV 5 SEATER", "grand vitara": "SUV 5 SEATER", "hyryder": "SUV 5 SEATER", "compass": "SUV 5 SEATER",
    
    // SUV 7 Seater
    "xuv500": "SUV 7 SEATER", "xuv700": "SUV 7 SEATER", "safari": "SUV 7 SEATER", "scorpio": "SUV 7 SEATER", "innova": "SUV 7 SEATER", "fortuner": "SUV 7 SEATER", "endeavour": "SUV 7 SEATER", "hector plus": "SUV 7 SEATER", "carens": "SUV 7 SEATER", "ertiga": "SUV 7 SEATER", "xl6": "SUV 7 SEATER", "alcazar": "SUV 7 SEATER", "gloster": "SUV 7 SEATER", "bolero": "SUV 7 SEATER"
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
    const inputClean = inputRaw.replace(/\\s+/g, '');

    let foundCategory = null;
    
    for (const [model, category] of Object.entries(carDatabase)) {
        const cleanModel = model.replace(/\\s+/g, '');
        if (inputClean.includes(cleanModel)) {
            foundCategory = category;
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
"""

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content + new_code)

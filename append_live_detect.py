import os

filepath = r"c:\Users\DELL\Desktop\UShine\script.js"
with open(filepath, "a", encoding="utf-8") as f:
    f.write("""
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
            liveCategoryResult.innerHTML = `Auto-Detected Category: <span style="color: var(--primary);">${foundCategory}</span>`;
        } else {
            liveCategoryResult.innerHTML = `<span style="color: #e74c3c; font-weight: normal; font-size: 13px;">Keep typing car model...</span>`;
        }
    });
}
""")

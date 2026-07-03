import os
import re

filepath = r"c:\Users\DELL\Desktop\UShine\script.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Update the database slightly to include 'breeza' and 'swift dzire'
content = content.replace('"brezza": "COMPACT SUV"', '"brezza": "COMPACT SUV", "breeza": "COMPACT SUV"')
content = content.replace('"dzire": "SEDAN"', '"dzire": "SEDAN", "swift dzire": "SEDAN"')
content = content.replace('"innova": "SUV 7 SEATER"', '"innova": "SUV 7 SEATER", "inova": "SUV 7 SEATER", "crysta": "SUV 7 SEATER", "hycross": "SUV 7 SEATER"')

# Update findCarCategory function
old_func = """function findCarCategory() {
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
}"""

new_func = """function findCarCategory() {
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
    
    // Sort keys by length descending to match longer specific names first (e.g. "swift dzire" before "swift")
    const sortedModels = Object.keys(carDatabase).sort((a, b) => b.length - a.length);
    
    for (const model of sortedModels) {
        const cleanModel = model.replace(/\\s+/g, '');
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
}"""

content = content.replace(old_func, new_func)

# Also update the live event listener at the bottom
old_live = """    contactCarInput.addEventListener("input", function() {
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
        }"""

new_live = """    contactCarInput.addEventListener("input", function() {
        const inputRaw = this.value.toLowerCase().trim();
        if (!inputRaw) {
            liveCategoryResult.textContent = "";
            return;
        }
        
        const inputClean = inputRaw.replace(/\\s+/g, '');
        let foundCategory = null;
        
        const sortedModels = Object.keys(carDatabase).sort((a, b) => b.length - a.length);
        for (const model of sortedModels) {
            const cleanModel = model.replace(/\\s+/g, '');
            if (inputClean.includes(cleanModel)) {
                foundCategory = carDatabase[model];
                break;
            }
        }"""

content = content.replace(old_live, new_live)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

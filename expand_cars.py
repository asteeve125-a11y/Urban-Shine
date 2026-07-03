import re

filepath = r"c:\Users\DELL\Desktop\UShine\script.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

expanded_database = """const carDatabase = {
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
    "city": "SEDAN", "verna": "SEDAN", "slavia": "SEDAN", "virtus": "SEDAN", "ciaz": "SEDAN", "dzire": "SEDAN", 
    "amaze": "SEDAN", "aura": "SEDAN", "tigor": "SEDAN", "rapid": "SEDAN", "octavia": "SEDAN", "civic": "SEDAN", 
    "accord": "SEDAN", "corolla": "SEDAN", "altis": "SEDAN", "camry": "SEDAN", "yaris": "SEDAN", "etios": "SEDAN", 
    "vento": "SEDAN", "jetta": "SEDAN", "passat": "SEDAN", "superb": "SEDAN", "laura": "SEDAN", "elantra": "SEDAN", 
    "sonata": "SEDAN", "accent": "SEDAN", "fiesta": "SEDAN", "ikon": "SEDAN", "aspire": "SEDAN", "sunny": "SEDAN", 
    "teana": "SEDAN", "cruze": "SEDAN", "optra": "SEDAN", "aveo": "SEDAN", "sail": "SEDAN", "manza": "SEDAN", 
    "zest": "SEDAN", "indigo": "SEDAN", "linea": "SEDAN", "esteem": "SEDAN", "baleno sedan": "SEDAN", "kizashi": "SEDAN",
    
    // Compact SUVs / Crossovers
    "nexon": "COMPACT SUV", "brezza": "COMPACT SUV", "venue": "COMPACT SUV", "sonet": "COMPACT SUV", "punch": "COMPACT SUV", 
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
    "xuv500": "SUV 7 SEATER", "xuv700": "SUV 7 SEATER", "safari": "SUV 7 SEATER", "scorpio": "SUV 7 SEATER", "innova": "SUV 7 SEATER", 
    "fortuner": "SUV 7 SEATER", "endeavour": "SUV 7 SEATER", "hector plus": "SUV 7 SEATER", "carens": "SUV 7 SEATER", 
    "ertiga": "SUV 7 SEATER", "xl6": "SUV 7 SEATER", "alcazar": "SUV 7 SEATER", "gloster": "SUV 7 SEATER", "bolero": "SUV 7 SEATER", 
    "marazzo": "SUV 7 SEATER", "hexa": "SUV 7 SEATER", "aria": "SUV 7 SEATER", "lodgy": "SUV 7 SEATER", "triber": "SUV 7 SEATER", 
    "mobilio": "SUV 7 SEATER", "enjoy": "SUV 7 SEATER", "tavera": "SUV 7 SEATER", "mu-x": "SUV 7 SEATER", "mux": "SUV 7 SEATER", 
    "kodiaq": "SUV 7 SEATER", "tiguan allspace": "SUV 7 SEATER", "meridian": "SUV 7 SEATER", "carnival": "SUV 7 SEATER", 
    "vellfire": "SUV 7 SEATER", "rumion": "SUV 7 SEATER", "invicto": "SUV 7 SEATER", "q7": "SUV 7 SEATER", "x5": "SUV 7 SEATER",
    "x7": "SUV 7 SEATER", "gls": "SUV 7 SEATER", "gle": "SUV 7 SEATER", "defender": "SUV 7 SEATER", "discovery": "SUV 7 SEATER"
};"""

# Use regex to find and replace the carDatabase block
# We know it starts with 'const carDatabase = {' and ends with '};' right before 'function findCarCategory()'
pattern = r"const carDatabase = \{.*?\};"
new_content = re.sub(pattern, expanded_database, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Database expanded successfully!")

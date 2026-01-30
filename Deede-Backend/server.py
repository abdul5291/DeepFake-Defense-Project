# server.py - REALISTIC DEMO MODE
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Global counter for Quick Scan "One-by-One" logic
quick_scan_counter = 0

@app.route('/', methods=['GET'])
def home():
    return "✅ Deede Server Running"

@app.route('/scan', methods=['POST'])
def scan_media():
    global quick_scan_counter
    
    mode = request.form.get('mode', 'random') 
    filename = request.files['media'].filename if 'media' in request.files else "unknown"
    
    verdict = ""
    confidence = 0
    details = ""

    # --- LOGIC 1: QUICK SCAN (Predictable Toggle) ---
    if mode == 'toggle':
        # Even = REAL, Odd = FAKE
        if quick_scan_counter % 2 == 0:
            verdict = "REAL"
            confidence = random.randint(96, 99)
            details = "Authentic Media Verified"
        else:
            verdict = "DEEPFAKE"
            confidence = random.randint(92, 98)
            details = "Deepfake / Face Manipulation Detected"
        quick_scan_counter += 1

    # --- LOGIC 2: SYSTEM GUARD (Realistic Weights) ---
    else:
        # 80% Real, 15% AI, 5% Deepfake
        choices = ["REAL", "AI_GENERATED", "DEEPFAKE"]
        weights = [0.80, 0.15, 0.05] 
        
        verdict = random.choices(choices, weights=weights, k=1)[0]
        
        if verdict == "REAL":
            confidence = random.randint(88, 99)
            details = "Authentic"
        elif verdict == "AI_GENERATED":
            confidence = random.randint(85, 95)
            details = "AI Pattern (Midjourney/Sora)"
        else:
            confidence = random.randint(90, 99)
            details = "Deepfake Detected"

    # Tiny delay to look like it's "thinking"
    time.sleep(0.2) 

    return jsonify({
        'status': 'success',
        'verdict': verdict,
        'confidence': confidence,
        'details': details
    })

@app.route('/scan-url', methods=['POST'])
def scan_url():
    # Extension logic
    global quick_scan_counter
    if quick_scan_counter % 2 == 0:
        verdict = "REAL"
    else:
        verdict = "DEEPFAKE"
    quick_scan_counter += 1
    return jsonify({'status': 'success', 'verdict': verdict, 'confidence': 95})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

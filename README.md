# 🐉 Dragon Repeller RPG

![Project Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

A retro-style, turn-based RPG game built entirely with vanilla JavaScript. Originally a study in DOM manipulation and Web Audio, **v1.1.0** evolves the project into a secure, polished web application with AES encryption and advanced UI animations.

## 🎮 Live Demo
**[CLICK HERE TO PLAY](https://mfcan10.github.io/Dragon-Repeller-RPG/)**

---

## 🚀 New in v1.1.0 (Upgrade Highlights)

### 🔐 Military-Grade Save Security
Moved beyond simple storage to a robust, cryptographically secure save system.
* **AES-GCM Encryption:** Player data (Gold/XP/Inventory) is encrypted using the **Web Crypto API** (AES-GCM 256-bit).
* **Key Derivation (PBKDF2):** Uses a random salt and 100,000 iterations to derive secure keys, preventing rainbow table attacks.
* **Integrity Checks:** The GCM mode ensures save files cannot be tampered with or edited by the user without invalidating the data.
* **Cross-Browser Fallback:** Includes a custom XOR-based encryption algorithm for environments where `crypto.subtle` is unavailable.

### 🎨 Visual & UX Overhaul
* **"Game Juice":** Added polished CSS animations for screen shake (damage), dodge feedback, and victory pulses.
* **Dynamic Environments:** Context-aware background images now load dynamically via Unsplash as the player travels between the Town, Store, and Cave.
* **Event Overlays:** Replaced standard alerts with custom, animated Victory/Defeat overlay screens.

---

## ✨ Core Features (v1.0.0)

### 🔊 Procedural Audio Engine
Instead of using static `.mp3` or `.wav` files, this project utilizes the **Web Audio API** to generate sound effects in real-time.
* **Synthesis:** Sound effects (sword swings, hits, music) are synthesized programmatically using oscillators and gain nodes.
* **Performance:** Zero audio asset loading times.

### ⚔️ Interactive Combat System
* **Turn-Based Logic:** complete state management for combat loops, including RNG-based damage, dodging, and critical hits.
* **Inventory System:** Tracks weapon upgrades and gold economy.

---

## 🛠️ Technologies Used

* **JavaScript (ES6+):** Async/Await, Web Crypto API, Web Audio API, LocalStorage.
* **CSS3:** Advanced `@keyframes`, Flexbox, Responsive Layouts.
* **HTML5:** Semantic structure.

---

## 💡 Technical Deep Dive: Security Implementation

One of the main engineering challenges in **v1.1.0** was securing client-side data. Below is a snippet of the encryption logic using `AES-GCM`:

```javascript
async function encryptData(data) {
    // 1. Generate Entropy
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 2. Derive Key using PBKDF2
    const keyMaterial = await crypto.subtle.importKey( ... );
    const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        ...
    );

    // 3. Encrypt & Bundle
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoder.encode(data)
    );
    // ... combines salt + iv + ciphertext for storage
}
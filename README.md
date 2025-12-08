# 🐉 Dragon Repeller RPG

![Project Status](https://img.shields.io/badge/status-active-success)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

A retro-style, turn-based RPG game built entirely with vanilla JavaScript. This project explores advanced DOM manipulation, CSS animations, and procedural sound generation using the Web Audio API.

## 🎮 Live Demo
**[CLICK HERE TO PLAY]** (#)

---

## ✨ Key Features

### 🔊 Procedural Audio Engine
Instead of using static `.mp3` or `.wav` files, this project utilizes the **Web Audio API** to generate sound effects in real-time.
* **Oscillators & Gain Nodes:** Sound effects (sword swings, hits, victory music) are synthesized programmatically using custom frequencies and ramps.
* **Performance:** Zero audio asset loading times.

### ⚔️ Interactive Combat System
* **Dynamic Visuals:** Custom CSS Keyframe animations for player attacks, damage feedback (screen shake), and victory states.
* **State Management:** Tracks player XP, Health, Gold, and Inventory state throughout the session.

---

## 🛠️ Technologies Used

* **HTML5:** Semantic structure.
* **CSS3:** Flexbox layout and advanced `@keyframes` animations for game "juice."
* **JavaScript (ES6+):** Game logic, state management, and audio synthesis.

---

## 💡 Technical Highlight: Web Audio API

One of the main challenges in this project was creating a sound system without external assets. Below is a snippet of how the "Sword Swing" sound is synthesized using an oscillator:

```javascript
function playSwordSwing() {
    // Create oscillator and gain node
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Frequency ramp to simulate the "whoosh" sound
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
    
    // Play and stop
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}
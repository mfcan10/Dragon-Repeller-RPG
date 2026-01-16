# 🐉 Dragon Repeller RPG

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![Tech](https://img.shields.io/badge/tech-Vite%20%7C%20ES6%20Modules%20%7C%20CSS3-blue)

A modern browser-based RPG game featuring turn-based combat, procedural audio, and a premium dark UI. Originally a simple DOM manipulation study, **v2.0.0** transforms it into a robust, modular web application.

## 🎮 Features

### 💎 Premium Visual Experience
-   **Glassmorphism UI**: Immersive interface with blurred panels and neon glows.
-   **Dynamic Stats**: Animated progress bars for Health, XP, and Monster Health.
-   **Juicy Combat**: Screen shakes on impact, red flash on damage, and bouncy victory animations.
-   **Responsive Design**: Fully playable on mobile and desktop.

### 🛠 Modern Tech Stack
-   **Vite**: Blazing fast development server and bundler.
-   **ES6 Modules**: Clean architecture separating `audio`, `combat`, `state`, `storage`, and `ui`.
-   **Web Audio API**: Real-time synthesized sound effects (no assets to load).
-   **Secure Persistence**: AES-GCM encrypted local storage to prevent save tampering.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v16 or higher)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/mfcan10/Dragon-Repeller-RPG.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 🏗 Architecture

The project is structured as a modular monolith:

```
src/
├── modules/
│   ├── audio.js    # Procedural sound generation
│   ├── combat.js   # Battle formulas and logic
│   ├── state.js    # Reactive game state
│   ├── storage.js  # AES-GCM Encryption & Persistence
│   └── ui.js       # DOM Manipulation & Animations
├── assets/         # Static assets
├── style.css       # Modern CSS Variables & Animations
└── main.js         # Game Loop & Initialization
```

## 🔒 Security

Save data is protected using **AES-GCM encryption** via the Web Crypto API. 
-   **Key Derivation**: PBKDF2 with 100,000 iterations.
-   **Integrity**: GCM mode ensures save files cannot be modified externally.

---
*Original concept based on the freeCodeCamp JavaScript Algorithms and Data Structures curriculum.*
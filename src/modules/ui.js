export class UI {
    constructor() {
        this.elements = {
            xpText: document.getElementById("xpText"),
            xpFill: document.getElementById("xpFill"),
            healthText: document.getElementById("healthText"),
            healthFill: document.getElementById("healthFill"),
            goldText: document.getElementById("goldText"),
            monsterStats: document.getElementById("monsterStats"),
            monsterName: document.getElementById("monsterName"),
            monsterHealth: document.getElementById("monsterHealth"),
            monsterHealthFill: document.getElementById("monsterHealthFill"),
            button1: document.getElementById("button1"),
            button2: document.getElementById("button2"),
            button3: document.getElementById("button3"),
            text: document.getElementById("text"),
            combatArea: document.getElementById("combatArea"),
            monsterImage: document.getElementById("monsterImage"),
            monsterNameDisplay: document.getElementById("monsterNameDisplay"),
            player: document.getElementById("player"),
            locationImage: document.getElementById("locationImage"),
            locationImageContainer: document.getElementById("locationImageContainer"),
            winOverlay: document.getElementById("winOverlay"),
            loseOverlay: document.getElementById("loseOverlay"),
            winMessage: document.getElementById("winMessage"),
            loseMessage: document.getElementById("loseMessage"),
            winRestart: document.getElementById("winRestart"),
            loseRestart: document.getElementById("loseRestart")
        };


        this.currentMonsterMaxHealth = 100;
    }

    updateStats(state) {
        this.elements.xpText.innerText = state.xp;
        this.elements.healthText.innerText = state.health;
        this.elements.goldText.innerText = state.gold;

        // Visual updates
        // XP Bar: arbitrary progress based on modulo 100 for visual flavor
        const xpProgress = (state.xp % 100);
        if (this.elements.xpFill) {
            this.elements.xpFill.style.width = `${xpProgress}%`;
        }

        // Health Bar: Assume 100 is base for visual, but allow overflow
        const healthPercent = Math.min(100, Math.max(0, state.health));
        if (this.elements.healthFill) {
            this.elements.healthFill.style.width = `${healthPercent}%`;
            // Change color if low health
            this.elements.healthFill.style.backgroundColor = state.health < 30 ? '#ff4444' : '#44ff44';
        }
    }

    updateLocation(location, functions) {
        this.elements.text.innerText = location.text;
        this.elements.button1.innerText = location["button text"][0];
        this.elements.button2.innerText = location["button text"][1];
        this.elements.button3.innerText = location["button text"][2];

        this.elements.button1.onclick = functions[0];
        this.elements.button2.onclick = functions[1];
        this.elements.button3.onclick = functions[2];

        if (this.elements.combatArea) {
            this.elements.combatArea.style.display = "none";
            this.elements.monsterStats.style.display = "none"; // Hide monster stats too
        }

        if (this.elements.locationImage && location.image) {
            this.elements.locationImage.src = location.image;
            this.elements.locationImageContainer.className = location.imageClass || "";
            this.elements.locationImageContainer.style.display = "flex";
        }
    }

    showCombat(monster) {
        this.elements.monsterStats.style.display = "flex"; // Flex for our new layout
        this.elements.combatArea.style.display = "block";
        this.elements.locationImageContainer.style.display = "none";

        this.elements.monsterName.innerText = monster.name;
        this.elements.monsterHealth.innerText = `${monster.health} / ${monster.health}`;

        this.currentMonsterMaxHealth = monster.health;
        this.updateMonsterHealth(monster.health);

        this.elements.monsterImage.innerText = monster.image;
        this.elements.monsterNameDisplay.innerText = monster.name;
        this.elements.monsterImage.className = "";
    }

    updateMonsterHealth(health) {
        this.elements.monsterHealth.innerText = `${health} / ${this.currentMonsterMaxHealth}`;
        if (this.elements.monsterHealthFill) {
            const percent = (health / this.currentMonsterMaxHealth) * 100;
            this.elements.monsterHealthFill.style.width = `${Math.max(0, percent)}%`;
        }
    }

    setMessage(msg) {
        this.elements.text.innerText = msg;
    }

    animatePlayerAttack() {
        this.elements.player.classList.add("player-attack");
        setTimeout(() => {
            this.elements.player.classList.remove("player-attack");
        }, 500);
    }

    animateMonsterHit() {
        this.elements.monsterImage.classList.add("monster-hit");
        const area = document.getElementById("game");
        area.classList.add("shake-screen");
        setTimeout(() => {
            this.elements.monsterImage.classList.remove("monster-hit");
            area.classList.remove("shake-screen");
        }, 500);
    }

    animatePlayerHit() {
        this.elements.player.classList.add("player-hit");
        document.body.classList.add("flash-red");
        setTimeout(() => {
            this.elements.player.classList.remove("player-hit");
            document.body.classList.remove("flash-red");
        }, 500);
    }

    animatePlayerDodge() {
        this.elements.player.classList.add("player-dodge");
        setTimeout(() => {
            this.elements.player.classList.remove("player-dodge");
        }, 500);
    }

    animateMonsterAttack() {
        this.elements.monsterImage.classList.add("monster-attack");
        setTimeout(() => {
            this.elements.monsterImage.classList.remove("monster-attack");
        }, 500);
    }

    showWinOverlay(msg) {
        this.elements.winMessage.innerText = msg;
        this.elements.winOverlay.classList.add("win-overlay-show");
    }

    showLoseOverlay(msg) {
        this.elements.loseMessage.innerText = msg;
        this.elements.loseOverlay.classList.add("lose-overlay-show");
    }
}

export const ui = new UI();

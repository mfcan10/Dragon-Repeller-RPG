import './style.css';
import { AudioController } from './modules/audio';
import { state } from './modules/state';
import { storage } from './modules/storage';
import { ui } from './modules/ui';
import { CombatSystem } from './modules/combat';
import { GameEngine } from './modules/engine';
import { maps } from './modules/maps';

const audio = new AudioController();
const combatSystem = new CombatSystem(state, audio, ui);

// 2D Engine
let gameEngine = null;

const monsters = [
    { name: "slime", level: 2, health: 15, image: "🟢" },
    { name: "fanged beast", level: 8, health: 60, image: "🐺" },
    { name: "dragon", level: 20, health: 300, image: "🐉" }
];

const weapons = [
    { name: "stick", power: 5 },
    { name: "dagger", power: 30 },
    { name: "claw hammer", power: 50 },
    { name: "sword", power: 100 }
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStoreMenu, goCaveMap, fightDragon],
        text: "You are in the town square. Use ARROW KEYS to move.",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
        imageClass: "town"
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Back to Town"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You are in the store. You see a sign that says 'Store'.",
        image: "https://images.unsplash.com/photo-1708409858781-30df7a234f2d?w=800&h=600&fit=crop",
        imageClass: "store"
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Back to Town"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You are in the cave. Use ARROW KEYS to find monsters.",
        image: "https://images.unsplash.com/photo-1517239320384-e08ad2c24a3e?w=800&h=600&fit=crop",
        imageClass: "cave"
    }
];

function handleZoneChange(zone) {
    if (zone === "store") {
        goStoreMenu();
    } else if (zone === "cave") {
        goCaveMap();
    } else if (zone === "town") {
        goTown();
    } else if (zone === "slime") {
        fightSlime();
    } else if (zone === "beast") {
        fightBeast();
    } else if (zone === "dragon") {
        fightDragon();
    }
}

// Ensure Canvas Visibility Control
function showCanvas(visible) {
    const canvasContainer = document.getElementById("game-canvas-container");
    const controls = document.getElementById("controls");
    const locationImg = document.getElementById("locationImageContainer");

    if (visible) {
        canvasContainer.style.display = "flex";
        controls.style.display = "none";
        locationImg.style.display = "none";
        if (gameEngine) gameEngine.start();
    } else {
        canvasContainer.style.display = "none";
        controls.style.display = "grid";
        locationImg.style.display = "flex";
        if (gameEngine) gameEngine.stop();
    }
}

function update(location) {
    ui.updateLocation(location, location["button functions"]);
}

function goTown() {
    update(locations[0]);
    if (gameEngine) gameEngine.loadMap(maps.town);
    showCanvas(true);
}

function goStoreMenu() {
    update(locations[1]);
    showCanvas(false);
}

function goCaveMap(spawnX, spawnY) {
    update(locations[2]);
    if (gameEngine) gameEngine.loadMap(maps.cave, spawnX, spawnY);
    showCanvas(true);
}

function buyHealth() {
    if (state.gold >= 10) {
        state.gold -= 10;
        state.health += 10;
        ui.updateStats(state);
        ui.setMessage("You bought 10 health for 10 gold.");
    } else {
        ui.setMessage("You do not have enough gold to buy health.");
    }
}

function buyWeapon() {
    if (state.currentWeapon < weapons.length - 1) {
        if (state.gold >= 30) {
            state.gold -= 30;
            state.currentWeapon++;
            state.inventory.push(weapons[state.currentWeapon].name);
            ui.updateStats(state);
            ui.setMessage("You now have a " + weapons[state.currentWeapon].name + ".");
        } else {
            ui.setMessage("You do not have enough gold to buy a weapon.");
        }
    } else {
        ui.setMessage("You already have the best weapon!");
        ui.elements.button2.innerText = "Sell weapon for 15 gold";
        ui.elements.button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (state.inventory.length > 1) {
        state.gold += 15;
        state.currentWeapon--;
        state.inventory.pop();
        ui.updateStats(state);
        ui.setMessage("You sold a weapon for 15 gold.");
    }
}

function fightSlime() {
    state.fighting = 0;
    goFight();
}

function fightBeast() {
    state.fighting = 1;
    goFight();
}

function fightDragon() {
    state.fighting = 2;
    goFight();
}

function goFight() {
    showCanvas(false); // Hide map during combat
    const monster = monsters[state.fighting];
    state.monsterHealth = monster.health;
    ui.showCombat(monster);

    ui.setMessage("You are fighting a " + monster.name + ". What do you want to do?");

    ui.elements.button1.innerText = "Attack";
    ui.elements.button2.innerText = "Dodge";
    ui.elements.button3.innerText = "Run";
    ui.elements.button1.onclick = attack;
    ui.elements.button2.onclick = dodge;
    ui.elements.button3.onclick = () => {
        // Run back to Cave Map, specific tunnel entrance (Safe Zones)
        // Using integer Y to align perfectly with the 1-tile wide tunnels
        if (state.fighting === 0) goCaveMap(3.5, 2);  // Slime Path (Row 2)
        else if (state.fighting === 1) goCaveMap(11.5, 2); // Beast Path (Row 2)
        else if (state.fighting === 2) goCaveMap(11.5, 8); // Dragon Path (Row 8)
        else goCaveMap();

    };
}

async function attack() {
    const monster = monsters[state.fighting];
    const result = await combatSystem.attack(monster, weapons);

    ui.updateStats(state);
    ui.updateMonsterHealth(state.monsterHealth);

    if (state.health <= 0) {
        lose();
    } else if (state.monsterHealth <= 0) {
        state.fighting === 2 ? winGame() : defeatMonster();
    }

    storage.save(state.serialize());
}

async function dodge() {
    const monster = monsters[state.fighting];
    await combatSystem.dodge(monster);

    ui.updateStats(state);
    if (state.health <= 0) {
        lose();
    }
}

function defeatMonster() {
    state.gold += Math.floor(monsters[state.fighting].level * 6.7);
    state.xp += monsters[state.fighting].level;
    ui.updateStats(state);
    ui.setMessage('The monster screams "Arg!" as it dies. You gain experience points and find gold.');

    // Reset buttons to return to Cave Map
    ui.elements.button1.innerText = "Back to Map";
    ui.elements.button2.innerText = "Back to Map";
    ui.elements.button3.innerText = "Back to Map";

    const returnToMap = () => {
        // Return to specific tunnel (Safe Zones)
        if (state.fighting === 0) goCaveMap(3.5, 2);
        else if (state.fighting === 1) goCaveMap(11.5, 2);
        else if (state.fighting === 2) goCaveMap(11.5, 8);
        else goCaveMap();

        ui.elements.combatArea.style.display = "none";
        ui.elements.monsterStats.style.display = "none";
    };


    ui.elements.button1.onclick = returnToMap;
    ui.elements.button2.onclick = returnToMap;
    ui.elements.button3.onclick = returnToMap;
}

function lose() {
    ui.updateStats(state);
    ui.showLoseOverlay("You have died. The dragon reclaims the town.");
    audio.playLoseMusic();
    if (gameEngine) gameEngine.stop();
}

function winGame() {
    ui.updateStats(state);
    ui.showWinOverlay("You defeat the dragon! THE TOWN IS SAVED!");
    audio.playWinMusic();
    if (gameEngine) gameEngine.stop();
}

function restart() {
    if (confirm("Are you sure you want to reset the game?")) {
        storage.reset();
        state.reset();
        ui.updateStats(state);

        goTown();

        ui.elements.winOverlay.classList.remove("win-overlay-show");
        ui.elements.loseOverlay.classList.remove("lose-overlay-show");
        ui.elements.button1.disabled = false;
    }
}

async function init() {
    const savedData = await storage.load();
    if (savedData) {
        state.load(savedData);
    }

    ui.updateStats(state);

    // Initialize 2D Engine
    gameEngine = new GameEngine("gameCanvas", handleZoneChange);

    // Start in Town
    goTown();

    if (document.getElementById("resetButton")) {
        document.getElementById("resetButton").onclick = restart;
    }

    if (ui.elements.winRestart) ui.elements.winRestart.onclick = restart;
    if (ui.elements.loseRestart) ui.elements.loseRestart.onclick = restart;

    document.body.onclick = () => {
        audio.resume();
    };
}

init();

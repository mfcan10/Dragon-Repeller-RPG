let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];


const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const text = document.getElementById("text");
const xpText = document.getElementById("xpText");
const healthText = document.getElementById("healthText");
const goldText = document.getElementById("goldText");
const monsterName = document.getElementById("monsterName");
const monsterHealthText = document.getElementById("monsterHealth");
const monsterStats = document.getElementById("monsterStats");
const combatArea = document.getElementById("combatArea");
const monsterImage = document.getElementById("monsterImage");
const monsterNameDisplay = document.getElementById("monsterNameDisplay");
const player = document.getElementById("player");
const winOverlay = document.getElementById("winOverlay");
const loseOverlay = document.getElementById("loseOverlay");
const winMessage = document.getElementById("winMessage");
const loseMessage = document.getElementById("loseMessage");
const winIcon = document.getElementById("winIcon");
const loseIcon = document.getElementById("loseIcon");
const winTitle = document.getElementById("winTitle");
const loseTitle = document.getElementById("loseTitle");
const locationImage = document.getElementById("locationImage");
const locationImageContainer = document.getElementById("locationImageContainer");


let audioContext;
let currentMusic = null;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log("Web Audio API not supported");
    }
}


function resumeAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playSwordSwing() {
    if (!audioContext) return;
    try {
        resumeAudio();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log("Error playing sword swing sound:", e);
    }
}

function playDaggerSwing() {
    if (!audioContext) return;
    try {
        resumeAudio();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.08);
    } catch (e) {
        console.log("Error playing dagger swing sound:", e);
    }
}

function playHammerSwing() {
    if (!audioContext) return;
    try {
        resumeAudio();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        console.log("Error playing hammer swing sound:", e);
    }
}

function playSwordHit() {
    if (!audioContext) return;
    try {
        resumeAudio();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log("Error playing sword hit sound:", e);
    }
}

function playDamageSound() {
    if (!audioContext) return;
    try {
        resumeAudio();
       
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'triangle';
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        oscillator2.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.3);
        oscillator2.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log("Error playing damage sound:", e);
    }
}

function playWeaponSound(weaponIndex) {
    switch(weaponIndex) {
        case 0: 
            playSwordSwing();
            break;
        case 1: 
            playDaggerSwing();
            break;
        case 2: 
            playHammerSwing();
            break;
        case 3: 
            playSwordSwing();
            break;
        default:
            playSwordSwing();
    }
}


function playWinMusic() {
    if (!audioContext) return;
    try {
        resumeAudio();
        stopMusic();
        
        const notes = [
            { freq: 523.25, time: 0 },   // C5
            { freq: 659.25, time: 0.2 }, // E5
            { freq: 783.99, time: 0.4 }, // G5
            { freq: 1046.50, time: 0.6 }, // C6
            { freq: 783.99, time: 0.8 }, // G5
            { freq: 1046.50, time: 1.0 }, // C6
            { freq: 1318.51, time: 1.2 }, // E6
            { freq: 1567.98, time: 1.4 }, // G6
        ];
        
        notes.forEach(note => {
            setTimeout(() => {
                try {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = note.freq;
                    
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                } catch (e) {
                    console.log("Error playing win music note:", e);
                }
            }, note.time * 1000);
        });
    } catch (e) {
        console.log("Error playing win music:", e);
    }
}

function playLoseMusic() {
    if (!audioContext) return;
    try {
        resumeAudio();
        stopMusic();
        
        const notes = [
            { freq: 220, time: 0 },      // A3
            { freq: 196, time: 0.3 },    // G3
            { freq: 174.61, time: 0.6 }, // F3
            { freq: 155.56, time: 0.9 }, // D#3
            { freq: 146.83, time: 1.2 }, // D3
        ];
        
        notes.forEach(note => {
            setTimeout(() => {
                try {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sawtooth';
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = note.freq;
                    
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.4);
                } catch (e) {
                    console.log("Error playing lose music note:", e);
                }
            }, note.time * 1000);
        });
    } catch (e) {
        console.log("Error playing lose music:", e);
    }
}

function stopMusic() {
    if (currentMusic) {
        currentMusic.stop();
        currentMusic = null;
    }
}

function updateStats() {
    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
}

initAudio();

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15,
        image: "🟢"
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60,
        image: "🐺"
    },
    {
        name: "dragon",
        level: 20,
        health: 300,
        image: "🐉"
    }
];

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const locations = [
    {
        name:"town square",
        "button text" : ["Go to store","Go to cave","Fight dragon"],
        "button functions" : [goStore,goCave,fightDragon],
        text: "You are in the town square. You see a sign that says 'Town'.",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
        imageClass: "town"
    },
    {
        name:"store",
        "button text":["Buy 10 health (10 gold)","Buy weapon (30 gold)","Go to town square"],
        "button functions":[buyHealth,buyWeapon,goTown],
        text:"You are in the store. You see a sign that says 'Store'.",
        image: "https://images.unsplash.com/photo-1708409858781-30df7a234f2d?w=800&h=600&fit=crop",
        imageClass: "store"
    },
    {
        name:"cave",
        "button text":["Fight slime","Fight fanged beast","Go to town square"],
        "button functions":[fightSlime,fightBeast,goTown],
        text:"You are in the cave. You see a sign that says 'Cave'.",
        image: "https://images.unsplash.com/photo-1517239320384-e08ad2c24a3e?w=800&h=600&fit=crop",
        imageClass: "cave"
    }
];

updateStats();

if (locationImage && locationImageContainer) {
    locationImage.src = locations[0].image;
    locationImageContainer.className = locations[0].imageClass || "";
    locationImageContainer.style.display = "flex";
}

button1.onclick = function() {
    resumeAudio();
    goStore();
}
button2.onclick = function() {
    resumeAudio();
    goCave();
}
button3.onclick = function() {
    resumeAudio();
    fightDragon();
}

function update(location){
    text.innerText = location.text;
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    if (combatArea) {
        combatArea.style.display = "none";
    }
   
    if (locationImage && locationImageContainer && location.image) {
        locationImage.src = location.image;
        locationImageContainer.className = location.imageClass || "";
        locationImageContainer.style.display = "flex";
    }
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() { 
    update(locations[2])
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        updateStats();
        text.innerText = "You bought 10 health for 10 gold.";
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            text.innerText = "You now have a " + weapons[currentWeapon].name + ".";
            inventory.push(weapons[currentWeapon].name);
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the best weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        currentWeapon--;
        inventory.pop();
        goldText.innerText = gold;
        text.innerText = "You sold a weapon for 15 gold.";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function goFight() {
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    combatArea.style.display = "block";
  
    if (locationImageContainer) {
        locationImageContainer.style.display = "none";
    }
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
    monsterImage.innerText = monsters[fighting].image;
    monsterNameDisplay.innerText = monsters[fighting].name;
    monsterImage.className = ""; 
    text.innerText = "You are fighting a " + monsters[fighting].name + ". What do you want to do?";
    button1.innerText = "Attack";
    button2.innerText = "Dodge";
    button3.innerText = "Run";
    button1.onclick = attack;
    button2.onclick = dodge;
    button3.onclick = goTown;
}

function attack() {
  
    resumeAudio();
    
   
    playWeaponSound(currentWeapon);
    
    
    player.classList.add("player-attack");
    setTimeout(() => {
        player.classList.remove("player-attack");
    }, 500);
    
    
    setTimeout(() => {
        monsterImage.classList.add("monster-hit");
        playSwordHit(); 
        setTimeout(() => {
            monsterImage.classList.remove("monster-hit");
        }, 500);
    }, 250);
    
 
    const avoidDamage = Math.random() < 0.3;
    
    if (avoidDamage) {
        text.innerText = "The " + monsters[fighting].name + " attacks, but you dodge it!";
        text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    } else {
        text.innerText = "The " + monsters[fighting].name + " attacks.";
        text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    }
    
   
    setTimeout(() => {
        
        if (!avoidDamage) {
            health -= monsters[fighting].level;
            
            player.classList.add("player-hit");
            playDamageSound(); 
            setTimeout(() => {
                player.classList.remove("player-hit");
            }, 500);
        }
        
        
        monsterHealth -= weapons[currentWeapon].power + (currentWeapon > 0 ? Math.floor(Math.random() * xp) + 1 : 0);
        updateStats();
        monsterHealthText.innerText = monsterHealth;
        
        if (health <= 0) {
            lose();
        } else if (monsterHealth <= 0) {
            defeatMonster();
        }
    }, 300);
}

function dodge() {
    resumeAudio();
    
    
    const dodgeSuccess = Math.random() < 0.6;
    
    
    monsterImage.classList.add("monster-attack");
    setTimeout(() => {
        monsterImage.classList.remove("monster-attack");
    }, 500);
    
    if (dodgeSuccess) {
      
        player.classList.add("player-dodge");
        setTimeout(() => {
            player.classList.remove("player-dodge");
        }, 500);
        text.innerText = "You successfully dodge the attack from the " + monsters[fighting].name + "!";
    } else {
        
        player.classList.add("player-hit");
        playDamageSound();
        setTimeout(() => {
            player.classList.remove("player-hit");
        }, 500);
        
        setTimeout(() => {
            health -= monsters[fighting].level;
            updateStats();
            text.innerText = "You tried to dodge but failed! The " + monsters[fighting].name + " hits you for " + monsters[fighting].level + " damage.";
            
            if (health <= 0) {
                lose();
            }
        }, 300);
    }
}

function defeatMonster() {
    
    resumeAudio();
    
   
    playWinMusic();
    
    monsterImage.classList.add("monster-defeated");
    player.classList.add("victory");
    
    const goldGained = Math.floor(monsters[fighting].level * 6.7);
    const xpGained = monsters[fighting].level;
    gold += goldGained;
    xp += xpGained;
    updateStats();
    
    
    winMessage.innerText = `You defeated the ${monsters[fighting].name}!\n\nYou gained:\n${goldGained} gold\n${xpGained} XP`;
    winOverlay.classList.add("win-overlay-show");
    winIcon.classList.add("win-icon-animate");
    winTitle.classList.add("win-title-animate");
    
    setTimeout(() => {
        monsterStats.style.display = "none";
        combatArea.style.display = "none";
        player.classList.remove("victory");
    }, 2000);
    
    setTimeout(() => {
        winOverlay.classList.remove("win-overlay-show");
        winIcon.classList.remove("win-icon-animate");
        winTitle.classList.remove("win-title-animate");
        text.innerText = "You defeated the " + monsters[fighting].name + "! You win " + goldGained + " gold and " + xpGained + " XP!";
        button1.innerText = "Go to town square";
        button1.onclick = goTown;
        button2.innerText = "Go to store";
        button2.onclick = goStore;
        button3.innerText = "Go to cave";
        button3.onclick = goCave;
    }, 3000);
}

function lose() {
    resumeAudio();
    
    playLoseMusic();
    
    playDamageSound();
    
    player.classList.add("player-death");
    monsterImage.classList.add("monster-victory");
    
    const goldLost = Math.min(50, gold);
    gold = Math.max(0, gold - 50);
    health = 50;
    updateStats();
    
    loseMessage.innerText = `You were defeated by the ${monsters[fighting].name}!\n\nYou lost ${goldLost} gold.\nYou wake up at the town square.`;
    loseOverlay.classList.add("lose-overlay-show");
    loseIcon.classList.add("lose-icon-animate");
    loseTitle.classList.add("lose-title-animate");
    
    setTimeout(() => {
        monsterStats.style.display = "none";
        combatArea.style.display = "none";
        player.classList.remove("player-death");
        monsterImage.classList.remove("monster-victory");
    }, 2000);
    
    setTimeout(() => {
        loseOverlay.classList.remove("lose-overlay-show");
        loseIcon.classList.remove("lose-icon-animate");
        loseTitle.classList.remove("lose-title-animate");
        update(locations[0]);
        text.innerText = "You die. ☠️ You wake up at the town square. You lost some gold!";
    }, 3000);
}

function fightDragon() {
    fighting = 2;
    goFight();
}
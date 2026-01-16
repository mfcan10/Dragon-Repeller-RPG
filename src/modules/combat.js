export class CombatSystem {
    constructor(state, audio, ui) {
        this.state = state;
        this.audio = audio;
        this.ui = ui;
    }

    async attack(monster, weapons) {
        this.audio.resume();
        this.audio.playSwordSwing(); // Or weapon specific sound

        this.ui.animatePlayerAttack();

        // Delay for impact
        await new Promise(r => setTimeout(r, 250));

        this.ui.animateMonsterHit();
        this.audio.playSwordHit();

        const avoidDamage = Math.random() < 0.3; // 30% chance for monster to miss? OR player to dodge? Legacy says: "monster attacks, but you dodge"

        let msg = "";
        if (avoidDamage) {
            msg = `The ${monster.name} attacks, but you dodge it!`;
        } else {
            msg = `The ${monster.name} attacks.`;
        }
        msg += ` You attack it with your ${weapons[this.state.currentWeapon].name}.`;

        this.ui.setMessage(msg);

        // Calculate damage
        await new Promise(r => setTimeout(r, 300));

        if (!avoidDamage) {
            this.state.health -= monster.level;
            this.ui.animatePlayerHit();
            this.audio.playDamage();
        }

        const weaponPower = weapons[this.state.currentWeapon].power;
        const damage = weaponPower + (this.state.currentWeapon > 0 ? Math.floor(Math.random() * this.state.xp) + 1 : 0);
        this.state.monsterHealth -= damage;

        return {
            playerHealth: this.state.health,
            monsterHealth: this.state.monsterHealth,
            avoidDamage
        };
    }

    async dodge(monster) {
        this.audio.resume();
        const success = Math.random() < 0.6;

        this.ui.animateMonsterAttack();

        if (success) {
            this.ui.animatePlayerDodge();
            this.ui.setMessage(`You successfully dodge the attack from the ${monster.name}!`);
        } else {
            this.ui.animatePlayerHit();
            this.audio.playDamage();
            this.state.health -= monster.level;
            this.ui.setMessage(`You tried to dodge but failed! The ${monster.name} hits you for ${monster.level} damage.`);
        }

        return {
            success,
            playerHealth: this.state.health
        };
    }
}

export class GameState {
    constructor() {
        this.xp = 0;
        this.health = 100;
        this.gold = 50;
        this.currentWeapon = 0;
        this.inventory = ["stick"];
        this.fighting = null;
        this.monsterHealth = 0;
    }

    reset() {
        this.xp = 0;
        this.health = 100;
        this.gold = 50;
        this.currentWeapon = 0;
        this.inventory = ["stick"];
        this.fighting = null;
        this.monsterHealth = 0;
    }

    load(data) {
        Object.assign(this, data);
    }

    serialize() {
        return {
            xp: this.xp,
            gold: this.gold,
            health: this.health,
            currentWeapon: this.currentWeapon,
            inventory: this.inventory
        };
    }
}

export const state = new GameState();

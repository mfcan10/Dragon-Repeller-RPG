import { InputHandler } from './input.js';
import { TileMap } from './tilemap.js';
import { Player } from './player.js';

export class GameEngine {
    constructor(canvasId, onZoneChange) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.onZoneChange = onZoneChange;

        this.tileSize = 40;
        this.input = new InputHandler();
        this.map = new TileMap(this.tileSize); // empty initially
        this.player = new Player(0, 0, this.tileSize, this.map, this.input);

        this.isRunning = false;
        this.lastZone = null;
    }

    loadMap(mapConfig, startX, startY) {
        this.map.load(mapConfig);

        // Resize canvas
        this.canvas.width = mapConfig.width * this.tileSize;
        this.canvas.height = mapConfig.height * this.tileSize;

        // Reset player pos (Override or Default)
        if (startX !== undefined && startY !== undefined) {
            this.player.x = startX * this.tileSize;
            this.player.y = startY * this.tileSize;
        } else {
            this.player.x = mapConfig.startPos.x * this.tileSize;
            this.player.y = mapConfig.startPos.y * this.tileSize;
        }

        this.lastZone = null; // Clear zone memory on new map load
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.loop());
    }

    update() {
        const moving = this.player.update();

        if (moving) {
            const currentZone = this.player.checkZone();

            if (currentZone && currentZone !== this.lastZone) {
                this.onZoneChange(currentZone);
                this.lastZone = currentZone;
            } else if (!currentZone) {
                this.lastZone = null;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.draw(this.ctx);
        this.player.draw(this.ctx);
    }
}

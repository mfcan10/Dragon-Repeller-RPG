export class Player {
    constructor(x, y, tileSize, map, input) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.map = map;
        this.input = input;

        this.speed = 4;
        this.size = tileSize; // Full tile size for sprite

        this.sprite = new Image();
        this.sprite.src = 'assets/sprites/hero.png';

        // Simple animation state
        this.frame = 0;
        this.frameCount = 0;
        this.direction = 0; // 0: Down, 1: Up, 2: Right, 3: Left? For now single sprite.
    }

    update() {
        const dir = this.input.direction;
        let moved = false;

        if (dir.x !== 0 || dir.y !== 0) {
            const nextX = this.x + dir.x * this.speed;
            const nextY = this.y + dir.y * this.speed;

            // Collision Check
            const gridX = Math.floor((nextX + this.tileSize / 2) / this.tileSize);
            const gridY = Math.floor((nextY + this.tileSize / 2) / this.tileSize); // Center point

            // X Movement
            const testX = this.x + dir.x * this.speed;
            const leftGrid = Math.floor((testX + 4) / this.tileSize); // Padding
            const rightGrid = Math.floor((testX + this.tileSize - 4) / this.tileSize);
            const topGrid = Math.floor((this.y + 10) / this.tileSize);
            const bottomGrid = Math.floor((this.y + this.tileSize - 2) / this.tileSize);

            if (!this.map.isSolid(leftGrid, topGrid) &&
                !this.map.isSolid(rightGrid, topGrid) &&
                !this.map.isSolid(leftGrid, bottomGrid) &&
                !this.map.isSolid(rightGrid, bottomGrid)) {
                this.x += dir.x * this.speed;
                moved = true;
            }

            // Y Movement
            const testY = this.y + dir.y * this.speed;
            const leftGridY = Math.floor((this.x + 4) / this.tileSize);
            const rightGridY = Math.floor((this.x + this.tileSize - 4) / this.tileSize);
            const topGridY = Math.floor((testY + 10) / this.tileSize);
            const bottomGridY = Math.floor((testY + this.tileSize - 2) / this.tileSize);

            if (!this.map.isSolid(leftGridY, topGridY) &&
                !this.map.isSolid(rightGridY, topGridY) &&
                !this.map.isSolid(leftGridY, bottomGridY) &&
                !this.map.isSolid(rightGridY, bottomGridY)) {
                this.y += dir.y * this.speed;
                moved = true;
            }
        }
        return moved;
    }

    draw(ctx) {
        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(this.x + this.tileSize / 2, this.y + this.tileSize - 5, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sprite
        if (this.sprite.complete && this.sprite.naturalHeight !== 0) {
            ctx.drawImage(this.sprite, this.x, this.y, this.tileSize, this.tileSize);
        } else {
            // Fallback
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.arc(this.x + this.tileSize / 2, this.y + this.tileSize / 2, this.tileSize / 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    checkZone() {
        // Check center point
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;
        const gridX = Math.floor(centerX / this.tileSize);
        const gridY = Math.floor(centerY / this.tileSize);

        return this.map.getZone(gridX, gridY);
    }
}

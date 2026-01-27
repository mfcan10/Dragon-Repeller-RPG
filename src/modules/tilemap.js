export class TileMap {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.mapData = null;

        this.tileset = new Image();
        this.tileset.src = 'assets/sprites/tileset.png';
        this.isLoaded = false;

        this.tileset.onload = () => {
            this.isLoaded = true;
        };

        this.slimeSprite = new Image();
        this.slimeSprite.src = 'assets/sprites/slime.png';

        this.beastSprite = new Image();
        this.beastSprite.src = 'assets/sprites/beast.png';

        this.dragonSprite = new Image();
        this.dragonSprite.src = 'assets/sprites/dragon.png';

        this.decorSprites = new Image();
        this.decorSprites.src = 'assets/sprites/cave_animals.png';

        // Map ID -> Spritesheet Coordinate [x, y]
        this.tileAtlas = {
            0: [0, 0], // Grass
            1: [1, 0], // Wall
            2: [2, 0], // Wood Floor
            3: [3, 0], // Cave Entrance
            4: [3, 0], // Cave Exit
            8: [3, 0], // Cave Floor (Standard)

            // For Zones
            5: [3, 0],
            6: [3, 0],
            7: [3, 0],

            // Decor IDs (Overlay on Floor)
            9: [3, 0], // Bat
            10: [3, 0], // Spider
            11: [3, 0], // Rat
            12: [3, 0]  // Skull
        };
    }

    load(mapConfig) {
        this.mapData = mapConfig;
    }

    draw(ctx) {
        if (!this.mapData || !this.isLoaded) return;

        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const tile = this.mapData.data[y][x];
                const coords = this.tileAtlas[tile] || [0, 0];

                // Draw Base Tile
                ctx.drawImage(
                    this.tileset,
                    coords[0] * 32, coords[1] * 32, 32, 32,
                    x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
                );

                // Overlay Monsters for Zones
                if (tile === 5) this.drawMonster(ctx, x, y, 0);
                else if (tile === 6) this.drawMonster(ctx, x, y, 1);
                else if (tile === 7) this.drawMonster(ctx, x, y, 2);

                // Overlay Decor
                else if (tile === 9) this.drawDecor(ctx, x, y, 0); // Bat
                else if (tile === 10) this.drawDecor(ctx, x, y, 1); // Spider
                else if (tile === 11) this.drawDecor(ctx, x, y, 2); // Rat
                else if (tile === 12) this.drawDecor(ctx, x, y, 3); // Skull
            }
        }

        // Draw Labels
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Inter";
        ctx.textAlign = "center";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;

        if (this.mapData.labels) {
            this.mapData.labels.forEach(label => {
                ctx.fillText(label.text, label.x * this.tileSize + this.tileSize / 2, label.y * this.tileSize + this.tileSize / 2);
            });
        }
        ctx.shadowBlur = 0;
    }

    isSolid(x, y) {
        if (!this.mapData) return true;
        if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) return true;
        const tile = this.mapData.data[y][x];
        return tile === 1; // 1 is Wall
    }

    drawMonster(ctx, x, y, type) {
        // type 0: Slime, 1: Beast, 2: Dragon
        let img = this.slimeSprite;
        if (type === 1) img = this.beastSprite;
        if (type === 2) img = this.dragonSprite;

        // Determine quadrant based on Map Coordinates
        // Slime: (1,1) is Top-Left. So if x is odd, y is odd -> TL.
        // Beast: (12,1) is Top-Left. x even, y odd -> TL.
        // Dragon: (12,7) is Top-Left. x even, y odd -> TL.
        // WARNING: This depends greatly on fixed map positions. 
        // A more dynamic way: Check neighbors? Or just hardcode logic based on known map.

        // Let's use relative offset logic from known starts.
        // Slime Start: (1, 1). Offset = (x-1, y-1). 
        // Beast Start: (12, 1). Offset = (x-12, y-1).
        // Dragon Start: (12, 7). Offset = (x-12, y-7). // Wait, rows 7,8?
        // Let's check Dragon coordinates again. It was rows 7, 8 (index 7,8).

        let srcX = 0;
        let srcY = 0;

        if (type === 0) { // Slime (Starts at 1, 1)
            srcX = (x - 1) * 32;
            srcY = (y - 1) * 32;
        } else if (type === 1) { // Beast (Starts at 12, 1)
            srcX = (x - 12) * 32;
            srcY = (y - 1) * 32;
        } else if (type === 2) { // Dragon (Starts at 12, 7)
            srcX = (x - 12) * 32;
            srcY = (y - 7) * 32; // Row index 7 is the first row of dragon
        }

        // Clamp to 0-32 range for safety if map changes
        srcX = Math.max(0, Math.min(32, srcX));
        srcY = Math.max(0, Math.min(32, srcY));

        ctx.drawImage(
            img,
            srcX, srcY, 32, 32, // Source Quadrant
            x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
        );
    }


    drawDecor(ctx, x, y, spriteIndex) {
        // 64x64 image, 2x2 grid of 32x32 sprites
        const srcX = (spriteIndex % 2) * 32;
        const srcY = Math.floor(spriteIndex / 2) * 32;

        ctx.drawImage(
            this.decorSprites,
            srcX, srcY, 32, 32,
            x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
        );
    }




    getZone(x, y) {
        if (!this.mapData) return null;
        if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) return null;

        const tile = this.mapData.data[y][x];
        return this.mapData.zones[tile] || null;
    }
}

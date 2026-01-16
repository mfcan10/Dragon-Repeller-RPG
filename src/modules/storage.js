const KEY_STRING = "DRAGON_REPELLER_2024_SECURE_KEY";

export const storage = {
    async save(data) {
        try {
            const jsonData = JSON.stringify(data);
            const encrypted = await encryptData(jsonData);
            localStorage.setItem("dr_game_data", encrypted);
            return true;
        } catch (e) {
            console.error("Failed to save game:", e);
            return false;
        }
    },

    async load() {
        try {
            const encrypted = localStorage.getItem("dr_game_data");
            if (!encrypted) return null;

            const jsonData = await decryptData(encrypted);
            if (!jsonData) return null;

            return JSON.parse(jsonData);
        } catch (e) {
            console.error("Failed to load game:", e);
            return null;
        }
    },

    reset() {
        localStorage.removeItem("dr_game_data");
    }
};

async function encryptData(data) {
    try {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(KEY_STRING),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            dataBuffer
        );

        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        return btoa(String.fromCharCode(...combined));
    } catch (e) {
        return fallbackEncrypt(data);
    }
}

async function decryptData(encryptedData) {
    try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const encrypted = combined.slice(28);

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(KEY_STRING),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encrypted
        );

        return decoder.decode(decrypted);
    } catch (e) {
        return fallbackDecrypt(encryptedData);
    }
}

function fallbackEncrypt(data) {
    const key = KEY_STRING + "_X";
    const salt = Math.random().toString(36).substring(2, 15);
    let encrypted = "";

    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const saltChar = salt.charCodeAt(i % salt.length);
        const encryptedChar = charCode ^ keyChar ^ saltChar;
        encrypted += String.fromCharCode(encryptedChar);
    }

    return btoa(salt + ":" + encrypted);
}

function fallbackDecrypt(encryptedData) {
    try {
        const key = KEY_STRING + "_X";
        const decoded = atob(encryptedData);
        const parts = decoded.split(":");
        if (parts.length !== 2) return null;

        const salt = parts[0];
        const encrypted = parts[1];
        let decrypted = "";

        for (let i = 0; i < encrypted.length; i++) {
            const encryptedChar = encrypted.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const saltChar = salt.charCodeAt(i % salt.length);
            const decryptedChar = encryptedChar ^ keyChar ^ saltChar;
            decrypted += String.fromCharCode(decryptedChar);
        }

        return decrypted;
    } catch (e) {
        return null;
    }
}

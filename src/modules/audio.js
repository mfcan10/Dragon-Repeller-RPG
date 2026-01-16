export class AudioController {
    constructor() {
        this.ctx = null;
        this.currentMusic = null;
        this.init();
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    createOscillator(type, freq, startTime, duration) {
        if (!this.ctx) return null;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        return { osc, gain };
    }

    playTone({ freq, type = 'sine', duration = 0.1, vol = 0.1, slideTo = null }) {
        if (!this.ctx) return;
        this.resume();
        
        const t = this.ctx.currentTime;
        const { osc, gain } = this.createOscillator(type, freq, t);
        
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
        }

        osc.start(t);
        osc.stop(t + duration);
    }

    playSwordSwing() {
        this.playTone({ freq: 200, slideTo: 100, duration: 0.1, vol: 0.3 });
    }

    playDaggerSwing() {
        this.playTone({ freq: 300, slideTo: 150, duration: 0.08, vol: 0.25 });
    }

    playHammerSwing() {
        this.playTone({ freq: 150, slideTo: 80, duration: 0.15, vol: 0.4 });
    }

    playSwordHit() {
        this.playTone({ freq: 400, type: 'square', slideTo: 200, duration: 0.2, vol: 0.3 });
    }

    playDamage() {
        if (!this.ctx) return;
        this.resume();
        const t = this.ctx.currentTime;
        
        // Osc 1
        const o1 = this.createOscillator('sawtooth', 150, t);
        o1.gain.gain.setValueAtTime(0.4, t);
        o1.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        o1.osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
        o1.osc.start(t);
        o1.osc.stop(t + 0.3);

        // Osc 2
        const o2 = this.createOscillator('triangle', 200, t);
        o2.gain.gain.setValueAtTime(0.4, t);
        o2.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        o2.osc.frequency.exponentialRampToValueAtTime(120, t + 0.3);
        o2.osc.start(t);
        o2.osc.stop(t + 0.3);
    }

    playWinMusic() {
        if (!this.ctx) return;
        this.stopMusic();
        
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

        this.playSequence(notes);
    }

    playLoseMusic() {
        if (!this.ctx) return;
        this.stopMusic();

        const notes = [
            { freq: 220, time: 0, type: 'sawtooth' },      // A3
            { freq: 196, time: 0.3, type: 'sawtooth' },    // G3
            { freq: 174.61, time: 0.6, type: 'sawtooth' }, // F3
            { freq: 155.56, time: 0.9, type: 'sawtooth' }, // D#3
            { freq: 146.83, time: 1.2, type: 'sawtooth' }, // D3
        ];

        this.playSequence(notes);
    }

    playSequence(notes) {
        notes.forEach(note => {
            setTimeout(() => {
                this.playTone({ 
                    freq: note.freq, 
                    type: note.type || 'sine', 
                    duration: 0.3, 
                    vol: 0.2 
                });
            }, note.time * 1000);
        });
    }

    stopMusic() {
        // Simple implementation since we are scheduling oneshots mostly
        if (this.currentMusic) {
            // Logic if we had looping BGM
        }
    }
}

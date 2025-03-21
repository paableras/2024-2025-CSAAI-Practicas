/* crono.js */
// Clase Crono para el cronómetro
class Crono {
    constructor(display) {
        this.display = display;
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.timer = 0;
    }

    tic() {
        this.cent++;
        if (this.cent === 100) {
            this.seg++;
            this.cent = 0;
        }
        if (this.seg === 60) {
            this.min++;
            this.seg = 0;
        }
        this.display.textContent = `Tiempo: ${String(this.min).padStart(2, '0')}:${String(this.seg).padStart(2, '0')}:${String(this.cent).padStart(2, '0')}`;
    }

    start() {
        if (!this.timer) {
            this.timer = setInterval(() => this.tic(), 10);
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = 0;
        }
    }

    reset() {
        this.stop();
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.display.textContent = "Tiempo: 00:00:00";
    }
}

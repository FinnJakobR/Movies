
export const ANIMATION_TYPE = Object.freeze({
    LINEAR: 0,
    EASE_IN: 1,
    EASE_OUT: 2, 
    EASE_IN_OUT: 3
});


const ANIMATION_TYPE_MAPPING = {
    0: t => t, //linear
    1: t => t * t, // ease-in
    2: t => 1 - Math.pow(1 - t, 2), // ease-out
    3: t =>
        t < 0.5
            ? 2 * t * t
            : 1 - 2 * Math.pow(1 - t, 2) // ease-in-out
};


export default class CustomAnimation {
    constructor(type, startValue, durationMs) {
        this.type = type;
        this.durationMs = durationMs;
        this.ended = true;
        this.currentPos = startValue;
        this.easing = ANIMATION_TYPE_MAPPING[type];

        if (!this.easing) {
            throw new Error(`Unknown animation type: ${type}`);
        }

        this.startValue = startValue;
        this.endValue = startValue;
        this.startTime = null;
    }

    animateTo(callback, targetValue) {
        return new Promise((resolve) => {
            this.startValue = this.currentPos;
            this.endValue = targetValue;
            this.startTime = null;
            this.ended = false;

            const loop = (timestamp) => {
                if (this.startTime === null) {
                    this.startTime = timestamp;
                }

                const elapsed = timestamp - this.startTime;
                const t = Math.min(elapsed / this.durationMs, 1);

                const easedT = this.easing(t);

                const value =
                    this.startValue +
                    easedT * (this.endValue - this.startValue);

                this.currentPos = value;
                callback(value);

                if (t < 1) {
                    requestAnimationFrame(loop);
                } else {
                    this.ended = true;
                    resolve(value); // optional: Endwert mitgeben
                }
            };

            requestAnimationFrame(loop);
        });
    }
}

type MaskConfig = {
    mask: string;
    placeholderChar?: string;
    onComplete?: (value: string) => void;
};

class SimpleInputMask {
    private mask: string;
    private placeholderChar: string;
    private inputElement: HTMLInputElement | null = null;
    private onCompleteCallback?: (value: string) => void;

    constructor(config: MaskConfig) {
        this.mask = config.mask;
        this.placeholderChar = config.placeholderChar || "_";
        this.onCompleteCallback = config.onComplete;
    }

    private applyMask(value: string): string {
        const chars = value.replace(/\D/g, "").split("");
        let maskedValue = "";

        for (const char of this.mask) {
            if (chars.length === 0) break;
            if (char === this.placeholderChar) {
                maskedValue += chars.shift();
            } else {
                maskedValue += char;
            }
        }

        return maskedValue;
    }

    private isComplete(value: string): boolean {
        return !value.includes(this.placeholderChar);
    }

    attach(input: HTMLInputElement) {
        this.inputElement = input;

        const onInput = () => {
            if (!this.inputElement) return;
            const rawValue = this.inputElement.value;
            const maskedValue = this.applyMask(rawValue);
            this.inputElement.value = maskedValue;

            if (this.isComplete(maskedValue) && this.onCompleteCallback) {
                this.onCompleteCallback(maskedValue);
            }
        };

        this.inputElement.addEventListener("input", onInput);
        (this.inputElement as any)._onInputMask = onInput;
    }

    detach() {
        if (this.inputElement) {
            const onInput = (this.inputElement as any)._onInputMask;
            if (onInput) {
                this.inputElement.removeEventListener("input", onInput);
                delete (this.inputElement as any)._onInputMask;
            }
            this.inputElement = null;
        }
    }
}

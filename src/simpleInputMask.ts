type MaskConfig = {
    mask: string;
    onComplete?: (value: string) => void;
};

class SimpleInputMask {
    private mask: string;
    private inputElement: HTMLInputElement | null = null;
    private onCompleteCallback?: (value: string) => void;

    constructor(config: MaskConfig) {
        this.mask = config.mask;
        this.onCompleteCallback = config.onComplete;
    }

    private applyMask(value: string): string {
        let maskedValue = "";
        let valueIndex = 0;

        for (let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            const currentValueChar = value[valueIndex];

            if (!currentValueChar) break;

            if (maskChar === "9") {
                if (/\d/.test(currentValueChar)) {
                    maskedValue += currentValueChar;
                    valueIndex++;
                } else {
                    valueIndex++;
                    i--;
                }
            } else if (maskChar === "A") {
                if (/[a-zA-Z]/.test(currentValueChar)) {
                    maskedValue += currentValueChar;
                    valueIndex++;
                } else {
                    valueIndex++;
                    i--;
                }
            } else if (maskChar === "*") {
                if (/[a-zA-Z0-9]/.test(currentValueChar)) {
                    maskedValue += currentValueChar;
                    valueIndex++;
                } else {
                    valueIndex++;
                    i--;
                }
            } else {
                maskedValue += maskChar;
                if (currentValueChar === maskChar) {
                    valueIndex++;
                }
            }
        }

        return maskedValue;
    }

    private isComplete(value: string): boolean {
        return this.applyMask(value).length === this.mask.length;
    }

    attach(input: HTMLInputElement) {
        this.inputElement = input;

        const onInput = () => {
            if (!this.inputElement) return;
            const rawValue = this.inputElement.value;
            const maskedValue = this.applyMask(rawValue);
            this.inputElement.value = maskedValue;

            if (this.isComplete(rawValue) && this.onCompleteCallback) {
                this.onCompleteCallback(maskedValue);
            }
        };

        this.inputElement.addEventListener("input", onInput);
        this.inputElement.addEventListener("paste", onInput);
        (this.inputElement as any)._onInputMask = onInput;
    }

    detach() {
        if (this.inputElement) {
            const onInput = (this.inputElement as any)._onInputMask;
            if (onInput) {
                this.inputElement.removeEventListener("input", onInput);
                this.inputElement.removeEventListener("paste", onInput);
                delete (this.inputElement as any)._onInputMask;
            }
            this.inputElement = null;
        }
    }
}

export default SimpleInputMask;

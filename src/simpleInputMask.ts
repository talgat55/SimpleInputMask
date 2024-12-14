import {TMaskConfig} from "./types";

class SimpleInputMask {
    private mask: string;
    private inputElement: HTMLInputElement | null = null;
    private onCompleteCallback?: (value: string) => void;

    constructor(config: TMaskConfig) {
        this.mask = config.mask;
        this.onCompleteCallback = config.onComplete;
    }

    private applyMask(value: string): string {
        let maskedValue = "";
        let valueIndex = 0;

        for (let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            const currentValueChar = value[valueIndex];

            if (!currentValueChar) {
                if (maskChar === "9" || maskChar === "A" || maskChar === "*") {
                    maskedValue += "_";
                } else {
                    maskedValue += maskChar;
                }
                continue;
            }

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
        return this.applyMask(value).indexOf("_") === -1;
    }

    attach(input: HTMLInputElement) {
        this.inputElement = input;
        this.inputElement.placeholder = this.applyMask("");

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

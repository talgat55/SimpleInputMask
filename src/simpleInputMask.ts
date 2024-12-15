import { TMaskConfig } from "./types";

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

            if (maskChar === "9" && /\d/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            } else if (maskChar === "A" && /[a-zA-Z]/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            } else if (maskChar === "*" && /[a-zA-Z0-9]/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            } else if (maskChar !== "9" && maskChar !== "A" && maskChar !== "*") {
                maskedValue += maskChar;
                if (currentValueChar === maskChar) {
                    valueIndex++;
                }
            } else {
                valueIndex++;
                i--;
            }
        }

        return maskedValue;
    }

    private isComplete(value: string): boolean {
        return this.applyMask(value).indexOf("_") === -1;
    }

    private setCursorPosition(input: HTMLInputElement, position: number) {
        requestAnimationFrame(() => {
            input.setSelectionRange(position, position);
        });
    }


    private findNextEditablePosition(value: string, position: number): number {
        for (let i = position; i < value.length; i++) {
            if (value[i] === "_") return i;
        }
        return value.length;
    }

    attach(input: HTMLInputElement) {
        this.inputElement = input;
        this.inputElement.placeholder = this.applyMask("");

        const onInput = () => {
            if (!this.inputElement) return;

            const rawValue = this.inputElement.value;
            const cursorPosition = this.inputElement.selectionStart || 0;

            const maskedValue = this.applyMask(rawValue);

            const nextCursorPosition = this.findNextEditablePosition(maskedValue, cursorPosition);

            this.inputElement.value = maskedValue;
            this.setCursorPosition(this.inputElement, nextCursorPosition);

            if (this.isComplete(maskedValue) && this.onCompleteCallback) {
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

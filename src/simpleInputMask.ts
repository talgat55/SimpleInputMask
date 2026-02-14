import { TMaskConfig } from "./types";

class SimpleInputMask {
    private mask: string;
    private placeholderChar: string;
    private inputElement: HTMLInputElement | null = null;
    private onCompleteCallback?: (value: string) => void;
    private onChangeCallback?: (maskedValue: string, unmaskedValue: string) => void;

    constructor(config: TMaskConfig) {
        this.mask = config.mask;
        this.placeholderChar = config.placeholderChar ?? "_";
        this.onCompleteCallback = config.onComplete;
        this.onChangeCallback = config.onChange;
    }

    private applyMask(value: string): string {
        let maskedValue = "";
        let valueIndex = 0;

        for (let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            const currentValueChar = value[valueIndex];

            if (!currentValueChar) {
                if (maskChar === "9" || maskChar === "A" || maskChar === "*") {
                    maskedValue += this.placeholderChar;
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
        return this.applyMask(value).indexOf(this.placeholderChar) === -1;
    }

    private setCursorPosition(input: HTMLInputElement, position: number) {
        requestAnimationFrame(() => {
            input.setSelectionRange(position, position);
        });
    }


    private findNextEditablePosition(value: string, position: number): number {
        for (let i = position; i < value.length; i++) {
            if (value[i] === this.placeholderChar) return i;
        }
        return value.length;
    }

    attach(input: HTMLInputElement) {
        this.inputElement = input;
        this.inputElement.placeholder = this.applyMask("");

        if (this.inputElement.value) {
            const masked = this.applyMask(this.inputElement.value);
            this.inputElement.value = masked;
            const pos = this.findNextEditablePosition(masked, masked.length);
            this.setCursorPosition(this.inputElement, pos);
        }

        const onInput = () => {
            if (!this.inputElement) return;

            const rawValue = this.inputElement.value;
            const cursorPosition = this.inputElement.selectionStart || 0;

            const maskedValue = this.applyMask(rawValue);

            const nextCursorPosition = this.findNextEditablePosition(maskedValue, cursorPosition);

            this.inputElement.value = maskedValue;
            this.setCursorPosition(this.inputElement, nextCursorPosition);

            if (this.onChangeCallback) {
                this.onChangeCallback(maskedValue, this.getUnmaskedValue(maskedValue));
            }
            if (this.isComplete(maskedValue) && this.onCompleteCallback) {
                this.onCompleteCallback(maskedValue);
            }
        };

        this.inputElement.addEventListener("input", onInput);
        this.inputElement.addEventListener("paste", onInput);
        (this.inputElement as any)._onInputMask = onInput;
    }

    getUnmaskedValue(value?: string): string {
        const str = value ?? this.inputElement?.value ?? "";
        let result = "";
        let valueIndex = 0;
        for (let i = 0; i < this.mask.length && valueIndex < str.length; i++) {
            const maskChar = this.mask[i];
            const valueChar = str[valueIndex];
            valueIndex++;
            if (maskChar === "9" || maskChar === "A" || maskChar === "*") {
                if (valueChar !== this.placeholderChar) {
                    result += valueChar;
                }
            }
        }
        return result;
    }

    updateMask(newMask: string) {
        this.mask = newMask;
        if (this.inputElement) {
            this.inputElement.value = this.applyMask(this.inputElement.value);
        }
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

    destroy() {
        this.detach();
    }
}

export default SimpleInputMask;

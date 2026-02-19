import { TMaskConfig } from "./types";

class SimpleInputMask {
    private mask: string;
    private placeholderChar: string;
    private showMaskOnFocus: boolean;
    private inputElement: HTMLInputElement | null = null;
    private onCompleteCallback?: (value: string) => void;
    private onChangeCallback?: (maskedValue: string, unmaskedValue: string) => void;
    private onIncompleteCallback?: (maskedValue: string, unmaskedValue: string) => void;
    private wasComplete: boolean = false;
    private originalPlaceholder: string = "";

    constructor(config: TMaskConfig) {
        this.mask = config.mask;
        this.placeholderChar = config.placeholderChar ?? "_";
        this.showMaskOnFocus = config.showMaskOnFocus ?? false;
        this.onCompleteCallback = config.onComplete;
        this.onChangeCallback = config.onChange;
        this.onIncompleteCallback = config.onIncomplete;
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

    private checkComplete(value: string): boolean {
        return this.applyMask(value).indexOf(this.placeholderChar) === -1;
    }

    isComplete(): boolean {
        if (!this.inputElement) return false;
        return this.checkComplete(this.inputElement.value);
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
        this.originalPlaceholder = input.placeholder || "";
        
        if (this.showMaskOnFocus) {
            this.inputElement.placeholder = this.originalPlaceholder;
        } else {
            this.inputElement.placeholder = this.applyMask("");
        }

        if (this.inputElement.value) {
            const masked = this.applyMask(this.inputElement.value);
            this.inputElement.value = masked;
            const pos = this.findNextEditablePosition(masked, masked.length);
            this.setCursorPosition(this.inputElement, pos);
            this.wasComplete = this.checkComplete(masked);
        }

        const onInput = () => {
            if (!this.inputElement) return;

            const rawValue = this.inputElement.value;
            const cursorPosition = this.inputElement.selectionStart || 0;

            const maskedValue = this.applyMask(rawValue);
            const isComplete = this.checkComplete(maskedValue);

            const nextCursorPosition = this.findNextEditablePosition(maskedValue, cursorPosition);

            this.inputElement.value = maskedValue;
            this.setCursorPosition(this.inputElement, nextCursorPosition);

            const unmaskedValue = this.getUnmaskedValue(maskedValue);

            if (this.onChangeCallback) {
                this.onChangeCallback(maskedValue, unmaskedValue);
            }

            if (isComplete) {
                if (!this.wasComplete && this.onCompleteCallback) {
                    this.onCompleteCallback(maskedValue);
                }
                this.wasComplete = true;
            } else {
                if (this.wasComplete && this.onIncompleteCallback) {
                    this.onIncompleteCallback(maskedValue, unmaskedValue);
                }
                this.wasComplete = false;
            }
        };

        const onFocus = () => {
            if (!this.inputElement) return;
            if (this.showMaskOnFocus && !this.inputElement.value) {
                this.inputElement.placeholder = this.applyMask("");
            }
        };

        const onBlur = () => {
            if (!this.inputElement) return;
            if (this.showMaskOnFocus && !this.inputElement.value) {
                this.inputElement.placeholder = this.originalPlaceholder;
            }
        };

        this.inputElement.addEventListener("input", onInput);
        this.inputElement.addEventListener("paste", onInput);
        this.inputElement.addEventListener("focus", onFocus);
        this.inputElement.addEventListener("blur", onBlur);
        (this.inputElement as any)._onInputMask = onInput;
        (this.inputElement as any)._onFocusMask = onFocus;
        (this.inputElement as any)._onBlurMask = onBlur;
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

    getMaskedValue(): string {
        return this.inputElement?.value ?? "";
    }

    getCursorPosition(): number {
        return this.inputElement?.selectionStart ?? 0;
    }

    getState() {
        const maskedValue = this.getMaskedValue();
        return {
            maskedValue,
            unmaskedValue: this.getUnmaskedValue(maskedValue),
            isComplete: this.isComplete(),
            cursorPosition: this.getCursorPosition()
        };
    }

    setValue(value: string) {
        if (!this.inputElement) return;
        const maskedValue = this.applyMask(value);
        this.inputElement.value = maskedValue;
        const nextCursorPosition = this.findNextEditablePosition(maskedValue, 0);
        this.setCursorPosition(this.inputElement, nextCursorPosition);
        if (this.onChangeCallback) {
            this.onChangeCallback(maskedValue, this.getUnmaskedValue(maskedValue));
        }
        if (this.checkComplete(maskedValue) && this.onCompleteCallback) {
            this.onCompleteCallback(maskedValue);
        }
    }

    clear() {
        if (!this.inputElement) return;
        this.inputElement.value = "";
        this.setCursorPosition(this.inputElement, 0);
        if (this.onChangeCallback) {
            this.onChangeCallback("", "");
        }
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
            const onFocus = (this.inputElement as any)._onFocusMask;
            const onBlur = (this.inputElement as any)._onBlurMask;
            if (onInput) {
                this.inputElement.removeEventListener("input", onInput);
                this.inputElement.removeEventListener("paste", onInput);
                delete (this.inputElement as any)._onInputMask;
            }
            if (onFocus) {
                this.inputElement.removeEventListener("focus", onFocus);
                delete (this.inputElement as any)._onFocusMask;
            }
            if (onBlur) {
                this.inputElement.removeEventListener("blur", onBlur);
                delete (this.inputElement as any)._onBlurMask;
            }
            this.inputElement.placeholder = this.originalPlaceholder;
            this.inputElement = null;
        }
    }

    destroy() {
        this.detach();
    }
}

export default SimpleInputMask;

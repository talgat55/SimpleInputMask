import { TMaskConfig } from "./types";
declare class SimpleInputMask {
    private mask;
    private placeholderChar;
    private showMaskOnFocus;
    private inputElement;
    private onCompleteCallback?;
    private onChangeCallback?;
    private onIncompleteCallback?;
    private wasComplete;
    private originalPlaceholder;
    constructor(config: TMaskConfig);
    private applyMask;
    private checkComplete;
    isComplete(): boolean;
    private setCursorPosition;
    private findNextEditablePosition;
    attach(input: HTMLInputElement): void;
    getUnmaskedValue(value?: string): string;
    getMaskedValue(): string;
    getCursorPosition(): number;
    getState(): {
        maskedValue: string;
        unmaskedValue: string;
        isComplete: boolean;
        cursorPosition: number;
    };
    setValue(value: string): void;
    clear(): void;
    updateMask(newMask: string): void;
    detach(): void;
    destroy(): void;
}
export default SimpleInputMask;

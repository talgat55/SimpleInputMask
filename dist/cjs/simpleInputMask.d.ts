import { TMaskConfig } from "./types";
declare class SimpleInputMask {
    private mask;
    private placeholderChar;
    private inputElement;
    private onCompleteCallback?;
    private onChangeCallback?;
    constructor(config: TMaskConfig);
    private applyMask;
    private checkComplete;
    isComplete(): boolean;
    private setCursorPosition;
    private findNextEditablePosition;
    attach(input: HTMLInputElement): void;
    getUnmaskedValue(value?: string): string;
    setValue(value: string): void;
    clear(): void;
    updateMask(newMask: string): void;
    detach(): void;
    destroy(): void;
}
export default SimpleInputMask;

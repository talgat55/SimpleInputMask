type MaskConfig = {
    mask: string;
    onComplete?: (value: string) => void;
};
declare class SimpleInputMask {
    private mask;
    private inputElement;
    private onCompleteCallback?;
    constructor(config: MaskConfig);
    private applyMask;
    private isComplete;
    attach(input: HTMLInputElement): void;
    detach(): void;
}
export default SimpleInputMask;

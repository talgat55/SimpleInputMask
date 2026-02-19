export type TMaskConfig = {
    mask: string;
    placeholderChar?: string;
    showMaskOnFocus?: boolean;
    onComplete?: (value: string) => void;
    onChange?: (maskedValue: string, unmaskedValue: string) => void;
    onIncomplete?: (maskedValue: string, unmaskedValue: string) => void;
};

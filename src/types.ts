export type TMaskConfig = {
    mask: string;
    placeholderChar?: string;
    onComplete?: (value: string) => void;
    onChange?: (maskedValue: string, unmaskedValue: string) => void;
};

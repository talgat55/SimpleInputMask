"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleInputMask = /** @class */ (function () {
    function SimpleInputMask(config) {
        var _a, _b;
        this.inputElement = null;
        this.wasComplete = false;
        this.originalPlaceholder = "";
        this.mask = config.mask;
        this.placeholderChar = (_a = config.placeholderChar) !== null && _a !== void 0 ? _a : "_";
        this.showMaskOnFocus = (_b = config.showMaskOnFocus) !== null && _b !== void 0 ? _b : false;
        this.onCompleteCallback = config.onComplete;
        this.onChangeCallback = config.onChange;
        this.onIncompleteCallback = config.onIncomplete;
    }
    SimpleInputMask.prototype.applyMask = function (value) {
        var maskedValue = "";
        var valueIndex = 0;
        for (var i = 0; i < this.mask.length; i++) {
            var maskChar = this.mask[i];
            var currentValueChar = value[valueIndex];
            if (!currentValueChar) {
                if (maskChar === "9" || maskChar === "A" || maskChar === "*") {
                    maskedValue += this.placeholderChar;
                }
                else {
                    maskedValue += maskChar;
                }
                continue;
            }
            if (maskChar === "9" && /\d/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            }
            else if (maskChar === "A" && /[a-zA-Z]/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            }
            else if (maskChar === "*" && /[a-zA-Z0-9]/.test(currentValueChar)) {
                maskedValue += currentValueChar;
                valueIndex++;
            }
            else if (maskChar !== "9" && maskChar !== "A" && maskChar !== "*") {
                maskedValue += maskChar;
                if (currentValueChar === maskChar) {
                    valueIndex++;
                }
            }
            else {
                valueIndex++;
                i--;
            }
        }
        return maskedValue;
    };
    SimpleInputMask.prototype.checkComplete = function (value) {
        return this.applyMask(value).indexOf(this.placeholderChar) === -1;
    };
    SimpleInputMask.prototype.isComplete = function () {
        if (!this.inputElement)
            return false;
        return this.checkComplete(this.inputElement.value);
    };
    SimpleInputMask.prototype.setCursorPosition = function (input, position) {
        requestAnimationFrame(function () {
            input.setSelectionRange(position, position);
        });
    };
    SimpleInputMask.prototype.findNextEditablePosition = function (value, position) {
        for (var i = position; i < value.length; i++) {
            if (value[i] === this.placeholderChar)
                return i;
        }
        return value.length;
    };
    SimpleInputMask.prototype.attach = function (input) {
        var _this = this;
        this.inputElement = input;
        this.originalPlaceholder = input.placeholder || "";
        if (this.showMaskOnFocus) {
            this.inputElement.placeholder = this.originalPlaceholder;
        }
        else {
            this.inputElement.placeholder = this.applyMask("");
        }
        if (this.inputElement.value) {
            var masked = this.applyMask(this.inputElement.value);
            this.inputElement.value = masked;
            var pos = this.findNextEditablePosition(masked, masked.length);
            this.setCursorPosition(this.inputElement, pos);
            this.wasComplete = this.checkComplete(masked);
        }
        var onInput = function () {
            if (!_this.inputElement)
                return;
            var rawValue = _this.inputElement.value;
            var cursorPosition = _this.inputElement.selectionStart || 0;
            var maskedValue = _this.applyMask(rawValue);
            var isComplete = _this.checkComplete(maskedValue);
            var nextCursorPosition = _this.findNextEditablePosition(maskedValue, cursorPosition);
            _this.inputElement.value = maskedValue;
            _this.setCursorPosition(_this.inputElement, nextCursorPosition);
            var unmaskedValue = _this.getUnmaskedValue(maskedValue);
            if (_this.onChangeCallback) {
                _this.onChangeCallback(maskedValue, unmaskedValue);
            }
            if (isComplete) {
                if (!_this.wasComplete && _this.onCompleteCallback) {
                    _this.onCompleteCallback(maskedValue);
                }
                _this.wasComplete = true;
            }
            else {
                if (_this.wasComplete && _this.onIncompleteCallback) {
                    _this.onIncompleteCallback(maskedValue, unmaskedValue);
                }
                _this.wasComplete = false;
            }
        };
        var onFocus = function () {
            if (!_this.inputElement)
                return;
            if (_this.showMaskOnFocus && !_this.inputElement.value) {
                _this.inputElement.placeholder = _this.applyMask("");
            }
        };
        var onBlur = function () {
            if (!_this.inputElement)
                return;
            if (_this.showMaskOnFocus && !_this.inputElement.value) {
                _this.inputElement.placeholder = _this.originalPlaceholder;
            }
        };
        this.inputElement.addEventListener("input", onInput);
        this.inputElement.addEventListener("paste", onInput);
        this.inputElement.addEventListener("focus", onFocus);
        this.inputElement.addEventListener("blur", onBlur);
        this.inputElement._onInputMask = onInput;
        this.inputElement._onFocusMask = onFocus;
        this.inputElement._onBlurMask = onBlur;
    };
    SimpleInputMask.prototype.getUnmaskedValue = function (value) {
        var _a, _b;
        var str = (_b = value !== null && value !== void 0 ? value : (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
        var result = "";
        var valueIndex = 0;
        for (var i = 0; i < this.mask.length && valueIndex < str.length; i++) {
            var maskChar = this.mask[i];
            var valueChar = str[valueIndex];
            valueIndex++;
            if (maskChar === "9" || maskChar === "A" || maskChar === "*") {
                if (valueChar !== this.placeholderChar) {
                    result += valueChar;
                }
            }
        }
        return result;
    };
    SimpleInputMask.prototype.getMaskedValue = function () {
        var _a, _b;
        return (_b = (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
    };
    SimpleInputMask.prototype.getCursorPosition = function () {
        var _a, _b;
        return (_b = (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.selectionStart) !== null && _b !== void 0 ? _b : 0;
    };
    SimpleInputMask.prototype.getState = function () {
        var maskedValue = this.getMaskedValue();
        return {
            maskedValue: maskedValue,
            unmaskedValue: this.getUnmaskedValue(maskedValue),
            isComplete: this.isComplete(),
            cursorPosition: this.getCursorPosition()
        };
    };
    SimpleInputMask.prototype.setValue = function (value) {
        if (!this.inputElement)
            return;
        var maskedValue = this.applyMask(value);
        this.inputElement.value = maskedValue;
        var nextCursorPosition = this.findNextEditablePosition(maskedValue, 0);
        this.setCursorPosition(this.inputElement, nextCursorPosition);
        if (this.onChangeCallback) {
            this.onChangeCallback(maskedValue, this.getUnmaskedValue(maskedValue));
        }
        if (this.checkComplete(maskedValue) && this.onCompleteCallback) {
            this.onCompleteCallback(maskedValue);
        }
    };
    SimpleInputMask.prototype.clear = function () {
        if (!this.inputElement)
            return;
        this.inputElement.value = "";
        this.setCursorPosition(this.inputElement, 0);
        if (this.onChangeCallback) {
            this.onChangeCallback("", "");
        }
    };
    SimpleInputMask.prototype.updateMask = function (newMask) {
        this.mask = newMask;
        if (this.inputElement) {
            this.inputElement.value = this.applyMask(this.inputElement.value);
        }
    };
    SimpleInputMask.prototype.detach = function () {
        if (this.inputElement) {
            var onInput = this.inputElement._onInputMask;
            var onFocus = this.inputElement._onFocusMask;
            var onBlur = this.inputElement._onBlurMask;
            if (onInput) {
                this.inputElement.removeEventListener("input", onInput);
                this.inputElement.removeEventListener("paste", onInput);
                delete this.inputElement._onInputMask;
            }
            if (onFocus) {
                this.inputElement.removeEventListener("focus", onFocus);
                delete this.inputElement._onFocusMask;
            }
            if (onBlur) {
                this.inputElement.removeEventListener("blur", onBlur);
                delete this.inputElement._onBlurMask;
            }
            this.inputElement.placeholder = this.originalPlaceholder;
            this.inputElement = null;
        }
    };
    SimpleInputMask.prototype.destroy = function () {
        this.detach();
    };
    return SimpleInputMask;
}());
exports.default = SimpleInputMask;

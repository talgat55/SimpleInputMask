"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleInputMask = /** @class */ (function () {
    function SimpleInputMask(config) {
        var _a;
        this.inputElement = null;
        this.mask = config.mask;
        this.placeholderChar = (_a = config.placeholderChar) !== null && _a !== void 0 ? _a : "_";
        this.onCompleteCallback = config.onComplete;
        this.onChangeCallback = config.onChange;
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
        this.inputElement.placeholder = this.applyMask("");
        if (this.inputElement.value) {
            var masked = this.applyMask(this.inputElement.value);
            this.inputElement.value = masked;
            var pos = this.findNextEditablePosition(masked, masked.length);
            this.setCursorPosition(this.inputElement, pos);
        }
        var onInput = function () {
            if (!_this.inputElement)
                return;
            var rawValue = _this.inputElement.value;
            var cursorPosition = _this.inputElement.selectionStart || 0;
            var maskedValue = _this.applyMask(rawValue);
            var nextCursorPosition = _this.findNextEditablePosition(maskedValue, cursorPosition);
            _this.inputElement.value = maskedValue;
            _this.setCursorPosition(_this.inputElement, nextCursorPosition);
            if (_this.onChangeCallback) {
                _this.onChangeCallback(maskedValue, _this.getUnmaskedValue(maskedValue));
            }
            if (_this.checkComplete(maskedValue) && _this.onCompleteCallback) {
                _this.onCompleteCallback(maskedValue);
            }
        };
        this.inputElement.addEventListener("input", onInput);
        this.inputElement.addEventListener("paste", onInput);
        this.inputElement._onInputMask = onInput;
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
            if (onInput) {
                this.inputElement.removeEventListener("input", onInput);
                this.inputElement.removeEventListener("paste", onInput);
                delete this.inputElement._onInputMask;
            }
            this.inputElement = null;
        }
    };
    SimpleInputMask.prototype.destroy = function () {
        this.detach();
    };
    return SimpleInputMask;
}());
exports.default = SimpleInputMask;

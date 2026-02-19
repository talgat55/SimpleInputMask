# SimpleInputMask

SimpleInputMask is a lightweight, user-friendly JavaScript library for creating input masks. Designed to simplify and enhance form validation, it helps users enter formatted data, such as phone numbers, dates, credit card numbers, and more, with ease.

---

## Features

- 🌟 **Lightweight:** Minimal impact on performance.
- ⚡ **Fast & Efficient:** Works seamlessly on any browser.
- 🛠 **Customizable:** Create masks tailored to your needs.
- 🔄 **Dynamic Updates:** Adjust masks dynamically based on user input.
- 🚀 **Modern API:** Built with simplicity and flexibility in mind.
- 🌐 **Framework-Friendly:** Use with React, Vue, or any JavaScript framework.

---

## Installation

### Using npm
```bash
npm install simple-input-mask
```

## Getting Started

Here's a quick example to get you started:

### HTML
```html
<input id="phone" type="text" placeholder="Enter your phone number">
```
### JavaScript
```javascript
import SimpleInputMask from 'simple-input-mask';

const input = document.getElementById('phone');
const mask = new SimpleInputMask(input, { mask: '(999) 999-9999' });
```

## API

### Initialization
```javascript
const mask = new SimpleInputMask(inputElement, options);
```

### Options

| Option            | Type       | Default | Description                                                                 |
|-------------------|------------|---------|-----------------------------------------------------------------------------|
| `mask`            | `string`   | —       | The mask pattern (e.g., `(999) 999-9999`).                                  |
| `placeholderChar` | `string`   | `'_'`   | Character for unfilled positions in the mask (e.g. `' '`, `'.'`).           |
| `showMaskOnFocus` | `boolean`  | `false` | Show mask placeholder only when input is focused.                           |
| `onComplete`      | `function` | `null`  | Callback triggered when input matches the mask.                             |
| `onChange`        | `function` | `null`  | Callback on every change: `(maskedValue, unmaskedValue) => void`.           |
| `onIncomplete`    | `function` | `null`  | Callback when mask becomes incomplete after being complete.                 |

### Methods

| Method                    | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `attach(input)`           | Attaches the mask to an input element. Applies mask to existing value.      |
| `clear()`                 | Clears the input field and resets cursor position.                           |
| `detach()`                | Removes the mask from the input element.                                    |
| `destroy()`               | Alias for `detach()`.                                                       |
| `getCursorPosition()`     | Returns current cursor position in the input.                               |
| `getMaskedValue()`         | Returns current masked value.                                               |
| `getState()`               | Returns object with current state: `{maskedValue, unmaskedValue, isComplete, cursorPosition}`.|
| `getUnmaskedValue(value?)`| Returns only entered characters without mask literals (e.g. for form submit).|
| `isComplete()`            | Returns `true` if the mask is completely filled.                            |
| `setValue(value)`         | Programmatically sets the input value with mask applied.                   |
| `updateMask(mask)`        | Dynamically updates the input mask.                                         |





### Examples

#### Phone Number
```javascript
new SimpleInputMask(document.getElementById('phone'), {
  mask: '(999) 999-9999'
});
```

#### Date
```javascript
new SimpleInputMask(document.getElementById('date'), {
  mask: '99/99/9999'
});
```

#### Credit Card
```javascript
new SimpleInputMask(document.getElementById('credit-card'), {
  mask: '9999 9999 9999 9999'
});
```
#### Updating the Mask Dynamically
```javascript
const input = document.getElementById('dynamic-input');
const mask = new SimpleInputMask({ mask: '(999) 999-9999' });
mask.attach(input);

setTimeout(() => {
  mask.updateMask('999-99-9999'); 
}, 5000);
```

#### Custom placeholder and raw value
```javascript
const mask = new SimpleInputMask({
  mask: '(999) 999-9999',
  placeholderChar: ' '
});
mask.attach(document.getElementById('phone'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = mask.getUnmaskedValue();
  sendToServer({ phone: raw });
});
```

#### Show mask on focus only
```javascript
const mask = new SimpleInputMask({
  mask: '(999) 999-9999',
  showMaskOnFocus: true
});
mask.attach(document.getElementById('phone'));
```

#### Get state and handle incomplete
```javascript
const mask = new SimpleInputMask({
  mask: '(999) 999-9999',
  onComplete: (value) => console.log('Complete:', value),
  onIncomplete: (masked, unmasked) => console.log('Incomplete:', unmasked)
});
mask.attach(document.getElementById('phone'));

const state = mask.getState();
console.log(state.isComplete, state.cursorPosition);
```

## License

SimpleInputMask is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

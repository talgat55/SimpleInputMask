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

| Option       | Type     | Default | Description                                     |
|--------------|----------|---------|-------------------------------------------------|
| `mask`       | `string` | `null`  | The mask pattern (e.g., `(999) 999-9999`).      |
| `onComplete` | `function` | `null`| Callback triggered when input matches the mask. |

### Methods

| Method              | Description                              |
|---------------------|------------------------------------------|
| `destroy()`         | Removes the mask from the input element. |
| `updateMask(mask)`  | Dynamically updates the input mask.      |





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
const mask = new SimpleInputMask(input, { mask: '(999) 999-9999' });

setTimeout(() => {
  mask.updateMask('999-99-9999'); 
}, 5000);
```
## License

SimpleInputMask is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

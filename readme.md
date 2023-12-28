# Scole captcha resolver
Module for solving captcha of Scole journal.

## Guide
The main function for solving a captcha is `resolve_captcha`. It takes a
monochrome picture as first argument and an array of "num masks" as second one.
It gives a string of an answer or `undefined`.


### Monochrome picture
There is used own class `MonochromePicture` for that. There are two ways to get
object of it: static method `from_png` or static method `from_img`.

`from_png` takes an `ArrayBuffer` of png file as only argument.
`from_img` takes a `HtmlImageElement` of captcha image as first argument and an
object specifying font color. That object has three fields: `red`, `blue` and
`green`, all of which are `number` from 0 to 255 and represent corresponding
RGB component.

Both methods return `MonochromePicture` if succeeded.

### Num masks
Num mask is object of class `NumMask`. That has four fields: `height`, `width`,
`points` and `digit`. `height` and `width` are `number` that represent
corresponding dimension of digit. `digit` is `number` of digit which is
presented by that num mask. `points` is an `Array` of `Point` objects.
`Point` is just an object with fields `x` and `y` of type `number`. 

## Examples

From picture on a site:
```javascript
fetch("https://scole.journal/cpt.a")
    .then(captcha_response => captcha_response.arrayBuffer())
    .then(captcha => {
        const captcha_monochrome_picture = MonochromePicture.from_png(captcha),
            captcha_answer = resolve_captcha(captcha_monochrome_picture, num_masks);
        console.log(captcha_answer);
    });
```

From picture on a page:
```javascript
const img = document.querySelector("img"),
    captcha_monochrome_picture = MonochromePicture.from_img(img, {red: 214, green: 191, blue: 168}),
    captcha_answer = resolve_captcha(captcha_monochrome_picture, num_masks);
console.log(captcha_answer);
```
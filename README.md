# ackordion
VanillaJS mobile friendly accordion library

# version
alpha 0.03 - fix for safari double animation

# about
Accordion library for fast mobile device rendering. 

# demo
http://codepen.io/kunukn/full/zBEEEq/


# html structure
```html
<ul class="ackordion" id="ackordion-1">
    <li>
        <button onclick="ackordion.toggle(this,event)">title</button>
        <section>
            <div>
                <article> 
                    Contrary to popular belief, Lorem Ipsum is not simply random text.
                </article>
            </div>
        </section>
    </li>
    <li>
       ...
    /<li>
</ul>

```
* ul is the root component where an id must be provided
* li are the accordion items
* button is the header
* section is the wrapper to hide the content on collapsed
* div is the content area without padding
* article is used to for padding if needed, the element can be removed

# usage

Apply this JavaScript when the DOM is ready.

```javascript
ackordion.init({
  id: 'ackordion-1',
});
```

# configuration

```javascript
var config = {
  id: 'ackordion-1', // required - html id
  duration: '600ms', // optional - transition duration
  transition: 'max-height 300ms cubic-bezier(.27,.82,.29,.84)', // optional - custom css transition
  autoClosePrevious: false, // optional - behave like a collapsible component
};
ackordion.init(config);

// To prevent using transition-end event use this.
// If used the height is not auto adjusted on device rotate or browser resizing
ackordion.isTransitionEndDisabled = true; // optional
```


# features
* CSS transition on dynamically calculated height value
* Clean simple html structure with minimum CSS class usage 
* Max-height is dynamically set and reset after the animation
* Tabbing is supported
* Vanilla JS
* Multiple accordions supported


# supported browsers
* Chrome - latest 2 versions
* Firefox - latest 2 versions
* Safari on desktop and iPhone, iPad - latest 2 versions
* IE11
* Edge - latest 2 versions
* Android Chrome - latest 2 versions


# known bugs


# license
MIT

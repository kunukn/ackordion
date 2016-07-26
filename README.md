# ackordion
VanillaJS mobile friendly accordion library

# version
alpha 0.03 - fix for safari double animation

# about
Accordion library for faster mobile device rendering using CSS transition instead of JS animation such as jQuery slideToggle.

# demo
http://codepen.io/kunukn/full/zBEEEq/

# how does it work?
This uses CSS transition on max-height value. The max-height is dynamically set and removed with JS during expanding and collapsing. The height value is calculated dynamically based on content. You can rotate the device or resize the browser window where the height is dynamically adjusted because max-height is set to auto. The onClick declarative binding in the markup is used to make it flexible for removing or adding items without having to use addEvent or removeEvent listener bindings.

# html structure
```html
<ul role="tablist" class="ackordion" id="ackordion-1">
    <li role="tabpanel">
        <button role="tab" onclick="ackordion.toggle(this,event)">title</button>
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
* div is the content area without padding top and bottom
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


# known bugs / possible hiccups
* Safari animates a change from a specific max-height value to max-height auto. This should not happen and is a browser bug. This has been fixed by using a temporary css class.
* The expanding and collapsing animation might get out of sync if the browser is busy. This is because the animation is handled by the browser and collapsing and expanding are two separate animations.

# license
MIT

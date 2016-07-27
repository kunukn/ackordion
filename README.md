# ackordion
VanillaJS mobile friendly accordion library

# version
* alpha 0.04 - support toggle aside
* alpha 0.03 - fix for safari double animation

# about
Accordion library for faster mobile device rendering using CSS transition instead of JS animation such as jQuery slideToggle.

# demo
http://codepen.io/kunukn/full/zBEEEq/

# how does it work?
This uses CSS transition on max-height value. The max-height is dynamically set and removed with JS during expanding and collapsing. The height value is calculated dynamically based on content. You can rotate the device or resize the browser window where the height is dynamically adjusted. The onclick declarative binding in the markup is used to make it flexible for removing or adding items without having to use addEvent or removeEvent listener bindings.

# html structure

Default
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

Default with toggle aside
```html
<ul role="tablist" class="ackordion" id="ackordion-1">
    <li role="tabpanel">
        <header>
            <label>This is a header</label>
            <button role="tab" onclick="ackordion.toggle(this,event)">click</button>
        </header>
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
* button is the tab-panel
* section is the wrapper to hide the content on collapsed
* div is the content area without padding top and bottom
* article is used to for padding if needed, the element can be removed

# usage

Apply this JavaScript when the DOM is ready. The id must be provided for init.

```javascript
ackordion.init('ackordion-1');
```

Alternatively you can use initAll.

```javascript
ackordion.initAll();
```

# configuration support

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


Alternatively you can apply same config to all accordions using initAll.

```javascript
var config = {
  duration: '300ms', // optional - transition duration
  transition: 'max-height 200ms cubic-bezier(.27,.82,.29,.84)', // optional - custom css transition
  autoClosePrevious: true, // optional
};
ackordion.initAll(config);
```

# features
* Small library - JS is 5kb minified and CSS is 1kb minified
* CSS max-height transition on dynamically calculated height value
* Clean simple html structure with minimum CSS class usage 
* Max-height is dynamically set and reset to auto after the animation
* Tabbing is supported
* Vanilla JS
* Multiple accordions supported


# supported browsers

requestAnimationFrame and css max-height transition is required.

* Chrome - latest 4 versions
* Firefox - latest 4 versions
* Safari on desktop and iPhone, iPad - latest 4 versions
* IE11
* Edge - latest 4 versions
* Android Chrome - latest 4 versions


# known bugs / possible hiccups
* Safari animates to height 0px and back to current height on change from a specific max-height value to max-height auto. This should not happen and is a browser bug. This has been fixed by using a temporary css class.
* The expanding and collapsing animation might get out of sync if the browser is busy. This is because the animation is handled by the browser and collapsing and expanding are two separate css transition animations.

# license
MIT

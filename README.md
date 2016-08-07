# ackordion
Vanilla JS mobile friendly accordion library

# about
Simple accordion library for faster mobile device rendering using CSS transition instead of JS animation such as jQuery slideToggle. You don't have to hardcode any height value and the accordion collapse/expand in smooth sync motion for smartphone and tablet devices.

# demo
* Basic with different configurations and custom themes http://codepen.io/kunukn/full/zBEEEq/
* Nested accordions http://codepen.io/kunukn/full/dXKEJg/

# how does it work?
This uses CSS transition on max-height value. The max-height is dynamically set and removed with JS during expanding and collapsing. The height value is calculated dynamically based on the content. You can rotate the device or resize the browser window where the height is dynamically adjusted. The onclick declarative binding in the markup is used to make it flexible for removing or adding items without having to use addEvent or removeEvent listener bindings. When an item is expanded the attribute is set `aria-expanded=true` for the expanded tabpanel.

# html structure

Default
```html
<ul role="tablist" class="ackordion" id="ackordion-1">
    <li role="tabpanel">
        <button role="tab" onclick="ackordion.toggle(this)">title</button>
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
            <button role="tab" onclick="ackordion.toggle(this)">toggle</button>
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

* **ul** is the root component where an id must be provided
* **li** are the accordion items
* **button** is the toggle
* **section** is the wrapper to hide the content on collapsed
* **div** is the content area without padding top and bottom
* **article** is used to for padding if needed, the element can be removed

# usage

Check the **index.html** for inspiration.

* Add reference to `ackordion.min.js` and `ackordion.min.css` in the html page
* Apply the markup structure for the accordion
* Init the accordion with JS
* Apply custom css to override the library css

Apply this JavaScript when the DOM is ready for a single accordion. 
The id must match the one in the html markup.

## init

```javascript
ackordion.init('ackordion-1');
```

## init all

Alternatively you can use initAll.

```javascript
ackordion.initAll();
```

# configuration support

## init

```javascript
var config = {
  // required - html id
  id: 'ackordion-1', 
  // optional - transition duration, default is in the css, 200ms
  duration: '600ms', 
  // optional - default is in the css, max-height 200ms cubic-bezier(0,0,.3,1)
  transition: 'max-height 300ms cubic-bezier(.27,.82,.29,.84)', 
  // optional - close previous opened tab when a new tab is opened, default true
  autoClosePrevious: false, 
  // optional - set a specific close height, default 0px
  closeHeight: '32px',
};
ackordion.init(config);

// To prevent using transition-end event use this.
// If used the height is not auto adjusted on device rotate or browser resizing
ackordion.isTransitionEndDisabled = true; // optional, default false
```

## init all

Alternatively you can apply same config to all accordions using initAll.

```javascript
var config = {
  duration: '300ms',
  transition: 'max-height 200ms cubic-bezier(.27,.82,.29,.84)',
  autoClosePrevious: false,
};
ackordion.initAll(config);
```

## event callbacks

Add callbacks when accordion has changed to opened or closed state

```javascript
  ackordion.addCallbackForEvent('afteropen', function(eventName, accordion, item) {
            console.log('event triggered');
            console.log(eventName);
            console.log('on accordion');
            console.log(accordion);
            console.log('on item');
            console.log(item);
        });
        ackordion.addCallbackForEvent('afterclose', function(eventName, accordion, item) {
            console.log('event triggered');
            console.log(eventName);
            console.log('on accordion');
            console.log(accordion);
            console.log('on item');
            console.log(item);
        });
```

## cleanup memory on remove

If you later want to remove an accordion from your page you can remove the used memory.

E.g. `ackordion.destroy('the-accordion-id');`

You can remove all the used memory by applying destroyAll
`ackordion.destroyAll();`


# features
* Small library - JS is ~7kb minified and CSS is ~1kb minified
* Support for AMD and CommonJS
* Callback support for events: init, beforeopen, afteropen, beforeclose, afterclose
* CSS max-height transition on dynamically calculated height value
* Simple html structure with minimum CSS class usage 
* Max-height is dynamically set and reset after the animation
* Tabbing is supported
* Accessibility friendly, a11y
* Multiple accordions supported
* Vanilla JS

# supported browsers

requestAnimationFrame (rAF), transitionend event, css max-height transition and Ecmascript 5 are required.
Browsers which supports those should be fine. If needed the code can be refactored to exclude usage of rAF and transitionend. 

* Chrome - latest 5 versions
* Firefox - latest 5 versions
* Safari on desktop and iPhone, iPad - latest 5 versions
* IE10 (not tested), IE11
* Edge - latest 5 versions
* Android Chrome - latest 5 versions


# known bugs / possible hiccups
* Safari 9 animates to height 0px and back to current height on change from a specific max-height value to max-height none. This should not happen and is a browser bug. This has been fixed by using a temporary css class.
* The expanding and collapsing animation might get out of sync if the browser is busy. This is because the animation is handled by the browser and collapsing and expanding are two separate css transition animations.

# performance

The max-height triggers layout, paint and composite but is faster than JS animation. 
https://csstriggers.com/max-height

I tested this with smartphones and tablets and was happy with the result. 
I could have aimed for `transform: translate` which might have better performance, but max-height seemed simpler to implement and more flexible for content height adaptation.

# version
* beta  0.1 - support for custom close height value 
* alpha 0.04 - support toggle aside
* alpha 0.03 - fix for safari double animation

# credits
The accessibility part was implemented with inspiration from: Accordion: Live Coding Session - Supercharged
https://www.youtube.com/watch?v=P2glQ0fz7DM&ab_channel=GoogleChromeDevelopers

# license
MIT

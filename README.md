# ackordion
Vanilla JS mobile friendly accordion library

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
            <button role="tab" onclick="ackordion.toggle(this,event)">toggle</button>
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
* button is the toggle
* section is the wrapper to hide the content on collapsed
* div is the content area without padding top and bottom
* article is used to for padding if needed, the element can be removed

# usage

* Add reference to `ackordion.min.js` and `ackordion.min.css` in the html page
* Apply the markup structure for the accordion
* Init the accordion with JS

Apply this JavaScript when the DOM is ready for a single accordion. 
The id must match the one in the html markup.

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
  // required - html id
  id: 'ackordion-1', 
  // optional - transition duration, default is in the css, 200ms
  duration: '600ms', 
  // optional - default is in the css, max-height 200ms cubic-bezier(0,0,.3,1)
  transition: 'max-height 300ms cubic-bezier(.27,.82,.29,.84)', 
  // optional - behave like a collapsible component, default true
  autoClosePrevious: false, 
};
ackordion.init(config);

// To prevent using transition-end event use this.
// If used the height is not auto adjusted on device rotate or browser resizing
ackordion.isTransitionEndDisabled = true; // optional, default false
```


Alternatively you can apply same config to all accordions using initAll.

```javascript
var config = {
  duration: '300ms',
  transition: 'max-height 200ms cubic-bezier(.27,.82,.29,.84)',
  autoClosePrevious: true,
};
ackordion.initAll(config);
```

If you later want to remove an accordion you can remove the used memory, e.g.
`ackordion.destroy('the-accordion-id');`

You can remove all the used memory by applying destroyAll
`ackordion.destroyAll();`


# features
* Small library - JS is 5kb minified and CSS is 1kb minified
* CSS max-height transition on dynamically calculated height value
* Clean simple html structure with minimum CSS class usage 
* Max-height is dynamically set and reset to auto after the animation
* Tabbing is supported
* Vanilla JS
* Multiple accordions supported


# supported browsers

requestAnimationFrame, transitionend event, css max-height transition and Ecmascript 5 are required.
Browsers which supports those should be fine.

* Chrome - latest 5 versions
* Firefox - latest 5 versions
* Safari on desktop and iPhone, iPad - latest 5 versions
* IE10 (not tested), IE11
* Edge - latest 5 versions
* Android Chrome - latest 5 versions


# known bugs / possible hiccups
* Safari animates to height 0px and back to current height on change from a specific max-height value to max-height auto. This should not happen and is a browser bug. This has been fixed by using a temporary css class.
* The expanding and collapsing animation might get out of sync if the browser is busy. This is because the animation is handled by the browser and collapsing and expanding are two separate css transition animations.

# version
* alpha 0.04 - support toggle aside
* alpha 0.03 - fix for safari double animation

# license
MIT

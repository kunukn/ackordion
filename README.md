# ackordion
VanillaJS mobile friendly accordion library

# version
alpha 0.03 - fix for safari double animation

# about
Accordion library for fast mobile device rendering. 

# demo
http://codepen.io/kunukn/full/zBEEEq/

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

# html structure
```html
<ul class="ackordion" id="ackordion-1">
    <li>
        <button onclick="ackordion.toggle(this,event)">title</button>
        <section>
            <div>
                Contrary to popular belief, Lorem Ipsum is not simply random text.
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
* div is the content area

# license
MIT

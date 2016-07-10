# ackordion
VanillaJS mobile friendly accordion library

# version
alpha 0.02

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
Safari browser and usage of transitionend. 
set `ackordion.isTransitionEndDisabled = true` for supporting Safari browser. The max-height value doesn't get cleared.
This has effect on rezising browser width or rotating devices where the content is fixed in height until toggling the content again.

# license
MIT

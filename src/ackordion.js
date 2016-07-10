;
window.ackordion = (function(window, document, console) {

    function qs(expr, context) {
        return (context || document).querySelector(expr);
    }

    function qsa(expr, context) {
        return [].slice.call((context || document).querySelectorAll(expr), 0);
    }

    var log = console.log.bind(console),
        error = console.error.bind(console);

    var cssClassActive = 'ackordion--active';
    var dataAckordion = 'data-ackordion';
    var accordionIndex = 1;
    var accordions = [];
    var transitionEndVendorPrefix = getTransitionEndVendorPrefixAsString();

    function getTransitionEndVendorPrefixAsString() {
        var el = document.createElement('div')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false;
    }

    var Accordion = function(config) {

        if (!config) {
            error('ackordion error - you must provide a config');
            return;
        }

        var self = this;
        self.id = accordionIndex;
        self.root;
        self.contents = [];
        self.previous;
        self.autoClosePrevious = true;
        if (config.autoClosePrevious === false)
            self.autoClosePrevious = false;

        self.hasInit = false;

        if (!self.hasInit) {
            self.hasInit = true;
        } else {
            error('ackordion error - you can only call init once per id');
            return;
        }

        if (config && config.id) {
            self.root = document.getElementById(config.id);
        }
        if (!self.root) {
            error('ackordion error - component not found in html');
            return;
        }

        self.contents = qsa('section > div', self.root);

        if (config && config.duration) {
            self.contents.forEach(function(content) {
                content.style.transitionDuration = config.duration;
            });
        }

        self.root.dataset.ackordion = accordionIndex + '';

        accordions[accordionIndex] = self;
        accordionIndex++;
    }

    function expand(element) {

        function transitionEnd(event) {
            if (event.propertyName == 'max-height') {
                if (element.style.maxHeight !== '0px') {
                  element.style.maxHeight = 'none'
                }
                element.removeEventListener(transitionEndVendorPrefix, transitionEnd, false)
            }
        }

        element.addEventListener(transitionEndVendorPrefix, transitionEnd, false);

        element.style.maxHeight = 'none';

        var BCR = element.getBoundingClientRect();
        element.style.maxHeight = '0px';
        element.offsetHeight; // reflow

        element.style.maxHeight = BCR.height + 'px';
    }

    function collapse(element) {
        var BCR = element.getBoundingClientRect(),
            height = BCR.height == 0 ? 1 : BCR.height;
        element.style.maxHeight = height + 'px';
        element.offsetHeight; // reflow
        element.style.maxHeight = '0px';
    }

    function toggle(element, event) {

        var li = element.parentNode;
        var root = li.parentNode;
        var accordionIndex = +root.dataset.ackordion;
        var accordion = accordions[accordionIndex];
        li.classList.toggle(cssClassActive);

        var section = element.nextElementSibling,
            content = section.firstElementChild,
            BCR;

        if (accordion && accordion.autoClosePrevious && accordion.previous && li !== accordion.previous) {
            if (accordion.previous.classList.contains(cssClassActive)) {
                var previousContent = qs('section > div', accordion.previous);
                collapse(previousContent);
                accordion.previous.classList.remove(cssClassActive);
            }
        }

        if (li.classList.contains(cssClassActive)) {
            expand(content);
        } else {
            collapse(content);
        }

        if (accordion) accordions[accordionIndex].previous = li;
    }


    function clearPrevious(ackordionId) {
        var root = document.getElementById(ackordionId);
        var index = +root.dataset.ackordion;
        if (index) {
            var accordion = accordions[index];
            if (accordion) {
                accordions[index].previous = undefined;
                return true;
            }
        }
        return false;
    }

    function init(config) {
        var accordion = new Accordion(config);
    }

    return {
        toggle: toggle,
        init: init,
        clearPrevious: clearPrevious
    };

})(window, window.document, window.console, undefined);

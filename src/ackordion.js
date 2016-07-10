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
        var t, el = document.createElement('div')
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
        return 'transitionend';
    }

    var Accordion = function(config) {

        var self = this;

        if (!config) {
            error('ackordion error - you must provide a config');
            return;
        }

        self.hasInit = false;
        if (!self.hasInit) {
            self.hasInit = true;
        } else {
            error('ackordion error - you can only call init once per id');
            return;
        }

        self.id = accordionIndex;
        self.root; // component element root
        self.contents = [];
        self.previous; // previous toggled element
        self.autoClosePrevious = true;
        self.transition = config.transition || '';

        if (config && config.id) {
            self.root = document.getElementById(config.id);
        }
        if (!self.root) {
            error('ackordion error - component not found in html');
            return;
        }

        if (config.autoClosePrevious === false)
            self.autoClosePrevious = false;

        self.contents = qsa('section > div', self.root);

        self.contents.forEach(function(content) {
            //content.style.maxHeight = '0px';
        });

        if (self.transition) {
            self.contents.forEach(function(content) {
                content.style.transition = self.transition;
            });
        }

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

                    var height = getComputedStyle(event.srcElement).height;

                    // Using this technique because Safari has double animation bug when max-height is later set again
                    // http://stackoverflow.com/q/27806229/815507
                    element.classList.add('ackordion-fix-safari-bug');

                    setTimeout(function() {
                        element.style.maxHeight = 'none';
                        setTimeout(function() {
                            element.classList.remove('ackordion-fix-safari-bug');
                        }, 10);
                    }, 0);
                }
                element.removeEventListener(transitionEndVendorPrefix, transitionEnd, false)
            }
        }

        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect();
        element.style.maxHeight = '0px';


        if (!ackordion.isTransitionEndDisabled)
            element.addEventListener(transitionEndVendorPrefix, transitionEnd, false);

        element.offsetHeight; // reflow

        element.style.maxHeight = BCR.height + 'px';
    }

    function collapse(element) {

        function transitionEnd(event) {
            if (event.propertyName == 'max-height') {
                if (element.style.maxHeight === '0px') {
                    // not needed yet..
                }
                element.removeEventListener(transitionEndVendorPrefix, transitionEnd, false)
            }
        }

        element.classList.add('ackordion-fix-safari-bug');

        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect(),
            height = BCR.height === 0 ? 1 : BCR.height;

        element.style.maxHeight = height + 'px';

        if (!ackordion.isTransitionEndDisabled)
            element.addEventListener(transitionEndVendorPrefix, transitionEnd, false);

        element.offsetHeight; // reflow
        element.classList.remove('ackordion-fix-safari-bug');

        setTimeout(function() {
            element.style.maxHeight = '0px';
        }, 0);
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
        clearPrevious: clearPrevious,
        isTransitionEndDisabled: false,
    };

})(window, window.document, window.console, undefined);

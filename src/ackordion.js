/*!
 * ackordion JavaScript Library v0.3
 * https://github.com/kunukn/ackordion/
 *
 * Copyright Kunuk Nykjaer
 * Released under the MIT license
 */

window.ackordion = (function(window) {

    "use strict";

    // App variables
    var document = window.document,
        console = window.console,
        log = console.log.bind(console),
        error = console.error.bind(console),
        cssClassComponent = 'ackordion',
        cssClassActive = 'ackordion--active',
        dataAckordion = 'data-ackordion',
        accordionIndex = 1,
        accordions = [],
        transitionEndVendorPrefix = getTransitionEndVendorPrefixNameAsString();


    function qs(expr, context) {
        return (context || document).querySelector(expr);
    }

    function qsa(expr, context) {
        return [].slice.call((context || document).querySelectorAll(expr), 0);
    }

    function getAckordionTabPanel(element) {
        var root = element;
        while (root) {
            root = root.parentElement;
            if (root && root.getAttribute('role') === 'tabpanel')
                return root;
        }
        return undefined;
    }

    function getAckordionComponent(element) {
        var root = element;
        while (root) {
            root = root.parentElement;
            if (root && root.classList.contains(cssClassComponent))
                return root;
        }
        return undefined;
    }

    function getTransitionEndVendorPrefixNameAsString() {
        var t,
            el = document.createElement('div'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
        return 'transitionend';
    }

    var Accordion = function(config) {

        if (!config) {
            error('ackordion error - you must provide a config');
            return;
        }

        var self = this;

        // Accordion variables 

        self.root; // component element root
        self.index = accordionIndex;
        self.contents = [];
        self.previous; // previous toggled element
        self.transition;
        self.autoClosePrevious = true;

        // Get root and contents

        if (typeof config === 'string') {
            self.id = config;
            self.root = document.getElementById(config);
        } else if (typeof config === 'object') {
            self.id = config.id;
            self.root = document.getElementById(config.id);
        }
        if (!self.root) {
            error('ackordion error - component not found in html with id: ' + self.id);
            return;
        }

        self.contents = qsa('section > div', self.root);

        // Set rest of config

        if (typeof config === 'object') {

            self.transition = config.transition || '';
            self.duration = config.duration || '';

            if (config.autoClosePrevious === false)
                self.autoClosePrevious = false;
        }


        if (self.transition) {
            self.contents.forEach(function(content) {
                content.style.transition = self.transition;
            });
        }

        if (self.duration) {
            self.contents.forEach(function(content) {
                content.style.transitionDuration = config.duration;
            });
        }

        self.root.dataset.ackordion = accordionIndex + '';

        accordions[accordionIndex] = self;
        accordionIndex++;
    }

    function expand(element) {

        if (!element)
            return;

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
                        }, 0);
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

        element.offsetHeight; // force reflow to apply transition animation

        element.style.maxHeight = BCR.height + 'px';
    }

    function collapse(element) {

        if (!element)
            return;

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
            height = BCR.height;

        if (height === 0) {
            // Already collapsed, then stop here
            element.classList.remove('ackordion-fix-safari-bug');
            return;
        }

        element.style.maxHeight = height + 'px';

        /*
        if (!ackordion.isTransitionEndDisabled)
            element.addEventListener(transitionEndVendorPrefix, transitionEnd, false);
        */

        element.offsetHeight; // force reflow
        element.classList.remove('ackordion-fix-safari-bug');

        setTimeout(function() {
            element.style.maxHeight = '0px';
        }, 0);
    }

    function toggle(element, event) {

        if (!element)
            return;

        var tabpanel = getAckordionTabPanel(element),
            root = tabpanel.parentNode,
            accordionIndex = +root.dataset.ackordion,
            accordion = accordions[accordionIndex];

        tabpanel.classList.toggle(cssClassActive);

        var section = qs('section', tabpanel),
            content = section.firstElementChild,
            BCR;

        if (accordion && accordion.autoClosePrevious && accordion.previous && tabpanel !== accordion.previous) {
            if (accordion.previous.classList.contains(cssClassActive)) {
                var previousContent = qs('section > div', accordion.previous);
                collapse(previousContent);
                accordion.previous.classList.remove(cssClassActive);
                accordion.previous.removeAttribute('aria-expanded');
            }
        }

        if (tabpanel.classList.contains(cssClassActive)) {
            tabpanel.setAttribute('aria-expanded', 'true');
            expand(content);
        } else {
            tabpanel.removeAttribute('aria-expanded');
            collapse(content);
        }

        // update previous
        if (accordion)
            accordions[accordionIndex].previous = tabpanel;
    }


    function clearPrevious(id) {
        var root = document.getElementById(id),
            index = +root.dataset.ackordion;

        if (index) {
            var accordion = accordions[index];
            if (accordion) {
                accordions[index].previous = undefined;
                return true;
            }
        }

        return false;
    }

    function destroy(id) {
        if (!id)
            return false;

        accordions.forEach(function(accordion) {
            if (accordion && accordion.id === id) {
                accordion = undefined;
                return true;
            }
        });
        return false;
    }

    function destroyAll() {
        accordions.forEach(function(accordion) {
            if (accordion) {
                accordion = undefined;
            }
        });
        accordions = [];
    }

    function init(config) {
        new Accordion(config);
    }

    return {
        toggle: toggle,
        init: init,
        clearPrevious: clearPrevious,
        isTransitionEndDisabled: false,
        destroy: destroy,
        destroyAll: destroyAll,
    };

})(window, undefined);

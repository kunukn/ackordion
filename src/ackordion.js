/*!
 * ackordion JavaScript Library v0.5
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
        cssClassActive = 'ackordion--active',
        accordions = {},
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
            error('ackordion error - you must provide a config or id');
            return;
        }

        var self = this;

        // Accordion variables 

        self.root; // component element root
        self.contents = [];
        self.previous; // previous toggled element
        self.transition;
        self.autoClosePrevious = true;
        self.closeHeight = '0px';

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
            self.closeHeight = config.closeHeight || '0px';

            /*
                If close height is value larger than 0, e.g. 36px
                Then override css library by adding custom style element
            */
            if (self.closeHeight.lastIndexOf('0', 0) !== 0) {

                var css = ['.ackordion[id="',
                        self.id,
                        '"] > li:not(.ackordion--active) > section > div { max-height: ',
                        self.closeHeight,
                        ';}'
                    ].join(''),
                    head = document.head || document.getElementsByTagName('head')[0],
                    style = document.createElement('style');

                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                head.appendChild(style);
            }

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

        var id = self.root.getAttribute('id');
        if (id) {
            if (accordions[id]) {
                log('ackordion warning - this id has already been init ' + id);
            }
            accordions[id] = self;
        }
    }

    function expand(element, accordion) {

        if (!element)
            return;

        function transitionEnd(event) {

            if (event.propertyName == 'max-height') {

                if (element.style.maxHeight !== accordion.closeHeight) {

                    element.classList.add('ackordion-fix-safari-bug');

                    element.style.maxHeight = 'none';
                    setTimeout(function() {
                        element.classList.remove('ackordion-fix-safari-bug');
                    }, 0);
                }
                element.removeEventListener(transitionEndVendorPrefix, transitionEnd, false);
            }
        }


        // Using this technique because Safari has double animation bug when max-height is later set again
        // http://stackoverflow.com/q/27806229/815507
        element.classList.add('ackordion-fix-safari-bug');

        element.style.maxHeight = 'none';

        var BCR = element.getBoundingClientRect();

        element.style.maxHeight = accordion.closeHeight;

        if (!ackordion.isTransitionEndDisabled)
            element.addEventListener(transitionEndVendorPrefix, transitionEnd, false);

        element.offsetHeight; // force reflow to apply transition animation
        element.classList.remove('ackordion-fix-safari-bug');

        window.requestAnimationFrame(function() {
            element.style.maxHeight = BCR.height + 'px';
        });
    }

    function collapse(element, accordion) {

        if (!element)
            return;

        function transitionEnd(event) {
            if (event.propertyName == 'max-height') {
                element.removeEventListener(transitionEndVendorPrefix, transitionEnd, false)
            }
        }

        element.classList.add('ackordion-fix-safari-bug');

        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect(),
            height = BCR.height;

        if (height === 0 || (height + 'px') === accordion.closeHeight) {
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

        window.requestAnimationFrame(function() {
            element.style.maxHeight = accordion.closeHeight;
        });
    }

    function toggle(element) {

        if (!element)
            return;

        var tabpanel = getAckordionTabPanel(element),
            root = tabpanel.parentNode,
            id = root.getAttribute('id'),
            accordion = accordions[id];


        var section = qs('section', tabpanel),
            content = section.firstElementChild;

        // --- Begin animation 
        tabpanel.classList.toggle(cssClassActive);

        if (tabpanel.classList.contains(cssClassActive)) {
            tabpanel.setAttribute('aria-expanded', 'true');
            expand(content, accordion);
        } else {
            tabpanel.removeAttribute('aria-expanded');
            collapse(content, accordion);
        }
        if (accordion && accordion.autoClosePrevious && accordion.previous && tabpanel !== accordion.previous) {
            if (accordion.previous.classList.contains(cssClassActive)) {
                var previousContent = qs('section > div', accordion.previous);
                collapse(previousContent, accordion);
                accordion.previous.classList.remove(cssClassActive);
                accordion.previous.removeAttribute('aria-expanded');
            }
        }
        // --- End animation

        // update previous
        if (accordion)
            accordions[id].previous = tabpanel;
    }


    function clearPrevious(id) {
        if (id) {
            var accordion = accordions[id];
            if (accordion) {
                accordions[id].previous = undefined;
                return true;
            }

        }
        return false;
    }

    function destroy(id) {
        if (!id)
            return false;

        var accordion = accordions[id];
        if (accordion) {
            accordions[id] = undefined;
            return true;
        }

        return false;
    }

    function destroyAll() {
        Object.keys(accordions).forEach(function(id) {
            accordions[id] = undefined;
        });
        accordions = {};
    }

    function init(config) {
        if (config) {
            new Accordion(config);
        } else {
            error('ackordion error - you must provide an argument to init');
        }
    }

    function initAll(config) {
        if (config && typeof config === 'object') {
            qsa('.ackordion').forEach(function(accordion) {
                config.id = accordion.getAttribute('id');
                new Accordion(config);
            });
        } else {
            qsa('.ackordion').forEach(function(accordion) {
                new Accordion(accordion.getAttribute('id'));
            });
        }
    }

    return {
        toggle: toggle,
        init: init,
        initAll: initAll,
        clearPrevious: clearPrevious,
        isTransitionEndDisabled: false,
        destroy: destroy,
        destroyAll: destroyAll,
    };

})(window, undefined);

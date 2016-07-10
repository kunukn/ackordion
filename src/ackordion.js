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
    var accordionId = 1;
    var accordions = [];

    var Accordion = function(config) {

        if (!config) {
            error('ackordion error - you must provide a config');
            return;
        }

        var self = this;
        self.id = accordionId;
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

        self.root.dataset.ackordion = accordionId + '';

        accordions[accordionId] = self;
        accordionId++;
    }

    function expand(element) {

        function transitionEnd(event) {
            if (event.propertyName == 'max-height') {
               // log('transitionEnd');
                element.style.maxHeight = 'none'
                element.removeEventListener('transitionend', transitionEnd, false)
            }
        }

        element.addEventListener('transitionend', transitionEnd, false);


        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect();
        element.style.maxHeight = '0px';
        element.offsetHeight; // reflow
        element.style.maxHeight = BCR.height + 'px';
    }

    function collapse(element) {
        var BCR = element.getBoundingClientRect(),
            height = BCR.height;
        element.style.maxHeight = height + 'px';
        element.offsetHeight; // reflow
        element.style.maxHeight = '0px';
    }

    function toggle(element, event) {

        var li = element.parentNode;
        var root = li.parentNode;
        var ackordionId = +root.dataset.ackordion;
        var accordion = accordions[ackordionId];
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

        if (accordion) accordions[ackordionId].previous = li;
    }



    function init(config) {
        var accordion = new Accordion(config);
    }

    return {
        toggle: toggle,
        init: init,
    };

})(window, window.document, window.console, undefined);

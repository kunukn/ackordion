;
window.ackordion = (function(window, document) {

    function $(expr, context) {
        return (context || document).querySelector(expr);
    }

    function $$(expr, context) {
        return [].slice.call((context || document).querySelectorAll(expr), 0);
    }

    var log = console.log.bind(console),
        error = console.error.bind(console);

    var root, items, headers, contents, previous,
        cssClassActive = 'ackordion--active';

    function expand(element) {
        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect();
        element.style.maxHeight = '0px';
        element.offsetHeight; // reflow
        element.style.maxHeight = BCR.height + 'px';
    }

    function collapse(element) {
        element.style.maxHeight = 'none';
        var BCR = element.getBoundingClientRect(),
            height = BCR.height ? BCR.height : 1;
        element.style.maxHeight = height + 'px';
        element.offsetHeight; // reflow
        element.style.maxHeight = '0px';
    }

    function toggle(element, event) {

        var li = element.parentNode;
        li.classList.toggle(cssClassActive);

        var section = element.nextElementSibling,
            content = section.firstElementChild,
            BCR;

        if (previous && li !== previous) {
            if (previous.classList.contains(cssClassActive)) {
                var previousContent = $('section > div', previous);
                collapse(previousContent);
                previous.classList.remove(cssClassActive);
            }
        }

        if (li.classList.contains(cssClassActive)) {
            expand(content);
        } else {
            collapse(content);
        }

        previous = li;
    }

    var hasInit = false;

    function init(config) {
        if (!hasInit) {
            hasInit = true;
        } else {
            error('ackordion error - you can only call init once');
            return;
        }

        if (config && config.id) {
            root = document.getElementById(config.id);
        } else {
            root = $$('.ackordion')[0];
        }
        if (!root) {
            error('ackordion error - component not found in html');
        } else {
            items = $$('li', root),
                headers = $$('li > button', root),
                contents = $$('section > div', root);

            if (config && config.duration) {
                contents.forEach(function(content) {
                    content.style.transitionDuration = config.duration;
                });
            }
        }

        if (config && config.resetMaxHeightAfterTransitionEnd) {
            contents.forEach(function(content) {
                content.addEventListener('transitionend', function(event) {
                    content.style.maxHeight = ''; // reset
                }, false);
            });
        }
    }

    return {
        toggle: toggle,
        init: init,
    };

})(window, document, undefined);

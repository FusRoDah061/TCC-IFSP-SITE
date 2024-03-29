export default class DOMUtils {
    static isElementInViewport (el) {

        //special bonus for those using jQuery
        if (typeof el !== "object") {
            el = document.getElementById(el);
        }
    
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    static onVisibilityChange(el, callback) {
        var old_visible;
        return function () {
            var visible = isElementInViewport(el);
            if (visible != old_visible) {
                old_visible = visible;
                if (typeof callback == 'function') {
                    callback();
                }
            }
        }
    }

    static scrollToEnd (elemId) {
        let elem = document.getElementById(elemId);
        elem.scrollLeft = elem.scrollWidth;
    }

    static scrollCenterOnElem(idParent, idTarget) {
        let parent = document.getElementById(idParent);
        let target = document.getElementById(idTarget);

        parent.scrollLeft = target.offsetLeft - ((parent.clientWidth - target.clientWidth) / 2);
    }
}
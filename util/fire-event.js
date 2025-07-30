"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fireEvent = void 0;
var fireEvent = function (eventTarget, type, 
// @ts-ignore
detail, options) {
    options = options || {};
    var event = new CustomEvent(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed,
        detail: detail,
    });
    eventTarget.dispatchEvent(event);
};
exports.fireEvent = fireEvent;

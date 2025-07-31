"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EwtButton = void 0;
var lit_1 = require("lit");
var mwc_button_base_1 = require("@material/mwc-button/mwc-button-base");
var styles_css_1 = require("@material/mwc-button/styles.css");
var EwtButton = /** @class */ (function (_super) {
    __extends(EwtButton, _super);
    function EwtButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtButton.styles = [
        styles_css_1.styles,
        (0, lit_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      .mdc-button {\n        min-width: initial;\n      }\n      :host([text-left]) .mdc-button__label {\n        text-align: left;\n      }\n    "], ["\n      .mdc-button {\n        min-width: initial;\n      }\n      :host([text-left]) .mdc-button__label {\n        text-align: left;\n      }\n    "]))),
    ];
    return EwtButton;
}(mwc_button_base_1.ButtonBase));
exports.EwtButton = EwtButton;
customElements.define("ewt-button", EwtButton);
var templateObject_1;

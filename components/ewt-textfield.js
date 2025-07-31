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
exports.EwtTextfield = void 0;
var mwc_textfield_base_1 = require("@material/mwc-textfield/mwc-textfield-base");
var mwc_textfield_css_1 = require("@material/mwc-textfield/mwc-textfield.css");
var lit_1 = require("lit");
var EwtTextfield = /** @class */ (function (_super) {
    __extends(EwtTextfield, _super);
    function EwtTextfield() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtTextfield.styles = [
        mwc_textfield_css_1.styles,
        (0, 
        // rem -> em conversion
        lit_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      .mdc-floating-label {\n        line-height: 1.15em;\n      }\n    "], ["\n      .mdc-floating-label {\n        line-height: 1.15em;\n      }\n    "]))),
    ];
    return EwtTextfield;
}(mwc_textfield_base_1.TextFieldBase));
exports.EwtTextfield = EwtTextfield;
customElements.define("ewt-textfield", EwtTextfield);
var templateObject_1;

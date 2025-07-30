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
exports.EwtSelect = void 0;
var mwc_select_base_1 = require("@material/mwc-select/mwc-select-base");
var mwc_select_css_1 = require("@material/mwc-select/mwc-select.css");
var lit_1 = require("lit");
var EwtSelect = /** @class */ (function (_super) {
    __extends(EwtSelect, _super);
    function EwtSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtSelect.styles = [
        mwc_select_css_1.styles,
        (0, 
        // rem -> em conversion
        lit_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      .mdc-floating-label {\n        line-height: 1.15em;\n      }\n    "], ["\n      .mdc-floating-label {\n        line-height: 1.15em;\n      }\n    "]))),
    ];
    return EwtSelect;
}(mwc_select_base_1.SelectBase));
exports.EwtSelect = EwtSelect;
customElements.define("ewt-select", EwtSelect);
var templateObject_1;

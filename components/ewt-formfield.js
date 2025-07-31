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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EwtFormfield = void 0;
var mwc_formfield_base_1 = require("@material/mwc-formfield/mwc-formfield-base");
var mwc_formfield_css_1 = require("@material/mwc-formfield/mwc-formfield.css");
var EwtFormfield = /** @class */ (function (_super) {
    __extends(EwtFormfield, _super);
    function EwtFormfield() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtFormfield.styles = [mwc_formfield_css_1.styles];
    return EwtFormfield;
}(mwc_formfield_base_1.FormfieldBase));
exports.EwtFormfield = EwtFormfield;
customElements.define("ewt-formfield", EwtFormfield);

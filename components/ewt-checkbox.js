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
exports.EwtCheckbox = void 0;
var mwc_checkbox_base_1 = require("@material/mwc-checkbox/mwc-checkbox-base");
var mwc_checkbox_css_1 = require("@material/mwc-checkbox/mwc-checkbox.css");
var EwtCheckbox = /** @class */ (function (_super) {
    __extends(EwtCheckbox, _super);
    function EwtCheckbox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtCheckbox.styles = [mwc_checkbox_css_1.styles];
    return EwtCheckbox;
}(mwc_checkbox_base_1.CheckboxBase));
exports.EwtCheckbox = EwtCheckbox;
customElements.define("ewt-checkbox", EwtCheckbox);

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
exports.EwtIconButton = void 0;
var mwc_icon_button_base_1 = require("@material/mwc-icon-button/mwc-icon-button-base");
var mwc_icon_button_css_1 = require("@material/mwc-icon-button/mwc-icon-button.css");
var EwtIconButton = /** @class */ (function (_super) {
    __extends(EwtIconButton, _super);
    function EwtIconButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtIconButton.styles = [mwc_icon_button_css_1.styles];
    return EwtIconButton;
}(mwc_icon_button_base_1.IconButtonBase));
exports.EwtIconButton = EwtIconButton;
customElements.define("ewt-icon-button", EwtIconButton);

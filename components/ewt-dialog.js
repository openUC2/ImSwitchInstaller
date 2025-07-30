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
exports.EwtDialog = void 0;
var mwc_dialog_base_1 = require("@material/mwc-dialog/mwc-dialog-base");
var mwc_dialog_css_1 = require("@material/mwc-dialog/mwc-dialog.css");
var lit_1 = require("lit");
var EwtDialog = /** @class */ (function (_super) {
    __extends(EwtDialog, _super);
    function EwtDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtDialog.styles = [
        mwc_dialog_css_1.styles,
        (0, lit_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      .mdc-dialog__title {\n        padding-right: 52px;\n      }\n    "], ["\n      .mdc-dialog__title {\n        padding-right: 52px;\n      }\n    "]))),
    ];
    return EwtDialog;
}(mwc_dialog_base_1.DialogBase));
exports.EwtDialog = EwtDialog;
customElements.define("ewt-dialog", EwtDialog);
var templateObject_1;

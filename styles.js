"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialogStyles = void 0;
var lit_1 = require("lit");
// We set font-size to 16px and all the mdc typography styles
// because it defaults to rem, which means that the font-size
// of the host website would influence the ESP Web Tools dialog.
exports.dialogStyles = (0, lit_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  :host {\n    --mdc-theme-primary: var(--improv-primary-color, #03a9f4);\n    --mdc-theme-on-primary: var(--improv-on-primary-color, #fff);\n    --improv-danger-color: #db4437;\n    --improv-text-color: rgba(0, 0, 0, 0.6);\n    --mdc-theme-text-primary-on-background: var(--improv-text-color);\n    --mdc-dialog-content-ink-color: var(--improv-text-color);\n    text-align: left;\n    font-size: 16px;\n    --mdc-typography-headline6-font-size: 1.25em;\n    --mdc-typography-headline6-line-height: 2em;\n    --mdc-typography-body1-font-size: 1em;\n    --mdc-typography-body1-line-height: 1.5em;\n    --mdc-typography-button-font-size: 0.875em;\n    --mdc-typography-button-line-height: 2.25em;\n    --mdc-typography-subtitle1-font-size: 1em;\n    --mdc-typography-subtitle1-line-height: 1.75em;\n  }\n\n  a {\n    color: var(--improv-primary-color, #03a9f4);\n  }\n\n  a.button {\n    text-decoration: none;\n  }\n"], ["\n  :host {\n    --mdc-theme-primary: var(--improv-primary-color, #03a9f4);\n    --mdc-theme-on-primary: var(--improv-on-primary-color, #fff);\n    --improv-danger-color: #db4437;\n    --improv-text-color: rgba(0, 0, 0, 0.6);\n    --mdc-theme-text-primary-on-background: var(--improv-text-color);\n    --mdc-dialog-content-ink-color: var(--improv-text-color);\n    text-align: left;\n    font-size: 16px;\n    --mdc-typography-headline6-font-size: 1.25em;\n    --mdc-typography-headline6-line-height: 2em;\n    --mdc-typography-body1-font-size: 1em;\n    --mdc-typography-body1-line-height: 1.5em;\n    --mdc-typography-button-font-size: 0.875em;\n    --mdc-typography-button-line-height: 2.25em;\n    --mdc-typography-subtitle1-font-size: 1em;\n    --mdc-typography-subtitle1-line-height: 1.75em;\n  }\n\n  a {\n    color: var(--improv-primary-color, #03a9f4);\n  }\n\n  a.button {\n    text-decoration: none;\n  }\n"])));
var templateObject_1;

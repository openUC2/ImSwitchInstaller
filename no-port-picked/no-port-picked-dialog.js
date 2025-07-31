"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
require("../components/ewt-dialog");
require("../components/ewt-button");
var styles_1 = require("../styles");
var cloudDownload = (0, lit_1.svg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <svg\n    version=\"1.1\"\n    id=\"Capa_1\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    x=\"0px\"\n    y=\"0px\"\n    viewBox=\"0 0 510.322 510.322\"\n    xml:space=\"preserve\"\n    style=\"width: 28px; vertical-align: middle;\"\n  >\n    <g>\n      <path\n        style=\"fill:currentColor;\"\n        d=\"M429.064,159.505c0-0.151,0.086-1.057,0.086-1.057c0-75.282-61.261-136.521-136.543-136.521    c-52.244,0-97.867,30.587-120.753,76.339c-11.67-9.081-25.108-15.682-40.273-15.682c-37.166,0-67.387,30.199-67.387,67.387    c0,0,0.453,3.279,0.798,5.824C27.05,168.716,0,203.423,0,244.516c0,25.389,9.901,49.268,27.848,67.171    c17.968,17.99,41.804,27.869,67.193,27.869h130.244v46.83h-54.66l97.694,102.008l95.602-102.008h-54.66v-46.83H419.25    c50.174,0,91.072-40.855,91.072-90.986C510.3,201.827,474.428,164.639,429.064,159.505z M419.207,312.744H309.26v-55.545h-83.975    v55.545H95.019c-18.184,0-35.333-7.075-48.211-19.996c-12.878-12.878-19.953-30.005-19.953-48.189    c0-32.68,23.21-60.808,55.264-66.956l12.511-2.394l-2.092-14.431l-1.488-10.785c0-22.347,18.184-40.51,40.531-40.51    c13.266,0,25.691,6.514,33.305,17.408l15.229,21.873l8.52-25.303c15.013-44.652,56.796-74.656,103.906-74.656    c60.506,0,109.709,49.203,109.709,109.644l-1.337,25.712l15.121,0.302l3.149-0.086c35.419,0,64.216,28.797,64.216,64.216    C483.401,283.969,454.604,312.744,419.207,312.744z\"\n      />\n    </g>\n  </svg>\n"], ["\n  <svg\n    version=\"1.1\"\n    id=\"Capa_1\"\n    xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    x=\"0px\"\n    y=\"0px\"\n    viewBox=\"0 0 510.322 510.322\"\n    xml:space=\"preserve\"\n    style=\"width: 28px; vertical-align: middle;\"\n  >\n    <g>\n      <path\n        style=\"fill:currentColor;\"\n        d=\"M429.064,159.505c0-0.151,0.086-1.057,0.086-1.057c0-75.282-61.261-136.521-136.543-136.521    c-52.244,0-97.867,30.587-120.753,76.339c-11.67-9.081-25.108-15.682-40.273-15.682c-37.166,0-67.387,30.199-67.387,67.387    c0,0,0.453,3.279,0.798,5.824C27.05,168.716,0,203.423,0,244.516c0,25.389,9.901,49.268,27.848,67.171    c17.968,17.99,41.804,27.869,67.193,27.869h130.244v46.83h-54.66l97.694,102.008l95.602-102.008h-54.66v-46.83H419.25    c50.174,0,91.072-40.855,91.072-90.986C510.3,201.827,474.428,164.639,429.064,159.505z M419.207,312.744H309.26v-55.545h-83.975    v55.545H95.019c-18.184,0-35.333-7.075-48.211-19.996c-12.878-12.878-19.953-30.005-19.953-48.189    c0-32.68,23.21-60.808,55.264-66.956l12.511-2.394l-2.092-14.431l-1.488-10.785c0-22.347,18.184-40.51,40.531-40.51    c13.266,0,25.691,6.514,33.305,17.408l15.229,21.873l8.52-25.303c15.013-44.652,56.796-74.656,103.906-74.656    c60.506,0,109.709,49.203,109.709,109.644l-1.337,25.712l15.121,0.302l3.149-0.086c35.419,0,64.216,28.797,64.216,64.216    C483.401,283.969,454.604,312.744,419.207,312.744z\"\n      />\n    </g>\n  </svg>\n"])));
var EwtNoPortPickedDialog = function () {
    var _classDecorators = [(0, decorators_js_1.customElement)("ewt-no-port-picked-dialog")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = lit_1.LitElement;
    var EwtNoPortPickedDialog = _classThis = /** @class */ (function (_super) {
        __extends(EwtNoPortPickedDialog_1, _super);
        function EwtNoPortPickedDialog_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EwtNoPortPickedDialog_1.prototype.render = function () {
            return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      <ewt-dialog\n        open\n        heading=\"No port selected\"\n        scrimClickAction\n        @closed=", "\n      >\n        <div>\n          If you didn't select a port because you didn't see your device listed,\n          try the following steps:\n        </div>\n        <ol>\n          <li>\n            Make sure that the device is connected to this computer (the one\n            that runs the browser that shows this website)\n          </li>\n          <li>\n            Most devices have a tiny light when it is powered on. If yours has\n            one, make sure it is on.\n          </li>\n          <li>\n            Make sure that the USB cable you use can be used for data and is not\n            a power-only cable.\n          </li>\n          <li>\n            Make sure you have the right drivers installed. Below are the\n            drivers for common chips used in ESP devices:\n            <ul>\n              <li>\n                CP2102 drivers:\n                <a\n                  href=\"https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows & Mac</a\n                >\n              </li>\n              <li>\n                CH342, CH343, CH9102 drivers:\n                <a\n                  href=\"https://www.wch.cn/downloads/CH343SER_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows</a\n                >,\n                <a\n                  href=\"https://www.wch.cn/downloads/CH34XSER_MAC_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Mac</a\n                >\n                <br />\n                (download via blue button with ", " icon)\n              </li>\n              <li>\n                CH340, CH341 drivers:\n                <a\n                  href=\"https://www.wch.cn/downloads/CH341SER_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows</a\n                >,\n                <a\n                  href=\"https://www.wch.cn/downloads/CH341SER_MAC_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Mac</a\n                >\n                <br />\n                (download via blue button with ", " icon)\n              </li>\n            </ul>\n          </li>\n        </ol>\n        ", "\n      </ewt-dialog>\n    "], ["\n      <ewt-dialog\n        open\n        heading=\"No port selected\"\n        scrimClickAction\n        @closed=", "\n      >\n        <div>\n          If you didn't select a port because you didn't see your device listed,\n          try the following steps:\n        </div>\n        <ol>\n          <li>\n            Make sure that the device is connected to this computer (the one\n            that runs the browser that shows this website)\n          </li>\n          <li>\n            Most devices have a tiny light when it is powered on. If yours has\n            one, make sure it is on.\n          </li>\n          <li>\n            Make sure that the USB cable you use can be used for data and is not\n            a power-only cable.\n          </li>\n          <li>\n            Make sure you have the right drivers installed. Below are the\n            drivers for common chips used in ESP devices:\n            <ul>\n              <li>\n                CP2102 drivers:\n                <a\n                  href=\"https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows & Mac</a\n                >\n              </li>\n              <li>\n                CH342, CH343, CH9102 drivers:\n                <a\n                  href=\"https://www.wch.cn/downloads/CH343SER_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows</a\n                >,\n                <a\n                  href=\"https://www.wch.cn/downloads/CH34XSER_MAC_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Mac</a\n                >\n                <br />\n                (download via blue button with ", " icon)\n              </li>\n              <li>\n                CH340, CH341 drivers:\n                <a\n                  href=\"https://www.wch.cn/downloads/CH341SER_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Windows</a\n                >,\n                <a\n                  href=\"https://www.wch.cn/downloads/CH341SER_MAC_ZIP.html\"\n                  target=\"_blank\"\n                  rel=\"noopener\"\n                  >Mac</a\n                >\n                <br />\n                (download via blue button with ", " icon)\n              </li>\n            </ul>\n          </li>\n        </ol>\n        ", "\n      </ewt-dialog>\n    "])), this._handleClose, cloudDownload, cloudDownload, this.doTryAgain
                ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n              <ewt-button\n                slot=\"primaryAction\"\n                dialogAction=\"close\"\n                label=\"Try Again\"\n                @click=", "\n              ></ewt-button>\n\n              <ewt-button\n                no-attention\n                slot=\"secondaryAction\"\n                dialogAction=\"close\"\n                label=\"Cancel\"\n              ></ewt-button>\n            "], ["\n              <ewt-button\n                slot=\"primaryAction\"\n                dialogAction=\"close\"\n                label=\"Try Again\"\n                @click=", "\n              ></ewt-button>\n\n              <ewt-button\n                no-attention\n                slot=\"secondaryAction\"\n                dialogAction=\"close\"\n                label=\"Cancel\"\n              ></ewt-button>\n            "])), this.doTryAgain) : (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n              <ewt-button\n                slot=\"primaryAction\"\n                dialogAction=\"close\"\n                label=\"Close\"\n              ></ewt-button>\n            "], ["\n              <ewt-button\n                slot=\"primaryAction\"\n                dialogAction=\"close\"\n                label=\"Close\"\n              ></ewt-button>\n            "]))));
        };
        EwtNoPortPickedDialog_1.prototype._handleClose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.parentNode.removeChild(this);
                    return [2 /*return*/];
                });
            });
        };
        return EwtNoPortPickedDialog_1;
    }(_classSuper));
    __setFunctionName(_classThis, "EwtNoPortPickedDialog");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EwtNoPortPickedDialog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = [
        styles_1.dialogStyles,
        (0, lit_1.css)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      li + li,\n      li > ul {\n        margin-top: 8px;\n      }\n      ul,\n      ol {\n        margin-bottom: 0;\n        padding-left: 1.5em;\n      }\n    "], ["\n      li + li,\n      li > ul {\n        margin-top: 8px;\n      }\n      ul,\n      ol {\n        margin-bottom: 0;\n        padding-left: 1.5em;\n      }\n    "]))),
    ];
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EwtNoPortPickedDialog = _classThis;
}();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;

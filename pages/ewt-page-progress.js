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
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("lit");
var decorators_js_1 = require("lit/decorators.js");
require("../components/ewt-circular-progress");
var EwtPageProgress = function () {
    var _a;
    var _classSuper = lit_1.LitElement;
    var _label_decorators;
    var _label_initializers = [];
    var _label_extraInitializers = [];
    var _progress_decorators;
    var _progress_initializers = [];
    var _progress_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(EwtPageProgress, _super);
            function EwtPageProgress() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.label = __runInitializers(_this, _label_initializers, void 0);
                _this.progress = (__runInitializers(_this, _label_extraInitializers), __runInitializers(_this, _progress_initializers, void 0));
                __runInitializers(_this, _progress_extraInitializers);
                return _this;
            }
            EwtPageProgress.prototype.render = function () {
                return (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <div>\n        <ewt-circular-progress\n          active\n          ?indeterminate=", "\n          .progress=", "\n          density=\"8\"\n        ></ewt-circular-progress>\n        ", "\n      </div>\n      ", "\n    "], ["\n      <div>\n        <ewt-circular-progress\n          active\n          ?indeterminate=", "\n          .progress=", "\n          density=\"8\"\n        ></ewt-circular-progress>\n        ", "\n      </div>\n      ", "\n    "])), this.progress === undefined, this.progress !== undefined
                    ? this.progress / 100
                    : undefined, this.progress !== undefined ? (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<div>", "%</div>"], ["<div>", "%</div>"])), this.progress) : "", this.label);
            };
            return EwtPageProgress;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _label_decorators = [(0, decorators_js_1.property)()];
            _progress_decorators = [(0, decorators_js_1.property)()];
            __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: function (obj) { return "label" in obj; }, get: function (obj) { return obj.label; }, set: function (obj, value) { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
            __esDecorate(null, null, _progress_decorators, { kind: "field", name: "progress", static: false, private: false, access: { has: function (obj) { return "progress" in obj; }, get: function (obj) { return obj.progress; }, set: function (obj, value) { obj.progress = value; } }, metadata: _metadata }, _progress_initializers, _progress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.styles = (0, lit_1.css)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    :host {\n      display: flex;\n      flex-direction: column;\n      text-align: center;\n    }\n    ewt-circular-progress {\n      margin-bottom: 16px;\n    }\n  "], ["\n    :host {\n      display: flex;\n      flex-direction: column;\n      text-align: center;\n    }\n    ewt-circular-progress {\n      margin-bottom: 16px;\n    }\n  "]))),
        _a;
}();
customElements.define("ewt-page-progress", EwtPageProgress);
var templateObject_1, templateObject_2, templateObject_3;

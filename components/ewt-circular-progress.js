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
exports.EwtCircularProgress = void 0;
var mwc_circular_progress_base_1 = require("@material/mwc-circular-progress/mwc-circular-progress-base");
var mwc_circular_progress_css_1 = require("@material/mwc-circular-progress/mwc-circular-progress.css");
var EwtCircularProgress = /** @class */ (function (_super) {
    __extends(EwtCircularProgress, _super);
    function EwtCircularProgress() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtCircularProgress.styles = [mwc_circular_progress_css_1.styles];
    return EwtCircularProgress;
}(mwc_circular_progress_base_1.CircularProgressBase));
exports.EwtCircularProgress = EwtCircularProgress;
customElements.define("ewt-circular-progress", EwtCircularProgress);

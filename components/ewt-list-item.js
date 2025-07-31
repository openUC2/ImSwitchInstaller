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
exports.EwtListItem = void 0;
var mwc_list_item_base_1 = require("@material/mwc-list/mwc-list-item-base");
var mwc_list_item_css_1 = require("@material/mwc-list/mwc-list-item.css");
var EwtListItem = /** @class */ (function (_super) {
    __extends(EwtListItem, _super);
    function EwtListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EwtListItem.styles = [mwc_list_item_css_1.styles];
    return EwtListItem;
}(mwc_list_item_base_1.ListItemBase));
exports.EwtListItem = EwtListItem;
customElements.define("ewt-list-item", EwtListItem);

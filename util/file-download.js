"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textDownload = exports.fileDownload = void 0;
var fileDownload = function (href, filename) {
    if (filename === void 0) { filename = ""; }
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent("click"));
    document.body.removeChild(a);
};
exports.fileDownload = fileDownload;
var textDownload = function (text, filename) {
    if (filename === void 0) { filename = ""; }
    var blob = new Blob([text], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    (0, exports.fileDownload)(url, filename);
    setTimeout(function () { return URL.revokeObjectURL(url); }, 0);
};
exports.textDownload = textDownload;

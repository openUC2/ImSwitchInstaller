"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineBreakTransformer = void 0;
var LineBreakTransformer = /** @class */ (function () {
    function LineBreakTransformer() {
        this.chunks = "";
    }
    LineBreakTransformer.prototype.transform = function (chunk, controller) {
        // Append new chunks to existing chunks.
        this.chunks += chunk;
        // For each line breaks in chunks, send the parsed lines out.
        var lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach(function (line) { return controller.enqueue(line + "\r\n"); });
    };
    LineBreakTransformer.prototype.flush = function (controller) {
        // When the stream is closed, flush any remaining chunks out.
        controller.enqueue(this.chunks);
    };
    return LineBreakTransformer;
}());
exports.LineBreakTransformer = LineBreakTransformer;

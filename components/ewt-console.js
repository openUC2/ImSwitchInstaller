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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EwtConsole = void 0;
var console_color_1 = require("../util/console-color");
var sleep_1 = require("../util/sleep");
var line_break_transformer_1 = require("../util/line-break-transformer");
var EwtConsole = /** @class */ (function (_super) {
    __extends(EwtConsole, _super);
    function EwtConsole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.allowInput = true;
        return _this;
    }
    EwtConsole.prototype.logs = function () {
        var _a;
        return ((_a = this._console) === null || _a === void 0 ? void 0 : _a.logs()) || "";
    };
    EwtConsole.prototype.connectedCallback = function () {
        var _this = this;
        if (this._console) {
            return;
        }
        var shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = "\n      <style>\n        :host, input {\n          background-color: #1c1c1c;\n          color: #ddd;\n          font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier,\n            monospace;\n          line-height: 1.45;\n          display: flex;\n          flex-direction: column;\n        }\n        form {\n          display: flex;\n          align-items: center;\n          padding: 0 8px 0 16px;\n        }\n        input {\n          flex: 1;\n          padding: 4px;\n          margin: 0 8px;\n          border: 0;\n          outline: none;\n        }\n        ".concat(console_color_1.coloredConsoleStyles, "\n      </style>\n      <div class=\"log\"></div>\n      ").concat(this.allowInput
            ? "<form>\n                >\n                <input autofocus>\n              </form>\n            "
            : "", "\n    ");
        this._console = new console_color_1.ColoredConsole(this.shadowRoot.querySelector("div"));
        if (this.allowInput) {
            var input_1 = this.shadowRoot.querySelector("input");
            this.addEventListener("click", function () {
                var _a;
                // Only focus input if user didn't select some text
                if (((_a = getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) === "") {
                    input_1.focus();
                }
            });
            input_1.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    ev.stopPropagation();
                    _this._sendCommand();
                }
            });
        }
        var abortController = new AbortController();
        var connection = this._connect(abortController.signal);
        this._cancelConnection = function () {
            abortController.abort();
            return connection;
        };
    };
    EwtConsole.prototype._connect = function (abortSignal) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Starting console read loop");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, this.port
                                .readable.pipeThrough(new TextDecoderStream(), {
                                signal: abortSignal,
                            })
                                .pipeThrough(new TransformStream(new line_break_transformer_1.LineBreakTransformer()))
                                .pipeTo(new WritableStream({
                                write: function (chunk) {
                                    _this._console.addLine(chunk.replace("\r", ""));
                                },
                            }))];
                    case 2:
                        _a.sent();
                        if (!abortSignal.aborted) {
                            this._console.addLine("");
                            this._console.addLine("");
                            this._console.addLine("Terminal disconnected");
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        e_1 = _a.sent();
                        this._console.addLine("");
                        this._console.addLine("");
                        this._console.addLine("Terminal disconnected: ".concat(e_1));
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, (0, sleep_1.sleep)(100)];
                    case 5:
                        _a.sent();
                        this.logger.debug("Finished console read loop");
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    EwtConsole.prototype._sendCommand = function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, command, encoder, writer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = this.shadowRoot.querySelector("input");
                        command = input.value;
                        encoder = new TextEncoder();
                        writer = this.port.writable.getWriter();
                        return [4 /*yield*/, writer.write(encoder.encode(command + "\r\n"))];
                    case 1:
                        _a.sent();
                        this._console.addLine("> ".concat(command, "\r\n"));
                        input.value = "";
                        input.focus();
                        try {
                            writer.releaseLock();
                        }
                        catch (err) {
                            console.error("Ignoring release lock error", err);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EwtConsole.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._cancelConnection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._cancelConnection()];
                    case 1:
                        _a.sent();
                        this._cancelConnection = undefined;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    EwtConsole.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Triggering reset.");
                        return [4 /*yield*/, this.port.setSignals({
                                dataTerminalReady: false,
                                requestToSend: true,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.port.setSignals({
                                dataTerminalReady: false,
                                requestToSend: false,
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return EwtConsole;
}(HTMLElement));
exports.EwtConsole = EwtConsole;
customElements.define("ewt-console", EwtConsole);

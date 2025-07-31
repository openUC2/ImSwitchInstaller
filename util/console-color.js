"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coloredConsoleStyles = exports.ColoredConsole = void 0;
var ColoredConsole = /** @class */ (function () {
    function ColoredConsole(targetElement) {
        this.targetElement = targetElement;
        this.state = {
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            foregroundColor: null,
            backgroundColor: null,
            carriageReturn: false,
            secret: false,
        };
    }
    ColoredConsole.prototype.logs = function () {
        return this.targetElement.innerText;
    };
    ColoredConsole.prototype.addLine = function (line) {
        var _this = this;
        var re = /(?:\033|\\033)(?:\[(.*?)[@-~]|\].*?(?:\007|\033\\))/g;
        var i = 0;
        if (this.state.carriageReturn) {
            if (line !== "\n") {
                // don't remove if \r\n
                this.targetElement.removeChild(this.targetElement.lastChild);
            }
            this.state.carriageReturn = false;
        }
        if (line.includes("\r")) {
            this.state.carriageReturn = true;
        }
        var lineSpan = document.createElement("span");
        lineSpan.classList.add("line");
        this.targetElement.appendChild(lineSpan);
        var addSpan = function (content) {
            if (content === "")
                return;
            var span = document.createElement("span");
            if (_this.state.bold)
                span.classList.add("log-bold");
            if (_this.state.italic)
                span.classList.add("log-italic");
            if (_this.state.underline)
                span.classList.add("log-underline");
            if (_this.state.strikethrough)
                span.classList.add("log-strikethrough");
            if (_this.state.secret)
                span.classList.add("log-secret");
            if (_this.state.foregroundColor !== null)
                span.classList.add("log-fg-".concat(_this.state.foregroundColor));
            if (_this.state.backgroundColor !== null)
                span.classList.add("log-bg-".concat(_this.state.backgroundColor));
            span.appendChild(document.createTextNode(content));
            lineSpan.appendChild(span);
            if (_this.state.secret) {
                var redacted = document.createElement("span");
                redacted.classList.add("log-secret-redacted");
                redacted.appendChild(document.createTextNode("[redacted]"));
                lineSpan.appendChild(redacted);
            }
        };
        while (true) {
            var match = re.exec(line);
            if (match === null)
                break;
            var j = match.index;
            addSpan(line.substring(i, j));
            i = j + match[0].length;
            if (match[1] === undefined)
                continue;
            for (var _i = 0, _a = match[1].split(";"); _i < _a.length; _i++) {
                var colorCode = _a[_i];
                switch (parseInt(colorCode)) {
                    case 0:
                        // reset
                        this.state.bold = false;
                        this.state.italic = false;
                        this.state.underline = false;
                        this.state.strikethrough = false;
                        this.state.foregroundColor = null;
                        this.state.backgroundColor = null;
                        this.state.secret = false;
                        break;
                    case 1:
                        this.state.bold = true;
                        break;
                    case 3:
                        this.state.italic = true;
                        break;
                    case 4:
                        this.state.underline = true;
                        break;
                    case 5:
                        this.state.secret = true;
                        break;
                    case 6:
                        this.state.secret = false;
                        break;
                    case 9:
                        this.state.strikethrough = true;
                        break;
                    case 22:
                        this.state.bold = false;
                        break;
                    case 23:
                        this.state.italic = false;
                        break;
                    case 24:
                        this.state.underline = false;
                        break;
                    case 29:
                        this.state.strikethrough = false;
                        break;
                    case 30:
                        this.state.foregroundColor = "black";
                        break;
                    case 31:
                        this.state.foregroundColor = "red";
                        break;
                    case 32:
                        this.state.foregroundColor = "green";
                        break;
                    case 33:
                        this.state.foregroundColor = "yellow";
                        break;
                    case 34:
                        this.state.foregroundColor = "blue";
                        break;
                    case 35:
                        this.state.foregroundColor = "magenta";
                        break;
                    case 36:
                        this.state.foregroundColor = "cyan";
                        break;
                    case 37:
                        this.state.foregroundColor = "white";
                        break;
                    case 39:
                        this.state.foregroundColor = null;
                        break;
                    case 41:
                        this.state.backgroundColor = "red";
                        break;
                    case 42:
                        this.state.backgroundColor = "green";
                        break;
                    case 43:
                        this.state.backgroundColor = "yellow";
                        break;
                    case 44:
                        this.state.backgroundColor = "blue";
                        break;
                    case 45:
                        this.state.backgroundColor = "magenta";
                        break;
                    case 46:
                        this.state.backgroundColor = "cyan";
                        break;
                    case 47:
                        this.state.backgroundColor = "white";
                        break;
                    case 40:
                    case 49:
                        this.state.backgroundColor = null;
                        break;
                }
            }
        }
        var atBottom = this.targetElement.scrollTop >
            this.targetElement.scrollHeight - this.targetElement.offsetHeight - 50;
        addSpan(line.substring(i));
        // Keep scroll at bottom
        if (atBottom) {
            this.targetElement.scrollTop = this.targetElement.scrollHeight;
        }
    };
    return ColoredConsole;
}());
exports.ColoredConsole = ColoredConsole;
exports.coloredConsoleStyles = "\n  .log {\n    flex: 1;\n    background-color: #1c1c1c;\n    font-family: \"SFMono-Regular\", Consolas, \"Liberation Mono\", Menlo, Courier,\n      monospace;\n    font-size: 12px;\n    padding: 16px;\n    overflow: auto;\n    line-height: 1.45;\n    border-radius: 3px;\n    white-space: pre-wrap;\n    overflow-wrap: break-word;\n    color: #ddd;\n  }\n\n  .log-bold {\n    font-weight: bold;\n  }\n  .log-italic {\n    font-style: italic;\n  }\n  .log-underline {\n    text-decoration: underline;\n  }\n  .log-strikethrough {\n    text-decoration: line-through;\n  }\n  .log-underline.log-strikethrough {\n    text-decoration: underline line-through;\n  }\n  .log-secret {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n  }\n  .log-secret-redacted {\n    opacity: 0;\n    width: 1px;\n    font-size: 1px;\n  }\n  .log-fg-black {\n    color: rgb(128, 128, 128);\n  }\n  .log-fg-red {\n    color: rgb(255, 0, 0);\n  }\n  .log-fg-green {\n    color: rgb(0, 255, 0);\n  }\n  .log-fg-yellow {\n    color: rgb(255, 255, 0);\n  }\n  .log-fg-blue {\n    color: rgb(0, 0, 255);\n  }\n  .log-fg-magenta {\n    color: rgb(255, 0, 255);\n  }\n  .log-fg-cyan {\n    color: rgb(0, 255, 255);\n  }\n  .log-fg-white {\n    color: rgb(187, 187, 187);\n  }\n  .log-bg-black {\n    background-color: rgb(0, 0, 0);\n  }\n  .log-bg-red {\n    background-color: rgb(255, 0, 0);\n  }\n  .log-bg-green {\n    background-color: rgb(0, 255, 0);\n  }\n  .log-bg-yellow {\n    background-color: rgb(255, 255, 0);\n  }\n  .log-bg-blue {\n    background-color: rgb(0, 0, 255);\n  }\n  .log-bg-magenta {\n    background-color: rgb(255, 0, 255);\n  }\n  .log-bg-cyan {\n    background-color: rgb(0, 255, 255);\n  }\n  .log-bg-white {\n    background-color: rgb(255, 255, 255);\n  }\n";

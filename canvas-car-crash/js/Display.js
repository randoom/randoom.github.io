define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Display = /** @class */ (function () {
        function Display() {
            this.canvasEl = document.createElement("canvas");
            this.canvas.width = 400;
            this.canvas.height = 600;
            document.body.appendChild(this.canvasEl);
            var temp = this.canvasEl.getContext("2d");
            if (!temp)
                throw "Can't get 2D context of canvas";
            this.context2d = temp;
        }
        Object.defineProperty(Display.prototype, "width", {
            get: function () {
                return this.canvasEl.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Display.prototype, "height", {
            get: function () {
                return this.canvasEl.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Display.prototype, "canvas", {
            get: function () {
                return this.canvasEl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Display.prototype, "context", {
            get: function () {
                return this.context2d;
            },
            enumerable: true,
            configurable: true
        });
        Display.prototype.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
        };
        return Display;
    }());
    exports.Display = Display;
});
//# sourceMappingURL=Display.js.map
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeyCodes;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["enter"] = 13] = "enter";
        KeyCodes[KeyCodes["up"] = 38] = "up";
        KeyCodes[KeyCodes["down"] = 40] = "down";
        KeyCodes[KeyCodes["left"] = 37] = "left";
        KeyCodes[KeyCodes["right"] = 39] = "right";
    })(KeyCodes = exports.KeyCodes || (exports.KeyCodes = {}));
    var Input = /** @class */ (function () {
        function Input(canvasEl) {
            var _this = this;
            this.hasTouch = "ontouchstart" in document.documentElement;
            this.keysDown = {};
            this.laneClicked = -1;
            window.onkeydown = function (e) {
                _this.keysDown[e.keyCode] = true;
                _this.laneClicked = -1;
            };
            window.onkeyup = function (e) {
                _this.keysDown[e.keyCode] = false;
            };
            if (this.hasTouch) {
                canvasEl.ontouchstart = function (e) {
                    var t = e.touches[0];
                    var x = t.pageX - canvasEl.offsetLeft;
                    _this.laneClicked = x < canvasEl.width / 2 ? 0 : 1;
                };
            }
            else {
                canvasEl.onmousedown = function (e) {
                    var x = e.pageX - canvasEl.offsetLeft;
                    _this.laneClicked = x < canvasEl.width / 2 ? 0 : 1;
                };
            }
        }
        Object.defineProperty(Input.prototype, "laneChangeRequested", {
            get: function () {
                if (this.keysDown[KeyCodes.left])
                    return 0;
                if (this.keysDown[KeyCodes.right])
                    return 1;
                if (this.laneClicked >= 0)
                    return this.laneClicked;
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        Input.prototype.isKeyDown = function (keyCode) {
            return this.keysDown[keyCode] === true;
        };
        return Input;
    }());
    exports.Input = Input;
});
//# sourceMappingURL=Input.js.map
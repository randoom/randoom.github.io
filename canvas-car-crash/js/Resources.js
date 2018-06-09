define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Resources = /** @class */ (function () {
        function Resources(finishedCallback) {
            this.rootPath = "./";
            this.resourcesToLoad = 0;
            this.images = {};
            this.sounds = {};
            this.finishedCallback = finishedCallback;
        }
        Resources.prototype.loadImage = function (name, fileName) {
            var _this = this;
            this.resourcesToLoad++;
            var img = this.images[name] = new Image();
            img.onload = function () { return _this.onResourceLoaded(); };
            img.src = this.rootPath + "images/" + fileName;
        };
        Resources.prototype.loadSound = function (name, fileName) {
            var sound = this.sounds[name] = new Audio(this.rootPath + "sounds/" + fileName);
            sound.load();
        };
        Resources.prototype.getImage = function (name) {
            return this.images[name];
        };
        Resources.prototype.playSound = function (name) {
            var sound = this.sounds[name];
            try {
                sound.load();
                sound.play();
            }
            catch (e) { /* ignored */ }
        };
        Resources.prototype.onResourceLoaded = function () {
            if (--this.resourcesToLoad === 0) {
                this.finishedCallback();
            }
        };
        return Resources;
    }());
    exports.Resources = Resources;
});
//# sourceMappingURL=Resources.js.map
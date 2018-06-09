var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./ObjectPool"], function (require, exports, ObjectPool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameObject = /** @class */ (function () {
        function GameObject() {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        return GameObject;
    }());
    var carStartSpeed = 0.4;
    var carEndSpeed = 1.0;
    var carAcceleration = 0.00075;
    var Road = /** @class */ (function (_super) {
        __extends(Road, _super);
        function Road(image, height) {
            var _this = _super.call(this) || this;
            _this.distance = 0;
            _this.image = image;
            _this.width = _this.image.width;
            _this.height = height;
            return _this;
        }
        Road.prototype.draw = function (context) {
            var segmentHeight = this.distance % this.image.height;
            if (segmentHeight > 0) {
                context.drawImage(this.image, 0, this.image.height - segmentHeight, this.width, segmentHeight, this.x, this.y, this.width, segmentHeight);
            }
            var drawnHeight = Math.floor(segmentHeight);
            while (drawnHeight < this.height) {
                segmentHeight = Math.min(this.image.height, this.height - drawnHeight);
                context.drawImage(this.image, 0, 0, this.width, segmentHeight, this.x, this.y + drawnHeight, this.width, segmentHeight);
                drawnHeight += this.image.height;
            }
        };
        return Road;
    }(GameObject));
    exports.Road = Road;
    var Car = /** @class */ (function (_super) {
        __extends(Car, _super);
        function Car(image) {
            var _this = _super.call(this) || this;
            _this.lane = 0;
            _this.speed = carStartSpeed;
            _this.image = image;
            _this.width = _this.image.width;
            _this.height = _this.image.height;
            return _this;
        }
        Car.prototype.draw = function (context) {
            context.drawImage(this.image, this.x, this.y);
        };
        Car.prototype.stop = function () {
            this.speed = 0;
        };
        Car.prototype.accelerate = function () {
            if (this.speed < carEndSpeed)
                this.speed += carAcceleration;
        };
        Car.prototype.resetSpeed = function () {
            this.speed = carStartSpeed;
        };
        Car.prototype.slowDown = function () {
            this.speed = (carStartSpeed + this.speed) / 2;
        };
        return Car;
    }(GameObject));
    exports.Car = Car;
    var Animation = /** @class */ (function (_super) {
        __extends(Animation, _super);
        function Animation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.image = null;
            _this.rowCount = 1;
            _this.colCount = 1;
            _this.elapsed = 0;
            _this.currentFrame = 0;
            _this.isAnimating = true;
            return _this;
        }
        Animation.prototype.setImage = function (image, rowCount, colCount) {
            this.image = image;
            this.rowCount = rowCount;
            this.colCount = colCount;
            this.width = this.image.width / this.colCount;
            this.height = this.image.height / this.rowCount;
        };
        Animation.prototype.update = function (dt) {
            this.elapsed += dt;
            this.currentFrame = this.elapsed / 20;
            if (this.currentFrame < 0 || this.currentFrame >= this.rowCount * this.colCount) {
                this.isAnimating = false;
            }
        };
        Animation.prototype.draw = function (context) {
            if (!this.isAnimating || !this.image)
                return;
            var animX = this.width * Math.floor(this.currentFrame % 5);
            var animY = this.height * Math.floor(this.currentFrame / 5);
            context.drawImage(this.image, animX, animY, this.width, this.height, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        };
        Animation.prototype.reset = function () {
            this.elapsed = 0;
            this.currentFrame = 0;
            this.isAnimating = true;
        };
        return Animation;
    }(GameObject));
    exports.Animation = Animation;
    var Obstacle = /** @class */ (function (_super) {
        __extends(Obstacle, _super);
        function Obstacle() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isVisible = true;
            _this.hasColided = false;
            _this.lane = 0;
            _this.image = null;
            _this.animation = null;
            // tslint:disable-next-line no-empty
            _this.onCollided = function () { };
            return _this;
        }
        Obstacle.prototype.setImage = function (image) {
            this.image = image;
            this.width = this.image.width;
            this.height = this.image.height;
        };
        Obstacle.prototype.startAnimation = function (animation) {
            if (this.animation) {
                this.animation.reset();
            }
            this.animation = animation;
            this.update(0);
        };
        Obstacle.prototype.update = function (dt) {
            if (this.animation) {
                this.animation.update(dt);
                this.animation.x = this.x + this.width / 2;
                this.animation.y = this.y + this.height / 2;
                if (!this.animation.isAnimating) {
                    ObjectPool_1.ObjectPool.release(this.animation);
                    this.animation = null;
                }
            }
        };
        Obstacle.prototype.draw = function (context) {
            var spriteSize = 64;
            if (this.isVisible && this.image) {
                context.drawImage(this.image, this.x, this.y);
            }
            if (this.animation) {
                this.animation.draw(context);
            }
        };
        Obstacle.prototype.reset = function () {
            if (this.animation) {
                ObjectPool_1.ObjectPool.release(this.animation);
                this.animation = null;
            }
            this.isVisible = true;
            this.hasColided = false;
        };
        return Obstacle;
    }(GameObject));
    exports.Obstacle = Obstacle;
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isVisible = false;
            return _this;
        }
        Menu.prototype.draw = function (context) {
            if (!this.isVisible)
                return;
            var menuItemText = "New Game";
            context.font = "30px Arial";
            context.fillStyle = "#f00";
            context.textAlign = "center";
            context.strokeStyle = "#fff";
            context.fillText(menuItemText, this.x, this.y);
            context.strokeText(menuItemText, this.x, this.y);
        };
        return Menu;
    }(GameObject));
    exports.Menu = Menu;
    var Hud = /** @class */ (function (_super) {
        __extends(Hud, _super);
        function Hud() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.score = 0;
            _this.lives = 0;
            return _this;
        }
        Hud.prototype.draw = function (context) {
            context.font = "bold 14px Arial";
            context.fillStyle = "#000";
            context.textBaseline = "bottom";
            context.strokeStyle = "#000";
            context.textAlign = "left";
            context.fillText("Score: " + this.score, this.x, this.y + this.height);
            context.textAlign = "right";
            context.fillText("Cars: " + this.lives, this.x + this.width, this.y + this.height);
        };
        return Hud;
    }(GameObject));
    exports.Hud = Hud;
});
//# sourceMappingURL=GameObjects.js.map
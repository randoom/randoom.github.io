define(["require", "exports", "./Resources", "./Input", "./Display", "./ObjectPool", "./GameObjects"], function (require, exports, Resources_1, Input_1, Display_1, ObjectPool_1, GameObjects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game(resources) {
            this.obstacles = [];
            this.lastFrameTime = null;
            this.obstacleMinY = 1000;
            this.bindedGameLoop = this.gameLoop.bind(this);
            this.resources = resources;
            this.display = new Display_1.Display();
            this.input = new Input_1.Input(this.display.canvas);
            this.menu = new GameObjects_1.Menu();
            this.menu.x = this.display.width / 2;
            this.menu.y = this.display.height / 2;
            this.hud = new GameObjects_1.Hud();
            this.hud.width = this.display.width;
            this.hud.height = 20;
            this.road = new GameObjects_1.Road(this.resources.getImage("road"), this.display.height - this.hud.height);
            this.road.y = this.hud.height;
            this.car = new GameObjects_1.Car(this.resources.getImage("car"));
        }
        Game.prototype.startNewGame = function () {
            this.hud.score = 0;
            this.hud.lives = 3;
            this.car.resetSpeed();
            this.car.lane = 0;
            for (var i = 0; i < this.obstacles.length; i++) {
                ObjectPool_1.ObjectPool.release(this.obstacles[i]);
            }
            this.obstacles.length = 0;
            this.lastFrameTime = null;
        };
        Game.prototype.gameLoop = function (t) {
            requestAnimationFrame(this.bindedGameLoop);
            if (!this.lastFrameTime)
                this.lastFrameTime = t;
            var dt = t - this.lastFrameTime;
            this.update(dt);
            this.draw();
            this.lastFrameTime = t;
        };
        Game.prototype.update = function (dt) {
            if (this.hud.lives > 0) {
                if (this.input.laneChangeRequested >= 0) {
                    this.car.lane = this.input.laneChangeRequested;
                }
                this.car.x = this.laneToX(this.car.lane, this.car.width);
                this.car.y = this.road.y + this.road.height - this.car.height * 1.25;
                this.car.accelerate();
            }
            else {
                if (this.input.isKeyDown(Input_1.KeyCodes.enter)) {
                    this.startNewGame();
                    this.menu.isVisible = false;
                }
            }
            this.road.distance += dt * this.car.speed;
            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                obstacle.update(dt);
                obstacle.y += dt * this.car.speed;
            }
            this.generateObstacles();
            this.checkCollisions();
        };
        Game.prototype.draw = function () {
            this.display.clear();
            this.display.context.save();
            this.display.context.beginPath();
            this.display.context.rect(this.road.x, this.road.y, this.road.width, this.road.height);
            this.display.context.clip();
            this.road.draw(this.display.context);
            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                obstacle.draw(this.display.context);
            }
            this.car.draw(this.display.context);
            this.display.context.restore();
            this.menu.draw(this.display.context);
            this.hud.draw(this.display.context);
        };
        Game.prototype.checkCollisions = function () {
            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                if (!obstacle.hasColided && obstacle.lane === this.car.lane &&
                    (obstacle.y + obstacle.height > this.car.y) &&
                    (obstacle.y < this.car.y + this.car.height)) {
                    obstacle.hasColided = true;
                    obstacle.onCollided(this, obstacle);
                }
            }
        };
        Game.prototype.generateObstacles = function () {
            var random = Math.random() * 200;
            if (random < this.obstacleMinY - this.car.height) {
                this.createObstacle();
            }
            this.obstacleMinY = 1000;
            var toRemove = [];
            for (var i = 0; i < this.obstacles.length; i++) {
                var obstacle = this.obstacles[i];
                this.obstacleMinY = Math.min(this.obstacleMinY, obstacle.y - obstacle.height);
                if (obstacle.y > this.road.y + this.road.height) {
                    toRemove.push(i);
                }
            }
            this.hud.score += toRemove.length * 10;
            this.removeObstacles(toRemove);
        };
        Game.prototype.removeObstacles = function (indexes) {
            indexes.reverse();
            for (var i = 0; i < indexes.length; i++) {
                var obstacle = this.obstacles.splice(indexes[i], 1)[0];
                ObjectPool_1.ObjectPool.release(obstacle);
                // obstacle.reset();
            }
        };
        Game.prototype.createObstacle = function () {
            var obstacle = ObjectPool_1.ObjectPool.get(GameObjects_1.Obstacle);
            var typeRandom = Math.random();
            if (typeRandom < 0.1) {
                obstacle.setImage(this.resources.getImage("dirt"));
                obstacle.onCollided = Game.onDirtCollided;
            }
            else if (typeRandom < 0.3) {
                obstacle.setImage(this.resources.getImage("money"));
                obstacle.onCollided = Game.onMoneyCollided;
            }
            else {
                obstacle.setImage(this.resources.getImage("wall"));
                obstacle.onCollided = Game.onWallCollided;
            }
            obstacle.lane = Math.random() > 0.5 ? 0 : 1;
            obstacle.x = this.laneToX(obstacle.lane, obstacle.width);
            obstacle.y = this.road.y - obstacle.height;
            this.obstacles.push(obstacle);
        };
        Game.onWallCollided = function (game, obstacle) {
            obstacle.isVisible = false;
            game.resources.playSound("explosion");
            var animation = ObjectPool_1.ObjectPool.get(GameObjects_1.Animation);
            animation.setImage(game.resources.getImage("explosion"), 5, 5);
            obstacle.startAnimation(animation);
            game.hud.lives--;
            if (game.hud.lives > 0) {
                game.car.resetSpeed();
            }
            else {
                game.car.stop();
                game.menu.isVisible = true;
            }
        };
        Game.onDirtCollided = function (game) {
            game.car.slowDown();
        };
        Game.onMoneyCollided = function (game, obstacle) {
            obstacle.isVisible = false;
            game.hud.score += 50;
        };
        Game.prototype.laneToX = function (lane, width) {
            return (this.road.width * (0.5 + lane) - width) / 2;
        };
        Game.loadResources = function (resources) {
            resources.loadImage("car", "car.png");
            resources.loadImage("road", "road.jpg");
            resources.loadImage("wall", "wall.png");
            resources.loadImage("dirt", "dirt.png");
            resources.loadImage("money", "money.png");
            resources.loadImage("explosion", "explosion.png");
            resources.loadSound("explosion", "explosion.mp3");
        };
        Game.init = function () {
            var resources = new Resources_1.Resources(function () {
                var game = new Game(resources);
                game.startNewGame();
                requestAnimationFrame(game.bindedGameLoop);
            });
            this.loadResources(resources);
        };
        return Game;
    }());
    Game.init();
});
//# sourceMappingURL=Game.js.map
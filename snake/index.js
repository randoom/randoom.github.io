// @ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
var canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var square = 50;
var colCount = canvas.width / square;
var rowCount = canvas.height / square;

var LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40;

class Snake {
    constructor(colors, parts, direction, keys) {
        this.colors = colors;
        this.parts = parts;
        this.direction = direction;
        this.keys = keys;
        this.score = 0;
        this.mustGrowBy = 0;
    }

    get head() {
        return this.parts[this.parts.length - 1];
    }

    drawSnakePart(part, isHead) {
        context.fillStyle = isHead ? this.colors[0] : this.colors[1];
        context.fillRect(part.c * square, part.l * square, square, square);
    }

    draw() {
        for (var i in this.parts) {
            var part = this.parts[i];
            this.drawSnakePart(part, i == "" + (this.parts.length - 1));
        }
    }

    makeNewHead() {
        var newHead;
        if (this.direction == RIGHT) {
            newHead = {
                c: this.head.c + 1,
                l: this.head.l
            }
        }
        else if (this.direction == DOWN) {
            newHead = {
                c: this.head.c,
                l: this.head.l + 1
            }
        }
        else if (this.direction == LEFT) {
            newHead = {
                c: this.head.c - 1,
                l: this.head.l
            }
        }
        else if (this.direction == UP) {
            newHead = {
                c: this.head.c,
                l: this.head.l - 1
            }
        }

        if (newHead.c >= colCount) {
            newHead.c = 0;
        }

        if (newHead.l >= rowCount) {
            newHead.l = 0;
        }

        if (newHead.c < 0) {
            newHead.c = colCount - 1;
        }

        if (newHead.l < 0) {
            newHead.l = rowCount - 1;
        }

        return newHead;
    }

    advance() {
        var head = this.makeNewHead();

        this.parts.push(head);

        if (this.mustGrowBy > 0) {
            this.mustGrowBy = this.mustGrowBy - 1;
        } else {
            // delete tail
            this.parts.splice(0, 1);
        }
    }

    checkEatsTheApple() {
        if (this.head.c == apple.c && this.head.l == apple.l) {
            this.mustGrowBy = 2;
            this.score += this.parts.length;
            return true;
        }
        return false;
    }

    checkEatsHimself() {
        for (var i = 0; i < this.parts.length - 1; i++) {
            var part = this.parts[i];
            if (this.head.c == part.c && this.head.l == part.l) {
                return true;
            }
        }
        return false;
    }

    checkEatsSnake(snake) {
        for (var i = 0; i < snake.parts.length; i++) {
            var part = snake.parts[i];
            if (this.head.c == part.c && this.head.l == part.l) {
                return true;
            }
        }
        return false;
    }

    checkKey(keyCode) {
        if (keyCode == this.keys.left) {
            this.direction = LEFT;
        }
        else if (keyCode == this.keys.right) {
            this.direction = RIGHT;
        }
        else if (keyCode == this.keys.up) {
            this.direction = UP;
        }
        else if (keyCode == this.keys.down) {
            this.direction = DOWN;
        }
    }

    makeSmall() {
        this.parts.splice(0, this.parts.length - 2);
    }
}

var snakes;
var apple;
function newGame() {
    snakes = [
        new Snake(
            ['rgba(0, 200, 0, 0.7)', 'rgba(100, 200, 100, 0.7)'],
            [
                { c: 1, l: 1 },
                { c: 2, l: 1 }
            ],
            RIGHT,
            {
                left: 37,
                right: 39,
                up: 38,
                down: 40
            }),
        new Snake(
            ['rgba(0, 0, 200, 0.7)', 'rgba(100, 100, 200, 0.7)'],
            [
                { c: colCount - 2, l: rowCount - 2 },
                { c: colCount - 3, l: rowCount - 2 }
            ],
            LEFT,
            {
                left: 81,
                right: 68,
                up: 90,
                down: 83
            })
    ];

    apple = makeApple();
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(apple.c * square, apple.l * square, square, square);
}

function drawScore() {
    var scoreText = "";
    snakes.forEach((snake, i) => scoreText += "Score " + (i + 1) + ": " + snake.score + "   ")
    context.fillStyle = 'teal';
    context.font = '20px sans';
    context.fillText(scoreText, 2, 20);
}

function makeApple() {
    return {
        c: Math.round(Math.random() * (colCount - 1)),
        l: Math.round(Math.random() * (rowCount - 1))
    }
}

var timesCalled = 0;
function gameLoop(delta) {
    drawApple();
    snakes.forEach(snake => snake.draw());
    drawScore();

    if (timesCalled == 19) {
        snakes.forEach(snake => snake.advance());
        if (snakes.some(snake => snake.checkEatsTheApple())) {
            apple = makeApple();
        }
        snakes.filter(snake => snake.checkEatsHimself()).forEach(snake => snake.makeSmall());

        snakes.forEach(snake => {
            snakes.filter(snake2 => { return snake2 !== snake && snake2.checkEatsSnake(snake) }).
                forEach(snake3 => snake3.makeSmall());
        })
    }

    timesCalled = timesCalled + 1;
    if (timesCalled == 20) {
        timesCalled = 0;
    }
}

var lastTime = null;
function mainLoop(time) {

    var delta = 0;
    if (lastTime !== null) {
        delta = time - lastTime;
    }
    lastTime = time;

    context.clearRect(0, 0, canvas.width, canvas.height);

    gameLoop(delta);

    window.requestAnimationFrame(mainLoop);
}

newGame();
window.requestAnimationFrame(mainLoop);

window.onkeydown = function (e) {
    snakes.forEach(snake => snake.checkKey(e.keyCode));
}

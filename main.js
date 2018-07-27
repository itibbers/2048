var board = new Array();
var score = 0;

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	newGame();
});

function newGame() {
	// 初始化格子
	init();
	// 随机生成两个格子
	generateOneNumber();
	generateOneNumber();
}
function init() {
    // 格子位置
    for( var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            var boxCell = $('#box-cell-' + i + '-' + j);
            boxCell.css('top', getPosTop(i, j));
            boxCell.css('left', getPosLeft(i, j));
        }

    // 数组初始化及更新
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    updateBoardView();

    // 分数初始化及更新
    score = 0;
    updateScore(score);
}

// 生成格子
function generateOneNumber() {
    if (noSpace(board))
        return false;
    // 随机一个位置
    do {
        var randx = parseInt(Math.floor((Math.random() * 4)));
        var randy = parseInt(Math.floor((Math.random() * 4)));
        if (board[randx][randy] == 0)
            break;
    } while (true);
    // 随机一个数字
    var randNumber = Math.random() <= 0.5 ? 2 : 4;
    // 位置上显示数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber, 'generate');
    return true;
}

// 数组更新
function updateBoardView() {
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#box').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                // 无数据时样式
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                // 有数据时样式
                theNumberCell.css('width', '100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
    $('.number-cell').css('line-height', '100px');
    $('.number-cell').css('font-size', '40px');
}

// 获取事件
$(document).keydown(function (event) {
    switch (event.keyCode) {  // 注意大小写 keyCode
        case 37: // Left
            // console.log("Keydown Left success!");
            event.preventDefault();
            if (moveLeft()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 400);
            }
            break;
        case 38: // Up
            event.preventDefault();
            if (moveUp()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 400);
            }
            break;
        case 39: // Right
            event.preventDefault();
            if (moveRight()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 400);
            }
            break;
        case 40: // Down
            event.preventDefault();
            if (moveDown()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 400);
            }
            break;
        default:
            break;
    }
});
// 支持触摸
document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});
document.addEventListener('touchend', function (event) {

    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.1 * document.body.clientWidth && Math.abs(deltay) < 0.1 * document.body.clientWidth)
        return;
    if (Math.abs(deltax) >= Math.abs(deltay)) { // X
        if (deltax > 0) { // Right
            if (moveRight()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 250);
            }
        } else { // Left
            if (moveLeft()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 250);
            }
        }
    } else { // Y
        if (deltay > 0) { // Down
            if (moveDown()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 250);
            }
        } else { // Up
            if (moveUp()) {
                setTimeout(generateOneNumber(), 200);
                setTimeout(isGameOver(), 250);
            }
        }
    }
});

// 是否结束
function isGameOver() {
    if (noSpace(board) && noMove(board))
        gameOver();
}
function gameOver() {
    alert("Game Over!");
}

/* move function apart */

function moveLeft() {
    // 判断是否可以移动
    //console.log(canMoveLeft(board));
    if (!canMoveLeft(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                
                for (var k = j-1; k > 0; k--) {
                    if (board[i][k] != 0) {
                        break;
                    }
                }
                if (board[i][k] == board[i][j]) { // 有相等格子
                    showMoveAnimation(i, j, i, k);
                    //setTimeout(showNumberWithAnimation(i, k, board[i][k], 'add'), 190);
                    board[i][k] += board[i][j];
                    board[i][j] = 0;

                    score += board[i][k];
                    updateScore(score);
                } else if (board[i][k] != 0) { // 路上有没有格子，有
                    if (board[i][k + 1] == 0) { // 右边是否为空
                        showMoveAnimation(i, j, i, k + 1);
                        board[i][k + 1] = board[i][j];
                        board[i][j] = 0;
                    }
                }else{ // 路上没有格子
                    showMoveAnimation(i, j, i, k);
                    board[i][k] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}
function moveUp() {
    // 判断是否可以移动
    if (!canMoveUp(board))
        return false;
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {

                for (var k = i - 1; k > 0; k--) {
                    if (board[k][j] != 0) {
                        break;
                    }
                }
                if (board[k][j] == board[i][j]) { // 有相等格子
                    showMoveAnimation(i, j, k, j);
                    //setTimeout(showNumberWithAnimation(i, k, board[i][k], 'add'), 190);
                    board[k][j] += board[i][j];
                    board[i][j] = 0;

                    score += board[k][j];
                    updateScore(score);
                } else if (board[k][j] != 0) { // 路上有没有格子，有
                    if (board[k + 1][j] == 0) { // 右边是否为空
                        showMoveAnimation(i, j, k + 1, j);
                        board[k + 1][j] = board[i][j];
                        board[i][j] = 0;
                    }
                } else { // 路上没有格子
                    showMoveAnimation(i, j, k, j);
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}
function moveRight() {
    // 判断是否可以移动
    if (!canMoveRight(board))
        return false;
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {

                for (var k = j + 1; k < 3; k++) {
                    if (board[i][k] != 0) {
                        break;
                    }
                }
                if (board[i][k] == board[i][j]) { // 有相等格子
                    showMoveAnimation(i, j, i, k);
                    //setTimeout(showNumberWithAnimation(i, k, board[i][k], 'add'), 190);
                    board[i][k] += board[i][j];
                    board[i][j] = 0;

                    score += board[i][k];
                    updateScore(score);
                } else if (board[i][k] != 0) { // 路上有没有格子，有
                    if (board[i][k - 1] == 0) { // 右边是否为空
                        showMoveAnimation(i, j, i, k - 1);
                        board[i][k - 1] = board[i][j];
                        board[i][j] = 0;
                    }
                } else { // 路上没有格子
                    showMoveAnimation(i, j, i, k);
                    board[i][k] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}
function moveDown() {
    // 判断是否可以移动
    if (!canMoveDown(board))
        return false;
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {

                for (var k = i + 1; k < 3; k++) {
                    if (board[k][j] != 0) {
                        break;
                    }
                }
                if (board[k][j] == board[i][j]) { // 有相等格子
                    showMoveAnimation(i, j, k, j);
                    //setTimeout(showNumberWithAnimation(i, k, board[i][k], 'add'), 190);
                    board[k][j] += board[i][j];
                    board[i][j] = 0;

                    score += board[k][j];
                    updateScore(score);
                } else if (board[k][j] != 0) { // 路上有没有格子，有
                    if (board[k - 1][j] == 0) { // 右边是否为空
                        showMoveAnimation(i, j, k - 1, j);
                        board[k - 1][j] = board[i][j];
                        board[i][j] = 0;
                    }
                } else { // 路上没有格子
                    showMoveAnimation(i, j, k, j);
                    board[k][j] = board[i][j];
                    board[i][j] = 0;
                }

            }
        }
    }

    setTimeout("updateBoardView()", 200);
    return true;
}

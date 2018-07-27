function updateScore(score) {
    $('#score').text(score);
}
function showNumberWithAnimation(i, j, randNumber, animation) {
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);

    if (animation == 'generate') {
        numberCell.animate({
            width: 100,
            height: 100,
            top: getPosTop(i, j),
            left: getPosLeft(i, j)
        }, 200);
    }
    if (animation == 'add') {
        numberCell.animate({
            width: 120,
            height: 120,
            top: getPosTop(i, j) - 10,
            left: getPosLeft(i, j) - 10
        }, 160);
        numberCell.animate({
            width: 100,
            height: 100,
            top: getPosTop(i, j),
            left: getPosLeft(i, j)
        }, 40);
    }
    
}
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    },200);
}
const Phaser = require('phaser');

function getAngle(point1, point2, circle) {
    let v1x = point2.x - point1.x;
    let v1y = point2.y - point1.y;
    let v2x = circle.x - point1.x;
    let v2y = circle.y - point1.y;
    let dot = v1x * v2x + v1y * v2y;
    let cross = v1x * v2y - v1y * v2x;
    let angle = Math.atan2(cross, dot);
    if(angle < 0) {
        angle = Math.abs(angle);
    }
    return angle;
}

module.exports = getAngle;
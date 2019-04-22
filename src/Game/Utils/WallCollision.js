const Phaser = require('phaser');
const getAngle = require('../Utils/GetAngle');

function wallCollision(point1, point2, circle) {
    let angleA = getAngle(point1,point2,circle);
    let angleB = getAngle(point2,point1,circle);
    let distA = Math.sqrt((circle.x-point1.x) * (circle.x-point1.x) + (circle.y-point1.y) * (circle.y-point1.y));
    let distB = Math.sqrt((circle.x-point2.x) * (circle.x-point2.x) + (circle.y-point2.y) * (circle.y-point2.y));
    //console.log('Dist: ' + distA + ', ' + distB);
    //console.log('radius: ' + circle.radius);
    //console.log('Angle: ' + angleA + ', ' + angleB);
    //console.log(point1.x);


    if(angleA == angleB) {
        if((distA * Math.sin(angleA)) < circle.radius) {
            //console.log('c');
            return true;
        }
    }
    if(angleA > angleB) {
        if(angleA > Math.PI/2) {
            if(distA <= circle.radius) {
                //console.log('a');
                return true;
            }
            else {
                //console.log('b');
                return false;
            }
        }
        else if((distA * Math.sin(angleA)) < circle.radius) {
            //console.log('c');
            return true;
        }
        else {
            //console.log('d');
            return false;
        }
    }
    else if(angleB > angleA) {
        if(angleB > Math.PI/2) {
            if(distB <= circle.radius) {
                //console.log('e');
                return true;
            }
            else {
                //console.log('f');
                return false;
            }
        }
        else if((distB * Math.sin(angleB)) < circle.radius) {
            //console.log('g');
            return true;
        }
        else {
            //console.log('h');
            return false;
        }
    }
}

module.exports = wallCollision;
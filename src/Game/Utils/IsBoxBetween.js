const Phaser = require('phaser');

function isBoxBetween(p, e, r) {
    if (r.xmin == r.xmax) {    //check which side of the wall is short
        if ((e.x < r.xmin && r.xmin < p.x) || (p.x < r.xmin && r.xmin < e.x)) {
            let x = Math.abs(e.x - r.xmin);
            let y = x * Math.abs(Math.tan(Math.PI/2 - (e.angle * Math.PI / 180)));
            //console.log(y);
            if ((r.ymin < y) && (y < r.ymax)){
                //console.log('a');
                return true;
            }
            else{
                //console.log('b');
                return false;
            }
        }
        else {
            return false;
        }
    }

    if (r.ymin == r.ymax) {    //check which side of the wall is short
        if ((e.y < r.ymin && r.ymin < p.y) || (p.y < r.ymin && r.ymin < e.y)) {
            let y = Math.abs(e.y - r.ymin);
            let x = y / Math.abs(Math.tan(e.angle * Math.PI / 180));
            //console.log(x);
            if ((r.xmin < x) && (x < r.xmax)){
                //console.log('c');
                return true;
            }
            else{
                //console.log('d');
                return false;
            }
        }
        else {
            return false;
        }
    }
}

module.exports = isBoxBetween;
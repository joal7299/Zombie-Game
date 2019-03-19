const Phaser = require('phaser');

class HitRect {
  constructor(xmin,xmax,ymin,ymax) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
    
    this.baseGeo = [
        new Phaser.Geom.Point(this.xmin, this.ymin),
        new Phaser.Geom.Point(this.xmax, this.ymin),
        new Phaser.Geom.Point(this.xmax, this.ymax),
        new Phaser.Geom.Point(this.xmin, this.ymax),
        new Phaser.Geom.Point(this.xmin, this.ymin),
    ];
  }

    setSize(xmin, xmax, ymin, ymax) {
        this.xmin = xmin;
        this.ymin = ymin;
        this.xmax = xmax;
        this.ymax = ymax;
    }

    draw(graphics){
        graphics.strokeRect(this.xmin, this.ymin, this.xmax-this.xmin, this.ymax-this.ymin);
        //graphics.strokePoints(this.baseGeo);
    }
}

module.exports = HitRect;

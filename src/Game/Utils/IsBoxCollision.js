const Phaser = require('phaser');

function isBoxCollision(c, r) {
    if((c.x > r.xmin) && (c.x < r.xmax) && (c.y > r.ymin) && (c.y < r.ymax)) {
        return true;
    }
    
    if((c.x > r.xmin) && (c.x < r.xmax) && (c.y > r.ymin - c.radius) && (c.y < r.ymax + c.radius)) {
        return true;
    }

    if((c.x > r.xmin - c.radius) && (c.x < r.xmax + c.radius) && (c.y > r.ymin) && (c.y < r.ymax)) {
        return true;
    }
    
    if((c.x < r.xmin) && (c.y < r.ymin)) {
        const distSq = (c.x - r.xmin) * (c.x - r.xmin) + (c.y - r.ymin) * (c.y - r.ymin);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x > r.xmax) && (c.y < r.ymin)) {
        const distSq = (c.x - r.xmax) * (c.x - r.xmax) + (c.y - r.ymin) * (c.y - r.ymin);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x < r.xmin) && (c.y > r.ymax)) {
        const distSq = (c.x - r.xmin) * (c.x - r.xmin) + (c.y - r.ymax) * (c.y - r.ymax);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    if((c.x > r.xmax) && (c.y > r.ymax)) {
        const distSq = (c.x - r.xmax) * (c.x - r.xmax) + (c.y - r.ymax) * (c.y - r.ymax);
        const radiiSq = (c.radius * c.radius);
    
        return (distSq < radiiSq);
    }

    else {
        return false;
    }
}

module.exports = isBoxCollision;
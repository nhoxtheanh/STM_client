
var Topographic = ccui.Widget.extend({
    ctor: function(xPos, yPos, zOrder, scaleRate) {
        //this._super();
        zOrder = zOrder || 5;
        scaleRate = scaleRate || 0.831;
        this._img = new cc.Sprite(this.getFileName());
        this._img.setScale(scaleRate);
        this._img.attr({ x: xPos, y: yPos });
        this._img.setLocalZOrder(zOrder);

        this._isBlock = null;
    },

    getFileName: function() {
        return "";
    }
});

var Obstacle = Topographic.extend({
    ctor: function(xPos, yPos, zOrder, scaleRate) {
        this._super(xPos, yPos, zOrder, scaleRate);
        this._isBlock = true;
    },
});

// var Bush = Obstacle.extend({
//     getFileName: function() {
//         return battle_res.map_forest_obstacle_1;
//     }
// });
var Tree = Obstacle.extend({
    ctor: function(xPos, yPos, zOrder, scaleRate) {
        this._super(xPos, yPos, zOrder, scaleRate);
        this._isActacker = false;
    },
    getFileName: function() {
        return battle_res.map_forest_obstacle_2;
    }
});
var Rock = Obstacle.extend({
    ctor: function(xPos, yPos, zOrder, scaleRate) {
        this._super(xPos, yPos, zOrder, scaleRate);
        this._isActacker = false;
    },
    getFileName: function() {
        return battle_res.map_forest_obstacle_3;
    }
});
var Tower = Obstacle.extend({
    ctor: function(xPos, yPos, zOrder, scaleRate) {
        this._super(xPos, yPos-20, zOrder, scaleRate);
        this._isActacker = true;
        this._plist = tower_res.tower_ice_gun_attack_0_plist;
        this._png = tower_res.tower_ice_gun_attack_0_png;
        this._anim_plist = tower_res.tower_ice_gun_attack_0_anim_plist;
        cc.spriteFrameCache.addSpriteFrames(this._plist, this._png);
        cc.animationCache.addAnimations(this._anim_plist);

		this._fire_animation = cc.animationCache.getAnimation("fire");
        this._fire_animation.setLoops(-1);
		this._fire_action = cc.animate(this._fire_animation);
        this._fire_action.retain();
    },
    getFileName: function() {
        return battle_res.tower_ice_gun_idle_0_0023;
    },
    fire: function(x, y, thisLayer) {
        // do animation
        this._img.stopAction(this._fire_action);
        this._img.runAction(this._fire_action);

        // bullet move
        var bullet = cc.Sprite.create(tower_res.tower_ice_gun_bullet_0000);
        //bullet.setScale(scaleRate);
        bullet.attr({ x: this._img.getPositionX(), y: this._img.getPositionY() });
        bullet.setLocalZOrder(30);
        thisLayer.addChild(bullet);
        bullet.runAction(cc.sequence(cc.moveTo(0.1, x, y),
        cc.callFunc(()=>{thisLayer.removeChild(bullet,true)})));

        // explode bullet
        var spine_tower_ice = new sp.SkeletonAnimation(tower_res.tower_ice_fx_json, tower_res.tower_ice_fx_atlas);
        spine_tower_ice.setAnimation(0, 'attack_5', false);
        spine_tower_ice.setScale(0.5);
		spine_tower_ice.setPosition(cc.p(x, y));
        thisLayer.addChild(spine_tower_ice);
    }
});


// var Flat = Topographic.extend({
//     ctor: function() {
//         this._super();
//         this._isBlock = false;
//     },
// });

// var Ground = Flat.extend({
//     getFileName: function() {
//         return battle_res.map_decoration_grass_0000;
//     }
// });
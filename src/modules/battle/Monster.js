
var Monster = ccui.Widget.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {

        this._flyable = null;
        this._speed = 30;
        this._move_right_animation = null;
        this._move_left_animation = null;
        this._move_up_animation = null;
        this._move_down_animation = null;
        this._level = level;
        this._milestone = -1; // dấu mốc vị trí của quái theo GPM._mainPathCoord
        //this._maxHP = 1*this._level;
        //this._HP = this._maxHP;

        zOrder = zOrder || 10;
        scaleRate = scaleRate || 0.831;
        this._img = new cc.Sprite(this.getFileName());
        this._img.setScale(scaleRate*Math.pow(1.1,this._level));
        this._img.attr({ x: xPos, y: yPos });
        this._img.setLocalZOrder(zOrder);
    },

    getFileName: function() {
        return "";
    },

    moveUpTo: function(milestoneX, milestoneY) {    // đi một đoạn đường trong 1 giây để tiến gần về milestone
        currentPos = this._img.getPosition();
        deltaY = Math.min(1*this._speed, milestoneY - currentPos.y);    // tối đa chỉ đi đến milestone
        var newPos = cc.p(currentPos.x, currentPos.y + deltaY);
        this._img.runAction(cc.moveTo(1, newPos));
        if (newPos.y >= milestoneY) {
            this._milestone++; // reached milestone
        }
    },

    moveDownTo: function(milestoneX, milestoneY) {
        currentPos = this._img.getPosition();
        deltaY = Math.min(1*this._speed, currentPos.y - milestoneY);
        var newPos = cc.p(currentPos.x, currentPos.y - deltaY);
        this._img.runAction(cc.moveTo(1, newPos));
        if (newPos.y <= milestoneY) {
            this._milestone++; // reached milestone
        }
    },

    moveRightTo: function(milestoneX, milestoneY) {
        currentPos = this._img.getPosition();
        deltaX = Math.min(1*this._speed, milestoneX - currentPos.x); 
        var newPos = cc.p(currentPos.x + deltaX, currentPos.y);
        this._img.runAction(cc.moveTo(1, newPos));
        if (newPos.x >= milestoneX) {
            this._milestone++; // reached milestone
        }
    },

    moveLeftTo: function(milestoneX, milestoneY) {
        currentPos = this._img.getPosition();
        deltaX = Math.min(1*this._speed, currentPos.x - milestoneX); 
        var newPos = cc.p(currentPos.x - deltaX, currentPos.y);
        this._img.runAction(cc.sequence(
            cc.moveTo(1, newPos)
            // ,cc.CallFunc(function() {    // kiem tra neu quai da den milestone

            // }.bind(this))
        ));
        if (newPos.x <= milestoneX) {
            this._milestone++; // reached milestone
        }
    },

    // jumpRightTo: function(xPos, yPosg("jump")
    //     this._img.runAction(
    //         cc.sequence(cc.scaleBy(0.1, 1.2),
    //         cc.moveBy(0.5, this._speed*1/2, 40),
    //         cc.moveBy(0.5, this._speed*1/2, -40),
    //         cc.scaleBy(0.1, 0.8333))
    //         );
    // },

    getHit: function() {
        this._HP--;
        this._img.runAction(cc.sequence(cc.scaleBy(0.1, 0.9), cc.fadeOut(0.2), cc.fadeIn(0.2),cc.scaleBy(0.1, 1.1)));
    }
});

var WalkingMonster = Monster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._flyable = false;

        // cc.spriteFrameCache.addSpriteFrames(this._plist, this._png);
        // cc.animationCache.addAnimations(this._anim_plist);

		// this._move_down_animation = cc.animationCache.getAnimation("move_down");
        // this._move_down_animation.setLoops(-1);
		// this._move_down_action = cc.animate(this._move_down_animation);
        // this._move_down_action.retain();

        // this._move_right_animation = cc.animationCache.getAnimation("move_right");
        // this._move_right_animation.setLoops(-1);
		// this._move_right_action = cc.animate(this._move_right_animation);
        // this._move_right_action.retain();
        var anima = new Animation();
        var move_right_frames = [
            right.monster_assassin_run_0020,
            right.monster_assassin_run_0021,
            right.monster_assassin_run_0022,
            right.monster_assassin_run_0023,
            right.monster_assassin_run_0024,
            right.monster_assassin_run_0025,
            right.monster_assassin_run_0026,
            right.monster_assassin_run_0027,
            right.monster_assassin_run_0028,
            right.monster_assassin_run_0029,
        ];
        var move_down_frames = [
            down.monster_assassin_run_0000,
            down.monster_assassin_run_0001,
            down.monster_assassin_run_0002,
            down.monster_assassin_run_0003,
            down.monster_assassin_run_0004,
            down.monster_assassin_run_0005,
            down.monster_assassin_run_0006,
            down.monster_assassin_run_0007,
            down.monster_assassin_run_0008,
            down.monster_assassin_run_0009,
        ];
        this._move_right_action = anima.frameByFrame("move_right", move_right_frames, 1/right.length, 1);
        this._move_down_action = anima.frameByFrame("move_right", move_down_frames, 1/down.length, 1);
    },
    moveUpTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.runAction(this._move_down_action);
    },
    moveDownTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.runAction(this._move_down_action);
    },
    moveRightTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.runAction(this._move_right_action);
    },
    moveLeftTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.runAction(this._move_right_action);
    }
});

var Assassin = WalkingMonster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._plist = monster_res.assassin_plist;
        this._png = monster_res.assassin_png;
        this._anim_plist = monster_res.assassin_anim_plist;
        zOrder = zOrder || 20;
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._maxHP = 2*this._level;
        this._HP = this._maxHP;
        this._speed = 2*this._speed;
        this._type = 1;
    },
    getFileName: function() {
        return battle_res.monster_assassin_run_0000;
    }
});
var DarkGiant = WalkingMonster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._plist = monster_res.dark_giant_plist;
        this._png = monster_res.dark_giant_png;
        this._anim_plist = monster_res.dark_giant_anim_plist;
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._maxHP = 10*this._level;
        this._HP = this._maxHP;
        this._speed = 1*this._speed;
        this._type = 2;
    },
    getFileName: function() {
        return battle_res.monster_dark_giant_run_0000;
    }
});
var Iceman = WalkingMonster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._plist = monster_res.iceman_plist;
        this._png = monster_res.iceman_png;
        this._anim_plist = monster_res.iceman_anim_plist;
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._maxHP = 5*this._level;
        this._HP = this._maxHP;
        this._speed = 1.4*this._speed;
        this._type = 3;
    },
    getFileName: function() {
        return battle_res.monster_iceman_run_0000;
    }
});


var FlyingMonster = Monster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._flyable = true;

        cc.spriteFrameCache.addSpriteFrames(this._plist, this._png);
        cc.animationCache.addAnimations(this._anim_plist);

		this._move_down_animation = cc.animationCache.getAnimation("move_down");
        this._move_down_animation.setLoops(-1);
		this._move_down_action = cc.animate(this._move_down_animation);
        this._move_down_action.retain();

        this._move_right_animation = cc.animationCache.getAnimation("move_right");
        this._move_right_animation.setLoops(-1);
		this._move_right_action = cc.animate(this._move_right_animation);
        this._move_right_action.retain();
    },
    moveUpTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.stopAction(this._move_right_action);//////////////////////////////
        this._img.stopAction(this._move_down_action);//////////////////////////////
        this._img.runAction(this._move_down_action);
    },
    moveDownTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.stopAction(this._move_right_action);//////////////////////////////
        this._img.stopAction(this._move_down_action);//////////////////////////////
        this._img.runAction(this._move_down_action);
    },
    moveRightTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.stopAction(this._move_down_action);//////////////////////////////
        this._img.stopAction(this._move_right_action);//////////////////////////////
        this._img.runAction(this._move_right_action);
    },
    moveLeftTo: function(milestoneX, milestoneY) {
        this._super(milestoneX, milestoneY);
        this._img.stopAction(this._move_down_action);//////////////////////////////
        this._img.stopAction(this._move_right_action);//////////////////////////////
        this._img.runAction(this._move_right_action);
    }
});

var Bat = FlyingMonster.extend({
    ctor: function(level, xPos, yPos, scaleRate, zOrder) {
        this._plist = monster_res.bat_plist;
        this._png = monster_res.bat_png;
        this._anim_plist = monster_res.bat_anim_plist;
        zOrder = zOrder || 25;
        this._super(level, xPos, yPos, scaleRate, zOrder);
        this._maxHP = 1*this._level;
        this._HP = this._maxHP;
        this._speed = 2.2*this._speed;
        this._type = 4;
    },
    getFileName: function() {
        return battle_res.monster_bat_run_0000;
    }
});
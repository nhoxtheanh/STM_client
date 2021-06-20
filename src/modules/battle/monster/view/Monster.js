var Monster = ccui.Widget.extend({
    ctor: function () {
        this._super();
        this._speed = 30;
        this._milestone = -1; // dấu mốc vị trí của quái theo GPM._mainPathCoord
    },

    // <MARK: INIT>
    initData: function (level, pos, scaleRate, zOrder) {
        this._level = level;
        this._beginPos = pos;
        this._scale = scaleRate || MonsterConstant.SCALE_DEFAULT;
        this._zOrder = zOrder || MonsterConstant.Z_ORDER_DEFAULT;
        this._style = null; // walking, fly
        this._type = null;  // assassin,..
        this._initSprite();
    },

    _initSprite: function () {
        var filename = this._getFileName();
        this._img = new cc.Sprite(filename);
        this._img.setScale(this._scale * Math.pow(1.1,this._level));
        this._img.setLocalZOrder(this._zOrder);
        this.addChild(this._img);
        this.setPosition(this._beginPos);
    },

    // <MARK: GET>
    _getFileName: function () {
        return "";
    },

    _getSpriteFrameByAction: function (action) {
        return MonsterManager.getInstance().getSpriteFramesByTypeAndAction(this._type, action);
    },

    // <MARK: ACTION>
    moveTo: function (pos, action) {
        switch (action) {
            case MonsterAction.MOVE.UP:
                cc.log("up")
                this.moveUpTo(pos);
                break;
            case MonsterAction.MOVE.DOWN:
                cc.log("down")
                this.moveDownTo(pos)
                break;
            case MonsterAction.MOVE.LEFT:
                cc.log("left")
                this.moveLeftTo(pos);
                break;
            case MonsterAction.MOVE.RIGHT:
                cc.log("right")
                this.moveRightTo(pos);
                break;
        }
    },

    moveLeftTo: function (pos) {
        var currentPos = this.getPosition();
        var dx = Math.min(this._speed, currentPos.x - pos.x);
        var newPos = cc.p(currentPos.x - dx, currentPos.y);
        this.runAction(cc.sequence(cc.moveTo(1, newPos)));
        if (newPos.x <= pos.x) {
            this._milestone++; // reached milestone
        }

        // do animation
        var animate = MyAnimation.getInstance().frameByFrame(this._type + MonsterAction.MOVE.LEFT, this._getSpriteFrameByAction(MonsterAction.MOVE.LEFT), 0.05, 1);
        this._img.runAction(cc.sequence(
            animate
        ));
    },

    moveRightTo: function (pos) {
        var currentPos = this.getPosition();
        var dx = Math.min(this._speed, pos.x - currentPos.x);
        var newPos = cc.p(currentPos.x + dx, currentPos.y);
        this.runAction(cc.moveTo(1, newPos));
        if (newPos.x >= pos.x) {
            this._milestone++; // reached milestone
        }

        // do animation
        var animate = MyAnimation.getInstance().frameByFrame(this._type + MonsterAction.MOVE.RIGHT, this._getSpriteFrameByAction(MonsterAction.MOVE.RIGHT), 0.05, 1);
        this._img.runAction(cc.sequence(
            animate
        ));
    },

    moveUpTo: function (pos) {
        var currentPos = this.getPosition();
        var dy = Math.min(this._speed, pos.y - currentPos.y);
        var newPos = cc.p(currentPos.x, currentPos.y + dy);
        this._img.runAction(cc.moveTo(1, newPos));
        if (newPos.y >= pos.y) {
            this._milestone++;
        }

        // do animation
        var animate = MyAnimation.getInstance().frameByFrame(this._type + MonsterAction.MOVE.UP, this._getSpriteFrameByAction(MonsterAction.MOVE.UP), 0.05, 1);
        this._img.runAction(cc.sequence(
            animate
        ));
    },

    moveDownTo: function (pos) {
        var currentPos = this.getPosition();
        var dy = Math.min(this._speed, currentPos.y - pos.y);
        var newPos = cc.p(currentPos.x, currentPos.y - dy);
        this.runAction(cc.moveTo(1, newPos));
        if (newPos.y <= pos.t) {
            this._milestone++; // reached milestone
        }
        cc.log("dyyyyyy: " + dy)
        // do animation
        var animate = MyAnimation.getInstance().frameByFrame(this._type + MonsterAction.MOVE.DOWN, this._getSpriteFrameByAction(MonsterAction.MOVE.DOWN), 0.05, 1);
        this._img.runAction(
            animate
        );
    },
});

var WalkingMonster = Monster.extend({
    ctor: function () {
        this._super();
        this._style = MonsterStyle.WALKING;
    },
});

var Assassin = WalkingMonster.extend({
    ctor: function() {
        this._super();
        this._speed = 2 * this._speed;
        this._maxHP = 2*this._level;
        this._HP = this._maxHP;
        this._type = MonsterType.ASSASSIN;
    },

    _getFileName: function() {
        return battle_res.monster_assassin_run_0000;
    }
});
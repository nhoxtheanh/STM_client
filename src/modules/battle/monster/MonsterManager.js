var MonsterManager = cc.Class.extend({
   ctor: function () {
       this._initWithSpriteFrame();
   },

   _initWithSpriteFrame: function () {
        for (var i = 0; i < MonsterResource.length; i++) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(
                MonsterResource[i].plist,
                MonsterResource[i].png
            );
        }
   },

    getSpriteFramesByTypeAndAction: function (type, action) {
        var config = MonsterConfig[type];
        if (config) {
            var spriteFrames = config[action];
            if (spriteFrames) return spriteFrames;
        }

        return null;
    },

    createMonsterByType: function (type) {
        switch (type) {
            case MonsterType.ASSASSIN:
                return new Assassin();
        }
        return null;
    }
});

MonsterManager._instance = null;
MonsterManager.getInstance = function () {
    if (!MonsterManager._instance) {
        MonsterManager._instance = new MonsterManager();
    }
    return MonsterManager._instance;
}
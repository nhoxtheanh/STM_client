var MyAnimation = cc.Class.extend(
{
    /**
     * Frame by frame action (used for cc.Sprite)
     * @param {String} name Used for caching
     * @param {String[]} frames 
     * @param {Number} delay Delay time between 2 frames 
     * @param {Number} repeat Repeat times 
     */
    frameByFrame: function(name, frames, delay, repeat) {
        if (repeat === undefined) repeat = 1;
        if (delay === undefined) delay = 1 / 30;
        frames = frames || [];
        name = name || "";
        var animation = null;
        if (name) {
            animation = cc.animationCache.getAnimation(name);
        }
        if (!animation) {
            var spriteFrames = [];
            frames.forEach(function(frame) {
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frame);
                if (spriteFrame) {
                    spriteFrames.push(spriteFrame);
                }
            });
            if (repeat >= 0) {
                animation = new cc.Animation(spriteFrames, delay, repeat);
            } else {
                animation = new cc.Animation(spriteFrames, delay, 1);
            }
            cc.animationCache.addAnimation(animation, name);
        }
        var animate = new cc.Animate(animation);
        return repeat >= 0 ? animate : animate.repeatForever();
    },
});

MyAnimation._instance = null;
MyAnimation.getInstance = function () {
    if (!MyAnimation._instance) {
        MyAnimation._instance = new MyAnimation();
    }
    return MyAnimation._instance;
}
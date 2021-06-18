var BaseButton = ccui.Button.extend({
    text: null,
    icon: null,
    ctor: function(_background, _text, _icon, width, height){
        this._super(_background);
        this.setScale9Enabled(true);

        this.text =  cc.LabelTTF.create(_text, _b_getFontName(res.supercellmagic_ttf), 20);
        this.text.anchorX = 0.5;
        this.text.anchorY = 0.5;
        this.addChild(this.text, 10);

        if(_icon != null){
            this.icon = cc.Sprite.create(_icon);
            this.icon.setScale(0.45);
            this.text.addChild(this.icon, 10);
            this.icon.setPosition(-20, this.text.height/2);
        }
        this.setContentSize(width, height);
        this.text.setPosition(this.width/2, this.height/2);
        cc.log(this.height);
    }
});


var _b_getFontName = function(resource) {
    if (cc.sys.isNative) {
        return resource.srcs[0];
    } else {
        return resource.name;
    }
}
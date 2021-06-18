var TimedShopItemList = ShopItemList.extend({
    type: ShopItemListType.TimedShopItemList,
    renewTime: null,
    renewBg: null,
    renewText: null,
    ctor: function(_id, _items, _name, _renewTime){
        this._super(_id, _items, _name);
        this.renewTime = _renewTime;
        this.init_renewtext();
    },
    init_renewtext: function(){
        this.renewBg = cc.Sprite(res.SHOP_CATEGORY_REFRESH);
        this.addChild(this.renewBg, 5);
        this.renewBg.anchorY = 1;
        cc.log("timed");
        this.renewBg.setPosition(this.width/2, this.height - this.banner.height/2*0.25);
        this.renewText = cc.LabelTTF(this.getrenewText(), "Arial", 18);
        this.renewBg.addChild(this.renewText, 10);
        this.renewText.setPosition(this.renewBg.width/2, this.renewBg.height/2);

        var curTime = new Date();
        var dif = this.renewTime - curTime;
        if(dif < 0) dif = 0;
        dif = dif/1000;
        cc.log("dif time = " + Math.floor(dif) + 2);

        this.scheduleOnce(this.checkRenew, Math.floor(dif) + 2);
        this.schedule(this.changerenewText, 5);

    },
    getrenewText: function(){
        var t = new Date();
        var dif = this.renewTime - t;
  
        if(dif < 0) dif = 0;

        var day = Math.floor(dif/(1000*3600*24));
        dif -= day*1000*3600*24;
        var hour = Math.floor(dif/(1000*3600));
        dif -= hour*1000*3600;
        var minute = Math.floor(dif/(1000*60));
        var difTime;
        difTime = "Làm mới sau: " + hour.toString() + "h " + minute.toString() + "m";
        return difTime;
    },
    checkRenew: function(){
        cc.log("checkrenew");
        var t = new Date();
        var curTime = t.getTime();
        if(curTime >= this.renewTime){
            cc.log("send renew");
            testnetwork.connector.sendrenewTimedShopItemList(this.id);
        }
        return 0;
    },
    changerenewText: function(){
        this.renewText.string = this.getrenewText();
        cc.log("change renew text");
    },
    renew: function(time){
        this.renewTime = time;
        this.renewText.string = this.getrenewText();
        for(var i = 0; i < this.items.length; i++) this.items[i].reset();
    }
});
var ShopManager = cc.Class.extend({
    shop: null,
    ctor: function(){
    },
    createInstance: function(shopitemlist){
        this.shop = new Shop(shopitemlist);
    },
    getInstance: function(){
        if(this.shop == null) this.createInstance();
        return this.shop;
    }
});
var shopManager = new ShopManager();
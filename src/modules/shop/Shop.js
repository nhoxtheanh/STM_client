var lobbyCurrencyBarHeight = 200;

var Shop = cc.Layer.extend({
    list: null,
    padding: 10,
    curHeight: null,
    ctor: function(_list){
        this._super();
        this.list = _list;
        this.curHeight = 0;
        this.init();
    },
    init: function(){
        var list;
        for(var i = 0; i < this.list.length; i++){
            list = this.list[i];
            this.addChild(list);

            list.anchorX = 0.5;
            list.anchorY = 1;
            list.setScale((this.width - 2*this.padding)/list.width);
            list.setPosition(this.width/2, this.height - this.curHeight - this.padding - list.banner.height*(1-list.banner.anchorY)*list.scaleY - lobbyCurrencyBarHeight);
            this.curHeight += this.padding + (list.height + list.banner.height*(1-list.banner.anchorY))*list.scaleY;
            cc.log(list.y);
        }
    },
    getList: function(id){
        for(var i = 0; i < this.list.length; i++){
            if(this.list[i].id == id) return this.list[i];
        }
        return null;
    },
    getItem: function(id){
        for(var i = 0; i < this.list.length; i++){
            for(var j = 0; j < this.list[i].items.length; j++){
                if(this.list[i].items[j].id == id) return this.list[i].items[j];
            }
        }
        return null;
    }
});

var init_sampleShop = function(){
    items = [];
    items.push(new ShopItemChest(1, 0, CurrencyID.Gold, 1, 500, 1000, 10, 20, [0,1 ,2, 3]));
    items.push(new ShopItemCard(2, 500, CurrencyID.Gold, 1, 0, 30));
    items.push(new ShopItemGold(3, 10, CurrencyID.G, 1, 2000));


    var list1 = new TimedShopItemList(1, items, res.SHOP_CATEGORY_DAILY, new Date(2021, 5, 14,   13, 51));

    items1 = [];
    items1.push(new ShopItemGold(4, 50, CurrencyID.G, 1000, 1000));
    items1.push(new ShopItemGold(5, 95, CurrencyID.G, 1000, 2000));
    items1.push(new ShopItemGold(6, 495, CurrencyID.G, 1000, 10000));

    var list2 = new ShopItemList(2, items1, res.SHOP_CATEGORY_GOLD);
    var list = [];
    list.push(list1);
    list.push(list2);

    
    shopManager.createInstance(list);
}
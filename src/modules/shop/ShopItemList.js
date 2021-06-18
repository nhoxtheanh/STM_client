var ShopItemListType = {
    ShopItemList: 0,
    TimedShopItemList: 1
}

var ShopItemList = ccui.Scale9Sprite.extend({
    items: null,
    type: ShopItemListType.ShopItemList,
    name: null,
    id: null,
    banner: cc.Node(),
    padding: 22, 
    items_per_row: 3,
    ctor: function(_id, _items, _name){
        this._super(res.SHOP_CATEGORY);
        this.id = _id;
        this.items = _items;
        this.name = _name;
        this.banner = cc.Sprite.create(res.SHOP_BANNER);
        this.init_items();
        this.init_banner();
    },
    init_banner: function(){
        this.addChild(this.banner, 10);

        this.name = new cc.Sprite(this.name);
        this.banner.addChild(this.name, 10);
        this.name.setPosition(this.banner.width/2, this.banner.height/2);
        this.banner.anchorY = 0.25;
        this.banner.setPosition(this.width/2, this.height);
        this.banner.setScale(this.width/this.banner.width);
    },
    init_items: function(){
        var item;
        width = (this.width - this.items_per_row*2*this.padding)/this.items_per_row;  
        for(var i = 0; i < this.items.length; i++){
            item = this.items[i];
            item.anchorY = 1;
            this.addChild(item, 10);
            item.setScale(width/item.width);
            item.setPosition((i+ 1/2)*width + (2*i + 1)*this.padding, this.height - this.banner.height/2 - this.padding + 20);
        }
    }
})
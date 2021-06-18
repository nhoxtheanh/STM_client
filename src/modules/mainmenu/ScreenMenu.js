/**
 * Created by GSN on 7/6/2015.
 */
 var shop;
var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        
        // gold = new Gold(20);
        // g = new G(0);
        // object = cc.Sprite.create(res.SHOP_ITEM_GOLD_1);

        // items = [];
        // items.push(new ShopItem(1, object, gold, res.SHOP_ITEM_GOLD_1));
        // items.push(new ShopItem(1, object, g, res.SHOP_ITEM_GOLD_2));
        // items.push(new ShopItem(1, object, gold, res.SHOP_ITEM_GOLD_3));


        // var list1 = new ShopItemList(1, items, res.SHOP_CATEGORY_GOLD);

        // items1 = [];
        // items1.push(new ShopItem(1, object, gold, res.SHOP_ITEM_GOLD_1));
        // items1.push(new ShopItem(1, object, gold, res.SHOP_ITEM_GOLD_2));
        // items1.push(new OnceShopItem(1, object, gold, res.SHOP_ITEM_GOLD_3));

        // var list2 = new TimedShopItemList(2, items1, res.SHOP_CATEGORY_GOLD, new Date(2021, 6, 5,   0, 0, 0, 0));
        // var list = [];
        // list.push(list1);
        // list.push(list2);

        
        // shop = new Shop(list);
        // this.addChild(shop);
        // shop.setScale(0.5);
        // shop.anchorY = 1;
        // shop.setPosition(size.width/2, size.height - 40);

        // var dialog = new BuyDialog("Mua vàng", gold, object, 400, 400);
        // this.addChild(dialog, 10);
        // dialog.setPosition(this.width/2, this.height/2);
        

        var yBtn = 3*size.height/5;

        var btnNetwork = gv.commonButton(200, 64, cc.winSize.width/4, yBtn,"Network");
        this.addChild(btnNetwork);
        btnNetwork.addClickEventListener(this.onSelectNetwork.bind(this));

        var btnLocalization = gv.commonButton(200, 64, cc.winSize.width/2, yBtn,"Localize");
        this.addChild(btnLocalization);
        btnLocalization.addClickEventListener(this.onSelectLocalization.bind(this));

        var btnDragonbones = gv.commonButton(200, 64, 3*cc.winSize.width/4, yBtn,"Dragonbone");
        this.addChild(btnDragonbones);
        btnDragonbones.addClickEventListener(this.onSelectDragonbones.bind(this));

    },
    onEnter:function(){
        this._super();
    },
    onSelectNetwork:function(sender)
    {
        fr.view(ScreenNetwork);
    },
    onSelectLocalization:function(sender)
    {
        fr.view(ScreenLocalization);
    },
    onSelectDragonbones:function(sender)
    {
        fr.view(ScreenDragonbones);
    }

});
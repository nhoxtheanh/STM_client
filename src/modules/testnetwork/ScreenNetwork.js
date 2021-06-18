/**
 * Created by GSN on 7/9/2015.
 */

var Direction =
{
    UP:1,
    DOWN:2,
    LEFT:3,
    RIGHT:4
};
var ScreenNetwork = cc.Layer.extend({
    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var yBtn = 2*size.height/3;

        var btnBack = gv.commonButton(200, 64, size.width - 120, 50,"Back");
        this.addChild(btnBack);
        btnBack.addClickEventListener(this.onSelectBack.bind(this));

        var btnLogin = gv.commonButton(200, 64, size.width/4, yBtn,"Login");
        this.addChild(btnLogin);
        btnLogin.addClickEventListener(this.onSelectLogin.bind(this));

        var btnDisconnect = gv.commonButton(200, 64, size.width/2, yBtn,"Disconnect");
        this.addChild(btnDisconnect);
        btnDisconnect.addClickEventListener(this.onSelectDisconnect.bind(this));

        var btnReconnect = gv.commonButton(200, 64, 3*size.width/4, yBtn,"Reconnect");
        this.addChild(btnReconnect);
        btnReconnect.addClickEventListener(this.onSelectReconnect.bind(this));

        this.lblLog = gv.commonText(fr.Localization.text("..."), size.width*0.4, size.height*0.05);
        this.addChild(this.lblLog);

        this.initGuiGame();
    },
    initGuiGame:function()
    {
        var size = cc.director.getVisibleSize();

        this._gameNode = new cc.Node();
        this._gameNode.setPosition(cc.p(size.width*0.4, size.height*0.4));
        this._gameNode.setVisible(false);
        this.addChild(this._gameNode);

        var btnLeft = gv.commonButton(64, 64, -80, 0,"<");
        this._gameNode.addChild(btnLeft);
        btnLeft.addClickEventListener(function()
        {
            testnetwork.connector.sendMove(Direction.LEFT);
        }.bind(this));

        var btnRight = gv.commonButton(64, 64, 80, 0,">");
        this._gameNode.addChild(btnRight);
        btnRight.addClickEventListener(function()
        {
            testnetwork.connector.sendMove(Direction.RIGHT);
        }.bind(this));
        var btnUp = gv.commonButton(64, 64, 0, 80,"<");
        btnUp.setRotation(90);
        this._gameNode.addChild(btnUp);
        btnUp.addClickEventListener(function()
        {
            testnetwork.connector.sendMove(Direction.UP);
        }.bind(this));
        var btnDown = gv.commonButton(64, 64, 0, -80,">");
        btnDown.setRotation(90);
        this._gameNode.addChild(btnDown);
        btnDown.addClickEventListener(function()
        {
            testnetwork.connector.sendMove(Direction.DOWN);
        }.bind(this));



    },
    onSelectBack:function(sender)
    {
        fr.view(ScreenMenu);
    },
    onSelectLogin:function(sender)
    {
        this.lblLog.setString("Start Connect!");
        gv.gameClient.connect();
    },
    onSelectDisconnect:function(sender)
    {
        this.lblLog.setString("Coming soon!");
    },
    onSelectReconnect:function(sender)
    {
        this.lblLog.setString("Coming soon!");
    },
    onConnectSuccess:function()
    {
        this.lblLog.setString("Connect Success!");
    },
    onConnectFail:function(text)
    {
        this.lblLog.setString("Connect fail: " + text);
    },
    onFinishLogin:function()
    {
        size = cc.director.getVisibleSize();


        items = [];
        items.push(new ShopItemGold(1, 100, CurrencyID.G, res.SHOP_ITEM_GOLD_1, 10, 1000));
        items.push(new ShopItemCard(1, 150, CurrencyID.G, res.CARD_BACKGROUND2, 10, 1, 30));
        items.push(new ShopItemGold(1, 200, CurrencyID.G, res.SHOP_ITEM_GOLD_3, 10, 1000));


        var list1 = new ShopItemList(1, items, res.SHOP_CATEGORY_GOLD);

        items1 = [];
        items1.push(new ShopItemChest(1, 0, CurrencyID.Gold, res.COMMON_TREASURE, 1, 500, 1000, 10, 20, [0,1 ,2]));
        items1.push(new ShopItemGold(1, 150, CurrencyID.G, res.SHOP_ITEM_GOLD_2, 10, 1000));
        items1.push(new ShopItemGold(1, 200, CurrencyID.G, res.SHOP_ITEM_GOLD_3, 10, 1000));

        var list2 = new TimedShopItemList(2, items1, res.SHOP_CATEGORY_GOLD, new Date(2021, 10, 5,   0, 0, 0, 0));
        var list = [];
        list.push(list1);
        list.push(list2);

        
        shop = new Shop(list);
        this.addChild(shop, 1000);
        shop.setScale(this.width/shop.width);
        shop.anchorY = 0.5;
        shop.anchorX = 0.5;
        shop.setPosition(this.width/2, this.height/2);



       // this.lblLog.setString("Finish login!");
        //this._gameNode.setVisible(true);
    },
    onUserInfo:function(userName, x, y)
    {
        this._gameNode.setVisible(true);
        this.lblLog.setString("Pos:" + x + "," + y);
    },
    updateMove:function(x, y)
    {
        this.lblLog.setString("Pos:" + x + "," + y);
    }

});
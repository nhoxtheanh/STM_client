var ShopItemGold = ShopItem.extend({
    amount: null,
    amountText: null,
    ctor: function(_id, _price, _CurrencyID, _maxBuy, _amount){
        var _thumbnail;
        if(_amount <= 1000) _thumbnail = res.SHOP_ITEM_GOLD_1;
        else if(_amount <= 2000) _thumbnail = res.SHOP_ITEM_GOLD_2;
        else _thumbnail = res.SHOP_ITEM_GOLD_3;

        this._super(_id, _price, _CurrencyID, _thumbnail, _maxBuy);
        this.amount = _amount;
        this.init_glow();

        this.amountText = cc.LabelTTF.create(this.amount.toString(), _b_getFontName(res.supercellmagic_ttf), 20);
        this.amountText.setPosition(this.width/2, this.height);
        this.amountText.anchorY = 1;
        this.addChild(this.amountText, 30);
    },
    init_glow: function(){
        glow = cc.Sprite(res.SHOP_ITEM_GLOW);
        this.thumbnail.addChild(glow, -10);
        glow.setPosition(this.thumbnail.width/2, this.thumbnail.height/2);
        glow.setScale(1.5);

    },
    openDialog: function(){
        var scene = fr.getCurrentScreen();
        this.dialog = new DialogBuyGold(this);
        scene.addChild(this.dialog, 100000);
        this.dialog.setBuyButton(this.price, this.CurrencyID);
        this.dialog.setCloseCallback(this.closeDialog);
        this.dialog.setBuyCallback(this.buy.bind(this));
        this.dialog.changeAmount(this.amount.toString());       

    }


});
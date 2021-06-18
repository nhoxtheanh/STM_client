var ShopItemChest = ShopItem.extend({
    minGold: null,
    maxGold: null,
    minCard: null,
    maxCard: null,
    cardType: null,
    nameText: null,
    ctor: function(_id, _price, _CurrencyID, _maxBuy, _minGold, _maxGold, _minCard, _maxCard, _cardType){
        var _thumbnail = res.COMMON_TREASURE;
        this._super(_id, _price, _CurrencyID, _thumbnail, _maxBuy);
        this.minGold = _minGold;
        this.maxGold = _maxGold;
        this.minCard = _minCard;
        this.maxCard = _maxCard;
        this.cardType = _cardType;

        this.nameText = cc.LabelTTF.create("Bạc", _b_getFontName(res.supercellmagic_ttf), 20);
        this.nameText.setPosition(this.width/2, this.height);
        this.nameText.anchorY = 1;
        this.addChild(this.nameText, 30);
    },
    openDialog: function(){
        var scene = fr.getCurrentScreen();
        this.dialog = new DialogBuyChest(this);
        scene.addChild(this.dialog, 100000);
        this.dialog.setBuyButton(this.price, this.CurrencyID);
        this.dialog.setCloseCallback(this.closeDialog);
        this.dialog.setBuyCallback(this.buy.bind(this));
        this.dialog.changeGoldRange(this.minGold.toString() + " - " + this.maxGold.toString());
        this.dialog.changeCardRange(this.minCard.toString() + " - " + this.maxCard.toString());
        // var scene = fr.getCurrentScreen();
        // cc.eventManager.pauseTarget(scene, true);

        // this.dialog = ccs.load(res.BUYCHEST_DIALOG);
        // this.dialog = this.dialog.node;
        // this.dialog.setVisible(true);

        // scene.addChild(this.dialog, 100000);
        
        // this.dialog.x = this.size.width/2;
        // this.dialog.y = this.size.height/2;
        // this.dialog.anchorX= 0.5;
        // this.dialog.anchorY= 0.5;
     
        // //this.dialog.setScale((shop.width - 2*shop.padding)/this.dialog.width);

        // var buttonBg, priceIcon, priceText;
        // if(this.CurrencyID == CurrencyID.G) {
        //     buttonBg = res.COMMON_BTN_GREEN;
        //     priceIcon = res.COMMON_ICON_G_SMALL;
        // }
        // else {
        //     buttonBg = res.COMMON_BTN_ORANGE;
        //     priceIcon = res.COMMON_ICON_GOLD_SMALL;
        // }

        // if(this.price <= 0){
        //     priceText = fr.Localization.text("lang_shopitem_free");
        //     priceIcon = null;
        // }   
        // else 
        //     priceText =  this.price.toString();

        // if(this.buyCount >= this.maxBuy){
        //     priceText = fr.Localization.text("lang_shopitem_bought");
        //     priceIcon = null;
        // }
        
        // button = this.dialog.getChildByName("BuyButton");
        // button_y = button.y;
        // this.dialog.removeChild(button);
        // button = new BaseButton(buttonBg, priceText, priceIcon, this.button.width, this.button_height);
        // this.dialog.addChild(button);
        // button.setPosition(scene.width/2, button_y);

        // button.addTouchEventListener(this.buy, this);


        // closeButton = this.dialog.getChildByName("CloseButton");
        // closeButton.addTouchEventListener(this.closeDialog, this);

        // goldrange = this.dialog.getChildByName("GoldRange");
        // goldrange.string = this.minGold.toString() + " - " + this.maxGold.toString();

        // cardrange = this.dialog.getChildByName("CardRange");
        // cardrange.string = this.minCard.toString() + " - " + this.maxCard.toString();

        // var background = this.dialog.getChildByName("PanelBackground");
    }
});
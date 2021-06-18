var ShopItemType = {
    Gold: 0,
    Gem: 1,
    Card: 2,
    Chest: 3,
}

ShopItem  = cc.Sprite.extend({
    id: null,
    itemType: null, //Gold, Gem Card or Chest
    price: null,
    CurrencyID: null,//Gold or Gem
    
    buyCount: 0,
    maxBuy: 10000,

    thumbnail: null,
    thumbnail_padding: 40,
    size: null,

    button: null,
    dialog: null,
    button_height: 60,
    ctor: function(_id, _price, _CurrencyID, _thumbnail, _maxBuy){
        this._super(res.SHOP_ITEM_BACKGROUND);
        this.id = _id;
        this.price = _price;
        this.CurrencyID = _CurrencyID;
        this.thumbnail = _thumbnail;
        this.maxBuy = _maxBuy;

        this.size = cc.director.getWinSize();
        this.init();
    },

    init: function(){
        this.init_button();
        this.init_thumbnail();
        //this.init_dialog();
    },
    init_button: function(){
        var buttonBg, priceIcon, priceText;
        if(this.CurrencyID == CurrencyID.G) {
            buttonBg = res.COMMON_BTN_GREEN;
            priceIcon = res.COMMON_ICON_G_SMALL;
        }
        else {
            buttonBg = res.COMMON_BTN_ORANGE;
            priceIcon = res.COMMON_ICON_GOLD_SMALL;
        }
        if(this.price <= 0){
            priceText = fr.Localization.text("lang_shopitem_free");
            priceIcon = null;
        }   
        else 
            priceText =  this.price.toString();

        if(this.buyCount >= this.maxBuy){
            priceText = fr.Localization.text("lang_shopitem_bought");
            priceIcon = null;
        }
        this.button = new BaseButton(res.COMMON_BTN_ORANGE, priceText, priceIcon, this.width, this.button_height);

        
        this.button.setPosition(this.width/2, 0);
        this.button.anchorX = 0.5;
        this.button.anchorY = 0;
        this.addChild(this.button);
        this.button.addClickEventListener(this.openDialog.bind(this));
    },
    init_thumbnail: function(){
        this.thumbnail = new cc.Sprite(this.thumbnail);
        this.thumbnail.setPosition(this.width/2, this.height/2 + this.button.height/2);
        this.addChild(this.thumbnail, 10);
        this.thumbnail.setScale((this.width - this.thumbnail_padding)/this.thumbnail.width);

    },
    setPrice: function(price, CurrencyID){
        this.price = price;
        this.CurrencyID = CurrencyID;
        this.removeChild(this.button);
        this.init_button();
    },

    openDialog: function(){
    },
    closeDialog: function(){
        var scene = fr.getCurrentScreen();
        this.dialog.setVisible(false);
        scene.removeChild(this.dialog);
    },
    checkBuy: function(){
        if(this.buyCount < this.maxBuy)
            return true;
    },
    buy: function(){
        var isBuyable = this.checkBuy();
        if(isBuyable == true){
            testnetwork.connector.sendShopBuy(this.id);
            this.buyCount++;
            
            if(this.buyCount >= this.maxBuy) 
                this.buyDone();
        }
    },
    buyDone: function(){
        this.removeChild(this.button);
        this.init_button();
        this.thumbnail.opacity = 120;
        this.bought = cc.Sprite.create(res.SHOP_ITEM_BOUGHT);
        this.thumbnail.addChild(this.bought, 10);
        this.bought.setPosition(this.thumbnail.width/2, this.thumbnail.height/2);
    },
    resetThumbnail: function(){
        if(this.buyCount == this.maxBuy){
            this.thumbnail.removeChild(this.bought);
            this.thumbnail.opacity = 255;
            this.removeChild(this.button);
            this.init_button();
        }
    },
    reset: function(){
        this.resetThumbnail();
        this.buyCount = 0;
    }
});

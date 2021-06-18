var ShopItemCard = ShopItem.extend({
    cardId: null,
    amount: null,
    amountText: null,
    ctor: function(_id, _price, _CurrencyID, _maxBuy, _cardId, _amount){
        var _thumbnail = res.CARD_BACKGROUND2;
        this._super(_id, _price, _CurrencyID, _thumbnail, _maxBuy);
        this.cardId = _cardId;
        this.amount = _amount;
        this.thumbnail.setScale((this.height - this.button_height - this.thumbnail_padding)/this.thumbnail.height);

        this.amountText = cc.LabelTTF.create("x" + this.amount.toString(), _b_getFontName(res.supercellmagic_ttf), 20);
        this.amountText.setPosition(this.thumbnail.width, this.button_height + this.thumbnail_padding);
        this.amountText.anchorY = 1;
        this.addChild(this.amountText, 30);
    },
    openDialog: function(){
        var scene = fr.getCurrentScreen();
        this.dialog = new DialogBuyCard(this);
        scene.addChild(this.dialog, 100000);
        this.dialog.setBuyButton(this.price, this.CurrencyID);
        this.dialog.setCloseCallback(this.closeDialog);
        this.dialog.setBuyCallback(this.buy.bind(this));
    }
})
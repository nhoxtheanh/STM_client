var Dialog = cc.Layer.extend({
    dialog: null,
    blackLayer: null,
    listener: null,
    ctor: function (jsonfile) {
        this._super();
        this.addBlackLayer(); // Add a black layer behide css
        this.loadCCS(jsonfile); // load cocos studio json file
        this.swallowTouches(); // Avoid user to tap behide the dialog
    },

    addBlackLayer: function () {
        var color = cc.color(0, 0, 0, 200);
        this.blackLayer = new cc.LayerColor(color, this.width, this.height);
        this.addChild(this.blackLayer, -1);
    },
    loadCCS: function(jsonfile){
        this.dialog = ccs.load(jsonfile);
        this.dialog = this.dialog.node;
        this.addChild(this.dialog, 2);
    },
    swallowTouches: function () {
        this.listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) { return true; },
            onTouchEnded: function (touch, event) {},
        }
        cc.eventManager.addListener(this.listener, this);
    },
    
});

var DialogOK = Dialog.extend({

    /**
     * Callback will be call when user tap OK button
     * @param {Function} callback 
     */
    setOKCallback: function (callback){},
});

var DialogYesNo = Dialog.extend({


    /**
     * Callback will be call when user tap Yes button
     * @param {Function} callback 
     */
     setYesCallback: function (callback){},

    /**
     * Callback will be call when user tap No button
     * @param {Function} callback 
     */
    setNoCallback: function (callback){},
});

var DialogBuy = Dialog.extend({
    _buyCallback: null,
    _closeCallback: null,
    _thumbnailCallback: null,
    _closeButton: null,
    _buyButton: null,
    _thumbnailButton: null,
    _shopitem: null,
    ctor: function(jsonfile, shopitem){
        this._super(jsonfile);
        this._shopitem = shopitem;
        this.initButton();
    },
    initButton: function(){
        this._closeButton = this.dialog.getChildByName("CloseButton");
        this._closeButton.addClickEventListener(this.onButtonCloseClicked.bind(this));

        this._buyButton = this.dialog.getChildByName("BuyButton");
        this._buyButton.addClickEventListener(this.onButtonBuyClicked.bind(this));

        this._thumbnailButton = this.dialog.getChildByName("Thumbnail");
        this._thumbnailButton.addClickEventListener(this.onButtonThumbnailClicked.bind(this));
    },
    setBuyButton: function(price, currencyID){
        var priceIcon, priceText;

        if(currencyID == CurrencyID.G) priceIcon = res.COMMON_ICON_G_SMALL;
        else priceIcon = res.COMMON_ICON_GOLD_SMALL;

        if(price <= 0){
            priceText = fr.Localization.text("lang_shopitem_free");
            priceIcon = null;
        }   
        else 
            priceText =  price.toString();

        this._buyButton = this.dialog.getChildByName("BuyButton");
        button_y = this._buyButton.y;

        this.dialog.removeChild(this._buyButton);
        this._buyButton = new BaseButton(res.COMMON_BTN_ORANGE, priceText, priceIcon, this._buyButton.width, this._buyButton.height);
        this.dialog.addChild(this._buyButton);
        this._buyButton.setPosition(this.dialog.width/2, button_y);
        this._buyButton.addClickEventListener(this.onButtonBuyClicked.bind(this));
    },
    onButtonCloseClicked: function(){
        cc.log("close");
        this.removeChild(this.blackLayer);
        cc.eventManager.removeListeners(this);

        if(this._closeCallback) this._closeCallback();
    },
    onButtonBuyClicked: function(){
        if(this._buyCallback) this._buyCallback();
    },
    onButtonThumbnailClicked: function(){
        if(this._thumbnailCallback) this._thumbnailCallback();
    },

    /**
     * Callback will be call when user tap Close button
     * @param {Function} callback 
     */
    setCloseCallback: function (callback){
        this._closeCallback = callback;
    },

    /**
     * Callback will be call when user tap Buy button
     * @param {Function} callback 
     */
    setBuyCallback: function (callback){
        this._buyCallback = callback;
    },

    /**
     * Callback will be call when user tap thumbnail button
     * @param {Function} callback 
     */
     setThumbnailCallback: function (callback){
        this._thumbnailCallback = callback;
     },
});

var DialogBuyGold = DialogBuy.extend({
    toolTip: null,
    amount: null,
    ctor: function(shopitem){
        this._super(res.BUYGOLD_DIALOG, shopitem);
        this.toolTip = this.dialog.getChildByName("Tooltip");
        this.toolTip.setVisible(false);
        this.setThumbnailCallback(this.showTooltip);
        this.amount = this.dialog.getChildByName("Amount");
    },
    showTooltip: function(){
        this.toolTip.setVisible(!this.toolTip.visible);

    },
    changeAmount: function(amount){
        this.amount.string = amount;
    }
});

var DialogBuyChest = DialogBuy.extend({
    goldRange: null,
    cardRange: null,
    cardType: null,
    ctor: function(shopitem){
        this._super(res.BUYCHEST_DIALOG, shopitem);
        this.goldRange = this.dialog.getChildByName("GoldRange");
        this.cardRange = this.dialog.getChildByName("CardRange");
        this.cardType = this.dialog.getChildByName("CardType");
    },
    changeGoldRange: function(goldRange){
        this.goldRange.string = goldRange;
    },
    changeCardRange: function(cardRange){
        this.cardRange.string = cardRange;
    }
});

var DialogBuyCard = DialogBuy.extend({
    progessBar: null,
    progressText: null,
    progressCard: null,
    title: null,
    amount: null,
    ctor: function(shopitem){
        this._super(res.BUYCARD_DIALOG, shopitem);
        this.title = this.dialog.getChildByName("Title");
        this.progessBar = this.dialog.getChildByName("ProgressBar");
        this.progressText = this.dialog.getChildByName("EvolutionProgress");
        this.progressCard = this.dialog.getChildByName("CardProgess");

    },
})

var DialogLogin = Dialog.extend({
    progessBar: null,
    progressText: null,
    progressCard: null,
    title: null,
    amount: null,
    ctor: function(jsonfile){
        this._super(jsonfile);
        var size = cc.director.getVisibleSize();
        this.dialog.attr({x: size.width/2 , y: size.height/2});
    },
    setText: function(text) {
        var label = this.dialog.getChildByName("dialogText");
        label.setString(text);
    }
})



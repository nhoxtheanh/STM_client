/**
 * Created by GSN on 7/9/2015.
 */

var cardPerRow = 4;
var cardHeight = 380;

var Inventory = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {

        this._super();

        this.cardList = new CardList();
        this.battleCardList = new BattleCardList();
        this.toggleSort = true;
    },
    render: function() {

        var size = cc.director.getVisibleSize();

        var cardScreen = ccs.load(lobby_scene.card_layout);
        this.addChild(cardScreen.node);

        var totalScrollViewHeight = (this.cardList.getAmount() / cardPerRow) * cardHeight;

        this.cardList.setStartPosition(totalScrollViewHeight);
        this.cardList.showGUI();

        // scrollView 
        var scrollView = ccui.helper.seekWidgetByName(cardScreen.node, "ScrollView_1");        
        scrollView.setInnerContainerSize(cc.size(size.width, totalScrollViewHeight));
        scrollView.addChild(this.cardList);

        this.battleCardList.showGUI();
        this.addChild(this.battleCardList);

        // 
        var sortButton = cardScreen.node.getChildByName("followEnergyButton");
        sortButton.addTouchEventListener(this.onSortByEnergy.bind(this));
    },
    onSortByEnergy: function(sender, type) {

        if (type != ccui.Widget.TOUCH_ENDED) return;

        if (this.toggleSort)
            this.cardList.showByEnergy();
        else 
            this.cardList.showAsOriginal();
              
        this.toggleSort = !this.toggleSort;
    },
    onEnter:function(){
        this._super();
    },
    onRemoved:function()
    {
  
    },
    updateTest:function(dt)
    {
        
    },
    onSelectBack:function(sender)
    {
        fr.view(ScreenMenu);
    },
    onLogIn: function(sender) {
        // go to lobby
    }
});
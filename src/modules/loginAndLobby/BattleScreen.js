/**
 * Created by GSN on 7/9/2015.
 */


 var BattleScreen = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        this.chestBox = new ChestBox();
    },
    render: function() {


        var battleScreen = ccs.load("../res/BattleLayer.json");
        this.addChild(battleScreen.node);

        var btnBattle = ccui.helper.seekWidgetByName(battleScreen.node, "Button_16");
        btnBattle.addClickEventListener(this.onFindMatch.bind(this));

        this.addChild(this.chestBox);
        this.chestBox.showGUI();
    },
    onPressedButton: function(sender) {

        if (this.currentButton)
            this.currentButton.setOpacity(0);
        
        this.currentButton = sender;
        this.currentButton.setOpacity(255);
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
    onFindMatch: function(sender) {
        // go to BattleScene // Todo: thêm màn hình tìm trận
        fr.view(BattleScene);
    }
});
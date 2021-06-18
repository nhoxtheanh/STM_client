/**
 * Created by GSN on 7/9/2015.
 */

 var button_dict = {
    "PageButton1": 0,
    "PageButton2": 1,
    "PageButton3": 2,
    "PageButton4": -1,
    "PageButton5": -1,

};

var Lobby = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        
        this._super();

        // need to get from user info
        this.gold = 0;
        this.g = 0;
        
        this.battleScreen = new BattleScreen();
        this.inventory = new Inventory();
        init_sampleShop();
        this.shop = shopManager.getInstance();
        this.lobbyConfig = {};
        this.buttons = [];
        
        this.loadConfig();
        this.render();
        //this.schedule(this.updateTest);
    },
    render: function() {

        var lobbyView = ccs.load(lobby_scene.main_lobby);
        this.addChild(lobbyView.node);

        this.lobbyPageView = ccui.helper.seekWidgetByName(lobbyView.node, "PageView_2");
        this.lobbyPageView.addEventListener(this.pageViewEvent, this);

        this.lobbyPageView.insertPage(this.shop, 0);
        this.lobbyPageView.insertPage(this.inventory, 1);
        this.lobbyPageView.insertPage(this.battleScreen, 2);

        // should do this ?
        this.lobbyPageView.setTouchEnabled(true);

        // make sure each page scale correctly
        var pages = this.lobbyPageView.getPages();
        pages.forEach(page => {

            page.anchorX = 0;
            page.anchorY = 0;

            page.setScale(0.185, 0.68);
        });

        this.lobbyPageView.scrollToPage(2);

        this.battleScreen.render();
        this.inventory.render();

        // add event for button
        for (var i = 1; i <= 5; i++) {
            
            var name = "PageButton" + i;
            var button = ccui.helper.seekWidgetByName(lobbyView.node, name);

            button.addClickEventListener(this.onChangePage.bind(this));
            this.buttons.push(button);
        }

        this.currentButton = 2;

        // add Currency event
        var gButton = ccui.helper.seekWidgetByName(lobbyView.node, "gIncreaseButton");
        var goldButton = ccui.helper.seekWidgetByName(lobbyView.node, "goldIncreaseButton");

        this.gText = ccui.helper.seekWidgetByName(lobbyView.node, "gText");
        this.gText.setContentSize(100, 23);
        
        this.goldText = ccui.helper.seekWidgetByName(lobbyView.node, "goldText");
        this.goldText.setContentSize(100, 23);

        gButton.addTouchEventListener(this.onIncreaseG.bind(this));
        goldButton.addTouchEventListener(this.onIncreaseGold.bind(this));
    },
    onChangePage: function(sender, type) {

        var idx = button_dict[sender.name];
        if (this.currentButton == idx || idx == -1) {
            //console.log(sender.name);
            //console.log("Current Button");   
            return;
        }
        
        this.buttons[this.currentButton].setOpacity(0);
        sender.setOpacity(255);

        this.currentButton = idx;
        this.lobbyPageView.scrollToPage(idx);
    },
    updateTest:function(dt)
    {
        // if scroll => change current button

        /*var idx = this.lobbyPageView.getCurPageIndex();
        if (idx == this.currentButton) return;

        var button = this.buttons[idx];
        this.buttons[this.currentButton].setOpacity(0);
        button.setOpacity(255);
        this.currentButton = idx;*/
    },
    loadConfig: function() {

        cc.loader.loadJson("../res/lobbyConfig.json", function(error, data){
            this.lobbyConfig = data;
        }.bind(this));

    },
    onIncreaseGold: function(sender, type) {

        if (type != ccui.Widget.TOUCH_ENDED) return;

        this.gold += this.lobbyConfig.goldIncrease;
        this.goldText.setString(this.gold);
    },
    onIncreaseG: function(sender, type) {

        if (type != ccui.Widget.TOUCH_ENDED) return;

        this.g += this.lobbyConfig.gIncrease;
        this.gText.setString(this.g);
    },
    pageViewEvent: function(page_view, type)
  {
    if (type == ccui.PageView.EVENT_TURNING)
    {
      if (this.currentButton != page_view.getCurPageIndex())
      {

        this.buttons[this.currentButton].setOpacity(0);
        this.currentButton = page_view.getCurPageIndex();
        this.buttons[this.currentButton].setOpacity(255);

        /*this._current_page_index = page_view.getCurPageIndex();
        this.setActivePanelButtonByPageIndex(this._current_page_index);

        //update ui when scrolling
        this.updateUIForPageViewScrolling(page_view.getCurPageIndex());*/


      }
    }
    },


});
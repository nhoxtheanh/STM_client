var ChestBox = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        
        this._super();
        this.state = Math.floor(Math.random() * 4);
    },
    showGUI: function() {
   
        var BG = ccs.load(lobby_scene.chestbox);
        this.addChild(BG.node);

        for (var i = 1; i <= 4; i++) {

            var buttonNode = BG.node.getChildByName("Chest" + i);
            BG.node.removeChild(buttonNode);

            var pos = buttonNode.getPosition();

            var chest = new Chest();
            chest.setPosition(pos);

            this.addChild(chest);
            chest.showGUI();
        }
    }
});
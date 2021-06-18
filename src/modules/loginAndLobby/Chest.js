/**
 * Created by GSN on 7/9/2015.
 */


 var Chest = cc.Node.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        
        this._super();
        this.state = Math.floor(Math.random() * 4);
    },
    showGUI: function() {

        var name = "";
        switch (this.state) {
            case 0: name = lobby_scene.availabelchest; break;
            case 1: name = lobby_scene.emptychest; break;
            case 2: name = lobby_scene.timingchest; break;
            case 3: name = lobby_scene.openablechest; break;
        }

        var chest = ccs.load(name);
        this.addChild(chest.node);
    }
});
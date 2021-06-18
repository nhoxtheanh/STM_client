
 var Card = cc.Node.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();

        // those info need to load from server
        this.energy = Math.floor(Math.random() * 5 + 1);
        this.cardNumber = Math.floor(Math.random() * 15);
        this.upgradeNumber = 10;

        this.isMax = Math.floor(Math.random() * 5);
        if (this.isMax < 2) this.isMax = true;
        else this.isMax = false;
    },
    showGUI: function() {

        var card = ccs.load(lobby_scene.card);
        var node = card.node;
        node.anchorX = 0.5;
        node.anchorY = 0.5;

        this.addChild(node);

        var textNode = card.node.getChildByName("energyText");
        textNode.setString(this.energy);

        var progressBar = card.node.getChildByName("card_level_78");

        this.upgrade_effect = new sp.SkeletonAnimation(lobby_scene.cardUpgradeEffect.json, lobby_scene.cardUpgradeEffect.atlas);
        this.upgrade_effect.setPosition(progressBar.getPosition());
        this.upgrade_effect.setScaleX(progressBar.getScaleX());
        this.upgrade_effect.setScaleY(progressBar.getScaleY());
        
        this.upgrade_effect.setAnimation(0, 'card_upgrade_ready', true);
        this.upgrade_effect.setVisible(false);
        this.addChild(this.upgrade_effect);

        // must remove child and then add to update position ??
        this.progressText = card.node.getChildByName("progressText");
        node.removeChild(this.progressText);
        this.addChild(this.progressText);

        this.nProgressBar = card.node.getChildByName("progressBar");
        this.nProgressGlow = card.node.getChildByName("progressGlow");
        this.progressMax = card.node.getChildByName("progressMax");
        //this.progressMax.setVisible(false);
        
        this.initialScale = this.nProgressGlow.getScaleX();

        this.updateCardUI();
    },
    updateCardUI: function() {

        // this for testing

        if (this.isMax) {

            this.progressMax.setVisible(true);
            this.progressText.setString("MAX");

            return;
        }

        if (this.cardNumber < this.upgradeNumber) {
            
            this.upgrade_effect.setVisible(false);
        
            this.nProgressBar.setPercent(this.cardNumber / this.upgradeNumber * 100);
            this.nProgressGlow.anchorX = 0;
            this.nProgressGlow.anchorY = 0.5;
            this.nProgressGlow.setScaleX(this.initialScale * this.cardNumber / this.upgradeNumber);
            this.progressText.setString(this.cardNumber + "/" + this.upgradeNumber);

            return;
        }

        if (this.cardNumber >= this.upgradeNumber) {
            
            this.upgrade_effect.setVisible(true);
            this.progressText.setString(this.cardNumber + "/" + this.upgradeNumber);

            return;
        }

    },
    onPressedButton: function(sender) {

       
    },
    getSize: function() {
        return this.size;
    },
    onEnter:function(){
        this._super();
    }
});
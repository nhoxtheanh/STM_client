var startPosition = {
    x: 170.00, 
    y: 1450.00
};

var startPosition2 = {
    x: 170.00,
    y: 600
};

var distance = {
    x: 250,
    y: 350
};

function compare( a, b ) {
    if ( a.energy < b.energy ){
      return -1;
    }
    if ( a.energy > b.energy ){
      return 1;
    }
    return 0;
}

var CardList = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();

        this.cards = []; // will get from server
        for (var i = 0; i < 23; i++) this.cards.push(new Card()); // will get from server

        this.startPosition = startPosition;
    },
    showGUI: function() {

        for (var i = 0; i < this.cards.length; i++) {
            
            var card = this.cards[i];
            card.showGUI();
            this.addChild(card);

            /*var pos = {
                x: this.startPosition.x + (i % 4) * distance.x,
                y: this.startPosition.y - Math.floor(i / 4) * distance.y
            }
        
            card.setPosition(pos);*/
        }

        this.showAsOriginal();

    },
    showAsOriginal: function() {

        for (var i = 0; i < this.cards.length; i++) {

            var card = this.cards[i];

            var pos = {
                x: this.startPosition.x + (i % 4) * distance.x,
                y: this.startPosition.y - Math.floor(i / 4) * distance.y
            }
        
            card.setPosition(pos);
        }

    },
    showByEnergy: function() {

        var new_card = this.cards.slice(0);
        new_card.sort(compare);

        for (var i = 0; i < new_card.length; i++) {

            var card = new_card[i];

            var pos = {
                x: this.startPosition.x + (i % 4) * distance.x,
                y: this.startPosition.y - Math.floor(i / 4) * distance.y
            }
        
            card.setPosition(pos);
        }

    },
    setStartPosition: function(height) {

        this.startPosition = {
            x: this.startPosition.x,
            y: height - distance.y/2
        };
        
    },
    getAmount: function() {
        return this.cards.length;
    },
    onPressedButton: function(sender) {

    }
});

var BattleCardList = CardList.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();

        this.cards = []; // will get from server
        for (var i = 0; i < 8; i++) this.cards.push(new Card()); // will get from server
    },
    onPressedButton: function(sender) {
        
    }
});
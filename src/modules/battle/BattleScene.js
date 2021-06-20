
var BattleScene = cc.Scene.extend({
	
	ctor:function () 
	{
        this._super();
        var main_layer = new Battle();
		this.addChild(main_layer);
    },
	
});

var Battle = cc.Layer.extend({
    SCALE_RATE: 1.45,
	_battle_ui: null,
    _cellsPerRow: 7,
    _cellsPerCol: 5,
    _map_cells_player: [],
    _map_cells_enemy: [],
    _player_house: null,
    _enemy_house: null,
    _pathCells: [], // mảng chứa các ô của đường đi
    scrSize: null,
    _GPM: null,
	
    ctor:function () 
	{
        this._super();
        this.init();
    },
	
    init:function () 
	{
		//set name for this instance
		this.setName("BattleLayer_" + ((Math.random()*100)>>0));
        
        // load background từ json
		var json_battle = ccs.load(battle_scene_res.battle_scene_json);
		this._battle_ui = json_battle.node;
		this.addChild(this._battle_ui);
		this._totalCellsPerMap = this._cellsPerRow*this._cellsPerCol;
        this.scrSize = cc.director.getVisibleSize();
    
    },
	
	onEnter: function()
	{
		this._super();
		cc.log("Battle - onEnter()");
        this.initTheGame();

		this.scheduleUpdate(); //schedule call function update() each frame
	},

    update:function (dt)
	{
       //cc.log("Battle - update()");
	   //uncomment to test native object
	   //this._test_node.update(dt);
       const cThis = this;
        // set position cho các monster của GPM
        this._GPM._monsters.forEach(monst => {
            //cc.log(monst._img.x)
        });
    },
	
	onExit: function()
	{
		this._super();
		cc.log("Battle - onExit()");
	},
    initTheGame: function() {   // init các giá trị, hiển thị hình ảnh trước khi vào game
        cc.eventManager.removeAllListeners();
        this.drawBackgroundMap();
		//this._utility = new Utility(this._cellsPerRow, this._cellsPerCol, this.cellSize, this.scrSize, this.playerMapStartX, this.playerMapStartY);
		this._GPM = new GamePlayManager(this._cellsPerRow, this._cellsPerCol, this.cellSize, this.scrSize, this.playerMapStartX, this.playerMapStartY, this);
        this.startGame();

    },
    drawBackgroundMap: function() {// draw cells in enemy map
        var enemyMapBG = this._battle_ui.getChildByName("map_background_0000_11");
        var playerMapBG = this._battle_ui.getChildByName("map_background_0001_12");
        var enemyMonsterGate = this._battle_ui.getChildByName("map_monster_gate_enemy_7");
        var playerMonsterGate = this._battle_ui.getChildByName("map_monster_gate_player_9");
        var enemyMapCells = this._battle_ui.getChildByName("map_cells_enemy");
        var playerMapCells = this._battle_ui.getChildByName("map_cells_player");
        this.enemyMapStartX = enemyMapBG.x-enemyMapBG.getBoundingBox().width/2;
        this.enemyMapStartY = enemyMapBG.y+enemyMapBG.getBoundingBox().height/2;
        this.playerMapStartX = playerMapBG.x-playerMapBG.getBoundingBox().width/2;
        this.playerMapStartY = playerMapBG.y+playerMapBG.getBoundingBox().height/2;
        var standardCell = this.addSprite(battle_res.map_cell_0000, this.enemyMapStartX, this.enemyMapStartY);
        standardCell.setAnchorPoint(0,1);
        this.cellSize = standardCell.getBoundingBox().width;
        this.removeChild(standardCell);
        var panelCellWidth = 1.0185*enemyMapCells.width/this._cellsPerRow;
        var panelCellHeight = 0.96*enemyMapCells.height/this._cellsPerCol;
        for (var i = 0; i < this._cellsPerCol; i++) {
            for (var j = 0; j < this._cellsPerRow; j++) {
                var x = panelCellWidth*j;
                var y = enemyMapCells.height-panelCellHeight*i;
                var cell = cc.Sprite.create(battle_res.map_cell_0000);
                cell.attr({ x: x, y: y });
                cell.setScale(1.02);
                enemyMapCells.addChild(cell);
                cell.setAnchorPoint(0,1);
                this._map_cells_enemy.push(cell);
            }
        }
        // draw cells in player map
        for (var i = 0; i < this._cellsPerCol; i++) {
            for (var j = 0; j < this._cellsPerRow; j++) {
                var x = panelCellWidth*j;
                var y = playerMapCells.height-panelCellHeight*i;
                var cell = cc.Sprite.create(battle_res.map_cell_0002);
                cell.attr({ x: x, y: y });
                cell.setScale(1.02);
                playerMapCells.addChild(cell);
                cell.setAnchorPoint(0,1);
                this._map_cells_player.push(cell);
            }
        }
        playerMonsterGate.setLocalZOrder(1);
        enemyMonsterGate.setLocalZOrder(1);
        // main house
        this._enemy_house = this.addSprite(battle_res.map_house, this.enemyMapStartX, this.enemyMapStartY);
        this._enemy_house.setAnchorPoint(0.15,0.5);
        this._enemy_house.setLocalZOrder(10);
        this._player_house = this.addSprite(battle_res.map_house, this.playerMapStartX + this.cellSize*this._cellsPerRow, this.playerMapStartY - this.cellSize*this._cellsPerCol);
        this._player_house.setAnchorPoint(0.8,0);
        this._player_house.setLocalZOrder(10);
        // button back to lobby
        btnBackToLobby = this.addSprite(battle_res.btn_back_to_lobby, this.scrSize.width*0.9, 100); /// tạm thời
    },
    startGame: function() {
        this._GPM.onStartGame();

        // add click listener when start game
        this.addClickListener();
    },
    addClickListener:function() {
        // add event listener for layer
        const cThis = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event){
                var xPos = touch.getLocation().x;
                var yPos = touch.getLocation().y;
                if (cThis._GPM._gameState === 1) {
                    if (cThis._GPM._utility.isInsideBattleMap(xPos, yPos)) {
                        cThis._GPM.checkConditionAndBuildTower(xPos, yPos);
                    }
                    else if (yPos < 100) {
                        fr.view(BattleScene);
                    }
                }
                return true;
            },
        }, this);
        
    },
    resetPathCells: function() {
        const cThis = this;
        for (var index = this._pathCells.length - 1; index >= 0; index--) {
            var pathCell = cThis._pathCells[index];
            cThis._pathCells.splice(index, 1);
            cThis.removeChild(pathCell, true);
        }
    },
    addSprite: function(resource, xPos, yPos, zOrder, scaleRate) {
        zOrder = zOrder || 0;
        scaleRate = scaleRate || this.SCALE_RATE;
        sprite = cc.Sprite.create(resource);
        sprite.setScale(scaleRate);
        sprite.attr({ x: xPos, y: yPos });
        sprite.setLocalZOrder(zOrder);
        this.addChild(sprite);
        return sprite;
    },
    onRemoved:function()
    {
        fr.unloadAllAnimationData(this);
    },
});


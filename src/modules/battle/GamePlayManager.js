var GamePlayManager = cc.Class.extend({
    SCALE_RATE: 1.45,
    BLANK_VALUE: 0,  // Value of blank cell on _obstaclesMap
    OBSTACLE_VALUE: 1,  // Value of obstacle on _obstaclesMap
    TOWER_VALUE: 10,  // Value of tower on _obstaclesMap
    _battleGUI: null,
    _monsters: [], // Monster Array
    _towers: [], // Tower Array
    _spells: [], // Spell Array
    _obstacleCount: 0,
    _obstacles: [], // obstacles array
    _obstaclesMap: [], // 1D or 2D array store info obstacles on the map (used to find path)
    _monsterSpawnPosition: null, // cc.p First position of monster when spawn (should read from config map)
    _mainPath: [], // đường đi chính của các quái có dạng mảng 1 chiều với rowIndex và colIndex. Lưu ý, có thể có nhiều đường đi khác nhau tại 1 thời điểm, ngoài mainPath
    _mainPathCoord: [], // đường đi chính của các quái có dạng mảng tọa độ

    ctor:function(cellsInARow, cellsInACol, cellSize, scrSize, mapStartX, mapStartY, battleGUI){
        this._cellsPerRow = cellsInARow;
        this._cellsPerCol = cellsInACol;
        this._cellSize = cellSize;
        this._scrSize = scrSize;
        this._mapStartX = mapStartX;
        this._mapStartY = mapStartY;
        this._battleGUI = battleGUI;
		this._totalCellsPerMap = this._cellsPerRow*this._cellsPerCol;
		this._utility = new Utility(this._cellsPerRow, this._cellsPerCol, this._cellSize, this._scrSize, this._mapStartX, this._mapStartY);
        // init obstacles 2D array with 0, means no obstacle
        for (var i = 0; i < this._cellsPerCol; i++) {
            var row = [];
            for (var j = 0; j < this._cellsPerRow; j++) {
                row.push(this.BLANK_VALUE);
            }
            this._obstaclesMap.push(row);
        }
        this._gameState = 1;
        this._wave = 1;
    },

    onStartGame: function() {
        const cThis = this;
        this.generateObstacles();
        
        this.generateMonsters();
        var intervalMove = setInterval(function () {
            cThis.moveAllMonsters();
        }, 1000);
    },

    generateObstacles:function()
    {
        var obstaclesPos = this.getObstaclePos(this._obstacleCount);
        const cThis = this;
        for (var i = 0; i < this._obstacleCount; i++) {
            var obst;
            var obstacleType = this._utility.randomInt(2,3);
            var obstacleCoord = this._utility.convertCellIndexToCoord(obstaclesPos[i]);
            switch (obstacleType) {
                case 2: 
                    obst = new Tree(obstacleCoord.x, obstacleCoord.y, 5, cThis.SCALE_RATE);
                    break;
                case 3: 
                    obst = new Rock(obstacleCoord.x, obstacleCoord.y, 5, cThis.SCALE_RATE);
                    break;
            }
            cThis._obstacles.push(obst);
            cThis._battleGUI.addChild(obst._img);
        }
        this._obstaclesMap = this._utility.convertPositionArrayToMap2D(obstaclesPos, this.OBSTACLE_VALUE, this._obstaclesMap);  // cập nhật map
        this.updatePaths(); // cập nhật lộ trình cho quái
    },
    getObstaclePos: function(_obstacleCount) {
        const cThis = this;
        var indexArray = [];
        var c = _obstacleCount;
        while (c != 0) {
            var cellIndex = this._utility.randomInt(0, cThis._totalCellsPerMap - 1);    // có thể random vô cực lần
            if (cThis.checkValidObstacleIndex(cellIndex, indexArray)) {
                indexArray.push(cellIndex);
                c--;
            }
        }
        return indexArray;
    },
    checkValidObstacleIndex: function(cellIndex, indexArray) {
        if (cellIndex === 0 || cellIndex === this._totalCellsPerMap - 1) return false; // vị trí này sẽ chặn đường quái
        for (var i = 0; i < indexArray.length; i++) {
            if (indexArray[i] === cellIndex)
                return false;
        }
        return true;
    },
    generateMonsters:function()
    {
        const cThis = this;
        // var interval = setInterval(function () {
        //     if (cThis._gameState != 2)
        //         cThis.addNewMonster();
        // }, 2000);
        cThis.addNewMonster();
        // var levelInterval = setInterval(function () {
        //     if (cThis._gameState === 1){
        //         cThis.checkSystemAndPlaySound(battle_sound.ingame_next_wave);
        //         cThis._wave++;
        //         cThis._waveBox.setString(cThis._wave);
        //     }
        // }, 30000);
    },
    addNewMonster: function() {
        var monst;
        var monsterPos = 0;
        var monsterType = this._utility.randomInt(1,3);//(1,4)
        var xPos = this._utility.convertCellIndexToCoord(monsterPos).x;
        var yPos = this._utility.convertCellIndexToCoord(monsterPos).y;
        switch (monsterType) {
            case 1: 
                monst = new Assassin(this._wave, xPos, yPos, this.SCALE_RATE);
                break;
            case 2: 
                monst = new DarkGiant(this._wave, xPos, yPos, this.SCALE_RATE);
                break;
            case 3: 
                monst = new Iceman(this._wave, xPos, yPos, this.SCALE_RATE);
                break;
            case 4: 
                monst = new Bat(this._wave, xPos, yPos, this.SCALE_RATE);
                break;
        }
        this._monsters.push(monst);
        this._battleGUI.addChild(monst._img);
    },
    moveAllMonsters: function() {
        const cThis = this;
        for (var index = this._monsters.length - 1; index >= 0; index--) {   // logic chỗ này có thể sẽ dời sang thành method của monster
            var monst = this._monsters[index];
            var xPos = monst._img.getPositionX();
            var yPos = monst._img.getPositionY();
            if (monst._milestone === -1) {  // bắt đầu di chuyển đến milestone 0 trên path
                monst._milestone++;
                monst._img.runAction(cc.moveTo(0, cThis._mainPathCoord[monst._milestone].x, cThis._mainPathCoord[monst._milestone].y));
                monst._milestone++;
            }
            else if (monst._milestone < cThis._mainPathCoord.length - 1) {
                var milestoneX = cThis._mainPathCoord[monst._milestone].x;
                var milestoneY = cThis._mainPathCoord[monst._milestone].y
                var deltaX = milestoneX - xPos;
                var deltaY = yPos - milestoneY;
                if (xPos == milestoneX && yPos == milestoneY) monst._milestone++; // reached milestone
                else if (deltaX<=0 && deltaY>0) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        monst.moveLeftTo(milestoneX, milestoneY);
                    }
                    else if (Math.abs(deltaX) <= Math.abs(deltaY)) {
                        monst.moveDownTo(milestoneX, milestoneY);
                    }
                }
                else if (deltaX<0 && deltaY<=0) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        monst.moveLeftTo(milestoneX, milestoneY);
                    }
                    else if (Math.abs(deltaX) <= Math.abs(deltaY)) {
                        monst.moveUpTo(milestoneX, milestoneY);
                    }
                }
                else if (deltaX>0 && deltaY<=0) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        monst.moveRightTo(milestoneX, milestoneY);
                    }
                    else if (Math.abs(deltaX) <= Math.abs(deltaY)) {
                        monst.moveUpTo(milestoneX, milestoneY);
                    }
                }
                else if (deltaX>0 && deltaY>0) {
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        monst.moveRightTo(milestoneX, milestoneY);
                    }
                    else if (Math.abs(deltaX) <= Math.abs(deltaY)) {
                        monst.moveDownTo(milestoneX, milestoneY);
                    }
                }
            }
            else {  // reach the house
                if (cThis._gameState === 1) {
                    // cThis.houseHP--;
                    // cThis.checkSystemAndPlaySound(battle_sound.ingame_maintower_hit);
                    // cThis.houseHPBox.setString(cThis.houseHP);
                    cThis._monsters.splice(index, 1);
                    cThis._battleGUI.removeChild(monst._img, true);
                    //if (cThis.houseHP <= 0) cThis.onGameOver();
                }
            }
        }
    },
    checkConditionAndBuildTower: function (xPos, yPos) {
        // kiểm tra vị trí nằm trong map
        var isInsideMap = this._utility.isInsideBattleMap(xPos, yPos);
        // kiểm tra vị trí có vật cản ko
        var cell2DIndex = this._utility.convertCoordTo2DIndex(xPos, yPos);
        var cellValue = this._utility.getCellValue(cell2DIndex, this._obstaclesMap);
        var isValidPosInMap = (cellValue === this.BLANK_VALUE);
        // kiểm tra vị trí xây trụ có khiến quái ko thể tìm đường ko
        var newMap = this._obstaclesMap.map(function(arr) {
            return arr.slice();
        });
        newMap = this._utility.setCellValue(cell2DIndex, this.TOWER_VALUE, newMap);
        var newPath = this._utility.getAvailablePathInMap(newMap);
        if (isInsideMap && isValidPosInMap && newPath) {
            // TODO: kiểm tra điều kiện xây trụ, bao gồm cả đảm bảo đường đi cho quái
            // Tiến hành xây trụ
            var towerCenterPoint = this._utility.convert2DIndexToCoord(cell2DIndex);
            var tower = new Tower(towerCenterPoint.x, towerCenterPoint.y, 15, this.SCALE_RATE);
            this._towers.push(tower);
            this._battleGUI.addChild(tower._img);
    
            // Cập nhật map
            this._utility.setCellValue(cell2DIndex, this.TOWER_VALUE, this._obstaclesMap);
    
            // Hiển thị lại đường đi
            this.updatePaths(); // cập nhật lộ trình cho quái
        }
        else {
            cc.log("invalid position");
        }
    },

    // update: function () {
    //     this.updateMonsters();
    //     this.updateTowers();
    // },

    // updateMonsters: function () {
    //     this._monsters.forEach(function(monster){
    //         monster && monster.update();
    //         this.checkSpell(monster);
    //     });
    // },

    // checkSpell: function (monster) {
    //     this._spells.forEach(function(spell){
    //         if (this.isContact(spell, monster)) {
    //             monster.getHitBySpell(spell);
    //         }
    //     });
    //       monster.getPosition();
    // },

    // isContact: function (spell, monster) {
    //     // TODO check where a monster is inside spell effect radius or not
    //     return false;
    // },

    // updateTowers: function () {
    //     this._towers.forEach(function(tower){
    //         tower && tower.update();
    //     });
    // },

    // castSpell: function(spell) {
    //     this._spells.push(spell);
    //     // TODO render spell
    // },

    // spawnMonster: function (type) {
    //     var monster = Monster.create(type);
    //     monster.setPosition(this._monsterSpawnPosition);
    //     monster.setPath(utitlity.findPath(monster.getPosition(), this._obstaclesMap));
    //     this._monsters.push(monster);
    // },

    // addTower: function (type, x, y) {
    //     var tower = Tower.create(type);
    //     tower.setPosition(x, y);
    //     this._towers.push(tower);
    //     this._obstaclesMap[x][y] = 1; // update obstacles here, for simple version 1 means "has obstacle at x, y" 0 means "no obstacle here"
    //     this.updatePaths();
    // },

    updatePaths: function () {
        const cThis = this;
        // this._monsters.forEach(function(monster){
        //     monster && monster.setPath(utitlity.findPath(monster.getPosition(), this._obstaclesMap));
        // });
        var newPath = this._utility.getAvailablePathInMap(this._obstaclesMap);
        if (newPath) {
            this._mainPath = newPath;
            this._mainPathCoord = [];
            this._mainPath.forEach((pathCell, index) => {
                cThis._mainPathCoord[index] = cThis._utility.convert2DIndexToCoord(pathCell);   // chuyển từ vị trí dạng {row, col} sang tọa độ
            });
    
            cThis._battleGUI.resetPathCells();
            // render UI cho path của GPM
            this._mainPathCoord.forEach(pathCell => {
                var pathCell = cThis._battleGUI.addSprite(battle_res.map_cell_0000, pathCell.x, pathCell.y);
                cThis._battleGUI._pathCells.push(pathCell);
            });
        }
        else {
            cc.log("cannot find path");
        }
    },
});

var Utility = cc.Class.extend({
    ctor:function(cellsPerRow, cellsPerCol, cellSize, scrSize, mapStartX, mapStartY){
        this._cellsPerRow = cellsPerRow;
        this._cellsPerCol = cellsPerCol;
        this._cellSize = cellSize;
        this._scrSize = scrSize;
        this._mapStartX = mapStartX;
        this._mapStartY = mapStartY;
        this._topBorder = this._mapStartY;
        this._bottomBorder = this._mapStartY - this._cellSize*6;
        this._leftBorder = this._mapStartX;
        this._rightBorder = this._mapStartX + this._cellSize*6;
    },
    randomInt: function(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    calDistance: function(x1, y1, x2, y2) {
        var deltaX = x1 - x2;
        var deltaY = y1 - y2;
        return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    },
    //// not use
    isInsideMap: function(x, y) {
        return (x < this._rightBorder || x > this._leftBorder || y < this._topBorder || y > this._bottomBorder)
    },
    reachHousePoint: function(x, y) {
        return (x >= this._rightBorder && this._bottomBorder - this._cellSize/2 <= y && y <= this._bottomBorder + this._cellSize/2)
    },
    reachRightBorder: function(x, y) {
        return (x >= this._rightBorder)
    },
    reachLeftBorder: function(x, y) {
        return (x <= this._leftBorder)
    },
    reachBottomBorder: function(x, y) {
        return (y <= this._bottomBorder)
    },
    reachTopBorder: function(x, y) {
        return (y >= this._topBorder)
    },
    //// !not use  ///
    convertCellIndexToCoord: function(index) {
        var xIndex = index%this._cellsPerRow;
        var yIndex = Math.floor(index/this._cellsPerRow);
        var xCoord = this._mapStartX + this._cellSize*xIndex + this._cellSize/2;
        var yCoord = this._mapStartY - this._cellSize*yIndex - this._cellSize/2;
        return { x: xCoord, y: yCoord }
    },
    convertCellIndexTo2DIndex: function(index) {
        var rowIndex = Math.floor(index/this._cellsPerRow);
        var colIndex = index%this._cellsPerRow;
        return { rowIndex: rowIndex, colIndex: colIndex }
    },
    convert2DIndexToCoord: function(cell) {
        var xCoord = this._mapStartX + this._cellSize*cell.colIndex + this._cellSize/2;
        var yCoord = this._mapStartY - this._cellSize*cell.rowIndex - this._cellSize/2;
        return { x: xCoord, y: yCoord }
    },
    convertCoordTo2DIndex: function(xPos, yPos) {
        if (!this.isInsideMap(xPos, yPos))  return false;
        var rowIndex = Math.floor(Math.abs(this._mapStartY - yPos)/this._cellSize);
        var colIndex =  Math.floor(Math.abs(xPos - this._mapStartX)/this._cellSize);
        return { rowIndex: rowIndex, colIndex: colIndex }
    },
    convertPositionArrayToMap2D: function(posArray, value, obstacleMap) {   // chuyển đổi mảng obstacle dạng 1D thành map 2D
        for (var i = 0; i < posArray.length; i++) {
            var idx = this.convertCellIndexTo2DIndex(posArray[i]);
            obstacleMap[idx.rowIndex][idx.colIndex] = value;
        }
        return obstacleMap;
    },
    setCellValue: function(cellIndex, value, obstacleMap) {   // thêm 1 object (trụ, hố) vào map
        obstacleMap[cellIndex.rowIndex][cellIndex.colIndex] = value;
        return obstacleMap;
    },
    getCellValue: function(cellIndex, obstacleMap) {   // lấy value của 1 ô trong obstacleMap
        return obstacleMap[cellIndex.rowIndex][cellIndex.colIndex];
    },
    /**
     * Find path for a monster at position `pos` with `map` info
     * 
     * @param {cc.p} pos 
     * @param {Number[][]} map 
     * @returns {cc.p[]}
     * 
     * @example
     * pos = cc.p(1, 1)
     * map = [[0, 0, 1], [0, 1, 0], [0, 0, 0]]
     * return [{0,0}, {0,1}, {1,1}]
     * 
     * Là đường đi ngắn nhất để đi từ Cổng Ra tới Trụ Chính
     * Quái không đi qua trụ, ô có hố và ô có cây (sẽ được giải thích ở 2.3.2.8)
     * Quái sẽ sẽ liên tục đi thẳng và chỉ rẽ khi không thể đi thẳng nữa hoặc việc đi thẳng khiến cho đường đi hiện tại không còn là đường đi ngắn nhất nữa
     * 
     */
    // findPath: function (pos, map) {
    //     // mặc định: tìm đường đi từ ô đầu tiên của map
    //     var startPos = {rowIndex: 0, colIndex: 0};
    //     var path = [];
    //     path = this.findPathFromPos(startPos, map);
    //     return path;
    // },
    // findPathFromPos: function (startPos, map) {
    //     var path = [];
    //     path.push(startPos);
    //     if (startPos.rowIndex === 4 && startPos.colIndex === 6){ // đến đích
    //         return path;
    //     }
    //     else {
    //         var ableToMoveDown = this.isValidStep({rowIndex: startPos.rowIndex+1, colIndex: startPos.colIndex}, map);// thử đi xuống 1 ô
    //         var ableToMoveRight = this.isValidStep({rowIndex: startPos.rowIndex, colIndex: startPos.colIndex+1}, map); // thử đi sang phải 1 ô
    //         if (!ableToMoveDown && !ableToMoveRight)
    //             return []; // nếu cả 2 hướng đều ko đi được => ko tìm được đường đi
    //         else if (ableToMoveDown) {
    //             var pathAfterMoveDown = this.findPathFromPos({rowIndex: startPos.rowIndex+1, colIndex: startPos.colIndex}, map);
    //             if (pathAfterMoveDown.length>0) return path.concat(pathAfterMoveDown);
    //             else {
    //                 var pathAfterMoveRight = this.findPathFromPos({rowIndex: startPos.rowIndex, colIndex: startPos.colIndex+1}, map);
    //                 return path.concat(pathAfterMoveRight);
    //             }
    //         }
    //         else if (ableToMoveRight) {
    //             var pathAfterMoveRight = this.findPathFromPos({rowIndex: startPos.rowIndex, colIndex: startPos.colIndex+1}, map);
    //             if (pathAfterMoveRight.length>0) return path.concat(pathAfterMoveRight);
    //             else {
    //                 var pathAfterMoveDown = this.findPathFromPos({rowIndex: startPos.rowIndex+1, colIndex: startPos.colIndex}, map);
    //                 return path.concat(pathAfterMoveDown);
    //             }
                
    //         }
    //     }
        

    // },
    // isValidStep: function(pos, map) {
    //     if (pos.rowIndex >= this._cellsPerCol || pos.colIndex >= this._cellsPerRow) // nằm ngoài map
    //         return false;
    //     else if(map[pos.rowIndex][pos.colIndex] !== 0)  // nằm trên vật cản
    //         return false;
    //     else
    //         return true;
    // },
    // obstacleMap: mảng 2 chiều với các phần tử có giá trị 0 ứng với ô trống, khác 0 ứng với vật cản
    // A* map: mảng 2 chiều với các phần tử có giá trị 0 là tường, khác 0 là ô đi được
    convertObstacleMapToAStarMap: function(obstacleMap) {
        var aStarMap = [];
        for (var i = 0; i < obstacleMap.length; i++) {
            var row = [];
            for (var j = 0; j < obstacleMap[i].length; j++) {
                var value = (obstacleMap[i][j] === 0 ? 1 : 0); 
                row.push(value);
            }
            aStarMap.push(row);
        }
        return aStarMap;
    },
    findPathWithAStar: function (startPos, endPos, map) {
        var path = [];
        var aStarMap = this.convertObstacleMapToAStarMap(map);
        var graph = new Graph(aStarMap);
        var start = graph.grid[startPos.rowIndex][startPos.colIndex];
        var end = graph.grid[endPos.rowIndex][endPos.colIndex];
        var result = astar.search(graph, start, end);
        path.push(startPos);
        result.forEach(pathCell => {
            path.push({rowIndex: pathCell.x, colIndex: pathCell.y});
        });
        return path;
    },
    getAvailablePathInMap: function (map) {
        var startPos = {rowIndex: 0, colIndex: 0};
        var endPos = {rowIndex: this._cellsPerCol-1, colIndex: this._cellsPerRow-1};
        var newPath = this.findPathWithAStar(startPos, endPos, map);
        if (newPath.length > 1) return newPath;// lớn hơn 1 vì path luôn chứa ô (0, 0)
        else return false;

    },
    isInsideBattleMap: function(xPos, yPos) {
        return this._mapStartX <= xPos && xPos <= this._mapStartX+this._cellsPerRow*this._cellSize
        && this._mapStartY >= yPos && yPos >= this._mapStartY-this._cellsPerCol*this._cellSize;
    }
});

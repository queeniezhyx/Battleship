//sc/gameboard.js

import ColorName from "color-name";

class Gameboard {
    constructor(user){
        this.user = user;
        this.board=this.createBoard(user);
        this.ships=[];
    }

    createBoard(user){
        const gameBoardContainer= document.getElementById(user);
        if (gameBoardContainer) gameBoardContainer.id=user;
        return Array(10).fill(null).map(()=> Array(10).fill(null))
    }

    renderBoard(elementId, isEnemyBoard){
    const boardElement = document.getElementById(elementId);
    for(let i=0; i<10; i++){
        for(let j=0;j<10; j++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x=i;
            cell.dataset.y=j;

            const cellId= (i*10)+j;
            cell.id=cellId;
            boardElement.appendChild(cell);
        }
    }
}

    resetBoard(user){
        const gameBoardContainer = document.getElementById(user);
        if (gameBoardContainer) gameBoardContainer.id = user;
        this.ships =[];
        return Array(10).fill(null).map(() => Array(10).fill(null))
    }

    getValidity(allBoardCells, isHorizontal, startRow, startCol, ship){
        if (isHorizontal){
            if(startCol + ship.length>10) return{valid:false, notTaken: false, shipCells:[]};
        }else{
            if(startRow + ship.length>10) return{valid:false, notTaken: false, shipCells:[]};
        }

        let shipCells =[];
        for(let i=0; i<ship.length; i++){
            let r = isHorizontal ? startRow : startRow +i;
            let c = isHorizontal ? startCol + i: startCol;
            let index=(r*10)+c;
            if (index<0|| index>=allBoardCells.length){
                return{valid:false, notTaken:false, shipCells:[]};
            }
            shipCells.push(allBoardCells[index]);
        }
        //ensures that all targeted cells are free
        let notTaken= shipCells.every(shipCell => !shipCell.classList.contains('taken'))
        let valid=true;

        return{shipCells, valid,notTaken};
    }

    placeShip(user, ship, row, col, isVertical, attempts=0){
        if(attempts>=5){
            return false;//stop recursion
        }

        //select user cells
        const allBoardCells = document.querySelectorAll(`#${user} .cell`);
        let randomBoolean = Math.random()<0.5;
        let isHorizontal = user === 'player-board'? !isVertical : randomBoolean;
        let randomRowIndex = Math.floor(Math.random()*10);
        let randomColIndex = Math.floor(Math.random()*10);

        let startRow= (row!==null && row !== undefined) ? row : randomRowIndex;
        let startCol = (col !== null && col !== undefined) ? col : randomColIndex;

        const {valid, notTaken, shipCells} = this.getValidity(allBoardCells, isHorizontal, startRow, startCol, ship);
        if(valid&&notTaken){
            shipCells.forEach((shipCell) => {
                shipCell.classList.add(ship.name);
                shipCell.classList.add('taken');
            });
            return true;
        }else{
            if(user ==='computer-board') return this.placeShip(user, ship,null, null,null, attempts+1);
            if(user ==='player-board') return false;

        }
}

hovverArea(startRow, startCol, ship, isVerticalInput){
        //select all player cells
        const allBoardCells = document.querySelectorAll('#player-board .cell');
        let isHorizontal = !isVerticalInput;

        const {shipCells, valid, notTaken} = this.getValidity(allBoardCells, isHorizontal, startRow, startCol, ship);
        
        if (valid && notTaken){
            shipCells.forEach((shipCell) => {
                shipCell.classList.add('hover');
                setTimeout(() => shipCell.classList.remove('hover'), 500);
            });
        }
    }
}

export default Gameboard;
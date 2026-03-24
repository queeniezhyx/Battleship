import Gameboard from './gameboard.js';

// src/player.js
class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.board = new Gameboard();
        this.isComputer = isComputer;
        this.usedAttacks = new Set();
    }

    computerAttack(playerShips) {
        let cell;
        do {
            //select random cell as long as not hit or miss classes
            let randomComputerGo = Math.floor(Math.random() * 100);
            const allPlayerCells = document.querySelectorAll('#player-board .cell');
            cell = allPlayerCells[randomComputerGo];
        } while ( cell.classList.contains('hit') || cell.classList.contains('miss')
        ) 
        if (cell.classList.contains('taken')) {
            let classes = Array.from(cell.classList);
            // find ship name after removing other classes
            let shipName = classes.find(c => c !== 'cell' && c !== 'taken' && c !== 'hit');
            // find ship instance from your playerShips array
            let ship = playerShips.find(s => s.name === shipName); 
            return { ship, cell, shipName};  
        } else {
            cell.classList.add('miss');
            return { ship: null, cell };
        }
    }

    playerAttack(e, computerShips) {
        if (e.target.classList.contains('hit') || 
            e.target.classList.contains('miss')) {
            return {alreadyAttacked: true};
        } else if (e.target.classList.contains('taken') && !e.target.classList.contains('hit')) {
            // find ship name from class array
            let shipName = Array.from(e.target.classList).find(ship =>
                ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier'].includes(ship)
            );
            // find ship instance from your computerShips array
            let ship = computerShips.find(s => s.name === shipName);
            return { ship, shipName, alreadyAttacked: false};  
        } else {
            e.target.classList.add('miss');
            return { ship: null, alreadyAttacked: false };
        }
    }
}
export default Player;
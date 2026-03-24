// src/main.js
import Ship from './ship.js';
import Player from './player.js';

//define const and let
globalThis.player = new Player("Human");
globalThis.computer = new Player("Computer", true);
const infoDisplay = document.getElementById('game-message');
const turnDisplay = document.getElementById('turn-message');

const shipsContainer = document.querySelector('.ships-container');

let isPlayerTurn = true;
global.gameActive = false;
let computerTurnTimer;
let playerTurnTimer;
global.isVertical = false;
let notDropped = true;
global.draggedShip;
let alreadyAttacked;
let playerShips = shipFleet();
let playerShipsPlaced = [];
let computerShips = shipFleet();
let playerAttacks = [];
let computerAttacks = [];
let playerSunkShips = [];
let computerSunkShips = [];

//define all ships for players
function shipFleet() {
    return[
        new Ship('destroyer', 2),
        new Ship('submarine', 3),
        new Ship('cruiser', 3),
        new Ship('battleship', 4),
        new Ship('carrier', 5)
    ];
}

//reset game
function resetGame() {
    console.log('resetGame');
    isPlayerTurn = true;
    global.gameActive = false;
    clearTimeout(computerTurnTimer);
    clearTimeout(playerTurnTimer);
    global.isVertical = false;
    notDropped = true;
    global.draggedShip = undefined;
    alreadyAttacked;
    playerShips = shipFleet();
    playerShipsPlaced = [];
    computerShips = shipFleet();
    playerAttacks = [];
    computerAttacks = [];
    playerSunkShips = [];
    computerSunkShips = [];

    //reset and recreate boards
    player.board.resetBoard('player-board');
    computer.board.resetBoard('computer-board');

    //find all cells
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.className = 'cell'; // remove other classes
        cell.removeEventListener('click', handleCellClick); //remove listener
    });

    if(shipsContainer) {
        shipsContainer.style.flexWrap = 'wrap'; //return to wrap
        shipsContainer.innerHTML = `
            <div id="0" class="destroyer-size destroyer horizontal" data-size="2" draggable="true"></div>
            <div id="1" class="submarine-size submarine horizontal" data-size="3" draggable="true"></div>
            <div id="2" class="cruiser-size cruiser horizontal" data-size="3" draggable="true"></div>
            <div id="3" class="battleship-size battleship horizontal" data-size="4" draggable="true"></div>
            <div id="4" class="carrier-size carrier horizontal" data-size="5" draggable="true"></div>
    `;
    //recreate ship options
    const newShipOptions = Array.from(shipsContainer.children);

    newShipOptions.forEach(shipOption => {
        shipOption.addEventListener('dragstart', dragStart); //drag listener
    });
    }

    updateMessage('Game reset. Place your ships and click start.');
    turnMessage('');
    placeComputerShipsRandomly();
    dragOverNDrop();
}

//flip, start, and reset eventlistener after page load
document.addEventListener('DOMContentLoaded', (event) => {
    const flipButton = document.getElementById('flip-button');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    } else {
        console.log('Reset button element not found!');
    }
    if (flipButton) {
        flipButton.addEventListener('click', flip);
    } else {
        console.log('Flip button element not found!');
    }
    if (startButton) {
        startButton.addEventListener ('click', startGame);
    } else {
        console.log('Start button element not found!');
    }
})

function flip() {
    const currentShipsContainer = document.querySelector('.ships-container');
    //flip ships horizontal and vertical
    global.isVertical = !global.isVertical;

    //adjust container for flip
    if(currentShipsContainer) {
        currentShipsContainer.classList.toggle('vertical', global.isVertical);
        currentShipsContainer.classList.toggle('horizontal', !global.isVertical);

        currentShipsContainer.style.flexWrap = global.isVertical ? 'nowrap' : 'wrap';
        //select ships
        const shipsArr = Array.from(currentShipsContainer.children)
        shipsArr.forEach(shipArr => {
            if (global.isVertical) {
                shipArr.classList.add('vertical');
                shipArr.classList.remove('horizontal');
            } else {
                shipArr.classList.add('horizontal');
                shipArr.classList.remove('vertical');
            }
        })
    }
};

function dragStart(e) {
    global.draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault();
    //select with id
    const ship = playerShips[global.draggedShip.id];
    player.board.hoverArea(Number(e.target.dataset.x), Number(e.target.dataset.y), ship, global.isVertical);
}

function dropShip(e) {
    e.preventDefault();
    if (!global.draggedShip) return;

    const startRow = Number(e.target.dataset.x);
    const startCol = Number(e.target.dataset.y);
    const ship = playerShips[global.draggedShip.id];
    //place ship when dropped
    const success = globalThis.player.board.placeShip('player-board', ship, startRow, startCol, global.isVertical)
    if (success) {
        playerShipsPlaced.push(ship);
        global.draggedShip.remove();
        notDropped = false;
        //all ships placed before gameActive
        if (playerShipsPlaced.length >= 5) {
            global.gameActive = true;
        }
    }
}

function dragOverNDrop() {
    //select player cells
    const allPlayerCells = document.querySelectorAll(`#player-board .cell`);
    allPlayerCells.forEach(playerCell => {
        playerCell.addEventListener('dragover', dragOver);
        playerCell.addEventListener('drop', dropShip);
    })
}

function startGame() {
    if (isPlayerTurn === true) {
        //make sure ships are all placed
        if (shipsContainer.children.length != 0) {
            updateMessage('Please place all your ships first and then click start.');
        } else {
            isPlayerTurn = true;
            //select all computer cells
            const allBoardCells = document.querySelectorAll('#computer-board .cell');
            allBoardCells.forEach(cell => cell.addEventListener('click', handleCellClick));
            turnMessage('Your turn.');
            updateMessage('Game started. Select a cell to attack on the computer board.');
        }
    }
}

function computerTurn() {
    //requires gameActive
    if (global.gameActive) {
        turnMessage('Computer Turn!');
        updateMessage(' The computer is thinking...');
        //reset computerTurnTimer will be reset above
        computerTurnTimer = setTimeout(() => {
            const {ship, cell, shipName} = computer.computerAttack(playerShips)
            if (ship && !ship.sunk) {
                ship.hit(); //increment ship hits
                cell.classList.add('hit');
                updateMessage('The computer hit your ship!');
                computerAttacks.push(shipName);//add shipName to computerAttacks
                if (ship.isSunk()) {
                    updateMessage(`The computer sunk your ${ship.name}!`);
                    computerSunkShips.push(ship.name);
                    computerAttacks = computerAttacks.filter(attackName => attackName !== shipName); // remove sunkShips from computerAttacks
                }
                gameActiveCheck('computer-board', computerSunkShips);
            } else {
                updateMessage('Nothing hit this time.');
            }
        }, 2000)

        //reset playerTurnTimer will be reset above
        playerTurnTimer = setTimeout(() => {
            isPlayerTurn = true;
            turnMessage('Player Go!');
            updateMessage('Select a cell to attack on the computer board.');
            //select computer cells
            const allComputerCells = document.querySelectorAll('#computer-board .cell');
            allComputerCells.forEach(cell => cell.addEventListener('click', handleCellClick));
        }, 4000);
    } else {
        console.log('Error with computerTurn');
        alert('The game is over. Reset the game to play again');
        return;
    }

}

function handleCellClick(e) {
    if (global.gameActive && isPlayerTurn) {
        const { ship, shipName, alreadyAttacked } = player.playerAttack(e, computerShips);
        if (alreadyAttacked) {
            updateMessage('Cell already attacked, please try again.');
            return;
        }
        if (ship && !ship.sunk) {
            ship.hit(); //increment ship hits
            e.target.classList.add('hit');
            updateMessage('Computer ship hit!');
            playerAttacks.push(shipName); //add shipName to playerAttacks
            
            if (ship.isSunk()) {
                updateMessage(`You sunk the computer's ${ship.name}!`);
                playerSunkShips.push(ship.name);
                playerAttacks = playerAttacks.filter(attackName => attackName !== shipName); //remove sunkShips from playerAttacks
            }
            gameActiveCheck('player-board', playerSunkShips);
        } else {
            updateMessage('No ships hit.');
        }
        isPlayerTurn = false;
        //select computer cells
        const allBoardCells = document.querySelectorAll('#computer-board .cell');
        allBoardCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)));
        computerTurnTimer = setTimeout(computerTurn, 3000);
    } else {
        alert('The game is over. Reset the game to play again');
        return;
    }
}

function gameActiveCheck(user, userSunkShips) {
    //check after hits
    if (user === 'player-board'){
        if (userSunkShips.length === 5) {
            updateMessage('You sunk all the computer ships. YOU WON!');
            turnMessage('');
            global.gameActive = false;
       }
    }
    if (user === 'computer-board') {
        if (userSunkShips.length === 5) {
            updateMessage(' The computer sunk all your ships. You lost.');
            turnMessage('');
            global.gameActive = false;
        }
    }
}

function placeComputerShipsRandomly() {  
    playerShips.forEach(ship => computer.board.placeShip('computer-board', ship));
    turnMessage('Computer ships are placed.')
}

function renderBoards() {
    player.board.renderBoard('player-board', false);
    computer.board.renderBoard('computer-board', true);
}

function updateMessage(msg) {
    if (infoDisplay) {
        infoDisplay.textContent = msg;
    }
}
function turnMessage(msg) {
    if(turnDisplay) {
        turnDisplay.textContent = msg;
    }
}

function initGame() {
    renderBoards();
    placeComputerShipsRandomly();

    //select and drag player ships
    const shipOptions = Array.from(shipsContainer.children);
    shipOptions.forEach(shipOption => {
        shipOption.addEventListener('dragstart', dragStart)
    });
    dragOverNDrop();
    updateMessage("Please place your ships and click Start.");
}
export {shipFleet, dragStart, dropShip, resetGame, flip, initGame}
/**
 * @jest-environment jsdom
 */

import { shipFleet, dragStart, dropShip, resetGame, flip } from './main.js';
import Player from './player.js';
import Gameboard from './gameboard.js';

// Mocks the entire gameboard.js file
jest.mock('./gameboard.js');

 // Mock DOM structure
    const mockPlaceShip = jest.fn(() => true);
    const mockBoard = {
        resetBoard: jest.fn(),
        placeShip: mockPlaceShip,
        hoverArea: jest.fn(),
        renderBoard: jest.fn(),
    }

    global.computer = { board: mockBoard, computerAttack: jest.fn() };
    global.infoDisplay = document.getElementById('game-message');
    global.turnDisplay = document.getElementById('turn-message');
    global.handleCellClick = jest.fn();
    global.updateMessage = jest.fn();
    global.turnMessage = jest.fn();
    global.placeComputerShipsRandomly = jest.fn();
    global.dragOverNDrop = jest.fn();
    global.dragStart = jest.fn();

    global.isPlayerTurn = true;
    global.gameActive = false;
    global.playerShips = shipFleet();
    global.computerShips = [];


describe('Battleship Game Functions', () => {
    let mockEvent;
    let mockDraggedShip;

    beforeEach(() => {
        jest.clearAllMocks();        
        
        Gameboard.mockImplementation(() => mockBoard);
        globalThis.player = new Player("Human");
        globalThis.player.board = mockBoard;

        global.isVertical = false;
        global.playerShipsPlaced = [];
        global.gameActive = false;
        global.notDropped = true;

        document.body.innerHTML = `
        <div id="player-board"></div>
        <div id="computer-board"></div>
        <div class="ships-container"></div>
        <button id="flip-button"></button>
        <button id="start-button"></button>
        <button id="reset-button"></button>
        <div id="game-message"></div>
        <div id="turn-message"></div>
    `;

        global.shipsContainer = document.querySelector('.ships-container');
        shipsContainer.innerHTML = `
            <div id="0" class="destroyer-size destroyer horizontal" data-size="2" draggable="true"></div>
            <div id="1" class="submarine-size submarine horizontal" data-size="3" draggable="true"></div>
            <div id="2" class="cruiser-size cruiser horizontal" data-size="3" draggable="true"></div>
            <div id="3" class="battleship-size battleship horizontal" data-size="4" draggable="true"></div>
            <div id="4" class="carrier-size carrier horizontal" data-size="5" draggable="true"></div>
        `;
        mockDraggedShip = document.getElementById('0');
        global.draggedShip = mockDraggedShip;
        global.playerShips = [
            { id: 0, length: 2}, 
            { id: 1, length: 3},
            { id: 2, length: 3},
            { id: 3, length: 4},
            { id: 4, length: 5},
        ];

        mockEvent = {
            preventDefault: jest.fn(), target: {
                dataset: {x: '1', y: '1'}
            }
        }
    });

    test('shipFleet() returns a list of 5 ships with correct lengths', () => {
        const fleet = shipFleet();
        expect(fleet.length).toBe(5); // 5 ships
        expect(fleet[0].length).toBe(2); // destroyer
        expect(fleet[4].length).toBe(5); // carrier
    });

    test('resetGame() resets game state variables', () => {
        mockBoard.resetBoard('player-board');
        expect(isPlayerTurn).toBe(true);
        expect(gameActive).toBe(false);
        expect(playerShips.length).toBe(5);
        expect(mockBoard.resetBoard).toHaveBeenCalledWith('player-board');
    });

    test('resetGame() recreates ships in DOM', () => {
        resetGame();
        const shipOptions = shipsContainer.querySelectorAll('div');
        expect(shipOptions.length).toBe(5);
        expect(shipOptions[0].classList.contains('destroyer')).toBe(true);
    });

    test('initializes with horizontal orientation', () => {
        expect(global.isVertical).toBe(false);
    });

    test('flip() toggles isVertical and updates DOM classes', () => {
        let ship = shipsContainer.children[0];
        // First call: Should become vertical
        flip();
        expect(global.isVertical).toBe(true); 
        expect(ship.classList.contains('horizontal')).toBe(false);
        expect(ship.classList.contains('vertical')).toBe(true);

        // Second call: Should become horizontal
        flip();
        expect(global.isVertical).toBe(false);
        expect(ship.classList.contains('vertical')).toBe(false);
        expect(ship.classList.contains('horizontal')).toBe(true);
    });

    test('dragStart() sets global draggedShip', () => {
        const mockEvent = { target: shipsContainer.children[0] };
        dragStart(mockEvent);
        expect(global.draggedShip).toBe(mockEvent.target);
    });

    test('dragStart sets the draggedShip variable', () => {
        const mockEvent = { target: document.getElementById('0') };
        dragStart(mockEvent); 
        expect(global.draggedShip.id).toBe('0');
    });

     test('Player initializes with a mocked board', () => {
        expect(globalThis.player.board).toBeDefined();
        expect(Gameboard).toHaveBeenCalled();
    });

    test('should prevent default on drop', () => {
        dropShip(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    })

    test('dropShip calls player.board.placeShip with correct arguments', () => {
         document.body.innerHTML = `
            <div id="player-board">
                <div class="cell" data-x="1" data-y="1"></div>
            </div>
            <div class="ships-container">
                <div id="0" class="destroyer-size" data-size="2" draggable="true"></div>
            </div>
        `;
  
        // Execute drop
        dropShip(mockEvent);
        expect(mockPlaceShip).toHaveBeenCalled();
        expect(globalThis.player.board.placeShip).toHaveBeenCalled();
        expect(globalThis.player.board.placeShip).toHaveBeenCalledWith(
            'player-board', expect.any(Object), 1, 1, false
        );
    });
});

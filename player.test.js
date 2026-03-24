/**
 * @jest-environment jsdom
 */

import Player from '../src/player.js';
import Gameboard from '../src/gameboard.js';

jest.mock('../src/gameboard.js');

describe('Player Factory Function', () => {
    let player;
    let computer;
    let enemyBoard;

    beforeEach(() => {
        player = new Player('One', true);
        computer = new Player('Computer', true);
        document.body.innerHTML = `
            <div id="player-board"></div>
            <div id="computer-board"></div>
            `;
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            document.getElementById('player-board').appendChild(cell);
        };
    });

    test('Player object has a name and gameboard instance', () => {
        expect(player.name).toBe('One');
        expect(player.board).toBeDefined();
        expect(player.isComputer).toBe(true);
    });

    test('Create a computer player', () => {
        expect(computer.isComputer).toBe(true);
    });

    test('computerAttack should fire at a random cell and handle misses', () => {
        const result = computer.computerAttack([]);
        expect(result.cell).toBeDefined();
        expect(document.querySelectorAll('.miss').length).toBe(1);
    });

    test('computerAttack should detect a hit on a ship', () => {
        // Setup a fake ship on the board
        const cells = document.querySelectorAll('#player-board .cell');
        cells[0].classList.add('taken', 'destroyer');

        jest.spyOn(Math, 'random').mockReturnValue(0);

        const mockShip = [{ name: 'destroyer', hit: jest.fn() }];
        const result = computer.computerAttack(mockShip);
        expect(result.shipName).toBe('destroyer');
        expect(cells[0].classList.contains('hit')).toBe(false);
        expect(result.cell).toBe(cells[0]);

        Math.random.mockRestore();
    });

    test('playerAttack should prevent attacking already hit cells', () => {
        const cell = document.createElement('div');
        cell.classList.add('hit');
        const mockEvent = { target: cell };

        const result = player.playerAttack(mockEvent, []);
        expect(result.alreadyAttacked).toBe(true);
    });

    test('playerAttack should register a miss', () => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const mockEvent = { target: cell };

        const result = player.playerAttack(mockEvent, []);
        expect(cell.classList.contains('miss')).toBe(true);
        expect(result.ship).toBeNull();
    });

})
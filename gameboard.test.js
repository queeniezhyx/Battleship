/**
 * *@jesy-enviornment jsdom
 */
 
import Gameboard from '../src/gameboard.js';

describe('Gameboard Class', ()=>{
    let gameboard;
    beforeEach(()=>{
        //set up Dom elements required by the class 
        document.body.innerHTML ='<div id="player-board"></div>';
        gameboard = new Gameboard('player-board');
    })

    test ('initilizes empty 10x10 board', ()=> {
        expect(gameboard.board.length).toBe(10);
        expect(gameboard.board[0].length).toBe(10);
        expect(gameboard.ships.length).toBe(0);
    });

    test('renderBoarrd creates 100 cells', ()=>{
        gameboard.renerBoard('player-board');
            const cells= document.querySelectorAll('.cell');
            expect(cells.length).toBe(100);
    });
    
      test('getValidity allows valid horizontal placement', () => {
    gameboard.renderBoard('player-board');
    const allCells = document.querySelectorAll('.cell');
    const ship = { name: 'des', length: 3 };
    // Ship length 3, horizontal, at index 0 (0,1,2)
    const result = gameboard.getValidity(allCells, true, 0, 0, ship);
    expect(result.valid).toBe(true);
    expect(result.notTaken).toBe(true);
    expect(result.shipCells.length).toBe(3);
  });

  test('getValidity blocks invalid vertical boundary', () => {
    gameboard.renderBoard('player-board');
    const allCells = document.querySelectorAll('.cell');
    const ship1 = { name: 'dest', length: 5 }
    // Ship length 5, vertical, starts near bottom, index 95 (too low)
    const result = gameboard.getValidity(allCells, false, 9, 5, ship1);
    expect(result.valid).toBe(false);
  });

  test('placeShip marks cells as taken', () => {
    gameboard.renderBoard('player-board');
    const ship2 = { name: 'destr', length: 2 };
    // Place horizontally at index 0
    gameboard.placeShip('player-board', ship2, 0, 0, false);
    
    const cell0 = document.getElementById('0');
    const cell1 = document.getElementById('1');
    expect(cell0.classList.contains('taken')).toBe(true);
    expect(cell1.classList.contains('taken')).toBe(true);
  });

  test('getValidity prevents overlapping ships', () => {
    gameboard.renderBoard('player-board');
    const ship3 = { name: 'carrier', length: 5 };
    gameboard.placeShip('player-board', ship3, 0, 0, false); // Places at 0,1,2,3,4
    
    const allCells = document.querySelectorAll('.cell');
    // Try to place another ship over the same area
    const ship4 = {name: 'destro', length: 2 };
    const result = gameboard.getValidity(allCells, true, 0, 2, ship4);
    expect(result.notTaken).toBe(false);
  });
});
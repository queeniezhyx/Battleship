import Ship from '../src/ship.js';

test('ship can be hit and sunk', () => {
    const ship = new Ship('des', 3);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship('dest', 3);
    })

    test('should have the correct length', () => {
        expect(ship.length).toBe(3);
    });
    test('number of times hit', () => {
        ship.hit();
        expect(ship.getHits()).toBe(1);
    });
    test('should not be sunk initially', () => {
        expect(ship.isSunk()).toBe(false);
    })
    test('should be sunk when hits equal length', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
    test('should remain sunk when hits more than length', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
})
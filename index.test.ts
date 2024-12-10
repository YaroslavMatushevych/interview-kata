import { Plateau, MarsRover, runMarsRover, parseInput } from './main';

describe('Plateau', () => {
    it('should be within bounds', () => {
        const plateau = new Plateau(5, 5);

        expect(plateau.isWithinBounds(1, 3)).toBe(true);
    });

    it('should be out of bounds', () => {
        const plateau = new Plateau(3, 3);

        expect(plateau.isWithinBounds(4, 4)).toBe(false);
    });
});

describe('MarsRover', () => {
    const plateua = new Plateau(5, 3);

    it('should initialise a valid position', () => {
        const marsRover = new MarsRover({ x: 1, y: 2, direction: 'N' }, plateua);

        expect(marsRover.getPosition()).toBe('1 2 N');
    });

    it('should throw an error if initialized out of bound', () => {
        expect(() => new MarsRover({ x: 6, y: 5, direction: 'N' }, plateua))
            .toThrow('The initial rover position is out of bounds.');
    });
    

    it('should turn left from the North to West', () => {
        const marsRover = new MarsRover({ x: 1, y: 2, direction: 'N' }, plateua);

        marsRover.executeCommands('L');

        expect(marsRover.getPosition()).toBe('1 2 W')
    });

    it('should turn right from the West to North', () => {
        const marsRover = new MarsRover({ x: 1, y: 2, direction: 'W' }, plateua);

        marsRover.executeCommands('R');

        expect(marsRover.getPosition()).toBe('1 2 N');
    });

    it('should move forward', () => {
        const marsRover = new MarsRover({ x: 1, y: 2, direction: 'W' }, plateua);

        marsRover.executeCommands('M');

        expect(marsRover.getPosition()).toBe('0 2 W');
    });

    it('should execute a full sequence of commands', () => {
        const marsRover = new MarsRover({ x: 1, y: 2, direction: 'N' }, plateua);

        marsRover.executeCommands('LMLMLMLMM');

        expect(marsRover.getPosition()).toBe('1 3 N');
    });
});

describe('ParseInput', () => { 
    it('should correctly parse the input', () => {
        const input = `5 5
        1 2 N
        LMLMLMLMM
        3 3 E
        MMRMMRMRRM`;

        const { plateau, rovers } = parseInput(input);

        expect(plateau).toBeInstanceOf(Plateau);
        expect(plateau.isWithinBounds(5, 5)).toBe(true);

        expect(rovers).toEqual([
            { position: { x: 1, y: 2, direction: 'N' }, commands: 'LMLMLMLMM' },
            { position: { x: 3, y: 3, direction: 'E'}, commands: 'MMRMMRMRRM' },
        ]);
    });
});

describe('RunMarsRover', () => {
    it('should correctly process input and return final positions', () => {
        const input = `5 5
                       1 2 N
                       LMLMLMLMM
                       3 3 E
                       MMRMMRMRRM`;

        const output = `1 3 N
5 1 E`;

        expect(runMarsRover(input)).toBe(output);
    });
});
type Direction = 'N' | 'E' | 'S' | 'W';

interface Position {
    x: number,
    y: number,
    direction: Direction
};

const turnMap: { L: Record<Direction, Direction>, R: Record<Direction, Direction>} = {
    L: { N: 'W', W: 'S', S: 'E', E: 'N' },
    R: { N: 'E', E: 'S', S: 'W', W: 'N' }
}

export class Plateau {
    private readonly LOWER_BOUND = 0;

    constructor(private readonly width: number, private readonly height: number) {};

    isWithinBounds(x: number, y: number) {
        return (
            x >= this.LOWER_BOUND &&
            y >= this.LOWER_BOUND &&
            x <= this.width &&
            y <= this.height
        )
    };
};

export class MarsRover {
    private position: Position;

    constructor(initialPosition: Position, private plateau: Plateau) {
        if (!this.plateau.isWithinBounds(initialPosition.x, initialPosition.y)) {
            throw new Error('The initial rover position is out of bounds.');
        };

        this.position = initialPosition;
    };

    public getPosition(): string {
        return `${this.position.x} ${this.position.y} ${this.position.direction}`;
    };

    private turnLeft(): void {
        this.position.direction = turnMap.L[this.position.direction];
    };

    private turnRight(): void {
        this.position.direction = turnMap.R[this.position.direction];
    };

    private moveForward(): void {
        const movements: Record<Direction, { dx: number, dy: number }> = {
            N: { dx: 0, dy: 1 },
            E: { dx: 1, dy: 0 },
            S: { dx: 0, dy: -1 },
            W: { dx: -1, dy: 0},
        };

        const movement = movements[this.position.direction];
        const newX = this.position.x + movement.dx;
        const newY = this.position.y + movement.dy;

        if (!this.plateau.isWithinBounds(newX, newY)) {
            throw new Error('Rover is trying to move out of plateau bounds');
        };

        this.position.x = newX;
        this.position.y = newY;
    };

    public executeCommands(commands: string): void {
        for (const command of commands) {
            switch(command) {
                case 'L':
                    this.turnLeft();
                    break;
                case 'R':
                    this.turnRight();
                    break;
                case 'M':
                    this.moveForward();
                    break;
                default:
                    throw new Error(`Invalid command: ${command}`);
            };
        };
    };
};

export function parseInput(input: string): { plateau: Plateau, rovers: { position: Position, commands: string }[] } {
    const lines = input.trim().split('\n');
    const [plateauWidth, plateauHeight] = lines[0].split(' ').map(Number);
    const plateau = new Plateau(plateauWidth, plateauHeight);

    const rovers: { position: Position, commands: string }[] = [];
    for (let i = 1; i < lines.length; i += 2) {
        const [x, y, direction] = lines[i].trim().split(' ');
        const position: Position = { x: Number(x), y: Number(y), direction: direction as Direction };
        const commands = lines[i + 1].trim();

        rovers.push({ position, commands });
    };

    return { plateau, rovers }
};


export function runMarsRover(input: string): string {
    const { plateau, rovers } = parseInput(input);

    const results: string[] = [];
    for (const { position, commands } of rovers) {
        const rover = new MarsRover(position, plateau);
        rover.executeCommands(commands);
        results.push(rover.getPosition());
    };

    return results.join('\n');
}

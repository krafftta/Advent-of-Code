import * as fs from 'fs';

type Coordinate = { x: number; y: number };

function parseCoordinates(data: string): Coordinate[] {
    const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');

    const coordinates: Coordinate[] = lines.map(line => {
        const [x, y] = line.split(',').map(num => parseInt(num, 10));
        if (isNaN(x) || isNaN(y)) {
            throw new Error(`Invalid coordinate line: "${line}"`);
        }
        return { x, y };
    });

    return coordinates;
}

function print2DArrayPretty(array: string[][]): void {
    array.forEach(row => {
        console.log(row.join(''));
    });
}

function initalizeGrid(coordinates, area, steps): string[][] {
    let i=0;
    let grid = Array.from({ length: area[0] }, () => Array.from({ length: area[1] }, () => "."));

    for (let c of coordinates) {
        grid[c.y][c.x] = "#";
        i++;
        if (i==steps) {
            break;
        }
    }

    return grid;
}

function bfsShortestPath(grid: string[][]): { path: number[][]; length: number } {
    const rows = grid.length;
    const cols = grid[0].length;

    // Directions: up, down, left, right
    const directions = [
        [0, 1],  // Right
        [0, -1], // Left
        [1, 0],  // Down
        [-1, 0], // Up
    ];

    const isValid = (x: number, y: number): boolean => {
        return x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] === ".";
    };

    const queue: { row: number; col: number; path: number[][] }[] = [];
    queue.push({ row: 0, col: 0, path: [[0, 0]] }); // Start from top-left corner
    grid[0][0] = "O"; // Mark start as visited

    while (queue.length > 0) {
        const { row, col, path } = queue.shift()!;

        // If goal is reached
        if (row === rows - 1 && col === cols - 1) {
            return { path, length: path.length - 1 };
        }

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (isValid(newCol, newRow)) {
                queue.push({ row: newRow, col: newCol, path: [...path, [newRow, newCol]] });
                grid[newRow][newCol] = "O"; // Mark as visited
            }
        }
    }

    return { path: [], length: -1 }; // No path found
}

function solveStarOne(coordinates, area): number {
    const steps = 12;
    let grid = initalizeGrid(coordinates,area, steps)
    //print2DArrayPretty(grid);

    let shorestPath = bfsShortestPath(grid)
    console.log(shorestPath.length)

    return 0;
}

function solveStarTwo(coordinates, area): number {
    const steps = 1024;
    console.log(coordinates.length)
    
    let grid = initalizeGrid(coordinates,area, steps)
    print2DArrayPretty(grid);
    let i=0;
    while (i <10) {
        let grid = initalizeGrid(coordinates,area, steps+i)
        const result = bfsShortestPath(grid);
        if (result.length === -1) {
            return i;
        }
        i++;
    }
    return 0;
}


// Example usage
try {
    const data = fs.readFileSync('2024/day18/input.txt', 'utf8');
    const coordinates = parseCoordinates(data);

    const resultOne = solveStarOne(coordinates, [71,71]);
    console.log(resultOne);

    const resultTwo = solveStarTwo(coordinates, [71,71]);
    console.log(resultTwo);


} catch (err) {
    console.error('Error reading or parsing the input file:', err.message);
}

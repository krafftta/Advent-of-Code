import * as fs from 'fs';

function parse(data: string): number[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split("").map(Number));
}

function findZeroIndices(matrix: number[][]): [number, number][] {
    const indices: [number, number][] = [];

    matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            if (value === 0) {
                indices.push([rowIndex, colIndex]);
            }
        });
    });

    return indices;
}

const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
];

const isValid = (input:number[][], row: number, col: number) =>
    row >= 0 && row < input.length && col >= 0 && col < input[0].length;

function traversePath(input: number[][], row: number, col: number, currentLength:number = 0, currentValue: number = 0): number[][] {
    if (currentLength == 9) {
        return [[row, col]];
    }

    let peaks:number[][] = [];

    for (const [dv, dh] of directions) {
        let newRow = row + dv;
        let newCol = col + dh;

        if (isValid(input, newRow, newCol) && input[newRow][newCol] == currentValue + 1) {
            peaks.push(...traversePath(input, newRow, newCol, currentLength+1, input[newRow][newCol]));
        }
    }

    return peaks;
}

function solveStarOne(input: number[][]): number {
    let trailheads = findZeroIndices(input)
    let result = 0;
    
    for (let [startRow, startCol] of trailheads) {
        const peaks = traversePath(input, startRow, startCol, 0, 0);

        // Remove duplicates
        const uniquePeaks = Array.from(
            new Set(peaks.map(node => JSON.stringify(node))) // Convert arrays to strings for comparison
        ).map(str => JSON.parse(str)); // Convert strings back to arrays
        result += uniquePeaks.length;
        
    }
    return result;
}

function solveStarTwo(input: number[][]): number {
    let trailheads = findZeroIndices(input)
    let result = 0;
    
    for (let [startRow, startCol] of trailheads) {
        const peaks = traversePath(input, startRow, startCol, 0, 0);
        // Removed uniqueness rule, this way all trails to reach the summits are counted.
        result += peaks.length;
        
    }
    return result;;
}

try {
    let data:string = fs.readFileSync('2024/day10/input.txt','utf8');
    let grid = parse(data);
    let resultOne = solveStarOne(grid);
    let resultTwo = solveStarTwo(grid);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
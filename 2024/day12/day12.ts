import * as fs from 'fs';

function parse(data: string): string[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split(""));
}

const directions = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
];

const isValid = (input:string[][], row: number, col: number) =>
    row >= 0 && row < input.length && col >= 0 && col < input[0].length;

function travelRegion(visitedGarden:string[][], plant: string, row: number, col: number): [number, number] {
    // Base case: if the cell is out of bounds or not the target plant
    if (!isValid(visitedGarden, row, col)) {
        return [0, 1]; // Out of bounds contributes to the perimeter
    }

    // If the cell is already visited, stop the recursion
    if (visitedGarden[row][col] === '.') {
        return [0, 0];
    }

    if (visitedGarden[row][col] !== plant) {
        return [0, 1]; // Non-matching cell contributes to the perimeter
    }

    visitedGarden[row][col] = '.';

    let area = 1;
    let perimeter = 0;

    for (let [dv,dh] of directions) {
        let newRow = row + dv;
        let newCol = col + dh;
        let [neighborArea, neighborPerimeter] = travelRegion(
            visitedGarden,
            plant,
            newRow,
            newCol
        );
        area += neighborArea;
        perimeter += neighborPerimeter;
        
    }

    return [area, perimeter];
} 

function solveStarOne(garden: string[][]): number {
    let totalPrice = 0;
    let visitedGarden =  garden.map(row => [...row]);
    for(let row=0; row<visitedGarden.length; row++) {
        for(let col=0; col<visitedGarden[0].length; col++) {
            let currentPlant = visitedGarden[row][col];
            if (currentPlant !== '.') {
                let [area, perimeter] = travelRegion(visitedGarden, currentPlant, row, col)
                totalPrice += perimeter;
                visitedGarden =  garden.map(row => [...row]);
            }
        }
    }
    return totalPrice;
}

function solveStarTwo(garden: string[][]): number {
    let totalPrice = 0;
    return totalPrice;
}

try {
    const data:string = fs.readFileSync('2024/day12/input.txt','utf8');
    let garden = parse(data);
    let resultOne = solveStarOne(garden);
    let resultTwo = solveStarTwo(garden);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
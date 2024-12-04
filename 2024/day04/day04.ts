import * as fs from 'fs';

function parse(data: string): string[][] {
    return data
        .trim()
        .split("\n")
        .map(line => Array.from(line));
}

function solveStarOne(grid: string[][], target:string): number {
    let result = 0;
    const directions = [
        { name: "right", dv: 0, dh: 1 },
        { name: "left", dv: 0, dh: -1 },
        { name: "down", dv: 1, dh: 0 },
        { name: "up", dv: -1, dh: 0 },
        { name: "diag_down_right", dv: 1, dh: 1 },
        { name: "diag_up_left", dv: -1, dh: -1 },
        { name: "diag_down_left", dv: 1, dh: -1 },
        { name: "diag_up_right", dv: -1, dh: 1 },
    ];

    const isInBounds = (row: number, col: number) =>
        row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] != target[0]) continue;

            for (const {name, dv, dh} of directions) {
                let currentWord:string = target[0];
                console.log(name)
                
                for (let j=1; j < target.length; j++) {
                    let nextRow = row + j*dv;
                    let nextCol = col + j*dh;

                    if (isInBounds(nextRow, nextCol)) {
                        if (grid[nextRow][nextCol] != target[j]) {
                            break;
                        } else {
                            //console.log(nextRow, nextCol)
                            currentWord = currentWord.concat(grid[nextRow][nextCol]);
                        } 
                    }
                }
                
                if (currentWord === target) {
                    // console.log(row, col, currentWord);
                    result += 1;
                }

            }

        }
    }

    return result;
}

function solveStarTwo(grid: string[][], target:string): number {
    // Identify X-MAS as MASes that meet in an X shape
    let result = 0;
    let foundXs = [];
    const directions = [
        { name: "diag_down_right", dv: 1, dh: 1},
        { name: "diag_up_left", dv: -1, dh: -1},
        { name: "diag_down_left", dv: 1, dh: -1},
        { name: "diag_up_right", dv: -1, dh: 1},
    ];

    const isInBounds = (row: number, col: number) =>
        row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] != target[0]) continue;

            for (const {name, dv, dh} of directions) {
                // Find first occurence
                let currentWord:string = target[0];
                let match = false;
                
                for (let j=1; j < target.length; j++) {
                    let nextRow = row + j*dv;
                    let nextCol = col + j*dh;

                    if (isInBounds(nextRow, nextCol)) {
                        if (grid[nextRow][nextCol] != target[j]) {
                            break;
                        } else {
                            // If at intersection, check if intersection has been checked before and look for X match
                            if (grid[nextRow][nextCol] == 'A' && !foundXs.some((a)=> a[0]==nextRow && a[1]==nextCol)) {
                                if (isInBounds(nextRow-1, nextCol-1) && isInBounds(nextRow+1, nextCol+1)) {

                                    // Look in both directions to find X match
                                    if (grid[nextRow+1*dv][nextCol-1*dh] == 'M' && grid[nextRow-1*dv][nextCol+1*dh] == 'S' || grid[nextRow-1*dv][nextCol+1*dh] == 'M' && grid[nextRow+1*dv][nextCol-1*dh] == 'S') {
                                        match = true;
                                        foundXs.push([nextRow,nextCol]);
                                    }
                                }
                            }
                            currentWord = currentWord.concat(grid[nextRow][nextCol]);
                        } 
                    }
                }
                
                if (currentWord === target && match) {
                    result += 1
                }

            }

        }
    }

    return result;
}

try {
    let data:string = fs.readFileSync('2024/day04/input.txt','utf8');
    // data = "MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX";
    let grid = parse(data);
    let resultOne = solveStarOne(grid, "XMAS");
    let resultTwo = solveStarTwo(grid, "MAS");
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
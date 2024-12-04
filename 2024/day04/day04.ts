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
    const directions = [
        { name: "diag_down_right", dv: 1, dh: 1, opposites: ['diag_down_left', 'diag_up_right']  },
        { name: "diag_up_left", dv: -1, dh: -1, opposites: ['diag_up_right','diag_down_left'] },
        { name: "diag_down_left", dv: 1, dh: -1, opposites: ['diag_down_right','diag_up_left'] },
        { name: "diag_up_right", dv: -1, dh: 1, opposites: ['diag_down_left','diag_down_right'] },
    ];

    const isInBounds = (row: number, col: number) =>
        row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

    const getDirectionVector = (name: string) => {
        const dir = directions.find(d => d.name === name);
        return [dir.dv, dir.dh];
    };

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] != target[0]) continue;

            for (const {name, dv, dh, opposites} of directions) {
                // Find first occurence
                let currentWord:string = target[0];
                
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
                    // If target is found, check for diagonal matches in X-shape using opposite vectors
                    for (const opp of opposites) {
                        // Get starting point
                        const oppVector = getDirectionVector(opp);
                        if (!oppVector) continue;
                        const [oppDv, oppDh] = oppVector;
                        
                        // Todo: find start point
                        let oppStartRow = row;
                        let oppStartCol = col - 2;

                        // Check if start is in bounds and correct letter
                        if (!isInBounds(oppStartRow, oppStartCol)) continue;
                        if (grid[oppStartRow][oppStartCol] != target[0]) continue;

                        // Find second occurence
                        let secondWord = target[0];
                        for (let k=1; k < target.length; k++) {
                            let nextRow = oppStartRow + k*oppDv;
                            let nextCol = oppStartCol + k*oppDh;
        
                            if (isInBounds(nextRow, nextCol)) {
                                if (grid[nextRow][nextCol] != target[k]) {
                                    break;
                                } else {
                                    //console.log(nextRow, nextCol)
                                    secondWord = secondWord.concat(grid[nextRow][nextCol]);
                                } 
                            }
                        }
                        if (secondWord === target) {
                            console.log(row, col, oppStartRow, oppStartCol, secondWord);
                            result += 1;
                        }
                    }
                }

            }

        }
    }

    return result;
}

try {
    let data:string = fs.readFileSync('2024/day04/input.txt','utf8');
    data = "MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX";
    let grid = parse(data);
    let resultOne = solveStarOne(grid, "XMAS");
    let resultTwo = solveStarTwo(grid, "MAS");
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
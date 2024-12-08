import * as fs from 'fs';

function parse(data: string): string[][] {
    return data
        .trim()
        .split("\n")
        .map(line => Array.from(line));
}


function solveStarOne(input: string[][]): number {
    let antinodes = new Array<number[]>();
    for (let row=0; row < input.length; row++) {
        for (let col=0; col < input[0].length; col++) {
            let currentLetter = input[row][col];
            if (currentLetter != '.') {
                for (let i=0; i < input.length; i++) {
                    for (let j=0; j < input[0].length; j++) {
                        if (i!==row && j!==col && input[i][j] == currentLetter) {
                            let xDiff = i - row;
                            let yDiff = j - col;
                            let antinodeOne = [i + xDiff, j + yDiff];
                            let antinodeTwo = [row - xDiff, col - yDiff];
                            if (antinodeOne[0] >= 0 && antinodeOne[0] < input.length
                                && antinodeOne[1] >= 0 && antinodeOne[1] < input[0].length
                                && !antinodes.some(a => a[0]==antinodeOne[0] && a[1]==antinodeOne[1])
                            ) {
                                antinodes.push(antinodeOne);
                            }
                            if (antinodeTwo[0] >= 0 && antinodeTwo[0] < input.length
                                && antinodeTwo[1] >= 0 && antinodeTwo[1] < input[0].length
                                && !antinodes.some(a => a[0]==antinodeTwo[0] && a[1]==antinodeTwo[1])
                            ) {
                                antinodes.push(antinodeTwo);
                            }
                        }
                    }
                }

            }
        }
    }

    return antinodes.length;
}

function solveStarTwo(input: string[][]): number {
    let antinodes = new Array<number[]>();
    for (let row=0; row < input.length; row++) {
        for (let col=0; col < input[0].length; col++) {
            let currentLetter = input[row][col];
            if (currentLetter != '.') {
                for (let i=0; i < input.length; i++) {
                    for (let j=0; j < input[0].length; j++) {
                        if (i!==row && j!==col && input[i][j] == currentLetter) {
                            antinodes.push([row, col]);
                            let xDiff = i - row;
                            let yDiff = j - col;
                            let newAntinodeOne = [i + xDiff, j + yDiff];
                            let k = 1;
                            while (row - xDiff * k >= 0 && row - xDiff * k < input.length
                                && col - yDiff * k >= 0 && col - yDiff * k < input[0].length
                            ) {
                                newAntinodeOne = [row - xDiff * k, col - yDiff * k];
                                k++;
                                antinodes.push(newAntinodeOne);
                            }

                            let newAntinodeTwo = [i + xDiff, j + yDiff];
                            let l = 1;
                            while (row - xDiff * l >= 0 && row - xDiff * l < input.length
                                && col - yDiff * l >= 0 && col - yDiff * l < input[0].length
                            ) {
                                newAntinodeTwo = [row - xDiff * l, col - yDiff * l];
                                l++;
                                antinodes.push(newAntinodeTwo);
                            }
                        }
                    }
                }

            }
        }
    }

    // Remove duplicates
    const uniqueAntinodes = Array.from(
        new Set(antinodes.map(node => JSON.stringify(node))) // Convert arrays to strings for comparison
    ).map(str => JSON.parse(str)); // Convert strings back to arrays

    return uniqueAntinodes.length;
}

try {
    let data:string = fs.readFileSync('2024/day08/input.txt','utf8');
    let grid = parse(data);
    let resultOne = solveStarOne(grid);
    let resultTwo = solveStarTwo(grid);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
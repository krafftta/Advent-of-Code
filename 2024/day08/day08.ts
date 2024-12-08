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

    console.log(antinodes)
    return antinodes.length;
}

function solveStarTwo(input: string[][]): number {
    return 0;
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
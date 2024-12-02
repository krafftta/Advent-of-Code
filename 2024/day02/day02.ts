import * as fs from 'fs';

function parse(data: string): number[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split(" ").map(Number));
}

function checkSortedAndDiff(arr: number[]): number {
    let i = 0;
    while (i < arr.length - 1) {
        if (arr[i] > arr[i + 1]) {
            return 0;
        } else {
            if (0 == (arr[i] - arr[i + 1]) || Math.abs(arr[i] - arr[i + 1]) > 3) {
                return 0;
            }
        }
        i++;
    }
    return 1;
}

function solveStarOne(levels: number[][]): number {
    let countSafeLevels = 0;
    for (let level of levels) {
        // Stupid sorting logic but works for no tolerance strategy
        if (level[0] > level[level.length - 1]) {
            level.reverse()
        }
        countSafeLevels += checkSortedAndDiff(level)
    }
    return countSafeLevels;
}

function solveStarTwo(levels: number[][]): number {
    let countSafeLevels = 0;
    return countSafeLevels;
}

try {
    const data:string = fs.readFileSync('2024/day02/input.txt','utf8');
    let levels = parse(data);
    let resultOne = solveStarOne(levels);
    let resultTwo = solveStarTwo(levels);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}

console.log(checkSortedAndDiff([1,2,4,6,7])) // 1
console.log(checkSortedAndDiff([1,2,6,7,8])) // 0
console.log(checkSortedAndDiff([1,6,7,8,9])) // 0 -> 1
console.log(checkSortedAndDiff([1,4,4,6,8])) // 0 -> 1
console.log(checkSortedAndDiff([1,3,2,4,5])) // 0 -> 1
console.log(checkSortedAndDiff([53, 54, 57, 58, 59, 61, 65])) // 0 -> 1
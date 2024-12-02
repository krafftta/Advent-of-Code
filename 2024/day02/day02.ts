import * as fs from 'fs';

function parse(data: string): number[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split(" ").map(Number));
}

function diff(arr: number[]): number[] {
    if (arr.length < 2) {
        return []; // Return an empty array if there are less than 2 elements
    }
    return arr.slice(1).map((value, index) => value - arr[index]);
}

function checkSortedAndDiff(arr: number[]): number {
    let diffArr = diff(arr);
    if (diffArr.some((a) => Math.abs(a) > 3 || a === 0)) {
        return 0;
    }

    const hasBothDirections = diffArr.some((a) => a > 0) && diffArr.some((a) => a < 0);
    if (hasBothDirections) {
        return 0;
    }

    return 1;
}

function updatedCheckSortedAndDiff(arr: number[]): number {
    return 0;
}

function solveStarOne(levels: number[][]): number {
    let countSafeLevels = 0;
    for (let level of levels) {
        countSafeLevels += checkSortedAndDiff(level)
    }
    return countSafeLevels;
}

function solveStarTwo(levels: number[][]): number {
    let countSafeLevels = 0;
    for (let level of levels) {
        countSafeLevels += updatedCheckSortedAndDiff(level)
    }
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

console.log(updatedCheckSortedAndDiff([1,2,4,6,7])) // 1
console.log(updatedCheckSortedAndDiff([1,2,6,7,8])) // 0
console.log(updatedCheckSortedAndDiff([1,6,7,8,9])) // 0 -> 1
console.log(updatedCheckSortedAndDiff([1,4,4,6,8])) // 0 -> 1
console.log(updatedCheckSortedAndDiff([1,3,2,4,5])) // 0 -> 1
console.log(updatedCheckSortedAndDiff([1,2,3,4,0])) // 0 -> 1
console.log(updatedCheckSortedAndDiff([53, 54, 57, 58, 59, 61, 65])) // 0 -> 1
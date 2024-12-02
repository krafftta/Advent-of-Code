import * as fs from 'fs';

function parse(data: string): number[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split(" ").map(Number));
}

function diff(arr: number[]): number[] {
    // Get distances between neighbours, inspired by Python's np.diff
    if (arr.length < 2) {
        return [];
    } else {
        return arr.slice(1).map((value, index) => value - arr[index]); // or: Array.from({ length: arr.length - 1 }, (_, i) => arr[i + 1] - arr[i]);
    }
}

function tryRemovingEitherSide(arr: number[], diffArr: number[], removeIndex: number): number {
    // Tries removing either the current or the next element to see if the preexisting issue can be solved
    let removeLeft = updatedCheckSortedAndDiff([...arr.slice(0, removeIndex), ...arr.slice(removeIndex + 1)], 1);
    let removeRight = updatedCheckSortedAndDiff([...arr.slice(0, removeIndex + 1), ...arr.slice(removeIndex + 2)], 1);
    return Math.max(removeRight, removeLeft);
}

function checkSortedAndDiff(arr: number[]): number {
    // Solution for Star One
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

function updatedCheckSortedAndDiff(arr: number[], tolerate: number = 0): number {
    // Updated Function for Star Two
    // Get distances between neighbouring elements
    let diffArr = diff(arr);
    // console.log(arr, diffArr)

    // Check if there is an issue with the sorting
    const hasBothDirections = diffArr.some((a) => a > 0) && diffArr.some((a) => a < 0);
    if (hasBothDirections) {
        // The Problem Dampener allows one retry
        if (tolerate==0) {
            let removeIndex = 0;
            if (diffArr.filter((a) => a > 0).length > diffArr.filter((a) => a < 0).length) {
                removeIndex = diffArr.findIndex((a) =>  a < 0);
            } else {
                removeIndex = diffArr.findIndex((a) =>  a > 0);
            }
            return tryRemovingEitherSide(arr, diffArr, removeIndex);
        } else {
            return 0;
        }
    }

    // Check if a diff between neigbours is too large or zero
    if (diffArr.some((a) => Math.abs(a) > 3 || a === 0)) {
        if (tolerate==0) {
            let removeIndex = diffArr.findIndex((a) => Math.abs(a) > 3 || a === 0);
            return tryRemovingEitherSide(arr, diffArr, removeIndex);
        } else {
            return 0;
        }
    }

    return 1;
}

function solveStarOne(levels: number[][]): number {
    let countSafeLevels = 0;
    for (let level of levels) {
        countSafeLevels += checkSortedAndDiff(level);
    }
    return countSafeLevels;
}

function solveStarTwo(levels: number[][]): number {
    let countSafeLevels = 0;
    for (let level of levels) {
        countSafeLevels += updatedCheckSortedAndDiff(level);
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

// Tests
// console.log(updatedCheckSortedAndDiff([1,2,4,6,7])) // 1
// console.log(updatedCheckSortedAndDiff([1,2,6,7,8])) // 0
// console.log(updatedCheckSortedAndDiff([1,6,7,8,9])) // 0 -> 1
// console.log(updatedCheckSortedAndDiff([1,4,4,6,8])) // 0 -> 1
// console.log(updatedCheckSortedAndDiff([1,3,2,4,5])) // 0 -> 1
// console.log(updatedCheckSortedAndDiff([1,8,2,4,5])) // 0 -> 1
// console.log(updatedCheckSortedAndDiff([1,2,3,4,0])) // 0 -> 1
// console.log(updatedCheckSortedAndDiff([53, 54, 57, 58, 59, 61, 65])) // 0 -> 1
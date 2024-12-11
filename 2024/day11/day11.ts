import * as fs from 'fs';
import { skip } from 'node:test';

function parse(data: string): number[] {
    return data
        .trim().split(" ").map(Number);
}

const blinks = 75;

function solveStarOne(stones: number[]): number {
    for (let i = 0; i < blinks; i++) {
        const newStones: number[] = [];
        console.log(i, stones.length)
        for (let sId = 0; sId < stones.length; sId++) {
            const s = stones[sId];
            if (s === 0) {
                // Replace 0 with 1
                newStones.push(1);
            } else {
                const sStr = s.toString();
                if (sStr.length % 2 === 0) {
                    // Even length: split into two numbers
                    const half = sStr.length / 2;
                    newStones.push(
                        parseInt(sStr.substring(0, half), 10),
                        parseInt(sStr.substring(half), 10)
                    );
                } else {
                    // Odd length: multiply by 2024
                    newStones.push(s * 2024);
                }
            }
        }
        // Replace the old array with the transformed one
        stones = newStones;
    }

    return stones.length;
}

function solveStarTwo(originalStones: number[]): number {
    let result = 0;
    return result;
}


try {
    let data:string = fs.readFileSync('2024/day11/input.txt','utf8');
    let stones = parse(data);
    //let resultOne = solveStarOne(stones);
    let resultTwo = solveStarTwo(stones);
    console.log(resultTwo);
  } catch (err) {
    console.error(err);
}
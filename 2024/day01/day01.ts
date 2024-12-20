import * as fs from 'fs';


function parse(data: string): [Array<number>, Array<number>] {
    let lines = data.split('\n')
    let listOne: Array<number> = [];
    let listTwo: Array<number> = [];
    for (let l of lines) {
        let elements = l.split('   ');
        listOne.push(parseInt(elements[0]));
        listTwo.push(parseInt(elements[1]));
    }
    return [listOne, listTwo]
}

function solveStarOne(listOne:Array<number>, listTwo: Array<number>): number {
    let result = 0;
    listOne.sort((a, b) => a - b);
    listTwo.sort((a, b) => a - b);

    for (let i=0; i<listOne.length; i++) {
        result += Math.abs(listOne[i] - listTwo[i]);
    } 

    return result;
}

function solveStarTwo(listOne:Array<number>, listTwo: Array<number>): number {
    let result = 0;
    let counts = {};

    // Iterate over all elements of the left list
    for (let ele of listOne) {
        for (let comp of listTwo) {
            // Count appearances in right list
            if (ele === comp) {
                if (counts[ele] === undefined) {
                    counts[ele] = 1; // Initialize if not already in counts
                } else {
                    counts[ele] += 1; // Increment if already exists
                }
            }
        }
    }

    for (let m in counts) {
        // Mulitply left element with appearance in right list
        result += counts[m]* parseInt(m);
    }

    return result
}


try {
    const data:string = fs.readFileSync('2024/day01/input.txt','utf8');
    let [listOne, listTwo] = parse(data);
    let resultOne = solveStarOne(listOne, listTwo);
    let resultTwo = solveStarTwo(listOne, listTwo);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
  }



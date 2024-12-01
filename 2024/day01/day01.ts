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

function solve(listOne:Array<number>, listTwo: Array<number>): number {
    let result = 0;
    listOne.sort((a, b) => a - b);
    listTwo.sort((a, b) => a - b);

    for (let i=0; i<listOne.length; i++) {
        result += Math.abs(listOne[i] - listTwo[i]);
    } 

    return result;
}


try {
    const data:string = fs.readFileSync('2024/day01/input.txt','utf8');
    let [listOne, listTwo] = parse(data);
    let result = solve(listOne, listTwo);
    console.log(result);
  } catch (err) {
    console.error(err);
  }



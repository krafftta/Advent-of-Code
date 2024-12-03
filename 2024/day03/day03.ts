import * as fs from 'fs';

function parseMul(mulString:string): [number, number]{
    var numberPattern = /\d+/g;
    let factors = mulString.match(numberPattern);
    return [parseInt(factors[0]), parseInt(factors[1])];
}

function mult(n:number, m:number): number{
    return n*m;
}

function solveStarOne(input: string): number {
    let result = 0;
    let regexp = new RegExp(`mul\\(\\d{1,3},\\d{1,3}\\)`, 'g');
    
    let matches = Array.from(input.matchAll(regexp));

    console.log(matches[0]);

    for (let mul of matches) {
        let [n,m] = parseMul(mul[0]);
        result += mult(n,m);
    }
    return result
}


try {
    const corruptedData:string = fs.readFileSync('2024/day03/input.txt','utf8');
    let resultOne = solveStarOne(corruptedData);
    //let resultTwo = solveStarTwo(levels);
    console.log(resultOne);
    //console.log(resultTwo);
  } catch (err) {
    console.error(err);
}
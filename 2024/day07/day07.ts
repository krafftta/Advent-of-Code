import * as fs from 'fs';

function parse(input: string): Array<{ result: number, inputs: number[] }> {
    // Split the input into lines
    const lines = input.trim().split("\n");
    
    // Map each line into the desired object structure
    return lines.map(line => {
        // Split each line into the result and inputs
        const [resultPart, inputsPart] = line.split(":");
        const result = parseInt(resultPart.trim(), 10);
        const inputs = inputsPart.trim().split(" ").map(num => parseInt(num, 10));
        
        return { result, inputs };
    });
}

const operators = ["*", "+", "||"];

// Function to apply an operator to two numbers
const applyOperator = (a: number, b: number, operator: string): number => {
    switch (operator) {
        case "+":
            return a + b;
        case "*":
            return a * b;
        case "||":
            return parseInt(a.toString().concat(b.toString()), 10)
        default:
            throw new Error("Unsupported operator");
    }
};

function getPossibleResults(inputs: number[], operators: string[]): number[] {
    if (inputs.length === 1) {
        return [inputs[0]];
    }

    let results:number[] = [];

    for (const operator of operators) {
            // Always get the first two numbers and get their result
            const combined = applyOperator(inputs[0], inputs[1], operator);

            const updatedInputs = [
                combined,
                ...inputs.slice(2),
            ];
            
            // Recursively calculate combinations for the new array
            results.push(...getPossibleResults(updatedInputs, operators));
        }
    return results;
}

function solveStarOne(input : Array<{ result: number, inputs: number[] }>): number {
    let result = 0;

    for (let line=0; line < input.length; line++) {
        let possibleResults = getPossibleResults(input[line].inputs, ["*", "+"]);
        if (possibleResults.find(a => a===input[line].result)) {
            result += input[line].result;
        }
    }

    return result;
}

function solveStarTwo(input: Array<{ result: number, inputs: number[] }>): number {
    let result = 0;

    for (let line=0; line < input.length; line++) {
        let possibleResults = getPossibleResults(input[line].inputs, ["*", "+", "||"]);
        if (possibleResults.find(a => a===input[line].result)) {
            result += input[line].result;
        }
    }

    return result;
}



try {
    let data:string = fs.readFileSync('2024/day07/input.txt','utf8');
    let inputOne = parse(data);
    let inputTwo = parse(data);
    let resultOne = solveStarOne(inputOne);
    let resultTwo = solveStarTwo(inputTwo);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
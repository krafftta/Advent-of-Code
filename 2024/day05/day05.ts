import * as fs from 'fs';

function parseInput(data: string): number[][] {
    return data
        .trim()
        .split("\n")
        .map(line => line.split(",").map(Number));
}

function parseRules(data: string): number[][] {
    return data
    .trim()
    .split("\n")
    .map(line => line.split("|").map(Number));
}

function solveStarOne(input:number[][], rules: number[][]):number {
    let correctUpdates: number[][] = [];

    const ruleApplies = (inputRow: number[], x: number, y: number) =>
        inputRow.some((a)=> a===x) && inputRow.some((a)=> a==y);

    // Iterate through updates
    for (let row=0; row<input.length; row++) {
        let valid = true;
        // Iterate through rules
        for (let rule of rules) {
            let x = rule[0];
            let y = rule[1];
            // Check if rule is relevant
            if (ruleApplies(input[row],x,y)) {
                // Check if rule is broken
                if (input[row].indexOf(x) > input[row].indexOf(y)) {
                    valid = false;
                    break;
                }
            }
        }
        if (valid) {
            correctUpdates.push(input[row])
        }
        
    }

    // Calculate result
    let result = 0
    for (let update of correctUpdates) {
        result += update[Math.floor(update.length/2)];
    }

    return result;
}

function fixRow(arr: number[], rules: number[][]): number[] {
    const graph = new Map();
    const inDegree = new Map();

    // Initialize graph and in-degree for all elements in arr
    arr.forEach((item) => {
        graph.set(item, []);
        inDegree.set(item, 0);
    });

    // Add edges based on the rules
    rules.forEach(([x, y]) => {
        if (graph.has(x) && graph.has(y)) {
            graph.get(x).push(y); // x -> y
            inDegree.set(y, inDegree.get(y) + 1); // Number of incoming edges
        }
    });

    // Perform stable topological sort
    const queue = [];
    const result = [];

    // Add elements with in-degree 0 (in their original order)
    arr.forEach((item) => {
        if (inDegree.get(item) === 0) {
            queue.push(item);
        }
    });

    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);

        for (const neighbor of graph.get(current)) {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                // Add neighbors to the queue in the order they appear in arr
                if (!queue.includes(neighbor)) queue.push(neighbor);
            }
        }
    }

    return result;
}



function solveStarTwo(input:number[][], rules: number[][]):number {
    let invalidUpdates: number[][] = [];

    const ruleApplies = (inputRow: number[], x: number, y: number) =>
        inputRow.some((a)=> a===x) && inputRow.some((a)=> a==y);

    // Iterate through updates
    for (let row=0; row<input.length; row++) {
        let valid = true;
        let applyingRules = []
        // Iterate through rules
        for (let rule of rules) {
            let x = rule[0];
            let y = rule[1];
            // Check if rule is relevant
            if (ruleApplies(input[row],x,y)) {
                // Check if rule is broken
                if (input[row].indexOf(x) > input[row].indexOf(y)) {
                    valid = false;
                    
                }
                applyingRules.push(rule);
            }
        }
        if (!valid) {
            let fixedRow = fixRow(input[row], applyingRules);
            invalidUpdates.push(fixedRow);
        }
    }

    // Calculate result
    let result = 0
    for (let update of invalidUpdates) {
        console.log(update)
        result += update[Math.floor(update.length/2)];
    }

    return result;
}



try {
    let data:string = fs.readFileSync('2024/day05/input.txt','utf8');
    //  data = "75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47"
    let input = parseInput(data);
    let rulesData:string = fs.readFileSync('2024/day05/rules.txt','utf8');
    let rules = parseRules(rulesData);
    let resultOne = solveStarOne(input, rules);
    let resultTwo = solveStarTwo(input, rules);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
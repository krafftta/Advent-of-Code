import * as fs from 'fs';

function parse(data: string): string[][] {
    return data
        .trim()
        .split("\n")
        .map(line => Array.from(line));
}

const guardLookalikes = ["^",">","<","v"];

const directions = [
    [-1, 0, 1],  // ^ (up)
    [0, 1, 2],   // > (right)
    [1, 0, 3],   // v (down)
    [0, -1, 0] // < (left)
];

function findGuard(input:string[][]): [string, number, number] {
    for (let row=0; row<input.length; row++) {
        for (let col=0; col<input[0].length; col++) {
            if (guardLookalikes.some(e => e === input[row][col])) {
                return [input[row][col],row, col];
            }
        }
    }
    throw new Error("No Guard Found.");
}

function solveStarOne(input:string[][]):number {
    let visited = 0;
    let [direction,guardX,guardY] = findGuard(input);
    let dirIndex = guardLookalikes.indexOf(direction);

    while (guardX >= 0 && guardX < input.length && guardY >= 0 && guardY < input[0].length) {
        
        if (input[guardX][guardY] != "X") {
            input[guardX][guardY] = "X";
            visited++;
        }
       
        // Calculate the next position
        const [dx, dy, nextDir] = directions[dirIndex];
        guardX += dx;
        guardY += dy;

        if (guardX < 0 || guardX >= input.length || guardY < 0 || guardY >= input[0].length) {
            // Stepped outside!           
            break;
        } else if (input[guardX][guardY] == '#') {
            // Don't step there and turn right (nextDir)
            guardX -= dx;
            guardY -= dy;
            dirIndex = nextDir;
        }

    }
    return visited;
}




function solveStarTwo(input:string[][]):number {
    let options = 0;
    let visited = 0;

    try {
        let [direction,guardX,guardY] = findGuard(input);
        let dirIndex = guardLookalikes.indexOf(direction);

        let lastTurns = [[dirIndex,guardX,guardY]];

        while (guardX >= 0 && guardX < input.length && guardY >= 0 && guardY < input[0].length) {
            if (input[guardX][guardY] != "X") {
                input[guardX][guardY] = "X";
                visited++;
            } 
           
            // Calculate the next position
            const [dx, dy, nextDir] = directions[dirIndex];
            guardX += dx;
            guardY += dy;

            if (guardX < 0 || guardX >= input.length || guardY < 0 || guardY >= input[0].length) {
                // Stepped outside!           
                break;
            }

            // Detect loops in lastTurns
            if (input[guardX][guardY] == '#') {
                // Don't step there and turn right (nextDir)
                guardX -= dx;
                guardY -= dy;
                dirIndex = nextDir;
                lastTurns.push([dirIndex, guardX, guardY])
            } else if (lastTurns.length >= 4 && input[guardX][guardY]!='#') {
                // Loop through previous turns to find a match
                for (let i = 0; i < lastTurns.length - 3; i++) {
                    const [lastDir, lastX, lastY] = lastTurns[i];

                    if (
                        (dy === 0 && guardX === lastX) || // Horizontal alignment
                        (dx === 0 && guardY === lastY)    // Vertical alignment
                    ) {
                        if (nextDir === lastDir) { // Ensure direction matches
                            console.log("Potential loop:", lastTurns, guardX, guardY);
                            options++;
                        }
                    }
                }
            }
    
        }
        return options;
    
    } catch (e) {
        return 0;
    }  
}




try {
    let data:string = fs.readFileSync('2024/day06/input.txt','utf8');
    let inputOne = parse(data);
    let inputTwo = parse(data);
    let resultOne = solveStarOne(inputOne);
    let resultTwo = solveStarTwo(inputTwo);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
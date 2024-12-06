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




function solveStarTwo(input: string[][]): number {
    let options = 0;

    try {
        let [direction, guardX, guardY] = findGuard(input);
        let dirIndex = guardLookalikes.indexOf(direction);

        let lastTurns = [[dirIndex, guardX, guardY]];

        while (guardX >= 0 && guardX < input.length && guardY >= 0 && guardY < input[0].length) {
            if (input[guardX][guardY] !== "X") {
                input[guardX][guardY] = "X";
            }

            // Calculate the next position
            const [dx, dy, nextDir] = directions[dirIndex];
            const nextX = guardX + dx;
            const nextY = guardY + dy;

            if (
                nextX >= 0 && nextX < input.length &&
                nextY >= 0 && nextY < input[0].length  &&
                input[nextX][nextY] !== "X"
            ) {
                // Check if placing a # here creates a loop
                const tempGrid = input.map(line => [...line]); // Copy the grid
                tempGrid[nextX][nextY] = "#"; // Simulate placing the #

                if (createsLoop(tempGrid, direction, guardX, guardY, dirIndex)) {
                    console.log(`Creating a loop at (${nextX}, ${nextY})`);
                    options++;
                }
            }

            // Move to the next position
            guardX = nextX;
            guardY = nextY;

            if (guardX < 0 || guardX >= input.length || guardY < 0 || guardY >= input[0].length) {
                // Stepped outside!
                break;
            }

            // Handle obstacle: Turn right
            if (input[guardX][guardY] === "#") {
                guardX -= dx;
                guardY -= dy;
                dirIndex = nextDir;
                lastTurns.push([dirIndex, guardX, guardY]);
            }
        }

        return options;

    } catch (e) {
        console.error("Error:", e);
        return 0;
    }
}

// Helper function to determine if a loop is created
function createsLoop(grid: string[][], direction: string, startX: number, startY: number, startDirIndex: number): boolean {
    const visitedStates = new Set<string>();
    let guardX = startX;
    let guardY = startY;
    let dirIndex = startDirIndex;

    while (
        guardX >= 0 && guardX < grid.length &&
        guardY >= 0 && guardY < grid[0].length
    ) {
        const stateKey = `${guardX},${guardY},${dirIndex}`;
        if (visitedStates.has(stateKey)) {
            // Loop detected
            return true;
        }
        visitedStates.add(stateKey);

        // Calculate the next position
        const [dx, dy, nextDir] = directions[dirIndex];
        guardX += dx;
        guardY += dy;

        // Check bounds or obstacle
        if (
            guardX < 0 || guardX >= grid.length ||
            guardY < 0 || guardY >= grid[0].length
        ) {
            return false; // Guard exits the grid
        }

        if (grid[guardX][guardY] === "#") {
            // Turn right
            guardX -= dx;
            guardY -= dy;
            dirIndex = nextDir;
        }
    }

    return false; // No loop detected
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
import * as fs from 'fs';

type Map = string[][]; // Represent the map as a 2D array of strings

function parseInput(input: string): { warehouse: Map; controls: string[] } {
    const lines = input.split('\n');

    // Identify where the map ends by finding the first line of the control section
    let mapEndIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        // Assuming control lines contain only <, >, ^, v, and whitespace
        if (/^[<>^v\s]+$/.test(lines[i])) {
            mapEndIndex = i;
            break;
        }
    }

    // Extract the map lines and control lines
    const mapLines = lines.slice(0, mapEndIndex).filter(line => line.trim() !== '');
    const controlLines = lines.slice(mapEndIndex).filter(line => line.trim() !== '');

    // Convert map section into a 2D array
    const warehouse: Map = mapLines.map(line => line.split(''));

    // Merge control lines into a single string, ignoring newlines
    const controls: string[] = controlLines.join('').split('');

    return { warehouse, controls };
}

function widenMap(map: string[][]): string[][] {
    const newMap: string[][] = [];

    for (const row of map) {
        const expandedRow: string[] = [];
        for (const tile of row) {
            switch (tile) {
                case '#':
                    expandedRow.push('#', '#');
                    break;
                case 'O':
                    expandedRow.push('[', ']');
                    break;
                case '.':
                    expandedRow.push('.', '.');
                    break;
                case '@':
                    expandedRow.push('@', '.');
                    break;
                default:
                    expandedRow.push(tile); // Handle unexpected tiles
            }
        }
        newMap.push(expandedRow); // Add the expanded row to the new map
    }

    return newMap;
}

function print2DArrayPretty(array: string[][]): void {
    array.forEach(row => {
        console.log(row.join(' | '));
    });
}

const directions = {
    "^" : [-1, 0],
    ">" : [0, 1],
    "<": [0, -1],
    "v": [1, 0]
}


function findAtPosition(warehouse: string[][]): { row: number; col: number } | null {
    const row = warehouse.findIndex(line => line.includes('@'));
    if (row !== -1) {
        const col = warehouse[row].indexOf('@');
        return { row, col };
    }
    return null; // Return null if @ is not found
}

function getGPSresult(warehouse: Map) {
    let result = 0;
    for (let row=0;row<warehouse.length; row++){
        for (let col=0;col<warehouse[0].length; col++){
            if (warehouse[row][col] === 'O' || warehouse[row][col] === '[' ) {
                result += row*100 + col;
            }
        }
    }
    return result;
}

function getGPSresultTwo(warehouse: Map) {
    let result = 0;
    for (let row=0;row<warehouse.length; row++){
        for (let col=0;col<warehouse[0].length; col++){
            if (warehouse[row][col] === '[' ) {
                result += row*100 + col;
            }
        }
    }
    return result;
}

function solveStarOne(warehouse: Map, controls: string[]): number {
    //console.log(warehouse);
    //console.log(controls);
    let robot = findAtPosition(warehouse);

    for (let control of controls) {
        let move = directions[control];
        let nextRobotPosition = [robot.row + move[0], robot.col + move[1]];

        // Stop criterion, robot can not move outside
        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === '#') {
            continue;
        }

        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === '.') {
            warehouse[robot.row][robot.col] = '.';
            warehouse[nextRobotPosition[0]][nextRobotPosition[1]] = '@';
            robot = findAtPosition(warehouse);
            //console.log(robot);
        }

        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === 'O') {
            let currentPosX = nextRobotPosition[0];
            let currentPosY = nextRobotPosition[1];
            
            while (warehouse[currentPosX][currentPosY] !== '.' && warehouse[currentPosX][currentPosY] !== '#') {
                currentPosX = currentPosX + move[0];
                currentPosY = currentPosY + move[1];
            }
            if (warehouse[currentPosX][currentPosY] == '.') {
                warehouse[currentPosX][currentPosY] = 'O';
                warehouse[robot.row][robot.col] = '.';
                warehouse[nextRobotPosition[0]][nextRobotPosition[1]] = '@';
                robot = findAtPosition(warehouse);
            }
            if (warehouse[currentPosX][currentPosY] == '#') {
                continue;
            }
        }

    }
    
    return getGPSresult(warehouse);
}

function findConnectedBoxes(
    warehouse: string[][],
    startRow: number,
    startCol: number,
    move: number[]
): number[][] {
    // Stopping conditions
    if (
        warehouse[startRow][startCol] === '.' ||
        warehouse[startRow][startCol] === '#'
    ) {
        return [];
    }

    let connectedBoxes: number[][] = [];
    let newRow = startRow + move[0];

    // If the current position is the left part of a box ('[')
    if (warehouse[startRow][startCol] === '[') {
            // Add the left and right parts of the box
        connectedBoxes.push([startRow, startCol]);
        connectedBoxes.push([startRow, startCol + 1]);
        connectedBoxes = connectedBoxes.concat(findConnectedBoxes(warehouse, newRow, startCol, move));
        connectedBoxes = connectedBoxes.concat(findConnectedBoxes(warehouse, newRow, startCol + 1, move));
    }
    // If the current position is the right part of a box (']')
    else if (warehouse[startRow][startCol] === ']') {
        if (startCol - 1 >= 0 && warehouse[startRow][startCol - 1] === '[') {
            // Add the right and left parts of the box
            connectedBoxes.push([startRow, startCol]);
            connectedBoxes.push([startRow, startCol - 1]);
            connectedBoxes = connectedBoxes.concat(findConnectedBoxes(warehouse, newRow, startCol, move));
            connectedBoxes = connectedBoxes.concat(findConnectedBoxes(warehouse, newRow, startCol - 1, move));
        }
    }

    return connectedBoxes;
}

function removeDuplicates(arr: number[][]): number[][] {
    const uniqueSet = new Set(arr.map(item => JSON.stringify(item))); // Convert each sub-array to a string
    return Array.from(uniqueSet).map(item => JSON.parse(item)); // Convert strings back to arrays
}

function moveConnectedBoxes(
    warehouse: string[][],
    connectedBoxes: number[][],
    move: number[]
): string[][] {
    // Check if the move is possible for all connected boxes
    for (const [row, col] of connectedBoxes) {
        const newRow = row + move[0];
        // If any target cell is not `'.'`, return the warehouse unchanged
        if (
            warehouse[newRow][col] === '#'
        ) {
            return warehouse; // Move not possible, return unchanged
        }
    }

    // Reorder the list of boxes to avoid removing already changed fields
    if (move[0] == 1) {
        connectedBoxes = connectedBoxes.sort((a, b) => {
            // First, compare by the first element
            if (a[0] !== b[0]) {
              return a[0] - b[0];
            }
            // If first elements are equal, compare by the second element
            return a[1] - b[1];
          });
    } else {
        connectedBoxes = connectedBoxes.sort((a, b) => {
            // First, compare by the first element
            if (a[0] !== b[0]) {
              return b[0] - a[0];
            }
            // If first elements are equal, compare by the second element
            return a[1] - b[1];
          });
    }

    // If move is valid, move all boxes
    for (let i = connectedBoxes.length - 1; i >= 0; i--) {
        const [row, col] = connectedBoxes[i];
        const newRow = row + move[0];
        const newCol = col;
        // Move the box to the new position
        warehouse[newRow][newCol] = warehouse[row][col];
        // Set the old position to `'.'`
        warehouse[row][col] = '.';
    }

    return warehouse;
}


function solveStarTwo(warehouse: Map, controls: string[]): number {
    let robot = findAtPosition(warehouse);

    for (let control of controls) {
        let move = directions[control];
        let nextRobotPosition = [robot.row + move[0], robot.col + move[1]];

        // Stop criterion, robot can not move outside; stays the same
        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === '#') {
            continue;
        }

        // Stays the same
        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === '.') {
            warehouse[robot.row][robot.col] = '.';
            warehouse[nextRobotPosition[0]][nextRobotPosition[1]] = '@';
            robot = findAtPosition(warehouse);
            continue;
        }

        // Encounter box
        if (warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === '['
            || warehouse[nextRobotPosition[0]][nextRobotPosition[1]] === ']'
        ) {
            if (move[0] == 0) {
                let currentPosX = nextRobotPosition[0];
                let currentPosY = nextRobotPosition[1];
                let movesNecessary = 0;
                while (warehouse[currentPosX][currentPosY] !== '.' && warehouse[currentPosX][currentPosY] !== '#') {
                    currentPosX = currentPosX + move[0];
                    currentPosY = currentPosY + move[1];
                    movesNecessary++; // Moves necessary in the respective position
                }
                if (warehouse[currentPosX][currentPosY] == '.') {
                    // Push boxes horizontally
                
                        for (let i=0; i<=movesNecessary; i++) {
                            warehouse[currentPosX][currentPosY] = warehouse[currentPosX][currentPosY-move[1]];
                            if (warehouse[currentPosX][currentPosY-move[1]] == '@') {
                                warehouse[currentPosX][currentPosY-move[1]] = '.';
                            }
                            currentPosY -= move[1];
                        }
                    robot = findAtPosition(warehouse);
                }
           
                if (warehouse[currentPosX][currentPosY] == '#') {
                    continue;
                }
            }
            
            if (move[1] == 0) { // Push boxes vertically
                // TODO: move boxes that are above one another
                let connectedBoxes = findConnectedBoxes(warehouse, robot.row + move[0], robot.col, move);
                connectedBoxes = removeDuplicates(connectedBoxes);
                warehouse = moveConnectedBoxes(warehouse, connectedBoxes, move);
                if ( warehouse[nextRobotPosition[0]][nextRobotPosition[1]] == '.') {
                    warehouse[robot.row][robot.col] = '.';
                    warehouse[nextRobotPosition[0]][nextRobotPosition[1]] = '@';
                }
                robot = findAtPosition(warehouse);
            }
        
              
        }

    }
    print2DArrayPretty(warehouse);
   
    return getGPSresultTwo(warehouse);
}


try {
    const data: string = fs.readFileSync('2024/day15/input.txt', 'utf8');
    let { warehouse, controls } = parseInput(data);

    // let resultOne = solveStarOne(warehouse, controls);
    warehouse = widenMap(warehouse);
    let resultTwo = solveStarTwo(warehouse, controls);

    //console.log(resultOne);
    console.log(resultTwo);
} catch (err) {
    console.error(err);
}
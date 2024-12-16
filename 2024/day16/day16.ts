import * as fs from 'fs';

type Mapp = string[][]; // Represent the map as a 2D array of strings
type Direction = 'N' | 'E' | 'S' | 'W';

interface Position {
    row: number;
    col: number;
}

interface State extends Position {
    dir: Direction;
}

function parseInput(input: string): Mapp {
    const lines = input.split('\n');
    // Extract the map
    const mapLines = lines.filter(line => line.trim() !== '');
    // Convert map section into a 2D array
    const map: Mapp = mapLines.map(line => line.split(''));

    return map;
}

function print2DArrayPretty(array: string[][]): void {
    array.forEach(row => {
        console.log(row.join(''));
    });
}

function findStartPosition(map: string[][], target: string = 'S'): Position | null {
    const row = map.findIndex(line => line.includes(target));
    if (row !== -1) {
        const col = map[row].indexOf(target);
        return { row, col };
    }
    return null; // Return null if target is not found
}

// Heuristic function
function heuristic(state: State, goal: Position): number {
    const distance = Math.abs(state.row - goal.row) + Math.abs(state.col - goal.col);
    return distance * 1; // Minimum possible cost (moving forward only)
}


// Get neighbors
function getNeighbors(state: State, map: Mapp): State[] {
    const neighbors: State[] = [];

    // Action: Move Forward
    const moveForward = moveInDirection(state);
    if (isValidPosition(moveForward, map)) {
        neighbors.push(moveForward);
    }

    // Action: Turn Left
    const turnLeft = { ...state, dir: turnDirection(state.dir, 'LEFT') };
    neighbors.push(turnLeft);

    // Action: Turn Right
    const turnRight = { ...state, dir: turnDirection(state.dir, 'RIGHT') };
    neighbors.push(turnRight);

    return neighbors;
}

// Helper functions
function moveInDirection(state: State): State {
    const { row, col, dir } = state;
    switch (dir) {
        case 'N': return { row: row - 1, col, dir };
        case 'E': return { row, col: col + 1, dir };
        case 'S': return { row: row + 1, col, dir };
        case 'W': return { row, col: col - 1, dir };
    }
}

function turnDirection(currentDir: Direction, turn: 'LEFT' | 'RIGHT'): Direction {
    const directions: Direction[] = ['N', 'E', 'S', 'W'];
    let index = directions.indexOf(currentDir);
    if (turn === 'LEFT') {
        index = (index + 3) % 4; 
    } else {
        index = (index + 1) % 4;
    }
    return directions[index];
}

function isValidPosition(state: State, map: Mapp): boolean {
    const { row, col } = state;
    return (
        row >= 0 &&
        row < map.length &&
        col >= 0 &&
        col < map[0].length &&
        map[row][col] !== '#'
    );
}

// A* Algorithm
function A_Star(
    start: State,
    goal: Position,
    map: Mapp
): State[] | null {
    const openSet = new Set<string>();
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const stateToKey = (state: State): string => `${state.row},${state.col},${state.dir}`;
    const keyToState = (key: string): State => {
        const [row, col, dir] = key.split(',');
        return { row: parseInt(row), col: parseInt(col), dir: dir as Direction };
    };

    const startKey = stateToKey(start);
    const goalKeyWithoutDir = `${goal.row},${goal.col}`; // Goal position without direction

    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start, goal));

    while (openSet.size > 0) {
        // Get the node in openSet with the lowest fScore value
        let currentKey: string | null = null;
        let currentMinFScore = Infinity;

        for (let key of Array.from(openSet.keys())) {
            const score = fScore.get(key) ?? Infinity;
            if (score < currentMinFScore) {
                currentMinFScore = score;
                currentKey = key;
            }
        }

        if (currentKey === null) break; // No reachable nodes
        const current = keyToState(currentKey);

        // Check if goal is reached (position matches, direction doesn't matter)
        const currentPosKey = `${current.row},${current.col}`;
        if (currentPosKey === goalKeyWithoutDir) {
            return reconstructPath(cameFrom, currentKey).map(keyToState);
        }

        openSet.delete(currentKey);

        // Explore neighbors
        const neighbors = getNeighbors(current, map);
        for (const neighbor of neighbors) {
            const neighborKey = stateToKey(neighbor);

            // Tentative gScore
            const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + costFunction(current, neighbor);

            if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
                // Better path found
                cameFrom.set(neighborKey, currentKey);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));

                if (!openSet.has(neighborKey)) {
                    openSet.add(neighborKey);
                }
            }
        }
    }

    // Goal was never reached
    return null;
}

// Reconstruct path
function reconstructPath(cameFrom: Map<string, string>, currentKey: string): string[] {
    const path: string[] = [];
    while (cameFrom.has(currentKey)) {
        path.unshift(currentKey);
        currentKey = cameFrom.get(currentKey)!;
    }
    path.unshift(currentKey);
    return path;
}


// Calculate total cost
function calculateTotalCost(path: State[]): number {
    let totalCost = 0;
    for (let i = 1; i < path.length; i++) {
        totalCost += costFunction(path[i - 1], path[i]);
    }
    return totalCost;
}

// Cost function
function costFunction(current: State, neighbor: State): number {
    // If direction changed, it's a turn action
    if (current.dir !== neighbor.dir) {
        return 1000;
    }
    // If position changed, it's a move forward
    else if (current.row !== neighbor.row || current.col !== neighbor.col) {
        return 1;
    }
    return 0;
}


function solveStarOne(map: Mapp): number {
    const startPos = findStartPosition(map, 'S');
    const goalPos = findStartPosition(map, 'E');

    if (!startPos || !goalPos) {
        console.error("Start or goal not found in the map!");
        return -1;
    }

    const startState: State = { ...startPos, dir: 'E' }; // Start facing East

    const path = A_Star(startState, goalPos, map);

    if (path) {
        const totalCost = calculateTotalCost(path);
        return totalCost;
    } else {
        console.log("No path found.");
        return -1;
    }
}

function A_Star_All_paths(
    start: State,
    goal: Position,
    map: Mapp
): State[][] | null {
    const openSet = new Set<string>();
    const cameFrom = new Map<string, { prev: string; direction: Direction }[]>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const stateToKey = (state: State): string => `${state.row},${state.col},${state.dir}`;
    const keyToState = (key: string): State => {
        const [row, col, dir] = key.split(',');
        return { row: parseInt(row), col: parseInt(col), dir: dir as Direction };
    };

    const startKey = stateToKey(start);
    const goalKeyWithoutDir = `${goal.row},${goal.col}`;

    openSet.add(startKey);
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start, goal));

    while (openSet.size > 0) {
        let currentKey: string | null = null;
        let currentMinFScore = Infinity;

        for (let key of Array.from(openSet.keys())) {
            const score = fScore.get(key) ?? Infinity;
            if (score < currentMinFScore) {
                currentMinFScore = score;
                currentKey = key;
            }
        }

        if (currentKey === null) break;

        const current = keyToState(currentKey);
        const currentPosKey = `${current.row},${current.col}`;

        // If goal is reached
        if (currentPosKey === goalKeyWithoutDir) {
            return reconstructAllPaths(cameFrom, currentKey).map(path =>
                path.map(keyToState)
            );
        }

        openSet.delete(currentKey);
        const neighbors = getNeighbors(current, map);

        for (const neighbor of neighbors) {
            const neighborKey = stateToKey(neighbor);
            const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + costFunction(current, neighbor);

            if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
                cameFrom.set(neighborKey, [{ prev: currentKey, direction: neighbor.dir }]);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
                if (!openSet.has(neighborKey)) {
                    openSet.add(neighborKey);
                }
            } else if (tentativeGScore === (gScore.get(neighborKey) ?? Infinity)) {
                cameFrom.get(neighborKey)?.push({ prev: currentKey, direction: neighbor.dir });
            }
        }
    }

    return null;
}

// Reconstruct all paths recursively
function reconstructAllPaths(
    cameFrom: Map<string, { prev: string; direction: Direction }[]>,
    currentKey: string
): string[][] {
    if (!cameFrom.has(currentKey)) {
        return [[currentKey]];
    }

    const paths: string[][] = [];
    for (const { prev } of cameFrom.get(currentKey)!) {
        const subPaths = reconstructAllPaths(cameFrom, prev);
        for (const subPath of subPaths) {
            paths.push([...subPath, currentKey]);
        }
    }
    return paths;
}

function countUniquePositions(paths: State[][], map: Mapp): number {
    let result = 0;
    for (const path of paths) {
        for (const state of path) {
            if (map[state.row][state.col] == '.') {
                map[state.row][state.col] = 'O'
                result++;
            } 
            
        }
    }

    print2DArrayPretty(map)
    return result + 2; // Add two for start and end
}

function solveStarTwo(map: Mapp): number {
    const startPos = findStartPosition(map, 'S');
    const goalPos = findStartPosition(map, 'E');

    if (!startPos || !goalPos) {
        console.error("Start or goal not found in the map!");
        return -1;
    }

    const startState: State = { ...startPos, dir: 'E' };

    const paths = A_Star_All_paths(startState, goalPos, map);

    if (paths) {
        console.log(`Number of optimal paths: ${paths.length}`);
        const uniquePositionsCount = countUniquePositions(paths, map);
        return uniquePositionsCount;
    } else {
        console.log("No path found.");
        return -1;
    }
}



try {
    const data: string = fs.readFileSync('2024/day16/input.txt', 'utf8');
    const map = parseInput(data);

    const resultOne = solveStarOne(map);
    const resultTwo = solveStarTwo(map);

    console.log(resultOne);
    console.log(resultTwo);
} catch (err) {
    console.error(err);
}

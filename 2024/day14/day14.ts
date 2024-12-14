import * as fs from 'fs';

type Agent = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
};

// Parsing function
function parse(input: string): Agent[] {
    return input.split('\n').map((line) => {
        const positionMatch = line.match(/p=(-?\d+),(-?\d+)/);
        const velocityMatch = line.match(/v=(-?\d+),(-?\d+)/);

        if (!positionMatch || !velocityMatch) {
        throw new Error(`Invalid line format: ${line}`);
        }

        const position = {
        x: parseInt(positionMatch[1], 10),
        y: parseInt(positionMatch[2], 10),
        };

        const velocity = {
        x: parseInt(velocityMatch[1], 10),
        y: parseInt(velocityMatch[2], 10),
        };

        return { position, velocity };
    });
}

const steps = 100;

// Example solution for the first task
function solveStarOne(agents: Agent[], area: [number, number]): number {
    let newPositions = []
    // agents.filter((agent) => agent.velocity.x > 0 && agent.velocity.y > 0).length
    for (let agent of agents) {
        let newX = ((agent.position.x + steps * agent.velocity.x) % area[0] + area[0]) % area[0];
        let newY = ((agent.position.y + steps * agent.velocity.y) % area[1] + area[1]) % area[1];
        newPositions.push([newX, newY]);
    }
    
    let upperHalf = (area[0] - 1) / 2;
    let leftHalf = (area[1] - 1) / 2;
    let quadrantOne = newPositions.filter(a => a[0] < upperHalf && a[1] < leftHalf).length;
    let quadrantTwo = newPositions.filter(a => a[0] > upperHalf && a[1] < leftHalf).length;
    let quadrantThree = newPositions.filter(a => a[0] > upperHalf && a[1] > leftHalf).length;
    let quadrantFour = newPositions.filter(a => a[0] < upperHalf && a[1] > leftHalf).length;

    return quadrantFour * quadrantOne * quadrantThree * quadrantTwo;
}

// Example solution for the second task
function solveStarTwo(agents: Agent[], area: [number, number]): number {
    let newPositions = []
    // agents.filter((agent) => agent.velocity.x > 0 && agent.velocity.y > 0).length
    for (let agent of agents) {
        let newX = ((agent.position.x + steps * agent.velocity.x) % area[0] + area[0]) % area[0];
        let newY = ((agent.position.y + steps * agent.velocity.y) % area[1] + area[1]) % area[1];
        newPositions.push([newX, newY]);
    }
    
    let upperHalf = (area[0] - 1) / 2;
    let leftHalf = (area[1] - 1) / 2;
    // TODO: check tree structure

    return 0;
}


try {
    const data: string = fs.readFileSync('2024/day14/input.txt', 'utf8');
    const agents = parse(data);

    let resultOne = solveStarOne(agents, [101,103]);
    let resultTwo = solveStarTwo(agents, [101,103]);

    console.log(resultOne);
    console.log(resultTwo);
} catch (err) {
    console.error(err);
}

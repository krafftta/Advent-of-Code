import * as fs from 'fs';

type Configuration = {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: number; y: number };
};

function parse(data: string): Configuration[] {
  const lines = data.trim().split(/\r?\n/);
  const configurations: Configuration[] = [];

  for (let i = 0; i < lines.length; i += 4) {
        const buttonALine = lines[i].match(/Button A: X\+([\d]+), Y\+([\d]+)/);
        const buttonBLine = lines[i + 1].match(/Button B: X\+([\d]+), Y\+([\d]+)/);
        const prizeLine = lines[i + 2].match(/Prize: X=([\d]+), Y=([\d]+)/);

        if (buttonALine && buttonBLine && prizeLine) {
            configurations.push({
                buttonA: {
                    x: parseInt(buttonALine[1], 10),
                    y: parseInt(buttonALine[2], 10),
                },
                buttonB: {
                    x: parseInt(buttonBLine[1], 10),
                    y: parseInt(buttonBLine[2], 10),
                },
                prize: {
                    x: parseInt(prizeLine[1], 10),
                    y: parseInt(prizeLine[2], 10),
                },
            });
        }
    }

    return configurations;
}


function solveStarOne(claws: Configuration[]): number {
    let result = 0;
    for (let claw of claws) {
        let found = false;
        let pressB = Math.floor(Math.max(claw.prize.x / claw.buttonB.x, claw.prize.y / claw.buttonB.y));
        console.log(pressB)
        while (!found && pressB > 0) {
            for (let pressA=0; pressA<Math.floor(Math.max(claw.prize.x / claw.buttonA.x, claw.prize.y / claw.buttonA.y)); pressA++) {
                let currentResX = claw.buttonA.x * pressA + claw.buttonB.x * pressB
                let currentResY = claw.buttonA.y * pressA + claw.buttonB.y * pressB
                if (currentResX === claw.prize.x && currentResY === claw.prize.y) {
                    found = true;
                    result += pressA * 3 + pressB
                    console.log(pressA, pressB);
                }
            }
            pressB--;
        }
    }
    return result;
}

function solveStarTwo(claws: Configuration[]): number {
    let result = 0;
    return result;
}

// Example usage:
try {
    const data: string = fs.readFileSync('2024/day13/input.txt', 'utf8');
    const clawmachine = parse(data);

    //let resultOne = solveStarOne(clawmachine);
    let resultTwo = solveStarTwo(clawmachine);
    //console.log(resultOne);
    console.log(resultTwo);
} catch (err) {
    console.error(err);
}
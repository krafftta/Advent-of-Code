import * as fs from 'fs';

interface Registers {
    [key: string]: number; // Map register names (e.g., A, B, C) to values
}

interface ParsedData {
    registers: Registers;
    program: number[];
}

// Function to parse the input file
function parseInputFile(data: string): ParsedData {
    const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');

    const registers: Registers = {};
    let program: number[] = [];

    for (const line of lines) {
        if (line.startsWith('Register')) {
            // Parse register lines
            const match = line.match(/Register\s+([A-Z]):\s+(\d+)/);
            if (match) {
                const [, registerName, value] = match;
                registers[registerName] = parseInt(value, 10);
            }
        } else if (line.startsWith('Program')) {
            // Parse the program line
            const programMatch = line.match(/Program:\s+([\d,]+)/);
            if (programMatch) {
                program = programMatch[1].split(',').map(num => parseInt(num, 10));
            }
        }
    }

    return { registers, program };
}

function getOperand(op: number, registers: Registers): number {
    switch(op) {
        case 0:
        case 1:
        case 2:
        case 3:
            return op;
        case 4:
            return registers['A'];
        case 5:
            return registers['B'];
        case 6:
            return registers['C'];
        case 7:
            console.error('Operand 7 occured!! Program not valid');
            return -1;
    }
}

function executeInstruction(output: number[], instPoi:number, registers: Registers, opcode: number, literalOperand: number, comboOperand: number): [number, boolean] {
    let result: number;
    let jump = false;
    switch (opcode) {
        case 0:
            // adv: division for A
            result = Math.trunc(registers['A'] / 2**comboOperand);
            registers['A'] = result;
            break;
        case 1:
            // bxl: Bitwise XOR
            result = registers['B'] ^ literalOperand;
            registers['B'] = result;
            break;
        case 2:
            // bst: mod 8
            result = comboOperand % 8;
            registers['B'] = result;
            break;
        case 3:
            // jnz: Jump action
            if (registers['A'] != 0) {
                instPoi = literalOperand;
                jump = true;
            }
            break;
        case 4:
            // bxc: bitwise XOR B and C
            result = registers['B'] ^ registers['C'];
            registers['B'] = result;
            break;
        case 5:
            // out: output combo mod 
            //console.log(comboOperand % 8, ',');
            output.push(comboOperand % 8)
            break;
        case 6:
            // bdv: adv for B
            result = Math.trunc(registers['A'] / 2**comboOperand);
            registers['B'] = result;
            break;
        case 7:
            // cdv: adv for C
            result = Math.trunc(registers['A'] / 2**comboOperand);
            registers['C'] = result;
            break;
        default:
            console.error('default');
            break;
    }
    return [instPoi, jump];
}

function executeProgram(registers: Registers, program: number[]): number[] {
    let instPoi=0;
    let output= [];
    while (instPoi<program.length) {
        let opcode = program[instPoi];
        let literalOperand = program[instPoi+1];
        let comboOperand = getOperand(program[instPoi+1], registers);
        let [newInst, jump] = executeInstruction(output, instPoi, registers, opcode, literalOperand, comboOperand);
        instPoi = newInst;
        if (!jump) {
            instPoi += 2;
        }
    }
    return output;
}

function solveStarOne(data: ParsedData): string {
    let result = executeProgram(data.registers, data.program);
    return result.toString();
}

function solveStarTwo(data: ParsedData): number {
    let copySuccessful = false;
    let i = 1;
    // At data.registers['A'] * 2**22, the correct length is reached
    let currentA = data.registers['A'] * 2**22;

    // Brute Force? 
    while (!copySuccessful && i < 1000000000) {
        let newReg = {...data.registers};
        newReg['A'] = newReg['A'] * 2**22 + i;
        currentA = newReg['A'];

        let result = executeProgram(newReg, data.program);
        
        console.log(i, result, newReg)
        copySuccessful = result.join() === data.program.join();
        if (copySuccessful) {
            console.log('Match found:', i, currentA);
            break;
        }

        i++;
    }
    return currentA;
}

// Example usage
try {
    const data = fs.readFileSync('2024/day17/input.txt', 'utf8');
    const parsedData = parseInputFile(data);

    //const resultOne = solveStarOne(parsedData);
    const resultTwo = solveStarTwo(parsedData);

    //console.log(resultOne);
    console.log(resultTwo);
} catch (err) {
    console.error('Error reading or parsing the input file:', err);
}
import * as fs from 'fs';

function parse(data: string): string[] {
    return Array.from(data.trim());
}

function decompress(input: string[]): string[] {
    let isAFile = true;
    let decompressedInput = [];
    let id = 0;
    for (let i=0; i< input.length; i++) {
        if (isAFile) {
            // Append `id` repeated `input[i]` times as separate elements
            const count = parseInt(input[i], 10);
            for (let j = 0; j < count; j++) {
                decompressedInput.push(id.toString());
            }
            id++;
        } else {
            decompressedInput.push(...Array.from('.'.repeat(parseInt(input[i]))))
        }
        // Switch after each digit
        isAFile = !isAFile;
    }
    return decompressedInput
}

function moveFileBlocksToFront(input: string[]): string[] {
    let j = input.length - 1;
    for (let i=0; i< input.length; i++) {
        // Only act if position is currently empty
        if (input[i]==='.') {
            // Move backwards to skip already empty elements
            while (j > i && input[j] === '.') {
                j--;
            }

            // Find non-'.' element, swap it with the current '.'
            if (j > i) {
                let temp = input[i];
                input[i] = input[j];
                input[j] = temp;
                j--; // Move `j` pointer backwards
            }
        }
    }
    return input;
}

function moveFittingFileBlocksToFront(input: string[]): string[] {
    let j = input.length - 1;
    for (let i=0; i< input.length; i++) {
        // Only act if position is currently empty
        if (input[i]==='.') {
            // Move backwards to skip already empty elements
            while (j > i && input[j] === '.') {
                j--;
            }

            // Find non-'.' element, swap it with the current '.'
            if (j > i) {
                let temp = input[i];
                input[i] = input[j];
                input[j] = temp;
                j--; // Move `j` pointer backwards
            }
        }
    }
    return input;
}

function solveStarOne(input: string[]): number {
    let decompressedInput = decompress(input);
    input = moveFileBlocksToFront(decompressedInput);
    console.log(input);
    let result = 0;
    for (let i=0; i<input.length;i++) {
        if (input[i]!=='.') {
            result += i * parseInt(input[i],10)
        }
    }

    return result;
}

function solveStarTwo(input: string[]): number {
    let decompressedInput = decompress(input);
    input = moveFittingFileBlocksToFront(decompressedInput);
    console.log(input);
    let result = 0;
    for (let i=0; i<input.length;i++) {
        if (input[i]!=='.') {
            result += i * parseInt(input[i],10)
        }
    }

    return result;
}

try {
    let data:string = fs.readFileSync('2024/day09/input.txt','utf8');
    let grid = parse(data);
    let resultOne = solveStarOne(grid);
    let resultTwo = solveStarTwo(grid);
    console.log(resultOne, resultTwo);
  } catch (err) {
    console.error(err);
}
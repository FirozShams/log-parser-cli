import fs from 'fs';

import InputOption from '../InputOption';

describe('Tests related to input option validation', () => {
    const inputOption = new InputOption();

    test('no input flag in command should throw error', () => {
        expect(() => inputOption.getValidatedInput('')).toThrowError();
    });

    test('input flags without argument in command should throw error', () => {
        for(const flag of inputOption.flags) {
            expect(() => inputOption.getValidatedInput(flag)).toThrowError();
        }
    });

    test('input flags with invalid argument should throw error', () => {
        for(const flag of inputOption.flags) {
            expect(() => inputOption.getValidatedInput(`${flag} 372910`)).toThrowError();
        }
    });

    test('input flags with valid argument should not throw error', () => {
        fs.writeFileSync('./app.log','This is a test string');
        for(const flag of inputOption.flags) {
            expect(inputOption.getValidatedInput(`${flag} ./app.log`)).toBe('./app.log');
        }
        fs.unlinkSync('./app.log');
    });
});

describe('Tests related to input option execution', () => {
    const inputOption = new InputOption();

    test('input flags with valid argument should read file', () => {
        fs.writeFileSync('./app.log','This is a test string');
        for(const flag of inputOption.flags) {
            expect(inputOption.executeAction(`${flag} ./app.log`)).resolves.toEqual('This is a test string');
        }
        fs.unlinkSync('./app.log');
    });
});


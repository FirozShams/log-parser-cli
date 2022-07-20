import fs from 'fs';

import OutputOption from '../OutputOption';

describe('Tests related to output option validation', () => {
    const outputOption = new OutputOption();

    test('no out flag in command should throw error', () => {
        expect(() => outputOption.getValidatedInput('')).toThrowError();
    });

    test('output flags without argument in command should throw error', () => {
        for(const flag of outputOption.flags) {
            expect(() => outputOption.getValidatedInput(flag)).toThrowError();
        }
    });

    test('output flags with invalid argument should throw error', () => {
        for(const flag of outputOption.flags) {
            expect(() => outputOption.getValidatedInput(`${flag} 372910/error.json`)).toThrowError();
        }
    });

    test('output flags with valid argument should not throw error', () => {
        for(const flag of outputOption.flags) {
            expect(outputOption.getValidatedInput(`${flag} ./error.json`)).toBe('./error.json');
        }
    });
});

describe('Tests related to output option execution', () => {
    const outputOption = new OutputOption();

    test('input flags with valid argument should write empty file in destination if no error', async () => {
        for(const flag of outputOption.flags) {
            await outputOption.executeAction(`${flag} ./error.json`, '2044-08-09T02:12:51.253Z - info - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Service is started"}');
            expect(fs.readFileSync('./error.json', {encoding:'utf8'})).toEqual('[]');
        }
        fs.unlinkSync('./error.json');
    });

    test('input flags with valid argument should write errors to file in destination', async () => {
        for(const flag of outputOption.flags) {
            await outputOption.executeAction(`${flag} ./error.json`, '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}');
            expect(fs.readFileSync('./error.json', {encoding:'utf8'})).toEqual('[{"timestamp":"2021-08-09T02:12:51.259Z","loglevel":"error","transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","err":"Not found"}]');
        }
        fs.unlinkSync('./error.json');
    });
});


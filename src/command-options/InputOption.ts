import fs from 'fs';

import AbstractOption from './AbstractOption';

export default class InputOption extends AbstractOption {
    public override flags = ['-i', '--input'];

    public override description = 'Input file location';

    public override required = true;

    public override getValidatedInput(cliInput: string): string {
        const flagLocation = this.getInputFlagLocationAfterSplit(cliInput);
        const splitInput = cliInput.split(' ');
        if (this.required && (flagLocation < 0 || !splitInput[flagLocation + 1])) {
            throw new Error(`missing required option '${this.flags}'`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pathStats = fs.statSync(splitInput[flagLocation + 1]!);
        if (!pathStats.isFile()) {
            throw new Error('input file does not exist');
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return splitInput[flagLocation + 1]!;
    }

    public override executeAction(cliInput: string): Promise<any> {
        const input = this.getValidatedInput(cliInput);
        return fs.promises.readFile(input, 'utf8');
    }
}
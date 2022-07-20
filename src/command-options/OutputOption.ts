import fs from 'fs';

import AbstractOption from './AbstractOption';

export default class OutputOption extends AbstractOption {
    public override flags = ['-o', '--output'];

    public override description = 'Output file location';

    public override required = true;

    public override getValidatedInput(cliInput: string): string {
        const flagLocation = this.getInputFlagLocationAfterSplit(cliInput);
        const splitInput = cliInput.split(' ');
        if (this.required && (flagLocation < 0 || !splitInput[flagLocation + 1])) {
            throw new Error(`missing required option '${this.flags}'`);
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            fs.openSync(splitInput[flagLocation + 1]!, 'w');
        } catch (err: any) {
            throw new Error('invalid output file directory');
        }
        
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return splitInput[flagLocation + 1]!;
    }

    public override executeAction(cliInput: string, processData: any): Promise<any> {
        const input = this.getValidatedInput(cliInput);
        const outputLogArray: {
            timestamp: string;
            loglevel: string; 
            transactionId: string; 
            err: string; 
        }[] = [];
        processData.split(/\r?\n/).forEach((line:string) => {
            if (line.includes('- error -')) {
                const splitLog = line.split('- error -');
                if (splitLog.length) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const logDetails:any = JSON.parse(splitLog[1]!);
                    outputLogArray.push({
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        timestamp: splitLog[0]!.trim()!,
                        loglevel: 'error',
                        transactionId: logDetails.transactionId, 
                        err: logDetails.err, 
                    });
                }
            }
        });

        return fs.promises.writeFile(input, JSON.stringify(outputLogArray));
    }
}
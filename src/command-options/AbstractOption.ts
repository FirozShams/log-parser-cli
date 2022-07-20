export default abstract class AbstractOption {
    public flags:string[] = [];

    public description = '';

    public required = false;

    protected getInputFlagLocationAfterSplit(cliInput: string): number {
        const splitInput = cliInput.split(' ');
        let flagLocation = -1;
        this.flags.forEach((flag) => {
            const location = splitInput.indexOf(flag);
            if (location >= 0 && flagLocation < 1) {
                flagLocation = location;
            }
        });
        return flagLocation;
    }

    protected abstract getValidatedInput(cliInput: string): any;

    public abstract executeAction(cliInput: string, processData?: any): Promise<any>;
}
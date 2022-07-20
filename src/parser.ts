import { getOptionExecutionQueue } from '@/command-options';

(async () => {
    try {
        const commandArgs = process.argv.slice(2);
        const executionQueue = getOptionExecutionQueue();
        
        await executionQueue.reduce( (previousPromise, nextOperation) => {
            return previousPromise.then((result) => {
                return nextOperation.executeAction(
                    commandArgs.join(' '), result,
                );
            });
        }, Promise.resolve());

    } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(`error: ${err.message}`);
    }
})();

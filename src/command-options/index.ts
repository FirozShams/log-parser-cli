import AbstractOption from './AbstractOption';
import InputOption from './InputOption';
import OutputOption from './OutputOption';

const getOptionExecutionQueue = (): AbstractOption[] => {
    return [
        new InputOption(),
        new OutputOption(), 
    ];
};

export {
    getOptionExecutionQueue,
    AbstractOption,
};
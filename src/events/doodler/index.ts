import EventEmitter from 'events';

class DoodlerEmitter extends EventEmitter {}

const DoodlerEmitterInstance = new DoodlerEmitter();
export default DoodlerEmitterInstance;

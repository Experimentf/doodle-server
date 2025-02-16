import EventEmitter from 'events';

class RoomEmitter extends EventEmitter {}

const RoomEmitterInstance = new RoomEmitter();
export default RoomEmitterInstance;

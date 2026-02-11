import MidiraveProc from ".";

export default class InstrumentsProc extends MidiraveProc {
  constructor(sf2Path: string, timeout?: number) {
    super(["instruments", sf2Path], timeout);
  }
}

import MidiraveProc from ".";

export default class InstrumentsProc extends MidiraveProc {
  constructor(sf2Path: string) {
    super(["instruments", sf2Path]);
  }
}

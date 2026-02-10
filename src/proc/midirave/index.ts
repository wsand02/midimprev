import Proc from "..";

export default abstract class MidiraveProc extends Proc {
  constructor(cliArgs: any[]) {
    super("midirave", cliArgs);
  }
}

import Proc from "..";

export default abstract class MidiraveProc extends Proc {
  constructor(cliArgs: any[], timeout?: number) {
    super("midirave", cliArgs, timeout);
  }
}

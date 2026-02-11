import Proc from "..";

export default class NamiProc extends Proc {
  constructor(inputPath: string, outputPath: string, timeout?: number) {
    super("nami3", ["--input", inputPath, "--output", outputPath], timeout);
  }
}

import Proc from "..";

export default class NamiProc extends Proc {
  constructor(inputPath: string, outputPath: string) {
    super("nami3", ["--input", inputPath, "--output", outputPath]);
  }
}

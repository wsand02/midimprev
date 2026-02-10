import MidiraveProc from ".";

export default class SynthesizeProc extends MidiraveProc {
  constructor(sf2: string, inputPath: string, outputPath: string) {
    super([
      "synthesize",
      "--sf2",
      sf2,
      "--midi",
      inputPath,
      "--output",
      outputPath,
    ]);
  }
}

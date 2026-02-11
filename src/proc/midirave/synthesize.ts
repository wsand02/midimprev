import MidiraveProc from ".";

export default class SynthesizeProc extends MidiraveProc {
  constructor(
    sf2: string,
    inputPath: string,
    outputPath: string,
    timeout?: number,
  ) {
    super(
      [
        "synthesize",
        "--sf2",
        sf2,
        "--midi",
        inputPath,
        "--output",
        outputPath,
      ],
      timeout,
    );
  }
}

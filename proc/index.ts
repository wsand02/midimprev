export default abstract class Proc {
  execName: string;
  cliArgs: string[];
  timeoutMin: number;
  process: Bun.Subprocess;

  constructor(execName: string, cliArgs: string[], timeoutMin: number = 2) {
    this.execName = execName;
    this.cliArgs = cliArgs;
    this.timeoutMin = timeoutMin;
    try {
      this.process = Bun.spawn([execName, ...cliArgs], {
        timeout: timeoutMin * 60 * 1000,
        stdout: "pipe",
        stderr: "pipe",
      });
    } catch (err) {
      console.error(
        `Failed to spawn ${execName} with args ${JSON.stringify(cliArgs)}:`,
        err,
      );
      throw err;
    }
  }

  async exitCode(): Promise<number | null> {
    const exitcode = await this.process.exited;
    return exitcode;
  }

  async stdOut(): Promise<string | undefined> {
    const stdout = this.process.stdout;
    if (!stdout || typeof stdout === "number") {
      console.error(
        `stdout is not a readable stream (value: ${String(stdout)})`,
      );
      return undefined;
    }
    try {
      return await stdout.text();
    } catch (err) {
      console.error("Failed to read stdout:", err);
      return undefined;
    }
  }

  async stdErr(): Promise<string | undefined> {
    const stderr = this.process.stderr;
    if (!stderr || typeof stderr === "number") {
      console.error(
        `stderr is not a readable stream (value: ${String(stderr)}`,
      );
      return undefined;
    }
    try {
      return await stderr.text();
    } catch (err) {
      console.error("Failed to read stderr:", err);
      return undefined;
    }
  }

  async failed(): Promise<boolean> {
    await this.exitCode();
    return typeof this.process.exitCode === "number"
      ? this.process.exitCode !== 0
      : false;
  }

  async printOutcome(): Promise<void> {
    const failed = await this.failed();
    const stdout = await this.stdOut();
    const stderr = await this.stdErr();
    if (failed) {
      const message = `${this.execName} failed: ${stderr || stdout || "(no output)"}`;
      console.error(message);
      throw new Error(message);
    }
  }
}

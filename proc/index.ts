export default abstract class Proc {
  execName: string;
  cliArgs: string[];
  timeoutMin: number;
  process: Bun.Subprocess | undefined;

  constructor(execName: string, cliArgs: string[], timeoutMin: number = 2) {
    this.execName = execName;
    this.cliArgs = cliArgs;
    this.timeoutMin = timeoutMin;
  }

  async exitCode(): Promise<number | null> {
    if (!this.process) {
      console.error(`Process not initialized`);
      return null;
    }
    const exitcode = await this.process.exited;
    return exitcode;
  }

  async stdOut(): Promise<string | undefined> {
    if (!this.process) {
      console.error(`Process not initialized`);
      return undefined;
    }
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
    if (!this.process) {
      console.error(`Process not initialized`);
      return undefined;
    }
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
    if (!this.process) {
      console.error(`Process not initialized`);
      return false;
    }
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

  printResourceUsage(): void {
    if (!this.process) {
      console.error(`Process not initialized`);
      return;
    }
    const usage = this.process.resourceUsage();
    if (!usage) {
      return;
    }
    console.log(`Max memory used: ${usage.maxRSS} bytes`);
    console.log(`CPU time (user): ${usage.cpuTime.user} µs`);
    console.log(`CPU time (system): ${usage.cpuTime.system} µs`);
  }

  async run(): Promise<void> {
    try {
      this.process = Bun.spawn([this.execName, ...this.cliArgs], {
        timeout: this.timeoutMin * 60 * 1000,
        stdout: "pipe",
        stderr: "pipe",
      });
    } catch (err) {
      console.error(
        `Failed to spawn ${this.execName} with args ${JSON.stringify(this.cliArgs)}:`,
        err,
      );
      throw err;
    }
    await this.printOutcome();
    this.printResourceUsage();
  }
}

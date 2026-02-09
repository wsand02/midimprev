export default abstract class Proc {
  execName: string;
  cliArgs: string[];
  timeoutMin: number;
  process: Bun.Subprocess | undefined;
  private _stdoutText: string | undefined;
  private _stderrText: string | undefined;

  constructor(execName: string, cliArgs: string[], timeoutMin: number = 2) {
    this.execName = execName;
    this.cliArgs = cliArgs;
    this.timeoutMin = timeoutMin;
    this._stdoutText = undefined;
    this._stderrText = undefined;
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
    if (this._stdoutText !== undefined) {
      return this._stdoutText;
    }
    if (!this.process) {
      console.error(`Process not initialized`);
      return undefined;
    }
    const stdout = this.process.stdout;
    if (!stdout || typeof stdout === "number") {
      console.error(
        `stdout is not a readable stream (value: ${String(stdout)})`,
      );
      this._stdoutText = "";
      return this._stdoutText;
    }
    try {
      const text = await stdout.text();
      this._stdoutText = text;
      return text;
    } catch (err) {
      console.error("Failed to read stdout:", err);
      this._stdoutText = "";
      return undefined;
    }
  }

  async stdErr(): Promise<string | undefined> {
    if (this._stderrText !== undefined) {
      return this._stderrText;
    }
    if (!this.process) {
      console.error(`Process not initialized`);
      return undefined;
    }
    const stderr = this.process.stderr;
    if (!stderr || typeof stderr === "number") {
      console.error(
        `stderr is not a readable stream (value: ${String(stderr)}`,
      );
      this._stderrText = "";
      return this._stderrText;
    }
    try {
      const text = await stderr.text();
      this._stderrText = text;
      return text;
    } catch (err) {
      console.error("Failed to read stderr:", err);
      this._stderrText = "";
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
    if (stdout) console.log(`${this.execName} stdout:\n${stdout}`);
    if (stderr) console.log(`${this.execName} stderr:\n${stderr}`);
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
    this._stdoutText = undefined;
    this._stderrText = undefined;
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

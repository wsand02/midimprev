import { Events } from "discord.js";
import type Midimprev from "../midimprev";

export default interface Event {
  name: string;
  once: boolean;
  execute(bot: Midimprev, ...args: any[]): Promise<void>;
}

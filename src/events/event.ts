import { Events } from "discord.js";
import type Bot from "../bot";

export default interface Event {
  name: string;
  once: boolean;
  execute(bot: Bot, ...args: any[]): Promise<void>;
}

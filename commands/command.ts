import type {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type Midimprev from "../midimprev";

export default interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (bot: Midimprev, ...args: any[]) => Promise<void>;
}

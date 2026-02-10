import type {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type Bot from "../bot";

export default interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (bot: Bot, ...args: any[]) => Promise<void>;
}

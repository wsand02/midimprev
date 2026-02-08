import type Midimprev from "../midimprev";
import type Event from "./event";
import {
  Events,
  MessageFlags,
  type ChatInputCommandInteraction,
} from "discord.js";

export default class InteractionCreateEvent implements Event {
  name = Events.InteractionCreate;
  once = false;
  execute = async (
    bot: Midimprev,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (!interaction.isChatInputCommand()) return;

    const command = bot.commandsByName(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    console.log(command.data.name);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  };
}

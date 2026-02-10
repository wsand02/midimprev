import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type Command from "../command";
import type Bot from "../../bot";
import InstrumentsProc from "../../proc/midirave/instruments";

export default class InstrumentsCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("instruments")
    .setDescription("Lists instruments from sf2");
  execute = async (bot: Bot, interaction: ChatInputCommandInteraction) => {
    if (!bot.sf2Path) {
      await interaction.reply("No sf2 file has been configured.");
      return;
    }

    await interaction.deferReply();

    try {
      const procInstruments = new InstrumentsProc(bot.sf2Path);
      await procInstruments.run();

      await interaction.editReply({
        content: "test",
      });
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "Something went wrong while reading instruments.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Something went wrong while reading instruments.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  };
}

import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import type Command from "../command";
import type Bot from "../../bot";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import SynthesizeProc from "../../proc/midirave/synthesize";
import NamiProc from "../../proc/nami";

export default class SynthesizeCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("synthesize")
    .setDescription("Synthesizes a mp3 file from a midi file.")
    .addAttachmentOption((option) =>
      option
        .setName("midi")
        .setDescription("The midi file to synthesize.")
        .setRequired(true),
    );
  execute = async (bot: Bot, interaction: ChatInputCommandInteraction) => {
    if (!bot.sf2Path) {
      await interaction.reply("No sf2 file has been configured.");
      return;
    }
    const midiAttach = interaction.options.getAttachment("midi");
    if (!midiAttach) {
      // discord should never let this happen, but just in case
      await interaction.reply("You have to provide an attachment.");
      return;
    }
    console.log(midiAttach.contentType);
    if (midiAttach.contentType !== "audio/sp-midi") {
      await interaction.reply("You have to provide a midi file.");
      return;
    }

    await interaction.deferReply();

    let tempDir: string | undefined;
    try {
      tempDir = await mkdtemp(join(tmpdir(), "midimprev-"));
      const midiPath = join(tempDir, "input.midi");

      const resp = await fetch(midiAttach.url);
      if (!resp.ok) {
        throw new Error(`Failed to download midi file: ${resp.status}`);
      }
      await Bun.write(midiPath, resp);
      console.log(`Midi file downloaded to ${midiPath}`);

      const wavOut = join(tempDir, "output.wav");

      const procMidirave = new SynthesizeProc(
        bot.sf2Path,
        midiPath,
        wavOut,
        bot.subprocessTimeout,
      );
      await procMidirave.run();

      const mp3Out = join(tempDir, "output.mp3");

      const procNami = new NamiProc(wavOut, mp3Out, bot.subprocessTimeout);
      await procNami.run();

      const attachment = new AttachmentBuilder(mp3Out);
      await interaction.editReply({
        content: "Here is your synthesized Mp3 file:",
        files: [attachment],
      });
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "Something went wrong while synthesizing your file.",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Something went wrong while synthesizing your file.",
          flags: MessageFlags.Ephemeral,
        });
      }
    } finally {
      if (tempDir) {
        try {
          console.log("Cleaning up...");
          await rm(tempDir, { recursive: true, force: true });
          console.log("Cleanup successful");
        } catch (e) {
          console.error("Failed to remove temp dir:", e);
        }
      }
    }
  };
}

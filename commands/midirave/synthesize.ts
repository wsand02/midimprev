import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import type Command from "../command";
import type Midimprev from "../../midimprev";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  execute = async (
    bot: Midimprev,
    interaction: ChatInputCommandInteraction,
  ) => {
    if (!bot.sf2Path) {
      await interaction.reply("No sf2 file has been configured.");
      return;
    }
    const midiAttach = interaction.options.getAttachment("midi");
    if (midiAttach?.contentType !== "audio/sp-midi" || !midiAttach) {
      await interaction.reply("You have to provide a midi file.");
      return;
    }
    try {
      const tempDir = await mkdtemp(join(tmpdir(), "midimprev-"));
      const midiPath = join(tempDir, "input.midi");
      const midiResp = await fetch(midiAttach.url);
      await Bun.write(midiPath, midiResp);
      console.log(`Midi file downloaded to ${midiPath}`);
      const wavOut = join(tempDir, "output.wav");
      const procMidirave = Bun.spawn([
        "midirave",
        "synthesize",
        "--sf2",
        bot.sf2Path,
        "--midi",
        midiPath,
        "--output",
        wavOut,
      ]);
      const text = await procMidirave.stdout.text();
      const mp3Out = join(tempDir, "output.mp3");
      const procNami = Bun.spawn([
        "nami3",
        "--input",
        wavOut,
        "--output",
        mp3Out,
      ]);
      const textNami = await procNami.stdout.text();
      console.log(textNami);
      const attachment = new AttachmentBuilder(mp3Out);
      await interaction.reply({
        content: "Here is your synthesized Mp3 file:",
        files: [attachment],
      });
      console.log("Cleaning up...");
      await rm(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.error(err);
      await interaction.reply("Something went wrong...");
      return;
    }
  };
}

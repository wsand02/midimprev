bot.on(Events.MessageCreate, async (message) => {
  // msg.attachments is a Collection <string, MessageAttachment>
  if (message.attachments.size > 0) {
    console.log(
      `${message.author.tag} sent ${message.attachments.size} attachment(s)`,
    );

    for (const [id, attach] of message.attachments) {
      console.log(`- ID: ${id}`);
      console.log(`  Filename: ${attach.name}`);
      console.log(`  URL:     ${attach.url}`); // direct link to the file
      console.log(`  Size:    ${(attach.size / 1024).toFixed(2)} KB`);
      if (attach.contentType == "audio/sp-midi") {
        // most likely a midi file
        await mkdir("./data/wav/", { recursive: true });
        await mkdir("./data/midi/", { recursive: true });
        await mkdir("./data/sf2/", { recursive: true });
        await mkdir("./data/mp3/", { recursive: true });
        const midiResp = await fetch(attach.url);
        const midiTempName = crypto.randomUUID() + ".mid";
        const midiPath = `./data/midi/${midiTempName}`;
        const outTempName = crypto.randomUUID() + ".wav";
        const outPath = `./data/wav/${outTempName}`;
        await Bun.write(midiPath, midiResp);
        console.log(`  >> MIDI file downloaded to ${midiPath}`);
        const procMidi = Bun.spawn([
          "midirave",
          "synthesize",
          "--sf2",
          "./data/sf2/Touhou.sf2",
          "--midi",
          midiPath,
          "--output",
          outPath,
        ]);
        const text = await procMidi.stdout.text();
        await Bun.file(midiPath).delete();
        console.log(text);
        const mp3OutPath = `./data/mp3/${crypto.randomUUID()}.mp3`;
        const procNami = Bun.spawn([
          "nami3",
          "--input",
          outPath,
          "--output",
          mp3OutPath,
        ]);
        const textNami = await procNami.stdout.text();
        console.log(textNami);
        const attachment = new AttachmentBuilder(mp3OutPath);
        await message.reply({
          content: "Here is your synthesized Mp3 file:",
          files: [attachment],
        });
        console.log(`  >> Replied with synthesized Mp3 file ${outPath}`);
        await Bun.file(outPath).delete();
        await Bun.file(mp3OutPath).delete();
      }
    }
  }
});

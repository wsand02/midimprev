import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import type Command from "../command";
import type Midimprev from "../../midimprev";

export default class UserCommand implements Command {
  data = new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user.");
  execute = async (_bot: Midimprev, interaction: CommandInteraction) => {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      await interaction.reply("This command can only be used in a guild.");
      return;
    }
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild

    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
    );
  };
}

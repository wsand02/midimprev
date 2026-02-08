import {
  Client,
  REST,
  type ClientOptions,
  Routes,
  GatewayIntentBits,
} from "discord.js";
import type { Command } from "./commands/commands";

export default class Midimprev {
  commands: Map<string, Command>;
  client: Client;

  constructor(
    token: string | undefined,
    guildId: string | undefined,
    clientId: string | undefined,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    if (!token) throw new Error("No token provided");
    this.token = token;
    if (!clientId) throw new Error("No client ID provided");
    this.clientId = clientId;
    if (!guildId) throw new Error("No guild ID provided");
    this.guildId = guildId;
    this.commands = new Map(
      commands.map((command) => [command.data.name, command]),
    );
    this.rest = new REST().setToken(this.token);
    this.deployGuildCommands();
  }

  public override login(token?: string): Promise<string> {
    if (!this.token) throw new Error("No token provided");
    this.deployGuildCommands();
    return super.login(this.token);
  }

  async deployGuildCommands() {
    const body = [...this.commands.values()].map((c) => c.data.toJSON());

    await this.rest.put(
      Routes.applicationGuildCommands(this.clientId, this.guildId),
      { body },
    );
  }
}

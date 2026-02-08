import {
  Client,
  REST,
  type ClientOptions,
  Routes,
  GatewayIntentBits,
} from "discord.js";
import type Command from "./commands/command";
import PingCommand from "./commands/utility/ping";
import ServerCommand from "./commands/utility/server";
import UserCommand from "./commands/utility/user";
import type Event from "./events/event";
import InteractionCreate from "./events/interactionCreate";
import ReadyEvent from "./events/ready";

export default class Midimprev {
  private commands: Command[];
  private client: Client;
  private events: Event[];
  private token: string;
  private clientId: string;
  private guildId: string;
  private foldersPath: any;
  private rest: REST;
  public testa: string = "hej";

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
    this.commands = [new PingCommand(), new ServerCommand(), new UserCommand()];
    this.rest = new REST({ version: "10" }).setToken(this.token); // tänk om dess auth går ut?
    this.events = [new InteractionCreate(), new ReadyEvent()];
    this.deployGuildCommands();

    this.registerEvents();
  }

  public commandsByName(name: string) {
    return this.commands.find((c) => c.data.name == name);
  }

  public registerCommands() {}

  public registerEvents() {
    this.events.forEach((event) => {
      console.log("hello there");
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(this, ...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(this, ...args));
      }
    });
  }

  public async deployGuildCommands() {
    const body = this.commands.map((c) => c.data.toJSON());
    await this.rest.put(
      Routes.applicationGuildCommands(this.clientId, this.guildId),
      { body },
    );
  }

  public async purgeGuildCommands() {
    await this.rest.put(
      Routes.applicationGuildCommands(this.clientId, this.guildId),
      { body: [] },
    );
  }

  public async purgeCommand(commandId: string) {
    await this.rest
      .delete(Routes.applicationCommand(this.clientId, commandId))
      .then(() => console.log("Successfully deleted guild command"))
      .catch(console.error);
  }

  public login() {
    this.client.login(this.token);
  }
}

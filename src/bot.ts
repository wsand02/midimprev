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
import SynthesizeCommand from "./commands/midirave/synthesize";
import InstrumentsCommand from "./commands/midirave/instruments";

export default class Bot {
  private _commands: Command[];
  private _client: Client;
  private _events: Event[];
  private _token: string;
  private _clientId: string;
  private _guildId: string;
  private _sf2Path?: string;
  private _subprocessTimeout: number;
  private _rest: REST;

  constructor(
    token: string | undefined,
    guildId: string | undefined,
    clientId: string | undefined,
    sf2Path?: string,
    subprocessTimeout: number = 2,
  ) {
    this._client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    if (!token) throw new Error("No token provided");
    this._token = token;
    if (!clientId) throw new Error("No client ID provided");
    this._clientId = clientId;
    if (!guildId) throw new Error("No guild ID provided");
    this._guildId = guildId;
    if (sf2Path) {
      this._sf2Path = sf2Path;
    }
    this._subprocessTimeout = subprocessTimeout;

    this._commands = [
      new PingCommand(),
      new ServerCommand(),
      new UserCommand(),
      new SynthesizeCommand(),
      new InstrumentsCommand(),
    ];
    this._rest = new REST({ version: "10" }).setToken(this._token); // tänk om dess auth går ut?
    this._events = [new InteractionCreate(), new ReadyEvent()];
    this.deployGuildCommands();

    this.registerEvents();
  }

  public commandsByName(name: string) {
    return this._commands.find((c) => c.data.name == name);
  }

  public registerEvents() {
    this._events.forEach((event) => {
      if (event.once) {
        this._client.once(event.name, (...args) =>
          event.execute(this, ...args),
        );
      } else {
        this._client.on(event.name, (...args) => event.execute(this, ...args));
      }
    });
  }

  public async deployGuildCommands() {
    const body = this._commands.map((c) => c.data.toJSON());
    await this._rest.put(
      Routes.applicationGuildCommands(this._clientId, this._guildId),
      { body },
    );
  }

  public async purgeGuildCommands() {
    await this._rest.put(
      Routes.applicationGuildCommands(this._clientId, this._guildId),
      { body: [] },
    );
  }

  public async purgeCommand(commandId: string) {
    await this._rest
      .delete(Routes.applicationCommand(this._clientId, commandId))
      .then(() => console.log("Successfully deleted guild command"))
      .catch(console.error);
  }

  public login() {
    this._client.login(this._token);
  }

  public get sf2Path(): string | undefined {
    return this._sf2Path;
  }

  public get subprocessTimeout(): number {
    return this._subprocessTimeout;
  }
}

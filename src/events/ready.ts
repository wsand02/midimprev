import { Events, Client } from "discord.js";
import type Bot from "../bot";
import type Event from "../events/event";

export default class ReadyEvent implements Event {
  name = Events.ClientReady;
  once = true;
  execute = async (_bot: Bot, client: Client) => {
    if (!client.user) {
      throw new Error("Client user is not available");
    }
    console.log(`Ready! Logged in as ${client.user.tag}`);
  };
}

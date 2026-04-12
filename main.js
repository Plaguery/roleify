const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
const { token } = require("./config.json");
const { data, execute } = require("./commands/utility/role");

//initializes discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
client.login(token);

client.commands = new Collection();

//builds /commands path & reads from there
const folderPath = path.join(__dirname, "commands");
const commandFolder = fs.readdirSync(folderPath);

//for folder within commands
for (const folder of commandFolder) {
  //subfolder path
  const commandPath = path.join(folderPath, folder);

  //gets all .js files within subfolder
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    //adds to commands collection if complete
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`${filePath} is missing something! uh oh D: `);
    }
  }
}

const eventPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventPath)
  .filter((file) => file.endsWith(".js"));
for (file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);

  //runs once if event.once is true
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    //else runs on event trigger
    client.on(event.name, (...args) => event.execute(...args));
  }
}

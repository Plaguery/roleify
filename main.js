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
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// client.once(Events.ClientReady, (readyClient) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });
// client.login(token);

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

client.on(Events.InteractionCreate, (interaction) => {
  console.log(interaction.commandName + "was just interacted");
  if (interaction.isChatInputCommand) {
    console.log(interaction);
  } else {
    console.log("not a chat interaction");
  }
});

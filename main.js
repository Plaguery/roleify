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
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
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

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction.commandName + "was just interacted");
  if (!interaction.isChatInputCommand()) {
    return;
  } else {
    console.log(interaction);
    //retrieves command associated w command name from commands collection
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.log(`${interaction.commandName} was NOT FOUND!!!`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(`error executing command: ${error}`);

      //if bot has already showed some sort of response
      if (interaction.replied || interaction.deferred) {
        //sends follow up message
        await interaction.followUp({ content: "uh oh! we ran into an error" });
      } else {
        await interaction.reply({
          content: "uh oh beep boop error detected!",
        });
      }
    }
  }
});

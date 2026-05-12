const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides a description of the commands"),
  async execute(interaction) {
    await interaction.reply({
      content: `/role
This is the main command. It takes the following inputs:

user: This is the Discord user to check.
role: This is the role to give the user if they own the badge
badgeid: This is the id of the Roblox badge to check for. The bot uses Bloxlink to gather the user's Roblox id from their Discord account, and then the Roblox API from there to check for badge ownership.
apikey: This is the BloxLink API key for the server a command was ran in. It is required since BloxLink API keys are server specific. The default API key will NOT work unless you are in the Jegg server. You can generate a key here: https://blox.link/dashboard/user/developer
checktype: This refers to the type of Roblox item to look for. It defaults to badge if left blank, but you can select assets, gamepasses, and bundles as well.

/roleall
This command is similar to role, except it automatically checks ALL users within the server. It attaches a txt file with the results of the command once it finishes running.
`,
      flags: MessageFlags.Ephemeral,
    });
  },
};

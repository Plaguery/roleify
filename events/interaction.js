const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // console.log(interaction.commandName + "was just interacted");
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
          await interaction.followUp({
            content: "uh oh! we ran into an error" + error,
          });
        } else {
          await interaction.reply({
            content: "uh oh beep boop error detected!",
          });
        }
      }
    }
  },
};

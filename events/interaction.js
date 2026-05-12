const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    } else {
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

        //if bot has already showed some sort of response, sends follow up
        if (interaction.replied || interaction.deferred) {
          if (error.code == 50013) {
            await interaction.followUp({
              content:
                "⚠ Ensure Roleify role is above roles you wish to assign ",
            });
            return;
          } else {
            await interaction.followUp({
              content: error,
            });
          }

          //sends intitial reply
        } else {
          await interaction.reply({
            content: error,
          });
        }
      }
    }
  },
};

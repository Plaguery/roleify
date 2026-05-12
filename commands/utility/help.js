const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides a description of the commands"),
  async execute(interaction) {
    await interaction.reply({
      content: `hi... *helps*`,
      flags: MessageFlags.Ephemeral,
    });
  },
};

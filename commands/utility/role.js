const { SlashCommandBuilder } = require("discord.js");
const { clientId, guildId, token, blKey } = require("./config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("role").setDescription("roles"),
  async execute(interaction) {
    await interaction.reply(`hi wassup  ${interaction.user.username}`);
  },
};

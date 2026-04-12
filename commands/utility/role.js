const path = require("node:path");
const { SlashCommandBuilder } = require("discord.js");
const { clientId, guildId, token, blKey } = require(
  path.join(__dirname, "../../config.json"),
);

const { ownsItem, checkUser } = require("../../checkBadges.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Applies role to users if they own specified badge")
    .addRoleOption((role) =>
      role
        .setName("role")
        .setDescription("Role to apply to users")
        .setRequired(true),
    )
    .addStringOption((id) =>
      id
        .setName("badgeid")
        .setDescription("ID of badge to check for")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.reply(`Checking badges, please wait.`);
    const guild = interaction.guild;
    const uid = interaction.user.id;
    await interaction.followUp(
      await checkUser(uid, interaction.options.getString("badgeid")),
    );
    //await interaction.followUp(interaction.options);

    //const memberList = await guild.members.fetch();

    // memberList.forEach((element) => {
    //   console.log(element.user + " is " + element.displayName);
    // });
  },
};

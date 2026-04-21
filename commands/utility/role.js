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
    )
    .addStringOption((apiKey) =>
      apiKey
        .setName("apikey")
        .setDescription(
          "Bloxlink API Key. Required if command is not run in the JEGG server",
        )
        .setRequired(false),
    ),

  async execute(interaction) {
    await interaction.reply(`Checking badges, please wait.`);
    //main important variables...
    const guild = interaction.guild;
    const role = interaction.options.getRole("role");
    const badge = interaction.options.getString("badgeid");

    //  await interaction.followUp("role" + role);

    //    const uid = interaction.user.id; //user who triggered interaction
    //    await interaction.followUp("hasBadge = " + (await checkUser(uid, badge)));

    const memberList = await guild.members.fetch();

    memberList.forEach(async (member) => {
      if (await checkUser(member.id, badge)) {
        console.log(member.user + "/" + member.displayName + "has the badge!");
        member.roles.add(role);
      } else {
        console.log(
          member.user + "/" + member.displayName + "does NOT have the badge",
        );
      }
    });
  },
};

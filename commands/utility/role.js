const path = require("node:path");
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { clientId, guildId, token, blKey } = require(
  path.join(__dirname, "../../config.json"),
);

const { ownsItem, checkUser } = require("../../checkBadges.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Applies role to user if they own specified badge")
    .addUserOption((user) =>
      user.setName("user").setDescription("User to check").setRequired(true),
    )
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
    const user = interaction.options.getUser("user");
    const member = await guild.members.fetch(user.id);
    const invoker = await guild.members.fetch(interaction.user.id);
    const manageRoles = invoker.permissions.has(
      PermissionsBitField.Flags.ManageRoles,
    );

    if (!manageRoles) {
      await interaction.followUp("Missing required manage-role permissions.");
      return;
    }

    //checks for badge
    if (await checkUser(member.id, badge)) {
      await interaction.followUp(
        member + "/" + member.displayName + " has the badge!",
      );
      await member.roles.add(role);
    } else {
      await interaction.followUp(
        member + "/" + member.displayName + " does NOT have the badge",
      );
    }
  },
};

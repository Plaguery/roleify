const path = require("node:path");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  MessageFlags,
} = require("discord.js");
const { clientId, guildId, token, blKey } = require(
  path.join(__dirname, "../../config.json"),
);

const { ownsItem, checkUser, typeWord } = require("../../checkBadges.js");

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
    )
    .addStringOption((type) =>
      type
        .setName("checktype")
        .setDescription("Type of item to check for. Defaults to badge.")
        .setRequired(false)
        .addChoices(
          { name: "Asset", value: "0" },
          { name: "Gamepass", value: "1" },
          { name: "Badge", value: "2" },
          { name: "Bundle", value: "3" },
        ),
    ),
  async execute(interaction) {
    try {
      //init response
      await interaction.reply({
        content: `Checking badges, please wait.`,
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      });

      //main important variables...
      const guild = interaction.guild;
      const guildid = interaction.guildId;

      const role = interaction.options.getRole("role");
      const badge = interaction.options.getString("badgeid");
      const key = interaction.options.getString("apikey");
      const user = interaction.options.getUser("user");
      var checktype = interaction.options.getString("checktype");
      checktype = !checktype ? 2 : checktype;

      const member = await guild.members.fetch(user.id);
      const invoker = await guild.members.fetch(interaction.user.id);
      const manageRoles = invoker.permissions.has(
        PermissionsBitField.Flags.ManageRoles,
      );

      //checks for perms
      if (!manageRoles) {
        await interaction.editReply(
          "⚠ Missing required manage-role permissions.",
        );
        return;
      }

      //checks for badge
      if (await checkUser(member.id, badge, guildid, key, checktype)) {
        await interaction.editReply(
          `${member.user.tag} has the ${typeWord[checktype]}! ✓`,
        );
        await member.roles.add(role);
      } else {
        await interaction.editReply(
          `${member.user.tag} does NOT have the ${typeWord[checktype]}. ✗`,
        );
      }
    } catch (error) {
      await interaction.editReply(`${error.message}`);
    }
  },
};

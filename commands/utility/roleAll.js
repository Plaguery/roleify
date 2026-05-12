const path = require("node:path");
const {
  SlashCommandBuilder,
  PermissionsBitField,
  MessageFlags,
  AttachmentBuilder,
  EmbedBuilder,
} = require("discord.js");
const { clientId, token, blKey } = require(
  path.join(__dirname, "../../config.json"),
);

const { ownsItem, checkUser, typeWord } = require("../../checkBadges.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleall")
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
      await interaction.reply({
        content: `Checking badges, please wait. \n`,
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      });

      //main important variables...

      const guild = interaction.guild;
      const guildid = interaction.guildId;
      const role = interaction.options.getRole("role");
      const badge = interaction.options.getString("badgeid");
      const key = interaction.options.getString("apikey");

      var checktype = interaction.options.getString("checktype");
      checktype = !checktype ? 2 : checktype;

      //checks for perms
      const invoker = await guild.members.fetch(interaction.user.id);
      const manageRoles = invoker.permissions.has(
        PermissionsBitField.Flags.ManageRoles,
      );

      var msgContent = "";

      //checks perms
      if (!manageRoles) {
        await interaction.editReply(
          "⚠ Missing required manage-role permissions.",
        );
        return;
      }

      const memberList = await guild.members.fetch();

      for (const member of memberList.values()) {
        try {
          var addText = "";
          //skips if bot
          if (member.user.bot) {
            continue;
          }
          if (await checkUser(member.id, badge, guildid, key, checktype)) {
            addText = `${member.user.tag} has the ${typeWord[checktype]}! ✓`;

            await member.roles.add(role);
          } else {
            addText = `${member.user.tag} does NOT have the ${typeWord[checktype]}. ✗`;
          }
        } catch (error) {
          //error checking
          if (error?.status == 401) {
            await interaction.editReply(
              `⚠ Must provide correct Bloxlink API key`,
            );
            return;
          } else if (error?.status == 400) {
            await interaction.editReply(`⚠ Invalid Bloxlink API key`);
            return;
          }
          addText = `Skipping ${member.user.tag}: ${error.message || error}`;
        }
        msgContent += addText + "\n";
      }

      //creates txt file to summarize results
      const attachment = new AttachmentBuilder(
        Buffer.from(msgContent, "utf-8"),
        { name: "result.txt" },
      );

      await interaction.followUp({
        content: "Completed role checking.",
        files: [attachment],
      });
    } catch (error) {
      await interaction.editReply({ content: error.message });
    }
  },
};

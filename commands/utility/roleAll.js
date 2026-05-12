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

const { ownsItem, checkUser } = require("../../checkBadges.js");

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
    ),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: `Checking badges, please wait. \n`,
        flags: MessageFlags.Ephemeral,
        withResponse: true,
      });
      //  var msg = await interaction.fetchReply();

      //main important variables...

      const guild = interaction.guild;
      const guildid = interaction.guildId;
      const role = interaction.options.getRole("role");
      const badge = interaction.options.getString("badgeid");
      const key = interaction.options.getString("apikey");

      //checks for perms
      const invoker = await guild.members.fetch(interaction.user.id);
      const manageRoles = invoker.permissions.has(
        PermissionsBitField.Flags.ManageRoles,
      );

      var msgContent = "";

      if (!manageRoles) {
        await interaction.editReply(
          "Missing required manage-role permissions.",
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
          if (await checkUser(member.id, badge, guildid, key)) {
            addText = member.user.tag + " has the badge!";
            //console.debug(member.user.tag + " has the badge!");
            await member.roles.add(role);
          } else {
            // console.log(member.user.tag + " does NOT have the badge!");
            addText = member.user.tag + " does NOT have the badge!";
          }
        } catch (error) {
          //error checking
          if (error?.status == 401) {
            await interaction.editReply(
              `Error: Must provide correct Bloxlink API key`,
            );
            return;
          } else if (error?.status == 400) {
            await interaction.editReply(`Error: Invalid Bloxlink API key`);
            return;
          }
          addText = `Skipping ${member.user.tag}: ${error.message || error}`;
          /*    await interaction.editReply(
            `Skipping ${member.user.tag}: ${error.message || error}`,
          ); */
        }
        msgContent += addText + "\n";

        // console.log("break", msgContent);
        //  msg = await interaction.editReply(msgContent);
        //  console.log(msg.content);
      }
      const attachment = new AttachmentBuilder(
        Buffer.from(msgContent, "utf-8"),
        { name: "result.txt" },
      );

      await interaction.followUp({
        content: "Completed role checking",
        files: [attachment],
      });
    } catch (error) {
      await interaction.followUp({ content: error.message });
    }
  },
};

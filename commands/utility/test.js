const { clientId, guildId, token, blKey } = require("./config.json");

async function fetchId(id) {
  const robloxId = await fetch(
    ("https://api.blox.link/v4/public/guilds/789699000047370261/discord-to-roblox/214858075650260992",
    { headers: { Authorization: blKey } }),
  );
}

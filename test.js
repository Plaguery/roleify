const { clientId, guildId, token, blKey } = require("./config.json");

//grabs roblox id from discord id using bloxlink
async function fetchId(id) {
  const response = await fetch(
    `https://api.blox.link/v4/public/guilds/${guildId}/discord-to-roblox/${id}`,
    {
      headers: { Authorization: blKey },
    },
  );

  const data = await response.json();
  const bloxId = data.robloxID;
  return bloxId;
}

//checks if roblox user uid owns item itemId
//returns true if owned
async function ownsBadge(uid, badgeId) {
  const response = await fetch(
    `https://inventory.roblox.com/v1/users/${uid}/items/2/${badgeId}/is-owned`,
  );
  const isOwned = await response.json();
  // console.log(isOwned);
  return isOwned;
}

async function checkUser(id, badgeId) {
  const bloxId = await fetchId(id);
  const isOwned = await ownsBadge(bloxId, badgeId);
  console.log(isOwned);
  return isOwned;
}

//console.log(ownsBadge(fetchId("694605691716894820"), "1078926980379768"));
checkUser("694605691716894820", "1078926980379768");

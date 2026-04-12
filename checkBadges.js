const { clientId, guildId, token, blKey } = require("./config.json");

module.exports = {
  fetchId,
  ownsItem,
  checkUser,
};
//grabs roblox id from discord id using bloxlink
async function fetchId(id) {
  try {
    const response = await fetch(
      `https://api.blox.link/v4/public/guilds/${guildId}/discord-to-roblox/${id}`,
      {
        headers: { Authorization: blKey },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`bloxlink error: ${response.status} // ${data.error}`);
    }

    const bloxId = data.robloxID;
    return bloxId;
  } catch (error) {
    console.log(error);
  }
}

//checks if roblox user uid owns item itemId
//returns true if owned
async function ownsItem(uid, itemId, itemType = 2) {
  //false if no valid uid
  if (!uid) {
    return false;
  }
  try {
    const response = await fetch(
      `https://inventory.roblox.com/v1/users/${uid}/items/${itemType}/${itemId}/is-owned`,
    );
    const isOwned = await response.json();

    if (!response.ok) {
      throw new Error(
        `roblox error: ${response.status} // ${isOwned.errors[0].message}`,
      );
    }

    // console.log(isOwned);
    return isOwned;
  } catch (error) {
    console.log(error);
  }
}

//check from discord id & itemId
async function checkUser(id, itemId, itemType = 2) {
  const bloxId = await fetchId(id);
  const isOwned = await ownsItem(bloxId, itemId, itemType);
  console.log(isOwned);
  return isOwned;
}

//checkUser("694605691716894820", "1078926980379768");
//ownsItem("296944867", "1078926980379768");

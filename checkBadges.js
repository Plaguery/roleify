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
      if (response.status == 429) {
        throw new Error(`Error: Bloxlink rate limit`);
      } else {
        throw new Error(`Bloxlink Error: ${response.status} // ${data.error}`);
      }
    }

    const bloxId = data.robloxID;
    return bloxId;
  } catch (error) {
    throw error;
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

    return isOwned;
  } catch (error) {
    throw error;
  }
}

//check from discord id & itemId
async function checkUser(id, itemId, itemType = 2) {
  try {
    const bloxId = await fetchId(id);
    const isOwned = await ownsItem(bloxId, itemId, itemType);
    return isOwned;
  } catch (error) {
    throw error;
  }
}

//checkUser("694605691716894820", "1078926980379768");
//ownsItem("296944867", "1078926980379768");

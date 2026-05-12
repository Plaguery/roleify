const { clientId, token, blKey } = require("./config.json");
const typeWord = {
  0: "asset",
  1: "gamepass",
  2: "badge",
  3: "bundle",
};

module.exports = {
  fetchId,
  ownsItem,
  checkUser,
  typeWord,
};

//grabs roblox id from discord id using bloxlink
async function fetchId(id, key, guildid) {
  try {
    const response = await fetch(
      `https://api.blox.link/v4/public/guilds/${guildid}/discord-to-roblox/${id}`,
      {
        headers: { Authorization: key },
      },
    );
    const data = await response.json();

    //error checking
    if (!response.ok) {
      var err;
      if (response.status == 429) {
        err = new Error(`⚠ Bloxlink rate limit`);
      } else if (response.status == 404) {
        err = new Error(`⚠ Bloxlink can't find the specified user.`);
      } else if (response.status == 401) {
        err = new Error(`⚠ Must provide correct Bloxlink API key`);
      } else {
        err = new Error(`⚠ Bloxlink ${response.status} // ${data.error}`);
      }
      err.status = response.status;
      throw err;
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
      if (response.status == 429) {
        throw new Error(`⚠ Roblox rate limit`);
      } else if (response.status == 403) {
        throw new Error(`⚠ User has their Roblox inventory privated`);
      } else {
        throw new Error(
          `⚠ Roblox ${response.status} // ${isOwned.errors[0].message}`,
        );
      }
    }

    return isOwned;
  } catch (error) {
    throw error;
  }
}

//check from discord id & itemId
async function checkUser(id, itemId, guildid, key, itemType = 2) {
  if (key == null) {
    key = blKey;
  }
  try {
    const bloxId = await fetchId(id, key, guildid);
    const isOwned = await ownsItem(bloxId, itemId, itemType);
    return isOwned;
  } catch (error) {
    throw error;
  }
}

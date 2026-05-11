# About

This is a Discord bot which gives users roles based on whether or not they own a Roblox badge.
Add it to your server here: https://discord.com/oauth2/authorize?client_id=1489809504685133977&permissions=1101927548928&integration_type=0&scope=bot

# Development

The bot integrates with Bloxlink (to get the Roblox user from the Discord account) and the Roblox API (to check if the user has the specified badge)

# Commands

/role
This is the main command. It takes the following inputs:

user: This is the Discord user to check.
role: This is the role to give the user if they own the badge
badgeid: This is the id of the Roblox badge to check for. The bot uses Bloxlink to gather the user's Roblox id from their Discord account, and then the Roblox API from there to check for badge ownership.
apikey: This is the BloxLink API key for the server a command was ran in. It is required since BloxLink API keys are server specific. The default API key will NOT work unless you are in the server this bot was developed for.

/roleall
This command is similar to role, except it automatically checks ALL users within the server.

# About

This is a Discord bot which gives users roles based on whether or not they own a Roblox badge.
\nAdd it to your server here: https://discord.com/oauth2/authorize?client_id=1489809504685133977&permissions=1101927548928&integration_type=0&scope=bot \nNOTE: TO ENSURE THE BOT IS ABLE TO CONFIGURE ROLES, DRAG THE AUTOMATICALLY GENERATED ROLE ABOVE THE ROLES YOU WANT IT TO BE ABLE TO ASSIGN.

# Development

The bot integrates with Bloxlink (to get the Roblox user from the Discord account) and the Roblox API (to check if the user has the specified badge)

# Commands

/role
This is the main command. It takes the following inputs:

\nuser: This is the Discord user to check.
\nrole: This is the role to give the user if they own the badge
\nbadgeid: This is the id of the Roblox badge to check for. The bot uses Bloxlink to gather the user's Roblox id from their Discord account, and then the Roblox API from there to check for badge ownership.
\napikey: This is the BloxLink API key for the server a command was ran in. It is required since BloxLink API keys are server specific. The default API key will NOT work unless you are in the server this bot was developed for. You can generate a key here: https://blox.link/dashboard/user/developer
\nchecktype: This refers to the type of Roblox item to look for. It defaults to badge if left blank, but you can select assets, gamepasses, and bundles as well.

/roleall
This command is similar to role, except it automatically checks ALL users within the server. It attaches a txt file with the results of the command once it finishes running.

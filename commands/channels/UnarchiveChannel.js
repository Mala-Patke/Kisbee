const { Command } = require('discord.js-commando');

module.exports = class UnarchiveChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'unarchivechannel',
            aliases: [ 'unarchive' ],
            group: 'channels',
            memberName: 'unarchive',
            description: 'Unarchives an archived channel.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'Please specify a channel to be unarchived.',
                type: 'channel'
            }],
            userPermissions: [ 'MANAGE_CHANNELS' ]
        });
    }
    
	async run(msg, args) {
        await args.channel.setParent(null);
        args.channel.overwritePermissions([]);
        // TODO: Make this restore previous perms somehow
        
        let year = new Date().getFullYear() - 1;
        if (new Date().getMonth() >= 7 && new Date().getDate() >= 17) year++;

        args.channel.send(`\`\`\`        UNARCHIVED CHANNEL

This channel is no longer archived and
can once again be used for discussion
as its class is active as of the ${year}
- ${year + 1} school year.\`\`\``);
	}
}
const { Command } = require('discord.js-commando');

module.exports = class ArchiveChannel extends Command {
    constructor(client) {
        super(client, {
            name: 'archivechannel',
            aliases: [ 'archive' ],
            group: 'channels',
            memberName: 'archive',
            description: 'Archives a channel.',
            guildOnly: true,
            args: [{
                key: 'channel',
                prompt: 'Please specify a channel to be archived.',
                type: 'channel'
            }],
            userPermissions: [ 'MANAGE_CHANNELS' ]
        });
    }
    
	async run(msg, args) {
        let archiveCategory = msg.guild.settings.get('archiveCategory');
        if (!archiveCategory)
            archiveCategory = msg.guild.channels.cache.find(c => c.name === 'Archive');
        if (!archiveCategory)
            archiveCategory = await msg.guild.channels.create('Archive', {
                type: 'category',
                permissionOverwrites: [{
                    id: msg.guild.roles.everyone,
                    deny: [ 'SEND_MESSAGES' ]
                }]
            });
        msg.guild.settings.set('archiveCategory', archiveCategory.id);

        await args.channel.setParent(archiveCategory, { lockPermissions: true });
        
        let year = new Date().getFullYear() - 1;
        if (new Date().getMonth() >= 7 && new Date().getDate() >= 17) year++;

        args.channel.send(`\`\`\`      ARCHIVED CHANNEL

This channel has been archived
and can no longer be used for
discussion as its class is no
longer active as of the ${year} -
${year + 1} school year. It may be
unarchived in future years if
the class becomes offered again.\`\`\``);

        let channels = msg.guild.settings.get('subjectRoles');
        for (let id in channels) {
            if (channels[id] === args.channel.id) msg.guild.settings.remove('subjectRoles.' + id);
        }
	}
}
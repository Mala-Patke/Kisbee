const { Command } = require('discord.js-commando');

module.exports = class DeleteChannels extends Command {
    constructor(client) {
        super(client, {
            name: 'deletechannels',
            group: 'channels',
            memberName: 'delete',
            description: 'Deletes all subject channels.',
            details: 'Requires the Manage Channels permission.',
            guildOnly: true,
            userPermissions: [ 'MANAGE_CHANNELS' ]
        });
    }

    async run(msg, args) {
        msg.channel.send('Working...');
        let channels = msg.guild.settings.get('subjectChannels');
        if (!channels) return msg.reply('No channels exist to be deleted.');

        for (let channel in channels) {
            channel = await msg.guild.channels.resolve(channels[channel]);
            if (channel && !channel.deleted) await channel.delete();
        }

        msg.reply(`Success! Deleted a total of ${Object.keys(channels).length} channels.`);
        msg.guild.settings.remove('subjectChannels');
    }
}
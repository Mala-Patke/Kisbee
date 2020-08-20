const { Command } = require('discord.js-commando');

module.exports = class CleanPins extends Command {
    constructor(client) {
        super(client, {
            name: 'cleanpins',
            group: 'channels',
            memberName: 'cleanpins',
            description: 'Remove and display each pinned Zoom url.',
            guildOnly: true,
            userPermissions: [ 'MANAGE_CHANNELS', 'MANAGE_MESSAGES' ]
        });
    }
    
	async run(msg, args) {
        let pins = (await msg.channel.messages.fetchPinned()).array();
        let pattern = new RegExp(/https:\/\/.*\.zoom\.us\/j\/[0-9]*(\?pwd=[0-z]*)?/, 'gi');
        pins = pins.filter(e => e.content.match(pattern) !== null);
        if (pins.length === 0) return msg.channel.send('Kisbee could not find any pinned Zoom links.');
        for (let message of pins) {
            message.unpin();
            msg.channel.send(message.content);
        }
	}
}
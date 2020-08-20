const { Command } = require('discord.js-commando');

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            aliases: [ 'invitelink' ],
            group: 'misc',
            memberName: 'invite',
            description: 'Bring Kisbee to a new server.'
        });
    }
    
	async run(msg, args) {
        msg.channel.send(`https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`);
	}
}
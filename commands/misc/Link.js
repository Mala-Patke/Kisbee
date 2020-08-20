const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Link extends Command {
    constructor(client) {
        super(client, {
            name: 'link',
            aliases: [ 'info', 'links' ],
            group: 'misc',
            memberName: 'link',
            description: 'Retrieve helpful information on a link. Returns all links when called with no arguments.',
            guildOnly: true,
            args: [{
                key: 'name',
                type: 'string',
                prompt: 'Please specify the name of an item you want to view.',
                default: ''
            }]
        });
    }
    
	async run(msg, args) {
        let time = { timeout: 30000 };
        msg.delete(time);
        let embed = new MessageEmbed();
        if (args.name && args.name !== 'list') {
            let item = msg.guild.settings.get('links.' + args.name.toLowerCase(), args.value);
            if (!item) return msg.channel.send('Kisbee could not find an item with that name').delete(time);
            embed.addField(args.name.charAt(0).toUpperCase() + args.name.slice(1), item);
        } else {
            let items = msg.guild.settings.get('links');
            if (!items || Object.keys(items).length === 0) return msg.channel.send('There are no items saved with Kisbee.').delete(time);
            for (let item in items) {
                embed.addField(item.charAt(0).toUpperCase() + item.slice(1), items[item]);
            }
        }

        let sent = await msg.channel.send(embed);
        sent.delete(time);
	}
}
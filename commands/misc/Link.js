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
            args: [{
                key: 'name',
                type: 'string',
                prompt: 'Please specify the name of an item you want to view.',
                default: ''
            }]
        });
    }
    
	async run(msg, args) {
        if (args.name && args.name !== 'list') {
            let item = msg.guild.settings.get('links.' + args.name.toLowerCase(), args.value);
            if (!item) return msg.channel.send('Kisbee could not find an item with that name');
            let embed = new MessageEmbed()
                .addField(args.name.charAt(0).toUpperCase() + args.name.slice(1), item);
            msg.channel.send(embed);
        } else {
            let items = msg.guild.settings.get('links');
            if (!items || Object.keys(items).length === 0) return msg.channel.send('There are no items saved with Kisbee.');
            let embed = new MessageEmbed();
            for (let item in items) {
                embed.addField(item.charAt(0).toUpperCase() + item.slice(1), items[item]);
            }
            msg.channel.send(embed);
        }
	}
}
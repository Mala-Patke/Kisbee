/**
 * Written by pitabread#7689
 * Ported to commando by thrilliams#5489
 */

const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const yts = require('yt-search');

module.exports = class KASearch extends Command {
    constructor(client) {
        super(client, {
            name: 'kasearch',
            aliases: [ 'ka', 'kahelp' ],
            group: 'misc',
            memberName: 'kahelp',
            description: 'Get help on Khan Academy.',
            args: [{
                key: 'query',
                prompt: 'You haven\'t specified what you need help with.',
                type: 'string'
            }]
        });
    }
    
	async run(msg, args) {
        let query = `Khan Academy ${args.query}`;

        yts(query, function(err, res) {
            const videos = res.videos.slice(0, 3);

            for (let video of videos) {
                let embed = new MessageEmbed()
                    .setColor('#1a771d')
                    .setTitle(video.title)
                    .setURL(video.url)
                    .setAuthor(video.author.name)
                    .setDescription(video.description)
                    .setThumbnail(video.image);
                msg.channel.send(embed);
            }
        });
	}
}
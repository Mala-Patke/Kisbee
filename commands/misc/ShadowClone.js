const { Command } = require('discord.js-commando');

module.exports = class ShadowClone extends Command {
    constructor(client) {
        super(client, {
            name: 'shadowclone',
            aliases: [ 'snoop', 'shadow', 'clone', 'shadowclonejutsu' ],
            group: 'misc',
            memberName: 'shadowclone',
            description: 'Shadow clone jutsu!',
            guildOnly: true,
            ownerOnly: true,
            hidden: true,
            args: [
                {
                    key: 'target',
                    prompt: 'Please specify the channel ID you want to create a shadow clone in.',
                    validate: function(val, msg, arg) {
                        if (!msg.command.client.channels.cache.has(val)) return 'Kisbee cannot find a channel with that ID.';
                        if (msg.command.client.channels.cache.get(val).type !== 'text') return 'Kisbee cannot perform shadow clone jutsu in a non-text channel.';
                        return true;
                    },
                    parse: function(val, msg, arg) {
                        return msg.command.client.channels.cache.get(val);
                    }
                },
                {
                    key: 'host',
                    prompt: 'Please specify the channel ID you want to control a shadow clone in.',
                    validate: function(val, msg, arg) {
                        if (!msg.command.client.channels.cache.has(val)) return 'Kisbee cannot find a channel with that ID.';
                        if (msg.command.client.channels.cache.get(val).type !== 'text') return 'Kisbee cannot perform shadow clone jutsu in a non-text channel.';
                        return true;
                    },
                    parse: function(val, msg, arg) {
                        return msg.command.client.channels.cache.get(val);
                    },
                    default: function(msg, arg) {
                        return msg.channel || msg.author;
                    }
                }
            ]
        });
    }
    
	async run(msg, args) {
        let listener = (function(t, h, msg) {
            if (msg.author.id === this.client.user.id) return;
            if (msg.content === 'stop' && msg.channel.id === h.id) {
                this.client.removeListener('message', listener);
                return msg.reply('Shadow clone jutsu finished.');
            }
            
            if (msg.channel.id === t.id) {
                msg.content = `\`${msg.guild.member(msg.author).nickname || msg.author.username}\`: ` + msg.content;
            }

            (msg.channel.id === h.id ? t : h).send(msg.content, {
                files: msg.attachments.array(),
                embed: msg.embed
            });
        }).bind(this, args.target, args.host);

        this.client.addListener('message', listener);
        msg.reply('Shadow clone jutsu commencing. Say any message to have it cloned or `stop` to finish shadow clone jutsu.');
	}
}
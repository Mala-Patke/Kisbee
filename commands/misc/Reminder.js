const { Command } = require('discord.js-commando');

module.exports = class Alert extends Command {
    constructor(client) {
        super(client, {
            name: 'reminder',
            aliases: [ 'remind', 'remindme', 'alert', 'alarm' ],
            group: 'misc',
            memberName: 'reminder',
            description: 'Set a reminder.',
            args: [
                {
                    key: 'amount',
                    type: 'integer',
                    prompt: 'Please specify an amount of time.'
                },
                {
                    key: 'type',
                    type: 'string',
                    prompt: 'Please specify a unit of time. (Valid types are seconds, minutes, hours, and days.)',
                    default: 'minutes'
                }
            ]
        });
    }
    
	async run(msg, args) {
        let types = [
            [ '^s(econd(s)?)?$', 1000, 'second' ],
            [ '^m(inute(s)?)?$', 1000 * 60, 'minute' ],
            [ '^h(our(s)?)?$', 1000 * 60 * 60, 'hour' ],
            [ '^d(ay(s)?)?$', 1000 * 60 * 60 * 24, 'day' ]
        ];

        let amount = args.amount;
        let type;
        for (type of types) {
            if (new RegExp(type[0], 'gi').test(args.type)) {
                amount *= type[1];
                break;
            }
        }

        if (amount === args.amount) return msg.channel.send('Kisbee was unable to find a unit of time under that name. (Valid types are seconds, minutes, hours, and days.)');
        else msg.channel.send(`Reminder set for ${args.amount} ${type[2] + (args.amount !== 1 ? 's' : '')}.`);

        setTimeout(() => msg.reply('become reminded.'), amount);
	}
}
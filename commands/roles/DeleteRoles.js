const { Command } = require('discord.js-commando');

module.exports = class DeleteRoles extends Command {
    constructor(client) {
        super(client, {
            name: 'deleteroles',
            group: 'roles',
            memberName: 'delete',
            description: 'Deletes all subject roles.',
            details: 'Requires the Manage Channels permission.',
            guildOnly: true,
            userPermissions: [ 'MANAGE_ROLES' ]
        });
    }

    async run(msg, args) {
        msg.channel.send('Working...');
        let roles = msg.guild.settings.get('subjectRoles');
        if (!roles) return msg.reply('No roles exist to be deleted.');
        
        for (let roleId in roles) {
            let role = msg.guild.roles.resolve(roles[roleId]);
            if (role && !role.deleted) await role.delete();
        }

        msg.reply(`Success! Deleted a total of ${Object.keys(roles).length} roles.`);
        msg.guild.settings.remove('subjectRoles');
    }
}
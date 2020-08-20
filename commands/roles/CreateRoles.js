const { Command } = require('discord.js-commando');
const primeTimeTable = require('../../api/primeTimeTable.js');

module.exports = class CreateRoles extends Command {
    constructor(client) {
        super(client, {
            name: 'createroles',
            group: 'roles',
            memberName: 'create',
            description: 'Finds existing roles for each subject and creates roles if they don\'t exist.',
            details: 'Requires the Manage Channels permission. Use sparingly; repeated uses of this command have the potential to get Kisbee ratelimited.',
            guildOnly: true,
            userPermissions: [ 'MANAGE_ROLES' ],
            throttling: {
                usages: 3,
                duration: 60 * 60 * 24 * 3 // 3 days
            }
        });
    }

    async run(msg, args) {
        msg.channel.send('Working...');
        let roles = (await primeTimeTable()).subjects;
        let existingRoles = msg.guild.settings.get('subjectRoles');
        
        let disallowedSubjectNames = ['Lunch', 'Break', 'Community Seminar', 'Community Meeting', 'Independent Study', 'Senior Seminar', 'College Counseling (IL7)', 'Advisory (IL6)'];
        let coloredSubjectPrefix = 'Advisory';

        roles = roles
            .map(role => ({ ...role, name: role.name.replace(/\((sec(tion)? )?[0-9]*\)/g, '').trim() }))
            .filter(role => !disallowedSubjectNames.includes(role.name));
        
        if (existingRoles) roles = roles
            .filter(role => !(role.id in existingRoles));
        
        for (let subject of roles) {
            let role = msg.guild.roles.cache.find(r => r.name === subject.name);
            if (!role) {
                let data = { name: subject.name }
                if (subject.name.startsWith(coloredSubjectPrefix)) data.color = subject.color;
                role = await msg.guild.roles.create({ data: data });
            } else console.log(`${role.name} already exists, adding to DB.`);

            msg.guild.settings.set('subjectRoles.' + subject.id, role.id);
        }

        msg.reply(`Success! Created/converted a total of ${roles.length} roles.`);
    }
}
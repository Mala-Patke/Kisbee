const { Command, ArgumentCollector } = require('discord.js-commando');
const primetable = require('../../api/primetable.js');

module.exports = class GetRoles extends Command {
    constructor(client) {
        super(client, {
            name: 'getroles',
            group: 'roles',
            memberName: 'get',
            description: 'Gives subject roles to whoever\'s calling it.',
            guildOnly: true
        });
    }

    async run(msg, args) {
        msg.channel.send('Fetching student information, please wait...');
        let roles = msg.guild.settings.get('subjectRoles');
        let students = (await primetable()).classes;
        
        let author = msg.mentions.members.first();
        if(!author) author = msg.member; 

        let possibleStudents = students.filter(s => {
            let first = s.name.toLowerCase().split(' ')[0];
            let last = s.name.toLowerCase().split(' ')[1];
            let username = (author.nickname || author.user.username).toLowerCase();
            return [
                `.*${first}.*`,
                `.*${first} ?${last}.*`,
                `.*${first.charAt(0)} ?${last}.*`,
                `.*${first} ?${last.charAt(0)}.*`
            ]
                .map(pattern => new RegExp(pattern, 'gi'))
                .some(pattern => pattern.test(username));
        });

        let student;
        if (possibleStudents.length !== 1) {
            let prompt = `Kisbee cannot tell what your name is. Please reply with your first and last name.`;
            let rules = msg.guild.channels.cache.find(c => c.name === 'rules');
            if (rules)
                prompt += `\nAdditionally, double-check you aren't breaking rule #1 in ${rules}.\n*(This is an automated reminder, not a formal warning.)*`
            let collector = new ArgumentCollector(this.client, [{
                key: 'name',
                prompt: prompt,
                type: 'string'
            }]);
    
            let result = await collector.obtain(msg);
            if (result.cancelled) return msg.channel.send('Cancelled.');

            student = students.filter(s => s.name.toLowerCase() === result.values.name.toLowerCase());
            if (student.length < 1) {
                return msg.channel.send('Kisbee cannot find a student with that name. Check for typos and try again.');
            } else {
                student = student[0];
            }
        } else {
            student = possibleStudents[0];
            msg.channel.send(`You look like ${student.name}.`);
        }

        if (!roles)
            return msg.channel.send('No roles assigned. Contact a moderator.');

        let newRoles = student.subjects
            .filter(s => s.id in roles)
            .map(s => roles[s.id])
            .filter(r => msg.guild.roles.cache.has(r));
        
        author.roles.add(newRoles);
        msg.channel.send(`Success! Assigned ${newRoles.length} roles.`);
    }
}

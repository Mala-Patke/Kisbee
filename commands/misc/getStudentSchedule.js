const { Command, ArgumentCollector } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const primeTimeTable = require('../../api/primeTimeTable.js');

module.exports = class GetSchedule extends Command {
    constructor(client) {
        super(client, {
            name: 'getSchedule',
            group: 'misc',
            memberName: 'get',
            description: 'Show\'s student their schedule',
            guildOnly: true
        });
    }

    async run(msg, args) {
        msg.channel.send('Fetching student information, please wait...');
        let author = msg.member;

        let students = (await primeTimeTable()).classes;
        let periods = (await primeTimeTable()).periods;
        let activities = (await primeTimeTable()).activities;
        let days = (await primeTimeTable()).days;
        let subjects = (await primeTimeTable()).subjects;

        let possibleStudents = students.filter(s => {
            let first = s.name.toLowerCase().split(' ')[0];
            let last = s.name.toLowerCase().split(' ')[1];
            let username = (author.nickname || msg.author.username).toLowerCase();
            return [
                `.*${first}.*`,
                `.*${last}.*`,
                `.*${first} *${last}.*`,
                `.*${first.charAt(0)} *${last}.*`,
                `.*${first} *${last.charAt(0)}.*`
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
        }
        
        let dotw = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(Date.now());
        dotw = days.find(day => day.name.toLowerCase() === dotw.toLowerCase()).id;
        let studentactivities = activities
            .filter(act => act.groupIds.includes(student.id)) //Array of activities with the student
            .filter(act => !!act.cards.find(card => card.dayID === dotw))
            .map(act => {return {subject: act.subjectId, period: act.cards[0].periodId}});
        let schedule = [];
        studentactivities.foreach(act => {
            let time = periods.find(p => p.id === act.period).name.split(" ");
            time = time.slice(time.length-1, time.length).join(" ");
            let subject = subjects.find(sub => sub.id === act.subject);
            schedule.push({
                subject: subject,
                time: time
            })
        })
        
        //This is where Aryan's code comes in, for now, take this temporary solution
        const embed = new MessageEmbed().setTitle(`Hello ${student.name}. Here is your personal schedule for ${dotw}`);
        schedule.forEach(sub => embed.addField(sub.subject, `**from ${sub.time}**`));
        msg.channel.send(embed);
    }
}
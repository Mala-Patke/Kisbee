const { Client } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const LowDBProvider = require('./api/LowDBProvider.js');
const path = require('path');
const secret = require('./secret.json');

const client = new Client({
    owner: '294625075934527495', // thrilliams#5489, change if you want
    commandPrefix: secret.production ? '!' : '-'
});

client
    .on('ready', () => {
        console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
        client.user.setPresence({
            activity: {
                name: client.commandPrefix + 'help',
                type: 'WATCHING'
            }
        });
    })
    .on('rateLimit', console.log);

client.setProvider(new LowDBProvider(path.join(process.env.PWD, 'db.json'))).catch(console.error);

client.registry
    .registerGroups([
        ['roles', 'Role management'],
        ['channels', 'Channel management'],
        ['misc', 'Miscellaneous'],
        ['util', 'Utility']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({ help: false })
    .registerCommandsIn(path.join(__dirname, 'commands'));

function sendEmbed(message){
    let embed = new MessageEmbed()
      .setTitle(`"${message.content}"`)
      .addField("Said by", message.author, true)
      .addField("On", message.createdAt, true)
      .addField("In channel", message.channel, true)
      .addField("Message link", message.url, true)
      .setThumbnail("https://imgur.com/cNecthw.png")
      .setFooter(message.id);
    message.channel.send(embed);
}

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.partial){
        try {
            await reaction.fetch()
        }catch(error) {
            console.log('Something went wrong: ', error);
            return;
        }
    }

    if(reaction.message.partial){
        try {
            await reaction.message.fetch()
        }catch(error) {
            console.log('Something went wrong: ', error);
            return;
        }
    }
    
    let channel = reaction.message.guild.channels.cache.find(ch => ch.name.split("-").includes("quotebook"));
    if(!channel) reaction.message.guild.channels.create()
    
    if(reaction.count >= 4 && reaction.emoji.id == '687164344261148696'){
      try{
        let fetch = await channel.messages.fetch({limit: 100});
        let dupCheck = fetch.find(m => m.embeds[0].footer.text.startsWith(reaction.message.id));
        if(!dupCheck){
            sendEmbed(reaction.message);
        }
      }catch {
        sendEmbed(reaction.message);
      }
    }
}

client.login(secret.client_tokens[secret.production ? 'production' : 'development']);

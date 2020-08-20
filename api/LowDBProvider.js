const { SettingProvider } = require('discord.js-commando');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync.js');

module.exports = class LowDBProvider extends SettingProvider {
    constructor(path) {
        super();
        this.db = low(new FileSync(path, {
            serialize: state => JSON.stringify(state),
            deserialize: string => JSON.parse(string)
        }));
    }

    async clear(guild) {
        if (typeof guild === 'string') throw guild;
        guild = guild.id;
        this.db.unset(`${this.id}.${guild}`).write();
    }

    async destroy() {
        return;
    }

    get(guild, key, defVal) {
        if (typeof guild === 'string') throw guild;
        guild = guild.id;
        let val = this.db.get(`${this.id}.${guild}.${key}`).value();
        if (!val && defVal)
            this.db.set(`${this.id}.${guild}.${key}`, defVal).write();
        return val;
    }

    async init(client) {
        this.id = client.user.id;
        this.db.defaults({}).write();
    }

    async remove(guild, key) {
        if (typeof guild === 'string') throw guild;
        guild = guild.id;
        let val = this.db.get(`${this.id}.${guild}.${key}`).value();
        this.db.unset(`${this.id}.${guild}.${key}`).write();
        return val;
    }

    async set(guild, key, val) {
        if (typeof guild === 'string') throw guild;
        guild = guild.id;
        this.db.set(`${this.id}.${guild}.${key}`, val).write();
        return val;
    }

    static getGuildID(guild) {
        if (typeof guild === 'string') throw guild;
        return guild.id;
    }
}
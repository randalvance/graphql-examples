export default {
    players(_parent, args, { database }, _info) {
        return database.players;
    },
    servers(_parent, args, { database }, _info) {
        return database.servers;
    }
};
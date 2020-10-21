export default {
    server(player, args, { database }, info) {
        return database.servers.find(s => s.id === player.serverId);
    }
};
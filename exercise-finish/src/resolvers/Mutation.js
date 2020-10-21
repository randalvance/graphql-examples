export default {
    createPlayer(parent, { data: { id, name, level} }, { database }, info) {
        const createdPlayer = {
            id,
            name,
            level
        };
        database.players.push(createdPlayer);

        return createdPlayer;
    }
}
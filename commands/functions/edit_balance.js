const sqlite = require('sqlite3').verbose();

module.exports = {
    balance_change: function (userid, heroesAmount, bankAmount) {
        return new Promise((res) => {
            let db = new sqlite.Database('./data/economy.db', sqlite.OPEN_READWRITE)
            db.run(`UPDATE data SET bank = bank + ${bankAmount}, heroes = heroes + ${heroesAmount} WHERE userid = ${userid}`)
            db.close();
        });
    }

}
const sqlite = require('sqlite3').verbose();

module.exports = {
    calculate: function (userid, cooldowntime, command) {
        return new Promise((res) => {
            let query = `SELECT ${command} AS value FROM cooldowns WHERE userid = ${userid}`;
            let db = new sqlite.Database('./data/economy.db', sqlite.OPEN_READWRITE)
            db.get(query, (err, row) => {
                if (err) {
                    console.log("ERR")
                }
                if (row == undefined) {
                    console.log("UND")
                    res("0");
                } else {
                    var wacht = cooldowntime.toString().split(".")
                    var cooldown_min = wacht[0]
                    var cooldown_sec = wacht[1]

                    var datetime = new Date(row.value).getTime();
                    var now = new Date().getTime();

                    var milisec_diff = now - datetime;

                    var minutes = Math.floor(milisec_diff / 1000 / 60);
                    var seconds = Math.floor((milisec_diff/ 1000) % 60);

                    if(minutes > cooldown_min || (minutes == cooldown_min && seconds > cooldown_sec)){
                        res("0")
                    } else {
                       min = cooldown_min - minutes
                       sec = cooldown_sec - seconds
                       if(sec < 0){ 
                           sec = 60 + sec
                           min = Math.max(min -1, 0)
                        }

                       res(`${min}.${sec}`)
                    }
                }

            })
            db.close();
        });
    }

}
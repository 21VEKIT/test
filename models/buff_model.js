const pool = require('./db_connect')

class Buff_model {
    async fetch_error_goods() {
        const [result] = await pool.execute('SELECT * FROM `goods_list`')
        const array = result.map(id => id.id_good)
        await pool.execute(`DELETE FROM goods_list`)
        return array
    }

    async fetchActiveGood(id) {
        const [result] = await pool.execute('SELECT * FROM `active_good` where good_id = ?', [id])
        if (result.length === 0)
            return false
        else
            return true
    }

    async AddActiveGood(id) {
        await pool.execute('INSERT INTO `active_good` (`good_id`) VALUES(?)', [id])
    }

    async add_good_item(id) {
        await pool.execute('insert into `goods_list` (`id_good`) values(?)', [id])
    }

    async fetchPercentMain() {
        const [result] = await pool.execute('SELECT * FROM `options` WHERE name = "percent" OR name = "max" OR name = "min"')
        const [sessions] = await pool.execute('SELECT * FROM `session_info` ORDER BY RAND() LIMIT 1')
        return {
            percent: result.find(item => item.name === 'percent').value,
            max: result.find(item => item.name === 'max').value,
            min: result.find(item => item.name === 'min').value,
            session: JSON.parse(sessions[0].session).session
        }
    }

    async fetchPercent2() {
        const [result] = await pool.execute('SELECT * FROM `options` WHERE name = "percent_2"')
        return result[0].value
    }
}

module.exports = new Buff_model()
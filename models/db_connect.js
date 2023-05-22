const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'brepexv4.beget.tech',
    user: 'brepexv4_buff',
    password: 'N31%nEOG',
    database: 'brepexv4_buff'
})

module.exports = pool
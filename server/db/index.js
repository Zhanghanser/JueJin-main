const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'juejin',
  charset: 'utf8mb4',
  port: '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = db


//ALTER USER 'yourusername'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';  
//FLUSH PRIVILEGES;
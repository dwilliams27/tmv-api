import sqlite from 'sqlite3';

let database;

export const query = (sql, params, res) => {
  database = new sqlite.Database(process.env.CHAT_PATH, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the chat database.');
  });
  return database.all(sql, params, (err, rows) => {
    if(err) {
      console.log(err);
    }
    res(rows);
  });
}
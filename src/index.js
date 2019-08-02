import express from 'express';
import cors from 'cors';
import * as Database from './database';

const app = express();

app.use(cors());

app.get('/db/', (req, res) => {
  res.send('Hello World!');
});

app.get('/db/getFromId/:id', (req, res) => { 
  const sql = `SELECT * FROM chat_message_join cmj INNER JOIN message ON message.ROWID = cmj.message_id WHERE cmj.chat_id = ?`;
  const params = [ req.params.id ]
  Database.query(sql, params, (rows) => {
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row].text);
    }
    return res.send(texts);
  });
})


app.post('/db/messagesFromUntil', (req, res) => {
  const sql = `SELECT * FROM chat_message_join cmj INNER JOIN message ON message.ROWID = cmj.message_id WHERE cmj.chat_id = ? AND message.data_delivered BETWEEN ? AND ?`;
  const params = [ req.body.id, req.body.start, req.body.end ]
  Database.query(sql, params, (rows) => {
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row].text);
    }
    return res.send(texts);
  });
})

app.get('/db/getAllSenders', (req, res) => {
  let sql = `SELECT * FROM message LIMIT 10`;
  Database.query(sql, (rows) => {
    return res.send(rows);
  });
})

app.get('/:sender', (req, res) => {
  return res.send(`Getting messages from sender: ${req.params.sender}\n`);
});

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
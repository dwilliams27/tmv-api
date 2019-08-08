import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as Database from './database';

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.get('/db/getAmandaMessages', (req, res) => {
  const sql = `SELECT * FROM amanda`;
  const params = []
  Database.query(sql, params, (rows) => {
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row]);
    }
    return res.send(texts);
  });
})

app.post('/db/postSentimentScore', (req, res) => {
  const sql = `UPDATE amanda SET sentiment = ? WHERE ROWID = ?`;
  const params = [ req.body.sentiment, req.body.ROWID ];
  console.log(params);
  Database.query(sql, params, (rows) => {
    return req.body;
  });
})

app.post('/db/messagesFromUntil', (req, res) => {
  const sql = `SELECT * FROM chat_message_join cmj INNER JOIN message ON message.ROWID = cmj.message_id WHERE cmj.chat_id = ? AND message.data_delivered BETWEEN ? AND ?`;
  const params = [ req.body.id, req.body.start, req.body.end ];
  Database.query(sql, params, (rows) => {
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row].text);
    }
    return res.send(texts);
  });
})

app.post('/db/addSentiment', (req, res) => {
  const sql = `SELECT * FROM chat_message_join cmj INNER JOIN message ON message.ROWID = cmj.message_id WHERE cmj.chat_id = ?`;
  const params = [ req.body.id ]
  Database.query(sql, params, (rows) => {
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row].text);
    }
    return res.send(texts);
  });
})

app.get('/db/getAllMessagesFrom/:id', (req, res) => {
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

app.get('/db/getAllMessagesFromV2/:id', (req, res) => {
  const sql = `SELECT chat_message_join.chat_id, chat_message_join.message_id, message.text, message.ROWID, message.date, message.date_read, message.date_delivered, message.is_from_me FROM chat_message_join INNER JOIN message ON message.ROWID = chat_message_join.message_id WHERE chat_message_join.chat_id = ?`;
  const params = [ req.params.id ]
  Database.query(sql, params, (rows) => {
    console.log(rows);
    let texts = [];
    for(let row in rows) {
      texts.push(rows[row].text);
    }
    return res.send(texts);
  });
})
app.post('/db/addSentimentColumn', (req, res) => {
  const sql = `ALTER TABLE amanda ADD sentiment int`;
  const params = []
  Database.query(sql, params, (rows) => {
    console.log(rows);
  });
})

app.post('/db/generateMessageTable', (req, res) => {
  const sql = `CREATE TABLE amanda AS SELECT chat_message_join.chat_id, chat_message_join.message_id, message.text, message.ROWID, message.date, message.date_read, message.date_delivered, message.is_from_me FROM chat_message_join INNER JOIN message ON message.ROWID = chat_message_join.message_id WHERE chat_message_join.chat_id = ?`;
  const params = [ req.params.id ]
  Database.query(sql, params, (rows) => {
    console.log(rows);
  });
})

app.get('/db/populateMessageTable/:id', (req, res) => {
  const sql = `SELECT chat_message_join.chat_id, chat_message_join.message_id, message.text, message.ROWID, message.date, message.date_read, message.date_delivered, message.is_from_me FROM chat_message_join INNER JOIN message ON message.ROWID = chat_message_join.message_id WHERE chat_message_join.chat_id = ?`;
  const params = [ req.params.id ]
  Database.query(sql, params, (rows) => {
    console.log(rows);
    let texts = [];
    for(let row in rows) {
      const sql2 = `INSERT INTO amanda(chat_id, message_id, text, ROWID, date, date_read, date_delivered, is_from_me) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
      const params2 = [ rows[row].chat_id, rows[row].message_id, rows[row].text, rows[row].ROWID, rows[row].date, rows[row].date_read, rows[row].date_delivered, rows[row].is_from_me ]
      Database.query(sql2, params2, (rows2) => {
        console.log(rows2);
      });
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
const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
   console.log('WE HERERERERER');
   res.send('Hello World!');
});

app.post('/test', (req, res) => {
   console.log('MADE IT HERE');
   res.json({
      success: true,
      data: 'Hello from express server',
      payload: req.body,
   });
});

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});

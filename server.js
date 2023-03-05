const express = require('express');
const server = express();

server.all(`/`, (req, res) => {
  res.send(`https://vkcoinmarket.booboo11.repl.co`);
});

function keepAlive() {
  server.listen(3000, () => {
    console.log(`Creator: ItzNexus`);
  });
}

module.exports = keepAlive;
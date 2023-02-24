const express = require('express');
const http = require('http');
const fs = require('fs');
const app = express();
const qs = require('qs');
const crypto = require('crypto');
const md5 = require('md5');
const random = require('random');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const requestIp = require('request-ip');
const request = require('request');
const util = require('util');
const conn = mysql.createConnection({
    host: "sql.freedb.tech",
    port: 3306,
    user:'freedb_44444',
    password:'ykp&?cJ&8%bxg%Y',
    database:'freedb_4klpi44j'
})
const { API, resolveResource, VK, Updates, Upload } = require('vk-io');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const limiter = new RateLimiterMemory({
  points: 1,
  duration: 0.5
})
const limiter2 = new RateLimiterMemory({
  points: 1,
  duration: 0.250
})
const transferLimiter = new RateLimiterMemory({
  points: 1,
  duration: 3
})
const apiLimiter = new RateLimiterMemory({
  points: 3,
  duration: 1
})
const ratingLimiter = new RateLimiterMemory({
  points: 1,
  duration: 2
})
const adLimiter = new RateLimiterMemory({
  points: 1,
  duration: 30
})

const json = bodyParser.json();

const api = new API({
	token:'9e067bde483b1b4cf85fc28266eb814f756b0dc4ce6ee4619d71d46be0229223eec646837e8c6e5f03652' //f8352fa7f8352fa7f8352fa74df84e79ebff835f8352fa79a3a637b23e4450406af2eb9 bdc5a542bdc5a542bdc5a5422fbdbf540ebbdc5bdc5a542dc2fc6a06c73a8fa6f2cf491
})

const api2 = new API({
  token:'vk1.a.Xgrg79rNNBDOI-4UoqPiZ2LzRy59Z1CoGb589LGVneDWO6KkGBzXvBoyBzIWsIjGDVH6jjsZ7TVI_lxalQy7Yw2WBjwW1BVOBcp52Iy7jHAkr6MYxjYUBsuyn08ec9JmKPGgXygak5B3fxFow8PGh7le_giNZEZ357Rw_RFK2S7l8lZuKFoXkrWQxBkLKYNr' //4c7c4a17ac8b1d3a1a6a6215c7ba69b11e8a672e975f0f2573b03f1788f9dd367cad52db0586f322bcd7c
})

const api3 = new API({
    token:'vk1.a.VGIm3gRf6H0iGBYMnOjDCoAJ_qr2qzj3DmHrszbSd8aPSxlxTyk-BjMBldbPJGWZXZ6LakJbcYup2lceC_Z_gS3Z7iApRgGzxLTbSIPdvPTL7LuEnTQb7PxoUJJIV87QbI9kmDP36uX4o8fiM5T_TShVDgV_002Iw36ZdHTcCoCI5nfd_Qx6_uBWB176lUsz'
})

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.cert')
}

const https = require("https").createServer(options, app).listen(8080);
const io = require('socket.io')(https, {
    allowEIO3: true,
    cors: {
        origin: "*"
      }
});

conn.connect();

function isObject(obj) {
    return obj === Object(obj);
}

function isArray(array) {
    return Array.isArray(array);
}

function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
        // If you want to get in native datatypes
        // myJson[hash[0]] = JSON.parse(hash[1]);
    }
    return myJson;
}

function verifyLaunchParams(searchOrParsedUrlQuery, secretKey) {
    let sign;
    const queryParams = [];
    const processQueryParam = (key, value) => {
      if (typeof value ==='string') {
        if (key ==='sign') {
          sign = value;
        } else if (key.startsWith('vk_')) {
          queryParams.push({key, value});
        }
      }
    };
  
    if (typeof searchOrParsedUrlQuery ==='string') {
      const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
        ? searchOrParsedUrlQuery.slice(1)
        : searchOrParsedUrlQuery;
  
      for (const param of formattedSearch.split('&')) {
        const [key, value] = param.split('=');
        processQueryParam(key, value);
      }
    } else {
      for (const key of Object.keys(searchOrParsedUrlQuery)) {
        const value = searchOrParsedUrlQuery[key];
        processQueryParam(key, value);
      }
    }
    if (!sign || queryParams.length === 0) {
      return false;
    }
    const queryString = queryParams
      .sort((a, b) => a.key.localeCompare(b.key))
      .reduce((acc, {key, value}, idx) => {
        return acc + (idx === 0 ?'' :'&') + `${key}=${encodeURIComponent(value)}`;
      },'');
  
    const paramsHash = crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest()
      .toString('base64')
      .replace(/\+/g,'-')
      .replace(/\//g,'_')
      .replace(/=$/,'');
  
    return paramsHash === sign;
}

(async() => {
//await conn.query('DROP TABLE users');
//await conn.query('DROP TABLE history');
//await conn.query('DROP TABLE communities');
//await conn.query('DROP TABLE merchants');
//await conn.query('CREATE TABLE users(id BIGINT(15) NOT NULL PRIMARY KEY, name TEXT(30) NOT NULL, coins DOUBLE NOT NULL, totalEarning DOUBLE NOT NULL, incomeForClick DOUBLE NOT NULL, incomeForSecond DOUBLE NOT NULL, link1 TEXT(30) NOT NULL, link2 TEXT(30) NOT NULL, link3 TEXT(30) NOT NULL, link4 TEXT(30) NOT NULL, avatar TEXT(30) NOT NULL, clickUpgrade1 INT NOT NULL, clickUpgrade2 INT NOT NULL, clickUpgrade3 INT NOT NULL, clickUpgrade4 INT NOT NULL, clickUpgrade5 INT NOT NULL, clickUpgrade6 INT NOT NULL, clickUpgrade7 INT NOT NULL, clickUpgrade8 INT NOT NULL, clickUpgrade9 INT NOT NULL, clickUpgrade10 INT NOT NULL, secondUpgrade1 INT NOT NULL, secondUpgrade2 INT NOT NULL, secondUpgrade3 INT NOT NULL, secondUpgrade4 INT NOT NULL, secondUpgrade5 INT NOT NULL, secondUpgrade6 INT NOT NULL, secondUpgrade7 INT NOT NULL, secondUpgrade8 INT NOT NULL, secondUpgrade9 INT NOT NULL, secondUpgrade10 INT NOT NULL, merchantIsCreated INT NOT NULL, token TEXT(40) NOT NULL, blocked INT NOT NULL, ip TEXT(40) NOT NULL)');
//await conn.query('CREATE TABLE history(id BIGINT(15) NOT NULL, recipient_id BIGINT(15) NOT NULL, amount DOUBLE NOT NULL, recipientName TEXT(20) NOT NULL, recipientAvatar TEXT(30) NOT NULL, name TEXT(20) NOT NULL, avatar TEXT(20) NOT NULL, transfer_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, type INT NOT NULL)');
//await conn.query('CREATE TABLE communities(groupId BIGINT NOT NULL PRIMARY KEY, coins DOUBLE NOT NULL, avatar TEXT(40), name TEXT(40))');
//await conn.query('CREATE TABLE merchants(id INT AUTO_INCREMENT PRIMARY KEY, owner BIGINT NOT NULL, coins DOUBLE NOT NULL, avatar TEXT(40), name TEXT(40), token TEXT(40), group_id BIGINT NOT NULL, server TEXT(40))');
//await conn.query('ALTER TABLE `users` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci');
//await conn.query('ALTER TABLE `history` ADD transfer_time TEXT(30)');
//await conn.query('ALTER TABLE `history` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci');
//await conn.query('ALTER TABLE `communities` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci');
//await conn.query('ALTER TABLE  `merchants` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci');
//await conn.query('ALTER TABLE users CHANGE coins coins DOUBLE UNSIGNED NOT NULL');
//await conn.query('ALTER TABLE users ADD COLUMN activeBoost INT NOT NULL AFTER ip'); 
})()




const intervals = [];
const connections = [];
const playersSends = [];
const len = [];
const clicksUpgrades = {
    id1 : {
        id: 1,
        name:'Напальчник',
        img:'https://i.ibb.co/R0vyDNB/image.png',
        totalEarning: 0.300,
        price: 1,
        increase: 0.001
    },
    id2 : {
        id: 2,
        name:'Супер кисть',
        img:'https://i.ibb.co/JpxqRRC/1998291.png',
        totalEarning: 2.500,
        price: 5,
        increase: 0.003
    },
    id3 : {
        id: 3,
        name:'Автоматический кликер',
        img:'https://i.ibb.co/0fSWydt/1481125.png',
        totalEarning: 15.000,
        price: 20,
        increase: 0.015
    },
    id4 : {
        id: 4,
        name:'Двойной клик',
        img:'https://i.ibb.co/GRNQZ01/5701954.png',
        totalEarning: 100.000,
        price: 70,
        increase: 0.050
    },
    id5 : {
        id: 5,
        name:'Высокая выносливость',
        img:'https://i.ibb.co/vV8MTkx/2446353.png',
        totalEarning: 550.000,
        price: 250,
        increase: 0.140
    },
    id6 : {
        id: 6,
        name:'Автоматический кликер +',
        img:'https://i.ibb.co/LN6vYJC/3338508.png',
        totalEarning: 3500.000,
        price: 800,
        increase: 0.320
    },
    id7 : {
        id: 7,
        name:'Дополнительная рука',
        img:'https://i.ibb.co/ZzzLjJg/2994516.png',
        totalEarning: 15000.000,
        price: 1750,
        increase: 0.900
    },
    id8 : {
        id: 8,
        name:'Компьютерная мышка',
        img:'https://i.ibb.co/rMgpQ2P/5921702.png',
        totalEarning: 60000.000,
        price: 6700,
        increase: 1.5
    },
    id9 : {
        id: 9,
        name:'Супер компьютер',
        img:'https://i.ibb.co/gSyx6T7/1055687.png',
        totalEarning: 180000.000,
        price: 200000.000,
        increase: 5
    },
    id10 : {
        id: 10,
        name:'Кликающая установка',
        img:'https://i.ibb.co/0yfH06g/1055659.png',
        totalEarning: 600000.000,
        price: 750000.000,
        increase: 10
    }
}

const secondsUpgrades = {
    id1 : {
        id: 1,
        name:'Слабый майнер',
        img:'https://i.ibb.co/txbXTXH/1688969.png',
        price: 0.120,
        totalEarning: 0.000,
        increase: 0.001
    },
    id2 : {
        id: 2,
        name:'Ларёк',
        img:'https://i.ibb.co/Y0fTjZL/1159111.png',
        price: 0.200,
        totalEarning: 0.000,
        increase: 0.002
    },
    id3 : {
        id: 3,
        name:'Средний майнер',
        img:'https://i.ibb.co/SNhfKZg/2000633.png',
        price: 0.320,
        totalEarning: 0.000,
        increase: 0.005
    },
    id4 : {
        id: 4,
        name:'Процессор',
        img:'https://i.ibb.co/R0PRSVg/543234.png',
        price: 10.230,
        totalEarning: 0.000,
        increase: 0.015
    },
    id5 : {
        id: 5,
        name:'Сильный майнер',
        img:'https://i.ibb.co/prHcTps/2000631.png',
        price: 800.340,
        totalEarning: 0.000,
        increase: 0.040
    },
    id6 : {
        id: 6,
        name:'Фабрика',
        img:'https://i.ibb.co/hZWDrTS/2131032.png',
        price: 1200.000,
        totalEarning: 0.000,
        increase: 0.100
    },
    id7 : {
        id: 7,
        name:'Предприятие',
        img:'https://i.ibb.co/B3MQn3p/4270090.png',
        price:  1800.000,
        totalEarning: 0.000,
        increase: 0.220
    },
    id8 : {
        id: 8,
        name:'Большое предприятие',
        img:'https://i.ibb.co/sJyK9bC/4299051.png',
        price:  5000.000,
        totalEarning: 0.000,
        increase: 0.440
    },
    id9 : {
        id: 9,
        name:'Дата-центр',
        img:'https://i.ibb.co/k2fgy58/3908390.png',
        price:  14000.000,
        totalEarning: 0.000,
        increase: 0.950
    },
    id10 : {
        id: 10,
        name:'Тепловая электростанция',
        img:'https://i.ibb.co/NrLmMZJ/1374291.png',
        price:  26000.000,
        totalEarning: 0.000,
        increase: 1.450
    }
}



io.on('connection', async (socket) => {
      const ip = requestIp.getClientIp(socket.request);
      console.log(1);
      if(!socket.handshake.query.params) return socket.disconnect(true);
      var groupId;
            console.log("группа", groupId);

      
      const params = socket.handshake.query.params.startsWith('?') ? socket.handshake.query.params.slice(1) : socket.handshake.query.params;
            console.log(3);

      try {
          groupId = params.match(/vk_group_id=\d+/gm)[0].replace('vk_group_id=','');
      } catch {
          console.log('error');
      }

      const url = params;
      let interval;
      if(isObject(url)) return;

      const clientSecret ='5xbYiEKGtvTZUL84YZDf'; //ne5yyV0l8llvl4Kchs1j jfyxBLHXQA96QY5BIhXj
    
      const launchParams = url.slice(url.indexOf('?') + 1);

      const areLaunchParamsValid = verifyLaunchParams(launchParams, clientSecret);
      console.log(areLaunchParamsValid);
      
      if(areLaunchParamsValid) {
          
        const dataFromUrl = getUrlVars(params);
          
        const userId = dataFromUrl.vk_user_id;
        if(dataFromUrl.vk_group_id) groupId = dataFromUrl.vk_group_id
        
if(groupId) {
    
    conn.query("SELECT id FROM communities WHERE id = ?" , [groupId], async(err, r) => {
        if(!r || r.length <= 0) {
                await api2.groups.getById({
        group_id: groupId,
        extended: 1
    }).then(res => {
conn.query('INSERT IGNORE INTO communities VALUES(?,?,?,?)', [groupId, 0.000, res[0].photo_200, res[0].name]);
    }).catch(err => {
    });
        }
    })

}
        
        const boostDisable = () => {
           conn.query('SELECT incomeForClick FROM users WHERE id = ?', [userId], (err, res) => {
               if (!res[0]) return;
               
               socket.emit('boostDisable', { click: res[0].incomeForClick });
           })
         }
         const abc = setInterval(async()=>{
             conn.query('SELECT incomeForClick, activeBoost FROM users WHERE id = ?', [userId], (err, res) => {
               if (!res[0]) return;
               
               if (res[0].activeBoost === 1) return;
               else {
                   socket.emit('boostDisable', { click: res[0].incomeForClick });
                   clearInterval(abc);
                   return;
               }
           })
         },400)

        socket.on('disconnect', function(data) {
            delete playersSends[socket.id];
            delete connections[socket.id];
            for (let i = 0; i < intervals.length; i++) {
                if (intervals[i].id === userId) {
                    clearInterval(intervals[i].interval);
                    intervals.splice(i, 1);
                }
            }
            io.sockets.emit('updateOnline', { online: Object.keys(connections).length });
        })
        
        
        
        setTimeout(() => {
        conn.query('SELECT blocked FROM users WHERE id = ?', [userId], async (err, res) => {
             if (res.length !== 0) {
                 if (res[0].blocked === 1) {
                     socket.emit('blocked');
                     
                     socket.removeAllListeners();
                     socket.disconnect(true);
                     return;
                 }
             }
                let array = [];
                len[socket.id] = 0;
                connections[socket.id] = { socket: socket, user_id: userId, socket_id: socket.id };
                playersSends[socket.id] = { lastBuy: 0, lastTransfer: 0, lastClick: 0 };
                   
        			  const buyDelay = 500;
        			  const transferDelay = 1000;
        			  const clickDelay = 1000;
                
                await api.users.get({
                  user_ids: userId.toString(),
                  fields:'screen_name, photo_200',
                  lang: 0
                })
                .then(res => { user = res});
        
                const screen_name = user[0].screen_name;
                if(!screen_name) return;
        
                const link1 = `https://vk.com/${screen_name}`;
                const link2 = `https://m.vk.com/${screen_name}`;
                const link3 = `vk.com/${screen_name}`;
                const link4 = `m.vk.com/${screen_name}`;
                const name = `${user[0].first_name} ${user[0].last_name}`;
                const userToken = md5(`${userId}\|/${87678687654}`);
                
                await conn.query('SELECT * FROM users WHERE id = ?', [userId], (err, res) => {
                    if (res.length === 0) {
                        api3.messages.send({
                            user_id: 571885063,
                            random_id: 0,
                            message: `Пользователь @id${userId}(${name}) зарегистрировался`
                        })
                    }
                })
                await conn.query('INSERT IGNORE INTO users VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [userId, name, 0.000, 0.000, 0.001, 0.000, link1, link2, link3, link4, user[0].photo_200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, userToken, 0, ip, 0], (err) => {});
                await conn.query('UPDATE users SET avatar = ?, token = ? WHERE id = ?', [user[0].photo_200, userToken, userId], (err) => {});
                conn.query('SELECT coins, incomeForClick, incomeForSecond, totalEarning, activeBoost FROM users WHERE id = ?', [userId], (err, res) => {
                  if(!res[0]) return;
                  
                  interval = setInterval(() => {
                      conn.query('SELECT incomeForSecond, totalEarning FROM users WHERE id = ?', [userId], (err, res) => {
                          if (!res[0]) return;
                          if (res[0].incomeForSecond === 0.000) return;
                          
                          const incomeForSecond = res[0].incomeForSecond;
        
                          if (groupId) {
                              conn.query('UPDATE communities SET coins = coins + ? WHERE groupId = ?', [incomeForSecond, groupId], (err) => {});
                          }
                          conn.query('UPDATE users SET coins = coins + ?, totalEarning = totalEarning + ? WHERE id = ?', [incomeForSecond, incomeForSecond, userId], (err) => {});
                          socket.emit('updateBalance', { increase: incomeForSecond, minedForAllTime: res[0].totalEarning });
                      })
                  }, 1000)
                  
                  intervals.push({ id: userId, interval: interval })
                  
                  //{ socket: socket, user_id: userId }
                  
                for(let i in connections) {
                    const current = connections[i];
                    if(current.user_id == userId) {
                        if(current.socket_id != socket.id) {
                            current.socket.emit("multiple_connections");
                            current.socket.removeAllListeners();
                            current.socket.disconnect(true);
                            delete connections[i];
                            for (let i = 0; i < intervals.length; i++) {
                              if (parseInt(intervals[i].id) === parseInt(userId)) {
                                  clearInterval(intervals[i].interval);
                                  intervals.splice(i, 1);
                              }
                          }
                        }
                    }
                }
                  /*
                  Object.entries(connections).forEach(([key, val]) => {
                    if (connections[key].user_id == userId) {
                      array.push(key);
                      len[socket.id] ++;
                      if(len[socket.id] > 1) {
                        array.forEach((e) => {
                          if (!connections[e]) return;
                          const sock = connections[e].socket;
                          sock.emit('multiple_connections');
                          sock.removeAllListeners();
                          sock.disconnect(true);
                          delete connections[e];
                          for (let i = 0; i < intervals.length; i++) {
                              if (parseInt(intervals[i].id) === parseInt(userId)) {
                                  clearInterval(intervals[i].interval);
                                  intervals.splice(i, 1);
                              }
                          }
                        })
                      }
                    }
                 })
                 */
                  
                  socket.emit('userInfo', { 
                    coins: (res[0].coins).toFixed(3), 
                    incomeForClick: res[0].activeBoost === 0 ? (res[0].incomeForClick).toFixed(3) : (res[0].incomeForClick * 1.5).toFixed(3), 
                    incomeForSecond: (res[0].incomeForSecond).toFixed(3),
                    screenName: screen_name,
                    minedForAllTime: res[0].totalEarning,
                    userToken: userToken,
                    online: Object.keys(connections).length
                  })
                })
                
                io.sockets.emit('updateOnline', { online: Object.keys(connections).length });
                
                socket.on('activateBoost', () => {
                    adLimiter.consume(userId).then(async () => {
                        await conn.query('SELECT activeBoost, incomeForClick FROM users WHERE id = ?', [userId], async (err, res) => {
                            if (!res[0]) return;
                            
                            await conn.query('UPDATE users SET activeBoost = 1 WHERE id = ?', [userId]);
                            setTimeout(() => {
                                conn.query('UPDATE users SET activeBoost = 0 WHERE id = ?', [userId]);
                                boostDisable();
                            }, 30000)
                            socket.emit('successBoostActivation', { click: res[0].incomeForClick * 1.5 });
                        })
                    }).catch(_ => {
                        socket.emit('boostLimitReached');
                    })
                })
                
                socket.on('sendCoinsToMerchant', async data => {
                limiter.consume(userId).then(async () => {
                if (isObject(data.recipient_id) || isObject(data.amount)) return;
                
                const lastTransfer = playersSends[socket.id].lastTransfer;
        
                if (Date.now() - lastTransfer < transferDelay) return;
                
                const recipient_id = data.recipient_id;
                  amount = Math.abs(data.amount);
                  
                  if (data.amount.indexOf(',') != -1) {
                      amount = Math.abs((data.amount).replace(/,/g,'.'));
                      if (amount.toString().split('.')[0].length > 3) {
                          return;
                      }
                  }
                  
                  if (amount.toString().split('.')[1]) {
                      if (amount.toString().split('.')[1].length > 3) return;
                  }
                  
                  await conn.query('SELECT coins, id, name, avatar FROM users WHERE id = ?', [userId], async (err, results) => {
                    if(!results[0]) return;
                    if(results[0].coins < amount || amount === 0.000) {
                      socket.emit('notEnoughCoins');
                      return;
                    };
        
                    await conn.query('SELECT name, avatar, server, token FROM merchants WHERE id = ?', [recipient_id], async (err, res) => {
                      if(!res[0]) return;
                      
                      if (isNaN(amount) || isNaN(recipient_id)) return;
                      await conn.query('UPDATE merchants SET coins = coins + ? WHERE id = ?', [amount, recipient_id], (err) => {});
                      await conn.query('UPDATE users SET coins = coins - ? WHERE id = ?', [amount, userId], (err) => {});
                      const transferTime = new Date();
                      await conn.query('INSERT INTO history SET id = ?, recipient_id = ?, amount = ?, recipientName = ?, recipientAvatar = ?, name = ?, avatar = ?, type = ?, transfer_time = ?', [userId, recipient_id, amount, res[0].name, res[0].avatar, results[0].name, results[0].avatar, 2, transferTime.toLocaleString().replace('AM','').replace(/\//gm,'.')]);
                      if (playersSends[socket.id].lastTransfer)
                      playersSends[socket.id].lastTransfer = Date.now();
                      socket.emit('successfulTransfer', {
                        amount: amount,
                        recipient_id: recipient_id
                      })
                      
                      if (res[0].server.length !== 0) {
                          const token = md5(`${parseInt(amount)}\|/${userId}\|/${res[0].token}`);
                          
                          request({
                              url: res[0].server, 
                              method:'POST', 
                              headers : {'content-type':'application/json' }, 
                              body: {
                                  event:'new_transfer',
                                  object: {
                                      sender_id: userId,
                                      amount: parseInt(amount),
                                      create_date: Date.now(),
                                      token: token
                                  }
                              },
                              json: true
                          })
                      }
                      
                    })
                  })
                  }).catch(_ => {});
                })
                
                socket.on('merchantSearchById', async data => {
                    limiter.consume(userId).then(async () => {
                    if (isObject(data.id)) return;
                    
                    conn.query('SELECT avatar, name, id FROM merchants WHERE id = ?', [data.id], (err, res) => {
                        if (!res[0]) return;
                        
                        socket.emit('merchantFound', { avatar: res[0].avatar, name: res[0].name, id: res[0].id });
                    })
                    }).catch(_ => {});
                })
                
                socket.on('getUserToken', () => {
                    limiter.consume(userId).then(async () => {
                    conn.query('SELECT token FROM users WHERE id = ?', [userId], (err, res) => {
                        if (!res[0]) return;
                        
                        socket.emit('getUserToken', { 
                            token: res[0].token
                        })
                    })
                    }).catch(_ => {});
                })
                
                socket.on('tokenUpdate', () => {
                    limiter.consume(userId).then(async () => {
                    conn.query('SELECT * FROM merchants WHERE owner = ?', [userId], (err, res) => {
                        if (res.length === 0) return;
                        
                        const token = md5(`${res.coins}\|/${res.totalEarning}\|/${userId}\|/${random.int(0, 100000000)}`);
                        
                        conn.query('UPDATE merchants SET token = ? WHERE owner = ?', [token, userId], (err) => {});
                        socket.emit('infoAboutMerchant', { token: token })
                    })
                    }).catch(_ => {});
                })
                
                socket.on('checkMerchant', async () => {
                    limiter.consume(userId).then(async () => {
                    conn.query('SELECT * FROM merchants WHERE owner = ?', [userId], (err, res) => {         
                        if (res.length === 0) {
                            conn.query('SELECT coins, totalEarning FROM users WHERE id = ?', [userId], async (err, res) => {
                                if (!res[0]) return;
                                
                                const token = md5(`${res.coins}\|/${res.totalEarning}\|/${userId}\|/${random.int(0, 100000000)}`);
                                
                                await conn.query('INSERT INTO merchants VALUES(?,?,?,?,?,?,?,?)', [0, userId, 0.000,'https://i.ibb.co/L9D7fb5/mzd-V2-RUR6-Lhjnc-VGWZBDR-UU-5-YOrkl-Jo0cjr-Zx4ym-D89y5j5sa-Rm-B6cke-Hk-Bu-Tsgtpww-TED0-O7-Ttz-Dp-Q3.jpg','Нет имени', token, 0,'']);
                                conn.query('SELECT id, token FROM merchants WHERE owner = ?', [userId], (err, res) => {
                                    if (!res[0]) return;
                                    
                                    conn.query('UPDATE merchants SET name = ? WHERE owner = ?', [`Мерчант #${res[0].id}`, userId], (err) => {});
                                    
                                    socket.emit('infoAboutMerchant', {
                                        id: res[0].id,
                                        token: res[0].token
                                    })
                                })
                            })
                        } else if (res.length > 0) {
                            conn.query('SELECT id, token FROM merchants WHERE owner = ?', [userId], (err, res) => {
                                if (!res[0]) return;
                                
                                socket.emit('infoAboutMerchant', {
                                    id: res[0].id,
                                    token: res[0].token
                                })
                            })
                        }
                    })
                    }).catch(_ => {});
                })
                
                socket.on('addAppToGroup', async data => {
                    limiter.consume(userId).then(async () => {
                    if (isObject(data.groupId)) return;
                    
                    let groupId = data.groupId;
                    
                    await api2.groups.get({
                        user_id: userId,
                        extended: 1
                    })
                    .then(res => {
                        for (let i = 0; i <= res.count; i++) {
                            if (res.items[i]) {
                                if (res.items[i].id === parseInt(groupId)) { // && res.items[i].is_admin === 1
                                    conn.query('INSERT IGNORE INTO communities VALUES(?,?,?,?)', [groupId, 0.000, res.items[i].photo_200, res.items[i].name]);
                                }
                            }
                        }
                    })
                    }).catch(_ => {});
                })
                
                socket.on('getListsOfUsers', async data => {
                    ratingLimiter.consume(userId).then(async () => {
                    const users = [];
                    const friends = [];
                    const groups = [];
                    const merchants = [];
                    var lenUsers;
                    var lenFriends;
                    var lenGroups;
                    var lenMerchants;
                    
                    if (data) {
                        if (!isArray(data.ids) || Object.keys(data.ids).length === 0) return;
                        
                        await conn.query('SELECT avatar, group_id, coins, name FROM merchants ORDER BY coins DESC LIMIT 100', (err, res) => {
                            merchants.push(res);
                            lenMerchants = res.length;
                        })
                        
                        await conn.query('SELECT id, avatar, name, coins, blocked FROM users ORDER BY coins DESC LIMIT 100', (err, res) => {
                            users.push(res);
                            lenUsers = res.length;
                        })
                        
                        await conn.query('SELECT * FROM communities ORDER BY coins DESC LIMIT 100', (err, res) => {   
                            groups.push(res);
                            lenGroups = res.length;
                        })
                        
                        for (let i = 0; i < Object.keys(data.ids[0]).length; i++) {
                            conn.query('SELECT id, avatar, name, coins FROM users WHERE id = ?', [data.ids[0][i]], async (err, res) => {
                                if (!res[0]) return;
                                
                                friends.push(res[0]);
                                lenFriends = friends.length;
                            })
                        }
                    }
                    
                    setTimeout(()=>{
                        friends.sort((a, b) => { return b.coins - a.coins });    
                        socket.emit('getListsOfUsers', {
                            users: users, 
                            friends: friends,
                            groups: groups,
                            merchants: merchants,
                            lenUsers: lenUsers,
                            lenFriends: lenFriends,
                            lenGroups: lenGroups,
                            lenMerchants: lenMerchants
                        })
                    },200)
                    }).catch(_ => {});
                })
                
                socket.on('getListsOfUpgrades', () => {
                    limiter2.consume(userId).then(async () => {
                    conn.query('SELECT secondUpgrade1, secondUpgrade2, secondUpgrade3, secondUpgrade4, secondUpgrade5, secondUpgrade6, secondUpgrade7, secondUpgrade8, secondUpgrade9, secondUpgrade10 FROM users WHERE id = ?', [userId], (err, res) => {
                        if (!res[0]) return;
                        //А тут у нас мега-костыль из-за того, что я в самый последний момент понял, что я накосячил жестко с улучшениями
                        var price1 = 1;
                        var price2 = 1;
                        var price3 = 1;
                        var price4 = 1;
                        var price5 = 1;
                        var price6 = 1;
                        var price7 = 1;
                        var price8 = 1;
                        var price9 = 1;
                        var price10 = 1;
                        
                        if(res[0].secondUpgrade1 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade1; i++) {
                                price1 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade2 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade2; i++) {
                                price2 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade3 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade3; i++) {
                                price3 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade4 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade4; i++) {
                                price4 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade5 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade5; i++) {
                                price5 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade6 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade6; i++) {
                                price6 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade7 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade7; i++) {
                                price7 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade8 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade8; i++) {
                                price8 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade9 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade9; i++) {
                                price9 *= 1.2;
                            }
                        }
                        if(res[0].secondUpgrade10 !== 0) {
                            for (let i = 0; i < res[0].secondUpgrade10; i++) {
                                price10 *= 1.2;
                            }
                        }
                        
                        socket.emit('getListsOfUpgrades', {
                        clicks: clicksUpgrades, 
                        seconds: {
                            id1 : {
                                id: 1,
                                name:'Слабый майнер',
                                img:'https://i.ibb.co/txbXTXH/1688969.png',
                                price: 0.120 * price1,
                                increase: 0.001
                            },
                            id2 : {
                                id: 2,
                                name:'Ларёк',
                                img:'https://i.ibb.co/Y0fTjZL/1159111.png',
                                price: 0.200 * price2,
                                increase: 0.002
                            },
                            id3 : {
                                id: 3,
                                name:'Средний майнер',
                                img:'https://i.ibb.co/SNhfKZg/2000633.png',
                                price: 0.320 * price3,
                                increase: 0.005
                            },
                            id4 : {
                                id: 4,
                                name:'Процессор',
                                img:'https://i.ibb.co/R0PRSVg/543234.png',
                                price: 10.230 * price4,
                                increase: 0.015
                            },
                            id5 : {
                                id: 5,
                                name:'Сильный майнер',
                                img:'https://i.ibb.co/prHcTps/2000631.png',
                                price: 800.340 * price5,
                                increase: 0.040
                            },
                            id6 : {
                                id: 6,
                                name:'Фабрика',
                                img:'https://i.ibb.co/hZWDrTS/2131032.png',
                                price: 1200.000 * price6,
                                increase: 0.100
                            },
                            id7 : {
                                id: 7,
                                name:'Предприятие',
                                img:'https://i.ibb.co/B3MQn3p/4270090.png',
                                price:  1800.000 * price7,
                                increase: 0.220
                            },
                            id8 : {
                                id: 8,
                                name:'Большое предприятие',
                                img:'https://i.ibb.co/sJyK9bC/4299051.png',
                                price:  5000.000 * price8,
                                increase: 0.440
                            },
                            id9 : {
                                id: 9,
                                name:'Дата-центр',
                                img:'https://i.ibb.co/k2fgy58/3908390.png',
                                price:  14000.000 * price9,
                                increase: 0.950
                            },
                            id10 : {
                                id: 10,
                                name:'Тепловая электростанция',
                                img:'https://i.ibb.co/NrLmMZJ/1374291.png',
                                price:  26000.000 * price10,
                                increase: 1.450
                            }
                          } 
                        })
                    })
                    }).catch(_ => {});
                })
                
                socket.on('buyUpgrade', async data => {
                    limiter.consume(userId).then(async () => {
                    if (isObject(data.type) || isObject(data.id)) return;
                    const lastBuy = playersSends[socket.id].lastBuy;
        
                    if (Date.now() - lastBuy < buyDelay) return;
                    
                    const type = data.type;
                    const id = data.id;
                    
                    let upgrade;
                    let secondUpgradePrice;
                    
                    if (isObject(type) || isObject(id)) return;
                    
                    if (type === 0) {
                        upgrade = clicksUpgrades[`id${id}`];
                    } else if (type === 1) {
                        upgrade = secondsUpgrades[`id${id}`];
                    }
                    
                    await conn.query(`SELECT clickUpgrade${id}, secondUpgrade${id}, coins, totalEarning FROM users WHERE id = ?`, [userId], async (err, res) => {
                        if (!res[0]) return;
                        
                        const clickUpgrade = res[0][`clickUpgrade${id}`];
                        const secondUpgrade = res[0][`secondUpgrade${id}`];
                        var upgradePrice = upgrade.price;
                        
                        if (secondUpgrade === 0 && type === 1) {
                            upgradePrice = upgrade.price;
                        } else if (secondUpgrade > 0 && type === 1) {
                            upgradePrice = upgrade.price * (secondUpgrade + 1);
                        }
                        
                        if (clickUpgrade >= 1 && type === 0) {
                            socket.emit('limitReached');
                            return;
                        }
                        
                        if (res[0].totalEarning > upgrade.totalEarning) {
                            if (res[0].coins < upgradePrice && type === 0) {
                                socket.emit('notEnoughCoins');
                            } else {
                                if (type === 0) {
                                    await conn.query(`UPDATE users SET coins = coins - ?, clickUpgrade${id} = clickUpgrade${id} + 1, incomeForClick = incomeForClick + ? WHERE id = ?`, [upgradePrice, upgrade.increase, userId], (err) => {});
                                    playersSends[socket.id].lastBuy = Date.now();
                                } else {
                                    const count = secondUpgrade;
                                    var price = upgrade.price;
                                    
                                    if (secondUpgrade === 0) {
                                        if (res[0].coins < price) {
                                            socket.emit('notEnoughCoins');
                                            return;
                                        }

                                        await conn.query(`UPDATE users SET coins = coins - ?, secondUpgrade${id} = secondUpgrade${id} + 1, incomeForSecond = incomeForSecond + ? WHERE id = ?`, [price, upgrade.increase, userId], (err) => {});
                                        playersSends[socket.id].lastBuy = Date.now();
                                    } else {
                                        for (let i = 0; i < secondUpgrade; i++) {
                                            price *= 1.2;
                                        }
                                        //setTimeout(async()=>{
                                            if (res[0].coins < price) {
                                                socket.emit('notEnoughCoins');
                                                return;
                                            }
                                            
                                            await conn.query(`UPDATE users SET coins = coins - ?, secondUpgrade${id} = secondUpgrade${id} + 1, incomeForSecond = incomeForSecond + ? WHERE id = ?`, [price, upgrade.increase, userId], (err) => {});
                                            playersSends[socket.id].lastBuy = Date.now();
                                        //},100)
                                    }
                                    
                                    var price2 = upgrade.price;
                                    
                                    if (secondUpgrade === 0) {
                                        price2 *= 1.2;
                                    } else {
                                        for (let i = 0; i <= secondUpgrade; i++) {
                                            price2 *= 1.2;
                                        }
                                    }
                                    
                                    //setTimeout(() => {
                                        socket.emit('updatePrice', { id: id, price: price2 });
                                    //}, 150)
                                }
                                await conn.query('SELECT coins, incomeForClick, incomeForSecond FROM users WHERE id = ?', [userId], (err, res) => {
                                    if (!res[0]) return;
                                    
                                    socket.emit('successBuy', { 
                                        coins: res[0].coins,
                                        incomeForClick: res[0].incomeForClick, 
                                        incomeForSecond: res[0].incomeForSecond 
                                    })
                                })
                            }
                        } else {
                            socket.emit('notEnoughCoinsOrNotEnoughCoinsForAllTheTime');
                        }
                    })
                    }).catch(_ => {});
                })
          
                socket.on('click', async data => {
                  limiter.consume(userId).then(async () => {
                  const lastClick = playersSends[socket.id].lastClick;
                  const limit = 15;
                  
        		      playersSends[socket.id].lastClick = Date.now();
        
                  if (Date.now() - lastClick < clickDelay) return;
                  if  (data.clicks < 0) return;                  
                  await conn.query('SELECT incomeForClick, activeBoost FROM users WHERE id = ?', [userId], async (err, res) => {
                    if(!res[0] || !data) return;
                    if(data.clicks > limit) data.clicks = limit;
                    
                    if (groupId) {
                        if (res[0].activeBoost === 1) {
                            await conn.query('UPDATE communities SET coins = coins + ? WHERE groupId = ?', [(res[0].incomeForClick * 1.5) * (data.clicks), groupId], (err) => {});
                        } else {
                            await conn.query('UPDATE communities SET coins = coins + ? WHERE groupId = ?', [res[0].incomeForClick * (data.clicks), groupId], (err) => {});
                        }
                    }
                    if (res[0].activeBoost === 1) {
                        await conn.query('UPDATE users SET coins = coins + ?, totalEarning = totalEarning + ? WHERE id = ?', [(res[0].incomeForClick * 1.5) * (data.clicks), res[0].incomeForClick * (data.clicks), userId], (err) => {});
                    } else {
                        await conn.query('UPDATE users SET coins = coins + ?, totalEarning = totalEarning + ? WHERE id = ?', [res[0].incomeForClick * (data.clicks), res[0].incomeForClick * (data.clicks), userId], (err) => {});
                    }
                  })
                  }).catch(_ => {});
                })
          
                socket.on('searchUser', link => {
                  limiter.consume(userId).then(async () => {
                  if (isObject(link)) return;
                  
                  conn.query(`SELECT name, avatar, id, coins FROM users WHERE link1 = ?`, [link], (err, res) => {
                    if (!res[0]) return;
        
                    socket.emit('userFound', {
                      name: res[0].name,
                      avatar: res[0].avatar,
                      recipient_id: res[0].id,
                      coins: res[0].coins,
                      id: userId
                    })
                  })
                  }).catch(_ => {});
                })
                
                socket.on('userSearchById', data => {
                    limiter.consume(userId).then(async () => {
                    if (isObject(data.id)) return;
                    conn.query('SELECT name, avatar, id, coins FROM users WHERE id = ?', [data.id], (err, res) => {
                        if (!res[0]) return;
                        
                        setTimeout(()=> {
                            socket.emit('userFoundById', {
                                name: res[0].name,
                                avatar: res[0].avatar,
                                recipient_id: res[0].id,
                                coins: res[0].coins,
                                id: userId
                            })
                        },1200)
                    })
                    }).catch(_ => {});
                })
        
                socket.on('sendCoins', async (data) => {
                  limiter.consume(userId).then(async () => {
                  if (isObject(data.recipient_id) || isObject(data.amount)) return;
                  
                  const recipient_id = data.recipient_id;
                  let amount = Math.abs(data.amount);
                  
                  if (data.amount.indexOf(',') != -1) {
                      amount = Math.abs((data.amount).replace(/,/g,'.'));
                      if (amount.toString().split('.')[0].length > 3) {
                          return;
                      }
                  }
                  
                  if (amount.toString().split('.')[1]) {
                      if (amount.toString().split('.')[1].length > 3) return;
                  }
                  
                  await conn.query('SELECT coins, id, name, avatar FROM users WHERE id = ?', [userId], async (err, results) => {
                    if(!results[0]) return;
                    if(results[0].coins < amount || amount === 0.000) {
                      socket.emit('notEnoughCoins');
                      return;
                    };
                    if(results[0].id === recipient_id) return;
        
                    await conn.query('SELECT name, avatar FROM users WHERE id = ?', [recipient_id], async (err, res) => {
                      if(!res[0]) return;
        
                      if (isNaN(amount) || isNaN(recipient_id)) return;
                      await conn.query('UPDATE users SET coins = coins + ? WHERE id = ?', [amount, recipient_id], (err) => {});
                      await conn.query('UPDATE users SET coins = coins - ? WHERE id = ?', [amount, userId], (err) => {});
                      const transferTime = new Date();
                      await conn.query('INSERT INTO history SET id = ?, recipient_id = ?, amount = ?, recipientName = ?, recipientAvatar = ?, name = ?, avatar = ?, type = ?, transfer_time = ?', [userId, recipient_id, amount, res[0].name, res[0].avatar, results[0].name, results[0].avatar, 0, transferTime.toLocaleString().replace('AM','').replace(/\//gm,'.')]);
                      socket.emit('successfulTransfer', {
                        amount: amount,
                        recipient_id: recipient_id
                      });
                    })
                  })
                  }).catch(_ => {});
                })
        
                socket.on('getHistory', () => {
                  limiter.consume(userId).then(async () => {
                  conn.query('SELECT * FROM history WHERE id = ? OR recipient_id = ? ORDER BY transfer_id DESC', [userId, userId], (err, res) => {
                    if(!res) return;
        
                    socket.emit('updateHistory', {res: res, len: res.length});
                  })
                }).catch(_ => {});
                })
         })
         }, 200);

        
      } else {
          socket.removeAllListeners();
          socket.disconnect(true);
      }
  })

app.post('/api/merchantEdit', json, (req, result) => {
    const ip = requestIp.getClientIp(req);

    apiLimiter.consume(ip).then(async () => {
    if (!req.body.merchant_id || !req.body.new_name || !req.body.new_group_id || !req.body.token || !req.body.new_avatar) {
        result.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.merchant_id) || isObject(req.body.new_name) || isObject(req.body.new_group_id) || isObject(req.body.token) || isObject(req.body.new_avatar) || Object.keys(req.body.merchant_id).length > 11 || Object.keys(req.body.new_name).length > 24 || Object.keys(req.body.new_group_id).length > 11 || Object.keys(req.body.token) > 30 || Object.keys(req.body.new_avatar).length > 200 || isNaN(parseInt(req.body.merchant_id)) || isNaN(parseInt(req.body.new_group_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token FROM merchants WHERE id = ?', [parseInt(req.body.merchant_id)], (err, res) => {
        if (!res[0]) {
            result.send({ error:'Мерчант не найден' });
            return;
        }
        
        if (res[0].token === req.body.token) {
            if (Object.keys(req.body.new_name).length <= 24) {
                conn.query('UPDATE merchants SET name = ?, group_id = ?, avatar = ? WHERE id = ?', [req.body.new_name, parseInt(req.body.new_group_id), req.body.new_avatar, parseInt(req.body.merchant_id)], (err) => {});
                result.send({ success:'Изменения произошли успешно' });
            } else {
                result.send({ error:'Имя должно быть не больше 24 символов'});
            }
        } else {
            result.send({ error:'Неправильный токен мерчанта' });
        }
    })
    }).catch(_ => {
        result.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/merchantGetBalance', json, (req, result) => {
    console.log('5');
    const ip = requestIp.getClientIp(req);

    apiLimiter.consume(ip).then(async () => {
    if (!req.body.merchant_id) {
        result.send({ error:'Параметр merchant_id не был передан' });
        return;
    }
    if (isObject(req.body.merchant_id) || Object.keys(req.body.merchant_id).length > 8 || isNaN(parseInt(req.body.merchant_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    console.log(req.body.merchant_id)
    
    conn.query('SELECT coins FROM merchants WHERE id = ?', [parseInt(req.body.merchant_id)], (err, res) => {
        if (!res[0]) {
            result.send({ error:'Мерчант не найден' });
            return;
        }
        
        result.send({ 
            success: { 
                merchant_id: parseInt(req.body.merchant_id), coins: res[0].coins
            }
        })
    })
    }).catch(_ => {});
})

app.post('/api/merchantGetHistory', json, (req, result) => {
    console.log('4');
    const ip = requestIp.getClientIp(req);

    apiLimiter.consume(ip).then(async () => {
    if (!req.body.merchant_id || !req.body.token) {
        result.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    console.log(Object.keys(req.body.token).length)
    if (isObject(req.body.merchant_id) || isObject(req.body.token) || Object.keys(req.body.merchant_id).length > 8 || Object.keys(req.body.token).length > 32 || isNaN(parseInt(req.body.merchant_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token FROM merchants WHERE id = ?', [parseInt(req.body.merchant_id)], (err, res) => {
        if (!res[0]) return;
        
        if (res[0].token !== req.body.token) {
            result.send({ error:'Переданный токен не совпадает с токеном мерчанта' });
            return;
        }
        
        conn.query('SELECT * FROM history WHERE type = 1 AND id = ? OR recipient_id = ? ORDER BY transfer_id DESC LIMIT 30', [parseInt(req.body.merchant_id), parseInt(req.body.merchant_id)], (err, res) => {
        if (res.length === 0) {
            result.send({ error:'У данного мерчанта пустая история переводов' });
            return;
        }
        
        result.send({ success: res });
    })
    })
    }).catch(_ => {});
})

app.post('/api/transferToMerchant', json, (req, result) => {
    console.log('3');
    const ip = requestIp.getClientIp(req);

    apiLimiter.consume(ip).then(async () => {
    if (!req.body.sender_id || !req.body.merchant_id || !req.body.amount || !req.body.token) {
        result.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.sender_id) || isObject(req.body.merchant_id) || isObject(req.body.amount) || isObject(req.body.token) || Object.keys(req.body.sender_id).length > 14 || Object.keys(req.body.merchant_id).length > 8 || Object.keys(amount).length > 20 || Object.keys(req.body.token).length > 30) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    const amount = Math.abs(req.body.amount);
    if (isNaN(parseInt(amount)) || isNaN(parseInt(req.body.sender_id)) || isNaN(parseInt(req.body.merchant_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token, coins, name, avatar FROM users WHERE id = ?', [parseInt(req.body.sender_id)], (err, results) => {
        if (!results[0]) {
            result.send({ error:'Что-то пошло не так' });
            return;
        }
        
        if (results[0].token === req.body.token) {
            if (amount < results[0].coins) {
                conn.query('SELECT name, avatar, server, token FROM merchants WHERE id = ?', [parseInt(req.body.merchant_id)], (err, res) => {
                    if (!res[0]) {
                        result.send({ error:'Мерчант не найден' });
                        return;
                    }
                    
                    conn.query('UPDATE merchants SET coins = coins + ? WHERE id = ?', [amount, parseInt(req.body.merchant_id)], (err) => {});
                    conn.query('UPDATE users SET coins = coins - ? WHERE id = ?', [amount, parseInt(req.body.sender_id)], (err) => {});
                    const transferTime = new Date();
                    conn.query('INSERT INTO history SET id = ?, recipient_id = ?, amount = ?, recipientName = ?, recipientAvatar = ?, name = ?, avatar = ?, type = ?, transfer_time = ?', [parseInt(req.body.sender_id), parseInt(req.body.merchant_id), amount, res[0].name, res[0].avatar, results[0].name, results[0].avatar, 2, transferTime.toLocaleString().replace('AM','').replace(/\//gm,'.')]);
                    
                    result.send({ success:'Перевод был успешно произведён' });
                    
                    if (res[0].server.length !== 0) {
                        const token = md5(`${parseInt(amount)}\|/${parseInt(req.body.sender_id)}\|/${res[0].token}`);
                        
                        request({
                            url: res[0].server, 
                            method:'POST', 
                            headers : {'content-type':'application/json' }, 
                            body: {
                                event:'new_transfer',
                                object: {
                                    sender_id: req.body.sender_id,
                                    amount: parseInt(amount),
                                    create_date: Date.now(),
                                    token: token
                                }
                            },
                            json: true
                        })
                    }
                })
            } else {
                result.send({ error:'Недостаточно коинов для совершения перевода' })
            }
        } else {
            result.send({ error:'Неправильный токен пользователя' });
        }
    })
    }).catch(_ => {});
})

app.post('/api/merchantTransferToUser', json, (req, result) => {
    console.log('2');
    const ip = requestIp.getClientIp(req);
    
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.recipient_id || !req.body.merchant_id || !req.body.amount || !req.body.token) {
        result.send({ error:'Какие-то параметры не были переданы или равны нулю' });
        return;
    }
    if (isObject(req.body.recipient_id) || isObject(req.body.merchant_id) || isObject(req.body.amount) || isObject(req.body.token)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    const amount = Math.abs(req.body.amount);
    if (isNaN(parseInt(amount)) || isNaN(parseInt(req.body.recipient_id)) || isNaN(parseInt(req.body.merchant_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token, coins, name, avatar FROM merchants WHERE id = ?', [req.body.merchant_id], (err, results) => {
        if (!results[0]) {
            result.send({ error:'Что-то пошло не так' });
            return;
        }
        
        if (results[0].token === req.body.token) {
            if (amount < results[0].coins) {
                conn.query('SELECT name, avatar FROM users WHERE id = ?', [req.body.recipient_id], (err, res) => {
                    if (!res[0]) {
                        result.send({ error:'Пользователь не найден' });
                        return;
                    }
                    
                    conn.query('UPDATE users SET coins = coins + ? WHERE id = ?', [amount, req.body.recipient_id], (err) => {});
                    conn.query('UPDATE merchants SET coins = coins - ? WHERE id = ?', [amount, req.body.merchant_id], (err) => {});
                    const transferTime = new Date();
                    conn.query('INSERT INTO history SET id = ?, recipient_id = ?, amount = ?, recipientName = ?, recipientAvatar = ?, name = ?, avatar = ?, type = ?, transfer_time = ?', [req.body.merchant_id, req.body.recipient_id, amount, res[0].name, res[0].avatar, results[0].name, results[0].avatar, 1, transferTime.toLocaleString().replace('AM','').replace(/\//gm,'.')]);
                    result.send({ success:'Перевод был успешно произведён' });
                })
            } else {
                result.send({ error:'Недостаточно коинов для совершения перевода' });
            }
        } else {
            result.send({ error:'Неправильный токен мерчанта' });
        }
    })
    }).catch(_ => {
        result.send({ error:'Вы превысили лимит отправки запросов' })
    })
})

app.post('/api/merchantTransferToMerchant', json, (req, result) => {
    console.log('1');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.sender_id || !req.body.merchant_id || !req.body.amount || !req.body.token) {
        result.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.sender_id) || isObject(req.body.merchant_id) || isObject(req.body.amount) || isObject(req.body.token)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    const amount = Math.abs(req.body.amount);
    if (isNaN(parseInt(amount)) || isNaN(parseInt(req.body.sender_id)) || isNaN(parseInt(req.body.merchant_id))) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token, coins, name, avatar FROM merchants WHERE id = ?', [req.body.sender_id], (err, results) => {
        if (!results[0]) {
            result.send({ error:'Мерчант не найден' });
            return;
        }
        
        if (results[0].token === req.body.token) {
            if (amount < results[0].coins) {
                if (req.body.merchant_id !== req.body.sender_id) {
                    conn.query('SELECT * FROM merchants WHERE id = ?', [req.body.merchant_id], (err, res) => {
                        if (!res[0]) {
                            result.send({ error:'Что-то пошло не так' });
                            return;
                        }
                        
                        conn.query('UPDATE merchants SET coins = coins + ? WHERE id = ?', [amount, req.body.merchant_id], (err) => {});
                        conn.query('UPDATE merchants SET coins = coins - ? WHERE id = ?', [amount, req.body.sender_id], (err) => {});
                        result.send({ success:'Перевод был успешно произведён' });
                    })
                } else {
                    result.send({ error:'Нельзя переводить с одного мерчанта на этот же' });
                }
            } else {
                result.send({ error:'Недостаточно коинов для совершения перевода' });
            }
        } else {
            result.send({ error:'Неправильный токен мерчанта' });
        }
    })
    }).catch(_ => {
        result.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/connectServer', json, (req, result) => {
    console.log('k');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.server || !req.body.merchant_id || !req.body.token) {
        result.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.server) || isObject(req.body.merchant_id) || isObject(req.body.token)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    conn.query('SELECT token FROM merchants WHERE id = ?', [req.body.merchant_id], (err, res) => {
        if (!res[0]) {
            resutl.send({ error:'Что-то пошло не так' });
            return;
        }
        
        if (res[0].token !== req.body.token) {
            resutl.send({ error:'Неправильный токен мерчанта' });
            return;
        }
        
        conn.query('UPDATE merchants SET server = ? WHERE id = ?', [req.body.server, req.body.merchant_id], (err) => {});
        
        result.send({ success:'Изменения произошли успешно' });
    })
    }).catch(_ => {
        result.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/user_ban_on', json, (req, res) => {
    console.log('p');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.id) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.id)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('SELECT blocked FROM users WHERE id = ?', [req.body.id], (err, result) => {
              if (!result[0]) {
                  res.send({ error:'Пользователь не найден' });
                  return;
              }
              
              conn.query('UPDATE users SET blocked = 1 WHERE id = ?', [req.body.id], (err) => {});
              res.send({ succes:'Пользователь успешно заблокирован' });
          })
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/user_ban_off', json, (req, res) => {
    console.log('g');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.id) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.id)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('SELECT blocked FROM users WHERE id = ?', [req.body.id], (err, result) => {
              if (!result[0]) {
                  res.send({ error:'Пользователь не найден' });
                  return;
              }
              
              conn.query('UPDATE users SET blocked = 0 WHERE id = ?', [req.body.id], (err) => {});
              res.send({ succes:'Пользователь успешно разблокирован' });
          })
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/apg_balance_user', json, (req, res) => {
    console.log('d');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.id || !req.body.new_balance) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.id) || isObject(req.body.new_balance)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('UPDATE users SET coins = ? WHERE id = ?', [req.body.new_balance, req.body.id], (err) => {});
          res.send({ error:'Новый баланс установлен успешно' });
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/apg_balance_merchant', json, (req, res) => {
    console.log('b');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.merchant_id || !req.body.new_balance) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.merchant_id) || isObject(req.body.new_balance)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('UPDATE merchants SET coins = ? WHERE id = ?', [req.body.new_balance, req.body.merchant_id], (err) => {});
          res.send({ error:'Новый баланс установлен успешно' });
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/infoMerchant', json, (req, res) => {
    console.log('a');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.merchant_id) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.merchant_id)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('SELECT * FROM merchants WHERE id = ?', [req.body.merchant_id], (err, result) => {
              if (!result[0]) {
                  res.send({ error: "Что-то пошло не так" });
                  return;
              }
              
              res.send(result[0]);
          })
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.post('/api/infoUser', json, (req, res) => {
    console.log('s');
    const ip = requestIp.getClientIp(req);
    
    apiLimiter.consume(ip).then(async () => {
    if (!req.body.initiator_id || !req.body.token || !req.body.id) {
        res.send({ error:'Какие-то параметры не были переданы' });
        return;
    }
    if (isObject(req.body.initiator_id) || isObject(req.body.token) || isObject(req.body.id)) {
        result.send({ error:'Что-то пошло не так' });
        return;
    }
    
    if (parseInt(req.body.initiator_id) === 571885063) {
          conn.query('SELECT token FROM users WHERE id = ?', [req.body.initiator_id], (err, result) => {
          if (!result[0]) return;
          
          if (result[0].token !== req.body.token) {
              res.send({ error:'Токен не совпадает' });
              return;
          }
          conn.query('SELECT * FROM users WHERE id = ?', [req.body.id], (err, result) => {
              if (!result[0]) {
                  res.send({ error: "Что-то пошло не так" });
                  return;
              }
              
              res.send(result[0]);
          })
      })
    } else {
        res.send({ error:'Вы не имеете доступа к данному методу' });
    }
    }).catch(_ => {
        res.send({ error:'Вы превысили лимит отправки запросов' });
    })
})

app.use((err, req, res, next) => {
    if(err) return res.status(400).send();
    else next();
})

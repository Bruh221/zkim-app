/*----------------------------------------------------------*/
const { VK, MessageContext, Keyboard } = require('vk-io');
const { HearManager } = require('@vk-io/hear');
const { QuestionManager } = require('vk-io-question');
const deferred = require('deferred');
const fs = require('fs')
const PaperScroll = require("paper-scroll-sdk");
var callbackQiwi = require('node-qiwi-api').callbackApi;
var Qiwi = require('node-qiwi-api').Qiwi;
const config = require('./config.js')
const Wallet = new Qiwi(config.qiwiToken);
/*----------------------------------------------------------*/
const utils = require('./include/utils.js')
const keyboard = require('./include/keyboard.js')
const botstats = require(`./include/botstats.json`)

const users = require(`./db/users.json`)
const qiwi = require(`./db/qiwi.json`)
/*----------------------------------------------------------*/
const vk = new VK({
	token: config.groupToken
});

const client = new PaperScroll(config.psid, config.psToken)
const api = client.getApi();
/*----------------------------------------------------------*/
const hearManager = new HearManager();
const questionManager = new QuestionManager();
/*----------------------------------------------------------*/
let defferred = [];

const z = api.editMerchant({ name: config.nameShop, group_id: config.groupId, avatar: config.avatar})
/*----------------------------------------------------------*/
          async function PSWithdraw(id, vivod) {
              const psTrans = await api.createTransfer({
              peer_id: Number(id),
              object_type: 'balance',
              amount: Number(vivod) * 1000
            }).catch(e => console.log(e))
              return psTrans
          };

          async function PSRezerve() {
                const rezerv = await api.getMerchants([config.psid])
              return rezerv[0].balance / 1000
          }

vk.updates.use(questionManager.middleware);
vk.updates.on('message', hearManager.middleware);

function nols(num) {
    if(num < 10) return('0' + num)
    if(num > 9) return(num)
}

setInterval(() => {
  let hour = new Date().getHours()
  let minute = new Date().getMinutes()
  let second = new Date().getSeconds()
  let o = `${nols(hour)}:${nols(minute)}`
  if(o == `21:01`){   
  for (let i in users){// перебор базы данных
  users[i].buyDay = 0
    }
  }
});

vk.updates.on('message_new', async(context) => {
console.log(context)
    if(context.senderId < 1 || context.isChat || context.isOutbox ) return
    defferred.forEach(async(data) => {
        if(data.user_id == context.senderId && data.chatId == context.peerId) {
        data.def.resolve(context);
        return defferred.splice(defferred.indexOf(data), 1);
        }
        });
        
        context.question = async(text) => {
        await context.send(text);
        let def = deferred();
        defferred.push({ user_id: context.senderId, chatId: context.peerId, payload: context.messagePayload, def: def });
        return await def.promise((data) => { return data; });
        }
if(!users[context.senderId]) {
    let data = await vk.api.users.get({
        user_ids: context.senderId
    })
    users[context.senderId] = {
        id: context.senderId,
        uid: users.length,
        name: data[0].first_name,
        buy: 0,
        buyDay: 0,
        usersettings: {
            rass: true,
            admin: false
        }
    }
   
}
/*---------------------------Начать--------------------------*/
if(context.text == `Начать`) {
        await context.send({ 
        message: `Главное меню:`,
        keyboard: keyboard.main_menu
    })
}
})
/*-----------------------Купить VKC--------------------------*/
hearManager.hear(/^Купить$/, async (context) => {
	const myBalance = await PSRezerve();
	const sum = await context.question({ 
		message: `Введите сумму PaperScroll для покупки:`,
        keyboard: Keyboard.keyboard([
	    [ 
    	Keyboard.textButton({ label: 'Назад', color: Keyboard.NEGATIVE_COLOR }),
    	],
      ])
	})

    if(sum.text == `Назад` || sum.text == `назад`) 
    	return context.send({ 
		    message: `Главное меню:`,
		    keyboard: keyboard.main_menu
	})

    if(sum.text.endsWith('к')) {
        let colva = ((sum.text.match(/к/g) || []).length)
        sum.text = sum.text.replace(/к/g, '')
        sum.text = sum.text * Math.pow(1000, colva);
        }

	if(!Number(sum.text)) 
	    return context.send({
    		message: `Введено неверное значение!`,
    		keyboard: keyboard.main_menu
    	})

    if(sum.text > myBalance) 
    	return context.send({
    		message: `У нас недостаточно резерва!`,
    		keyboard: keyboard.main_menu
    	})

    if(sum.text / 1000000 * botstats.sellCurse < 1) 
    	return context.send({ 
    	    message: `Нельзя купить койнов на сумму менее 1₽.`,
            keyboard: keyboard.main_menu
    })
    const rubles = Math.ceil(((sum.text / 1000000 * botstats.sellCurse) + Number.EPSILON) * 100) / 100
    console.log(rubles)
    let url = `https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=${config.qiwiNumber}&amountInteger=${rubles.toString().split('.')[0]}&amountFraction=${rubles.toString().split('.')[1]}&extra%5B%27comment%27%5D=bto_${context.senderId}&currency=643&blocked[0]=account&blocked[2]=comment`
    let short = (await vk.api.utils.getShortLink({ url })).short_url
    	return context.send({ 
    	   message: `
[ Ссылка для авто-оплаты: ]
👉 ${short}

[ Ручное пополнение: ]
🥝 Либо переведите на QIWI: ${config.qiwiNumber}
🗯 Указав комментарий: bto_${context.senderId}
💰 Сумму: ${utils.split(rubles)}₽`,
           keyboard: keyboard.main_menu
      })
});
/*------------------------Информация-------------------------*/
hearManager.hear(/^📊 Информация|Информация$/, async (context) => {
	const myBalance = await PSRezerve()
    let qq = 0
    let sellAll = 0
    let sellDay = 0
    for(i in users) { qq++ }
    for(i in users) { sellAll += users[i].buy }
    for(i in users) { sellDay += users[i].buyDay }
	return context.send({ 
		message: `
		[ Информация: ]

        📤 Мы продаём:
        🧻 1 миллион PaperScroll = ${botstats.sellCurse}₽
        🧻 1 миллиард PaperScroll = ${botstats.sellCurse * 1000}₽

		💸 Можем продать: ${utils.split(myBalance)} PaperScroll
        
        💸 Продано всего: ${utils.split(sellAll)} PaperScroll
        💸 Продано за день: ${utils.split(sellDay)} PaperScroll

        📝 Сделок: ${utils.split(qiwi.length)}

        👤 Пользователей: ${utils.split(qq)}
		`,
		keyboard: keyboard.information_menu
  })
});
/*--------------------------Профиль--------------------------*/
hearManager.hear(/^👤 Профиль|Профиль 👤|Профиль$/, async (context) => {
        await context.send({ 
            message: `
            [ Ваш профиль: ]
    
            💸 Вы приобрели за все время: ${utils.split(users[context.senderId].buy)} PaperScroll
            💰 Вы приобрели за день: ${utils.split(users[context.senderId].buyDay)} PaperScroll
            `
        })
    });

hearManager.hear(/^Топ за сегодня$/, async (context) => {
        let top = []
        let topme = []
        let my = 0
        for (let i in users){// перебор базы данных
        top.push({
        id: users[i].id,
        name: users[i].name,
        buyDay: users[i].buyDay // создание массива
        
        })
        }
        const find = () => {
        let pos = 1000;
        
        for (let i = 0; i < top.length; i++)
        {
        if(top[i].id === context.senderId) return pos = i;
        }
        return pos;
        }
        
        top.sort(function(a, b) {
        if (b.buyDay > a.buyDay) return 1
        if (b.buyDay < a.buyDay) return -1
        return 0
        }); //Сортировка
        
        let text = ""
        for (let s = 0; s < top.length; s++){
        topme.push(top[s].id)
        }
        
        if (top.length < 10){
        for (let j = 0; j < top.length; j++){
        my += Number(1)
        text += `${my}) [id${users[top[j].id].id}|${users[top[j].id].name}] - приобрел ${utils.number_format(top[j].buyDay)} PaperScroll\n`
        }
        
        } else {
        for (let j = 0; j < 10; j++){
        my += Number(1)
        text += `${my}) [id${users[top[j].id].id}|${users[top[j].id].name}] - приобрел ${utils.number_format(top[j].buyDay)} PaperScroll\n`
        }
        }
        
       
        return context.send(`ТОП за сегодня:\n\n${text}`)
});

hearManager.hear(/^Топ за все время$/, async (context) => {
        let top = []
        let topme = []
        let my = 0
        for (let i in users){// перебор базы данных
        top.push({
        id: users[i].id,
        name: users[i].name,
        buy: users[i].buy // создание массива
        
        })
        }
        const find = () => {
        let pos = 1000;
        
        for (let i = 0; i < top.length; i++)
        {
        if(top[i].id === context.senderId) return pos = i;
        }
        return pos;
        }
        
        top.sort(function(a, b) {
        if (b.buy > a.buy) return 1
        if (b.buy < a.buy) return -1
        return 0
        }); //Сортировка
        
        let text = ""
        for (let s = 0; s < top.length; s++){
        topme.push(top[s].id)
        }
        
        if (top.length < 10){
        for (let j = 0; j < top.length; j++){
        my += Number(1)
        text += `${my}) [id${users[top[j].id].id}|${users[top[j].id].name}] - приобрел ${utils.number_format(top[j].buy)} PaperScroll\n`
        }
        
        } else {
        for (let j = 0; j < 10; j++){
        my += Number(1)
        text += `${my}) [id${users[top[j].id].id}|${users[top[j].id].name}] - приобрел ${utils.number_format(top[j].buy)} PaperScroll\n`
        }
        }
        
       
        return context.send(`ТОП за все время:\n\n${text}`)
});
/*-------------------------Функции---------------------------*/
async function saveData() {
        await fs.writeFile('./db/users.json', JSON.stringify(users, null, '\t'), async(err, result) => {
            if(err) console.log('Ошибка записи БД:', err);
        })
        await fs.writeFile('./db/qiwi.json', JSON.stringify(qiwi, null, '\t'), async(err, result) => {
            if(err) console.log('Ошибка записи БД:', err);
        })
        await fs.writeFile('./include/botstats.json', JSON.stringify(botstats, null, '\t'), async(err, result) => {
            if(err) console.log('Ошибка записи БД:', err);
        })
}
/*------------------------Интервалы--------------------------*/
setInterval(async()=> {
await saveData()
}, 10000)
/*---------------------Пополнение QIWI-----------------------*/
setInterval(async () => {
	const myBalance = await PSRezerve()
      Wallet.getOperationHistory({rows: 5, operation: "IN"}, async(err, operations) => {
      for(i in operations['data']){
        let id = (operations['data'][i]['comment'] || "").split('bto_').pop().trim();
          if(!users[id]) {return}
          if(!qiwi.find(x => x.txnId === operations['data'][i]['txnId'])){
              qiwi.push({
              	  idUser: Number(id),
                  amount: operations['data'][i]['total']['amount'],
                  txnId: operations['data'][i]['txnId']
              })
              if ((operations['data'][i]['sum']['currency']) != 643) return;
              const vivod = Number(operations['data'][i]['sum']['amount'] / botstats.sellCurse * 1000000)
              const output = vivod * 1000
    if(myBalance < vivod) {
        vk.api.messages.send({ 
        	peer_id: id, 
        	random_id: utils.random(-200000000, 200000000), 
        	message: `🚫 Во время покупки произошла ошибка.\nПричина: Недостаточно резерва.` })
        .catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }
    if(myBalance > vivod) {
        vk.api.messages.send({ 
            peer_id: config.adminId, 
            random_id: utils.random(-200000000, 200000000), 
            message: `💸 *id${id} (${users[id].name}) успешно купил ${utils.split(vivod)} PaperScroll` })
            .catch((err) => { return console.log(`Ошибка при отправке сообщения!`)
        })
    console.log(`[Покупка] `+users[id].name+` купил `+vivod+` PaperScroll за `+operations['data'][i]['sum']['amount']+` рублей`);
      let rezerv = await PSRezerve()
        if(vivod > rezerv) {
            return vk.api.messages.send({ 
            	peer_id: id, 
            	random_id: utils.random(-200000000, 200000000), 
            	message: `На балансе бота недостаточно средств. Ожидайте пополнения.` })
            .catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
        }
        if(vivod <= rezerv && vivod > 0) {



            
            if(vivod <= 100000000000) {
                let summa = vivod
                PSWithdraw(Number(id), summa)
                users[id].buy += vivod
                users[id].buyDay += vivod
                return vk.api.messages.send({ 
                	peer_id: id, 
                	random_id: utils.random(-200000000, 200000000), 
                	message: `✅ Вы успешно приобрели ${utils.split(vivod)} PaperScroll.` })
                .catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
            }
            if(vivod > 100000000000) {
                let main_number = vivod
                let main_numbe1r = vivod
                async function vivods() {
                    setTimeout(async function() {
                    if(main_number >= 100000000000) {
                     
                            await PSWithdraw(Number(id), 100000000000)
                            main_number -= 100000000000

                        return vivods()
                    }
                    if(main_number <= 100000000000 && main_number > 0) {

                            await PSWithdraw(Number(id), main_number)
                            main_number -= main_number

                        return vivods()
                    }
                    users[id].buy += vivod
                    users[id].buyDay += vivod
                    return vk.api.messages.send({ peer_id: Number(id), random_id: utils.random(-200000000, 200000000), message: `✅ Вы успешно приобрели ${utils.split(vivod)} PaperScroll.` }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });

                    }, 500)
                }
               await vivods()
            }
        }
          }
        }
      }
  });
}, 3000);
/*----------------------Админка------------------------------*/
hearManager.hear(/^админ|Админ-Панель$/, async (context) => {
    if(!users[context.senderId].usersettings.admin) { return }
    if(users[context.senderId].usersettings.admin) {
    await context.send({ 
        message: `Админ меню открыто:`,
        keyboard: Keyboard.keyboard([
                [
                    Keyboard.textButton({ label: `Курс продажи`, color: Keyboard.SECONDARY_COLOR }),
                    Keyboard.textButton({ label: `Резерв`, color: Keyboard.SECONDARY_COLOR }),
                ],
                [
                    Keyboard.urlButton({ label: 'Пополнить', url: `https://vk.com/app7420483#m${config.psid}` }),                   
                    Keyboard.textButton({ label: `Вывести PS`, color: Keyboard.SECONDARY_COLOR }),
                ],
            ]).inline()
        })
    }
})
/*--------------------Курс Продажи---------------------------*/
hearManager.hear(/^Курс продажи|Курс продажи 💰$/, async (context) => {
    if(!users[context.senderId].usersettings.admin) { return }
    if(users[context.senderId].usersettings.admin) {
    const course = await context.question(`Введите новый курс продажи: `)
    if(!Number(course.text) || course.text <= 0) {
        return context.send(`Неверное значение!`)
    } else {
        botstats.sellCurse = Number(course.text)
        await context.send({ 
            message: `💸 Курс продажи успешно изменен на ${botstats.sellCurse} руб за 1кк`,
            keyboard: Keyboard.keyboard([
                    [
                    Keyboard.textButton({ label: `Админ-Панель`, color: Keyboard.SECONDARY_COLOR})
                    ],
                ]).inline()
            })
    }
}
})
/*-----------------------Резерв------------------------------*/
hearManager.hear(/^Резерв$/, async (context) => {
    if(!users[context.senderId].usersettings.admin) { return }
    if(users[context.senderId].usersettings.admin) {
	const myBalance = await PSRezerve()
    Wallet.getBalance(async(err, balance) => {
        await context.send({ 
            message: `[ Резерв: ]\n\n\n💸 QIWI: ${balance.accounts[0].balance.amount}₽\n💰 PaperScroll: ${utils.split(myBalance)}`,
            keyboard: Keyboard.keyboard([
                    [
                    Keyboard.textButton({ label: `Админ-Панель`, color: Keyboard.SECONDARY_COLOR})
                    ],
                ]).inline()
            })
        })
      }
    });
/*-----------------------Вывести PS------------------------------*/
hearManager.hear(/^Вывести PS$/, async (context) => {
    if(!users[context.senderId].usersettings.admin) { return }
    if(users[context.senderId].usersettings.admin) {
	const rezerv = await PSRezerve()
        const sum = await context.question(`Введите сумму вывода:\nРезерв: ${utils.number_format(rezerv)} PaperScroll`)
            if(sum.text.endsWith('к')) {
        let colva = ((sum.text.match(/к/g) || []).length)
        sum.text = sum.text.replace(/к/g, '')
        sum.text = sum.text * Math.pow(1000, colva);
        }
        let vivod = sum.text
        let id = context.senderId
        if(vivod > rezerv) {
            return vk.api.messages.send({ 
            	peer_id: id, 
            	random_id: utils.random(-200000000, 200000000), 
            	message: `На балансе бота недостаточно средств. Ожидайте пополнения.` })
            .catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
        }
        if(vivod <= rezerv && vivod > 0) {



            
            if(vivod <= 100000000000) {
                let summa = vivod
                PSWithdraw(Number(id), summa)
                return vk.api.messages.send({ 
                	peer_id: id, 
                	random_id: utils.random(-200000000, 200000000), 
                	message: `✅ Вы успешно вывели ${utils.split(vivod)} PaperScroll.` })
                .catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
            }
            if(vivod > 100000000000) {
                let main_number = vivod
                let main_numbe1r = vivod
                async function vivods() {
                    setTimeout(async function() {
                    if(main_number >= 100000000000) {
                     
                            await PSWithdraw(Number(id), 100000000000)
                            main_number -= 100000000000

                        return vivods()
                    }
                    if(main_number <= 100000000000 && main_number > 0) {

                            await PSWithdraw(Number(id), main_number)
                            main_number -= main_number

                        return vivods()
                    }
                    return vk.api.messages.send({ peer_id: Number(id), random_id: utils.random(-200000000, 200000000), message: `✅ Вы успешно вывели ${utils.split(vivod)} PaperScroll.` }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });

                    }, 500)
                }
               await vivods()
            }
        }
      }
    });
/*-------------Подключение к серверам VK---------------------*/
vk.updates.start().catch(console.error);
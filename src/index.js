import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Loading from './Components/Pages/Loading.js';
import Blocked from './Components/Pages/Blocked.js';
import MultipleConnections from './Components/Pages/MultipleConnections.js';
import ShopItemClicks from './Components/Other/ShopItemClicks.js';
import HistoryUserItem from './Components/Other/HistoryUserItem.js';
import reportWebVitals from './reportWebVitals';
import bridge from '@vkontakte/vk-bridge';
import ShopItemSeconds from './Components/Other/ShopItemSeconds';
import numberSeparator from "number-separator";
import RatingUserItem from './Components/Other/RatingUserItem';
import './index.css';

bridge.send("VKWebAppInit");


window.isAllDone = false;
window.bridge = bridge;
window.numberOfAttempts = 0;


function buyUpgrade(type, id) {
  window.socket.emit('buyUpgrade', { type: type, id: id });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const hash = window.location.hash.slice(1).match(/send\d+/);
const merchant = window.location.hash.slice(1).match(/m/);
const token = window.location.hash.slice(1).match(/token/);
const mSend = window.location.hash.slice(1).match(/m_send\d+/);
const amountMerchant = window.location.hash.slice(1).match(/amount\d+/)

setInterval(()=>{
  if(window.clicks === 0 || !window.clicks) return;
  
  window.socket.emit('click', { clicks: window.clicks });
  window.clicks = 0;
},1100)

window.socket.on('merchantFound', data => {
  window.merchantAvatar = data.avatar;
  window.merchantName = data.name;
  window.merchantRecipient_id = data.id;
  window.merchantAmount = false;
  if (amountMerchant) {
    window.merchantAmount = amountMerchant[0].replace('amount', '');
  }

  setTimeout(() => {
    window.setModalMerchantSend();
  }, 600);
})

window.socket.on('blocked', () => {
  root.render(
    <Blocked/>
  )
})

window.socket.on('getUserToken', data => {
  setTimeout(() => {
    window.setModalUserTokenTrue();
    window.userTokenToCopy = data.token;
    setTimeout(() => {
      document.getElementsByClassName('modal__user-token')[0].innerHTML=`Ваш токен: ${data.token}`;
    }, 100);
  }, 500);
})

window.socket.on('updateBalance', data => {
  window.coins = parseFloat(window.coins) + data.increase;
  window.minedForAllTime = parseFloat(data.minedForAllTime);

  if (document.getElementsByClassName('mined-for-all-time__quantity-span')[0]) {
    document.getElementsByClassName('mined-for-all-time__quantity-span')[0].innerHTML=numberSeparator(parseFloat(window.minedForAllTime).toFixed(3));
  }

  if (document.getElementsByClassName('balance__text')[0]) {
    document.getElementsByClassName('balance__text')[0].innerHTML=numberSeparator(window.coins.toFixed(3));
  }
})

window.socket.on('updatePrice', data => {
  document.getElementById(data.id).innerHTML=`Цена: ${numberSeparator(data.price.toFixed(3))}`;
})

window.socket.on('getListsOfUsers', res => {
  window.users = [];
  window.friends = [];
  window.merchants = [];
  window.groups = [];

  for (let i = 0; i < res.lenMerchants; i++) {
    const data = res.merchants[0][i];
    let place = i + 1;

    if (data.group_id !== 0) {
      window.merchants.push(
        <RatingUserItem
          type='merchant'
          id={data.group_id}
          place={place}
          avatar={data.avatar}
          name={data.name}
          coins={data.coins}
      />
      )
    } else {
      window.merchants.push(
        <RatingUserItem
          place={place}
          avatar={data.avatar}
          name={data.name}
          coins={data.coins}
      />
      )
    }
  }

  for (let i = 0; i < res.lenUsers; i++) {
    const data = res.users[0][i];
    let place = i + 1;

    if (data.blocked === 0) {
      window.users.push(
        <RatingUserItem
          id={data.id}
          place={place}
          avatar={data.avatar}
          name={data.name}
          coins={data.coins}
      />
      )
    }
  }

  for (let i = 0; i < res.lenFriends; i++) {
    const data = res.friends[i];
    let place = i + 1;

    window.friends.push(
      <RatingUserItem
        id={data.id}
        place={place}
        avatar={data.avatar}
        name={data.name}
        coins={data.coins}
    />
    )
  }

  for (let i = 0; i < res.lenGroups; i++) {
    const data = res.groups[0][i];
    let place = i + 1;

    window.groups.push(
      <RatingUserItem
        type='group'
        id={data.groupId}
        place={place}
        avatar={data.avatar}
        name={data.name}
        coins={data.coins}
    />
    )
  }

  if (document.getElementsByClassName('rating-list')[0]) {
    const ratingList = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);

    ratingList.render(window.users);
  }
})

window.socket.on('getListsOfUpgrades', res => {
  const clicks = [];
  const seconds = [];
  const shopItemsList = ReactDOM.createRoot(document.getElementsByClassName('shop-items-list')[0]);

  window.showSecondsUpgrades = () => {
    shopItemsList.render(seconds);
  }

  window.showClicksUpgrades = () => {
    shopItemsList.render(clicks);
  }

  for (let i = 1; i <= Object.keys(res.clicks).length; i++) {
    const data = res.clicks[`id${i}`];

    clicks.push(
      <ShopItemClicks
        onClick={() => { buyUpgrade(0, i) }}
        img={data.img}
        name={data.name}
        totalEarning={data.totalEarning.toFixed(3)}
        price={data.price.toFixed(3)}
        increase={data.increase.toFixed(3)}
      />
    )
  }

  for (let i = 1; i <= Object.keys(res.seconds).length; i++) {
    const data = res.seconds[`id${i}`];

    seconds.push(
      <ShopItemSeconds
        onClick={() => { buyUpgrade(1, i) }}
        img={data.img}
        name={data.name}
        price={data.price.toFixed(3)}
        id={i}
        increase={data.increase.toFixed(3)}
      />
    )
  }
  
  shopItemsList.render(clicks);
})

window.socket.on('userFoundById', data => {
  window.setModalUserInfo();

  window.avatar = data.avatar;
  window.name = data.name;
  window.recipient_id = data.recipient_id;
  window.id = data.id;
})

window.socket.on('notEnoughCoins', () => {
  window.color = '#FF3E3E';
  window.text = 'Недостаточно коинов';

  window.showToast();
})

window.socket.on('notEnoughCoinsOrNotEnoughCoinsForAllTheTime', () => {
  window.color = '#FF3E3E';
  window.text = 'Недостаточно коинов или недостаточно заработано за всё время';

  window.showToast();
})

window.socket.on('limitReached', () => {
  window.color = '#FF3E3E';
  window.text = 'Нельзя купить одно улучшение второй раз';

  window.showToast();
})

window.socket.on('boostLimitReached', () => {
  window.color = '#FF3E3E';
  window.text = 'У вас еще активен прошлый буст, пожалуйста, повторите попытку позже';

  window.showToast();
})

window.socket.on('successBuy', data => {
  window.color = '#F9B006';
  window.text = 'Успешная покупка';

  window.coins = data.coins.toFixed(3);
  window.incomeForClick = data.incomeForClick.toFixed(3);
  window.incomeForSecond = data.incomeForSecond.toFixed(3);

  window.showToast();
})

window.socket.on('successBoostActivation', data => {
  window.color = '#F9B006';
  window.text = 'Буст был успешно активирован на 30 секунд';
  window.incomeForClick = data.click;

  window.showToastBoost();
  
})

window.socket.on('boostDisable', data => {
  window.color = '#FF3E3E';
  window.text = 'Буст x1.5 клика закончился';
  window.incomeForClick = data.click;

  window.showToastBoost();
})

window.socket.on('multiple_connections', (data) => {
  root.render(
    <MultipleConnections/>
  )
})

window.socket.on('updateHistory', async data => {
  var avatar = '';
  var name = '';
  var user = await bridge.send("VKWebAppGetUserInfo");
  var elem = document.getElementsByClassName('empty-history')[0];
  const historyList = ReactDOM.createRoot(document.getElementById('history-list'));
  const len = data.len;
  const children = [];

  len === 0 ? elem.innerHTML='Ваша история пуста' : elem.parentNode.removeChild(elem);

  for(let i = 0; i < len; i++) {
    const id = parseInt(user.id);
    const recipient_id = parseInt(data.res[i].id);

    if(id !== recipient_id) {
      avatar = data.res[i].avatar;
      name = data.res[i].name;
    } else {
      avatar = data.res[i].recipientAvatar;
      name = data.res[i].recipientName;
    }

    children.push(
      <HistoryUserItem
          avatar={avatar}
          name={name}
          amount={data.res[i].amount.toFixed(3)}
          userId={data.res[i].id}
          recipientId={data.res[i].recipient_id}
          transferTime={data.res[i].transfer_time} 
          user={user}
      />
    )
  }

  historyList.render(children);
})

window.socket.on('notEnoughCoins', () => {
  const modal_status = document.getElementsByClassName('modal__status')[0];

  modal_status.style='color: #FF3F3F';
  modal_status.innerHTML='Недостаточно коинов';
})

window.socket.on('successfulTransfer', data => {
  const modal_status = document.getElementsByClassName('modal__status')[0];

  modal_status.style='color: #36ED5E';
  modal_status.innerHTML=`Переведено коинов: ${numberSeparator(data.amount)}`;
  window.coins = (parseFloat(window.coins) - parseFloat(data.amount)).toFixed(3);
})

window.socket.on('infoAboutMerchant', data => {
  window.tokenToCopy = data.token;

  setTimeout(() => {
    if (data.id) {
      document.getElementsByClassName('modal__merchant-id')[0].innerHTML=`ID мерчанта: ${data.id}`;
    }
    document.getElementsByClassName('modal__merchant-token')[0].innerHTML=`Токен мерчанта: ${data.token}`;  
  }, 500);
})

window.socket.on('updateOnline', data => {
  window.online = data.online;

  document.getElementsByClassName('online-count')[0].innerHTML=`Онлайн: ${numberSeparator(window.online)}`;
})

window.socket.on('userInfo', async data => {
  window.coins = data.coins;
  window.incomeForClick = data.incomeForClick;
  window.incomeForSecond = data.incomeForSecond;
  window.minedForAllTime = data.minedForAllTime;
  window.userToken = data.userToken;
  window.online = data.online;

  window.user = await bridge.send("VKWebAppGetUserInfo");

  window.linkToTransfer = `https://vk.com/app51434561#send${window.user.id}`;
  window.otherLinkToTransfer = `https://vk.com/${data.screenName}`;

  root.render(
    <React.StrictMode>
      <App user={window.user} />
    </React.StrictMode>
  );

  bridge.send("VKWebAppJoinGroup", {"group_id": 214258105});
  if (merchant && !mSend) {
    window.socket.emit('checkMerchant');

    setTimeout(()=> {
      window.setModalMerchantTrue();
    }, 450)
  }
  if (mSend) {
    const id = mSend[0].replace('m_send', '');
  
    window.socket.emit('merchantSearchById', { id: id });
  }
  if (hash && !mSend) {
    const id = hash[0].replace('send', '');
  
    window.socket.emit('userSearchById', { id: parseInt(id) });
  }
  if (token) {
    window.socket.emit('getUserToken');
  }
})

root.render(
  <React.StrictMode>
    <Loading />
  </React.StrictMode>
);

reportWebVitals();
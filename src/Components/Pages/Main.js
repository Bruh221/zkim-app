import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import UserInfo from '../Modals/UserInfo';
import Merchant from '../Modals/Merchant';
import UserToken from '../Modals/UserToken';
import Boost from '../Modals/Boost';
import SendToMerchantModal from '../Modals/SendToMerchantModal';
import numberSeparator from 'number-separator';
import { ReactComponent as Logo } from '../../logo.svg';
import { ReactComponent as L } from '../../L.svg';
import { ReactComponent as Svg1 } from '../../Time.svg';
import { ReactComponent as Svg2 } from '../../Rectangle 287.svg';
import { ReactComponent as Home } from '../../HomeA.svg';
import { ReactComponent as Rating } from '../../Chart.svg';
import { ReactComponent as More } from '../../More Square.svg';
import Toast from '../Modals/Toast';

const Main = props => {
    const [isModalUserInfo, setModalUserInfo] = useState(false);
    const onCloseModalUserInfo = () => setModalUserInfo(false);
    const [isModalMerchant, setModalMerchant] = useState(false);
    const onCloseModalMerchant = () => setModalMerchant(false);
    const [isModalUserToken, setModalUserToken] = useState(false);
    const onCloseModalUserToken = () => setModalUserToken(false);
    const [isModalMerchantSend, setModalMerchantSend] = useState(false);
    const onCloseModalMerchantSend = () => setModalMerchantSend(false);
    const [isModal, setModal] = useState(false);
    const onCloseModal = () => setModal(false);
    const [showToast, setShowToast] = useState(false);

    window.showToastBoost = () => { setShowToast(true) };
    const hideToast = () => { setShowToast(false) };
    window.setModalMerchantTrue = () => { setModalMerchant(true) };
    window.setModalUserTokenTrue = () => { setModalUserToken(true) };
    window.setModalMerchantSend = () => { setModalMerchantSend(true) };
    window.setModalUserInfo = () => setModalUserInfo(true);

    if(!props.user) return;

    window.clicks = 0;
    var incomeForClick = parseFloat(window.incomeForClick);

    function click() {
        if(window.clicks >= 15) return;
        var coins = parseFloat(window.coins);
        
        window.clicks = window.clicks + 1;
        document.getElementsByClassName('balance__text')[0].innerHTML=numberSeparator((coins += incomeForClick).toFixed(3));
        window.coins = (coins).toFixed(3);

        window.minedForAllTime += incomeForClick;
    }

    window.socket.on('userFoundById', data => {
        setModalUserInfo(true);
        window.avatar = data.avatar;
        window.name = data.name;
        window.recipient_id = data.recipient_id;
        window.id = data.id;
    })

    return(
        <div className='wrapper'>
            <div className='header'>
                <img className='header__user-avatar' src={props.user.photo_200} alt=''></img>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='balance'>
                    <div className='balance__coins'>
                        <div className='balance__text'>{numberSeparator(parseFloat(window.coins).toFixed(3))}</div>
                        <Logo />
                    </div>
                    <div className='balance__stats'>
                        <div className='balance__income'>
                            <div className='balance__income-for-click'>+ {numberSeparator(window.incomeForClick)} <Svg2 className='svg2'/></div>
                            <div className='balance__income-for-sec'>+ {numberSeparator(window.incomeForSecond)} <Svg1 className='svg1'/></div>
                        </div>
                    </div>
                    <Link to='/shop' className='balance__buy-upgrades-btn'>Купить ускорители</Link>
                </div>
                <div className='mining-button' onClick={() => {click()}}><L/></div>
                <h2 className='online-count'>Онлайн: { numberSeparator(window.online) }</h2>
                <div className='boost' onClick={() => {setModal(true)}}>x1.5</div>
                <div className='nav-menu'>
                    <div className='nav-menu__icon nav-menu__icon_active'>
                        <Home className='nav-menu__home-outline-icon nav-menu__home-outline-icon_active'/>
                    </div>
                    <Link to='/rating' className='nav-menu__icon'>
                        <Rating className='nav-menu__info-outline-icon'/>
                        <span className='nav-menu__text'>Рейтинг</span>
                    </Link>
                    <Link to='/other' className='nav-menu__icon'>
                        <More className='nav-menu__more-horizontal-icon'/>
                        <span className='nav-menu__text'>Прочее</span>
                    </Link>
                </div>
                <UserInfo
                    visible={isModalUserInfo}
                    onClose={onCloseModalUserInfo}
                    avatar={window.avatar}
                    name={window.name}
                    recipient_id={window.recipient_id}
                    id={window.id}
                />
                <Merchant
                    visible={isModalMerchant}
                    onClose={onCloseModalMerchant}
                />
                <UserToken
                    visible={isModalUserToken}
                    onClose={onCloseModalUserToken}
                />
                <SendToMerchantModal
                    visible={isModalMerchantSend}
                    onClose={onCloseModalMerchantSend}
                    avatar={window.merchantAvatar}
                    name={window.merchantName}
                    recipient_id={window.merchantRecipient_id}
                    id={window.id}
                    amount={window.merchantAmount}
                />
                <Boost
                    visible={isModal}
                    onClose={onCloseModal}
                />
                <div className='toast-wrapper'></div>
                <Toast show={showToast} hideToast={hideToast}>
                    {window.text}
                </Toast>
            </div>
        </div>
    )
}

export default Main;
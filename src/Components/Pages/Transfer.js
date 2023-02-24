import { Icon28ChevronLeftOutline, Icon28CopyOutline, Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import React, { useState } from 'react';
import UserInfo from '../Modals/UserInfo';
import { Link } from 'react-router-dom';
import Toast from '../Modals/Toast';
import { ReactComponent as Home } from '../../Home.svg';
import { ReactComponent as RatingIcon } from '../../Chart.svg';
import { ReactComponent as More } from '../../MoreA.svg';

const Transfer = () => {
    const [isModalUserInfo, setModalUserInfo] = useState(false);
    const onCloseModalUserInfo = () => setModalUserInfo(false);
    const [showToast, setShowToast] = useState(false);

    const hideToast = () => { setShowToast(false) };

    function handleChange(event) {
        window.socket.emit('searchUser', event.target.value);
	}

    window.socket.on('userFound', data => {
        setModalUserInfo(true);
        window.avatar = data.avatar;
        window.name = data.name;
        window.recipient_id = data.recipient_id;
        window.id = data.id;
    })

    return(
        <div className='wrapper'>
            <div className='header'>
                <div className='header__title'>
                    <Link to='/other' className='header__icon'>
                        <Icon28ChevronLeftOutline className='header__icon-chevron-back' width={38} height={38}/>
                    </Link>
                    Перевод
                </div>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                {/* <input className='search-user' placeholder='Введите ссылку' onChange={handleChange}></input>
                <span className='text'>Быстрый перевод вам</span>
                <div className='user-link-wrapper'>
                    <input className='user-link' value={window.linkToTransfer}></input>
                    <div className='copy-user-link' onClick={() => {
                            window.bridge.send('VKWebAppCopyText', { 'text': `${window.linkToTransfer}` });

                            window.text = 'Ссылка скопирована';
                            window.color = '#36ED5E';
                            setShowToast(true);
                        }}>
                        <Icon28CopyOutline className='copy-user-link__icon' width={28} height={28}/>
                    </div>
                </div>
                <span className='text'>Ваша ссылка ВК</span>
                <div className='user-link-wrapper'>
                    <input className='user-link' value={window.otherLinkToTransfer}></input>
                    <div className='copy-user-link' onClick={() => {
                            window.bridge.send('VKWebAppCopyText', { 'text': `${window.otherLinkToTransfer}` });

                            window.text = 'Ссылка скопирована';
                            window.color = '#36ED5E';
                            setShowToast(true);
                        }}>
                        <Icon28CopyOutline className='copy-user-link__icon' width={28} height={28}/>
                    </div>
                </div> */}
                <div className='transfer-wrapper'>
                    <div className='transfer-wrapper__text'>По ссылке</div>
                    <input className='transfer-wrapper__input' placeholder='Введите ссылку' onChange={handleChange}></input>
                </div>
                <div className='transfer-wrapper'>
                    <div className='transfer-wrapper__text'>Быстрый перевод вам</div>
                    <div className='transfer-wrapper__wrap'>
                        <input className='transfer-wrapper__link' value={window.linkToTransfer}></input>
                        <div className='transfer-wrapper__copy-button' onClick={() => {
                            window.bridge.send('VKWebAppCopyText', { 'text': `${window.linkToTransfer}` });

                            window.text = 'Ссылка скопирована';
                            window.color = '#F9B006';
                            setShowToast(true);
                        }}>Копировать</div>
                    </div>
                </div>
                <div className='transfer-list'></div>
                <div className='nav-menu'>
                    <Link to='/' className='nav-menu__icon'>
                        <Home className='nav-menu__home-outline-icon nav-menu__home-outline-icon_active'/>
                        <span className='nav-menu__text'>Главная</span>
                    </Link>
                    <Link to='/rating' className='nav-menu__icon'>
                        <RatingIcon className='nav-menu__info-outline-icon'/>
                        <span className='nav-menu__text'>Рейтинг</span>
                    </Link>
                    <div className='nav-menu__icon nav-menu__icon_active'>
                        <More className='nav-menu__more-horizontal-icon'/>
                    </div>
                </div>
                <div className='toast-wrapper'></div>
                <UserInfo
                    visible={isModalUserInfo}
                    onClose={onCloseModalUserInfo}
                    avatar={window.avatar}
                    name={window.name}
                    recipient_id={window.recipient_id}
                    id={window.id}
                />
                <Toast show={showToast} hideToast={hideToast}>
                    {window.text}
                </Toast>
            </div>
        </div>
    )
}

export default Transfer;
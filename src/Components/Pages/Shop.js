import React, { useState, useEffect } from 'react';
import Toast from '../Modals/Toast.js';
import { Icon28ChevronLeftOutline, Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal} from '@vkontakte/icons';
import { Link } from 'react-router-dom';
import { ReactComponent as Home } from '../../HomeA.svg';
import { ReactComponent as RatingIcon } from '../../Chart.svg';
import { ReactComponent as More } from '../../More Square.svg';

const Shop = () => {
    useEffect(() => {
        window.socket.emit('getListsOfUpgrades');
    }, [])

    const [showToast, setShowToast] = useState(false);

    window.showToast = () => { setShowToast(true) };
    const hideToast = () => { setShowToast(false) };

    function openSeconds() {
        document.getElementsByClassName('shop-buttons__clicks')[0].className='shop-buttons__clicks';
        document.getElementsByClassName('shop-buttons__seconds')[0].className='shop-buttons__seconds active';

        window.showSecondsUpgrades();
    }

    function openClicks() {
        document.getElementsByClassName('shop-buttons__seconds')[0].className='shop-buttons__seconds';
        document.getElementsByClassName('shop-buttons__clicks')[0].className='shop-buttons__clicks active';

        window.showClicksUpgrades();
    }

    return(
        <div className='wrapper'>
            <div className='header'>
                <div className='header__title'>
                    <Link to='/' className='header__icon'>
                        <Icon28ChevronLeftOutline className='header__icon-chevron-back' width={38} height={38}/>
                    </Link>
                    Магазин
                </div>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='shop-buttons'>
                    <div className='shop-buttons__clicks active' onClick={() => {openClicks()}}>Клики</div>
                    <div className='shop-buttons__seconds' onClick={() => {openSeconds()}}>Секунды</div>
                </div>
                <div className='shop-items-list'></div>
                <div className='nav-menu'>
                    <div className='nav-menu__icon nav-menu__icon_active'>
                        <Home className='nav-menu__home-outline-icon nav-menu__home-outline-icon_active'/>
                    </div>
                    <Link to='/rating' className='nav-menu__icon'>
                        <RatingIcon className='nav-menu__info-outline-icon'/>
                        <span className='nav-menu__text'>Рейтинг</span>
                    </Link>
                    <Link to='/other' className='nav-menu__icon'>
                        <More className='nav-menu__more-horizontal-icon'/>
                        <span className='nav-menu__text'>Прочее</span>
                    </Link>
                </div>
                <div className='toast-wrapper'></div>
                <Toast show={showToast} hideToast={hideToast}>
                    {window.text}
                </Toast>
            </div>
        </div>
    )
}

export default Shop;
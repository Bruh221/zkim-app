import React, { useState } from 'react';
import Merchant from '../Modals/Merchant';
import numberSeparator from 'number-separator';
import { Link } from 'react-router-dom';
import { Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import { ReactComponent as Home } from '../../Home.svg';
import { ReactComponent as RatingIcon } from '../../Chart.svg';
import { ReactComponent as More } from '../../More Square.svg';

const Additionally = props => {
    if(!props.user) return;

    return(
        <div className='wrapper'>
            <div className='header'>
                <img className='header__user-avatar' src={props.user.photo_200} alt=''></img>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='row'>
                    <Link to='/rating' className='row__rating'>
                        <img className='row__img-cup' src='https://i.ibb.co/s51gDgV/3188654.png' alt=''></img>
                        <span className='row__span'>Рейтинг</span>
                    </Link>
                    <Link to='/transfer' className='row__transfer'>
                        <img className='row__img-transfer' src='https://i.ibb.co/Kr5vTSF/2976565.png' alt=''></img>
                        <span className='row__span'>Перевод</span> 
                    </Link>
                </div>
                <div className='row'>
                    <Link to='/history' className='row__history'>
                        <img className='row__img-history' src='https://i.ibb.co/BZssxyt/1821820.png' alt=''></img>
                        <span className='row__span'>История</span>
                    </Link>
                    <Link to='/shop' className='row__shop'>
                        <img className='row__img-shop' src='https://i.ibb.co/sRJXCqK/shop.png' alt=''></img>
                        <span className='row__span'>Магазин</span>
                    </Link>
                </div>
                <div className='mined-for-all-time'>
                    <div className='mined-for-all-time__logo'>LC</div>
                    <div className='mined-for-all-time__information'>
                        <span className='mined-for-all-time__quantity-span'>{ numberSeparator(parseFloat(window.minedForAllTime).toFixed(3)) }</span>
                        <span className='mined-for-all-time__span'>Добыто за всё время</span>
                    </div>
                </div>
                <div className='nav-menu'>
                    <Link to='/' className='nav-menu__icon'>
                        <Home className='nav-menu__home-outline-icon nav-menu__home-outline-icon_active'/>
                        <span className='nav-menu__text'>Главная</span>
                    </Link>
                    <div className='nav-menu__icon nav-menu__icon_active'>
                        <RatingIcon className='nav-menu__info-outline-icon'/>
                    </div>
                    <Link to='/other' className='nav-menu__icon'>
                        <More className='nav-menu__more-horizontal-icon'/>
                        <span className='nav-menu__text'>Прочее</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Additionally;
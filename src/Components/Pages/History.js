import { Icon28ChevronLeftOutline, Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Home } from '../../Home.svg';
import { ReactComponent as RatingIcon } from '../../Chart.svg';
import { ReactComponent as More } from '../../MoreA.svg';

const History = () => {
    window.socket.emit('getHistory');

    return(
        <div className='wrapper'>
            <div className='header'>
                <div className='header__title'>
                    <Link to='/other' className='header__icon'>
                        <Icon28ChevronLeftOutline className='header__icon-chevron-back' width={38} height={38}/>
                    </Link>
                    История
                </div>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='history-list' id='history-list'></div>
                <div className='empty-history'></div>
                <div className='nav-menu'>
                    <Link to='/' className='nav-menu__icon'>
                        <Home className='nav-menu__home-outline-icon nav-menu__home-outline-icon_active'/>
                        <span className='nav-menu__text'>Главная</span>
                    </Link>
                    <Link to='/rating' className='nav-menu__icon'>
                        <RatingIcon className='nav-menu__info-outline-icon'/>
                        <span className='nav-menu__text'>Рейтинг</span>
                    </Link>
                    <div to='/other' className='nav-menu__icon nav-menu__icon_active'>
                        <More className='nav-menu__more-horizontal-icon'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History;
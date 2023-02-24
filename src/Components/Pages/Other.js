import { Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import { Link } from 'react-router-dom';
import { ReactComponent as Home } from '../../Home.svg';
import { ReactComponent as RatingIcon } from '../../Chart.svg';
import { ReactComponent as More } from '../../MoreA.svg';
import { ReactComponent as L2 } from '../../L2.svg';

const Other = props => {
    return(
        <div className='wrapper'>
            <div className='header'>
                <img className='header__user-avatar' src={props.user.photo_200} alt=''></img>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='other-wrap'>
                    <div className='buttons'>
                        <Link to='/transfer' className='buttons__button1'>
                            <img className='buttons__img' src='https://i.ibb.co/Kr5vTSF/2976565.png' alt=''/>
                            <div className='buttons__text'>Перевести</div>
                        </Link>
                        <Link to='/history' className='buttons__button2'>
                            <img className='buttons__img' src='https://i.ibb.co/BZssxyt/1821820.png' alt=''/>
                            <div className='buttons__text'>История</div>
                        </Link>
                    </div>
                    <div className='buttons'>
                        <a className='buttons__button3' target='_blank' href='https://vk.com/vklightcoin'>
                            <img className='buttons__img' src='https://i.ibb.co/94ZzSn2/Vector.png' alt=''/>
                            <div className='buttons__text'>Сообщество</div>
                        </a>
                        <a className='buttons__button4' target='_blank' href='https://vk.me/vklightcoin'>
                            <img className='buttons__img' src='https://i.ibb.co/1TN51nv/Vector2.png' alt=''/>
                            <div className='buttons__text'>Поддержка</div>
                        </a>
                    </div>
                </div>
                <div className='mined-for-all-time'>
                    <div className='mined-for-all-time__ellipse'>
                        <L2/>
                    </div>
                    <div className='mined-for-all-time__information'>
                        <span className='mined-for-all-time__span'>Добыто за всё время</span>
                        <span className='mined-for-all-time__quantity-span'>{window.minedForAllTime.toLocaleString()}</span>
                    </div>
                </div>
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
            </div>
        </div>
    )
}

export default Other;
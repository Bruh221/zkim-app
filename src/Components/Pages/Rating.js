import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';
import { Icon28ChevronLeftOutline, Icon28HomeOutline, Icon28InfoOutline, Icon28MoreHorizontal } from '@vkontakte/icons';
import { ReactComponent as Home } from '../../Home.svg';
import { ReactComponent as RatingIcon } from '../../ChartA.svg';
import { ReactComponent as More } from '../../More Square.svg';

const Rating = props => {
    useEffect(() => {
        const ids = [];
        if (window.numberOfAttempts < 2) {
            window.bridge.send("VKWebAppGetAuthToken", {"app_id": 51434561, "scope": "friends"})
            .then(data => {
                window.bridge.send("VKWebAppCallAPIMethod", { "method": "friends.get", "request_id": "32test", "params": { "user_id": window.user.id, "v": "5.131", "access_token": data.access_token } })
                .then(data => {
                    ids.push(data.response.items);
                    window.socket.emit('getListsOfUsers', { ids: ids });
                    setInterval(() => {
                        window.socket.emit('getListsOfUsers', { ids: ids });
                    }, 60000)
                })
            })
            window.numberOfAttempts += 1;

            const ratingButtonsGeneral = document.getElementsByClassName('rating-buttons__general')[0];
            const ratingButtonsFriends = document.getElementsByClassName('rating-buttons__friends')[0];
            const ratingButtonsShops = document.getElementsByClassName('rating-buttons__shops')[0];
            const ratingButtonsCommunities = document.getElementsByClassName('rating-buttons__communities')[0];
            const addAppToGroup = document.getElementsByClassName('add-app-to-group')[0];

            window.openGeneralRating = () => {
                const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                document.getElementsByClassName('rating-list')[0].style='margin: 0';
                
                ratingButtonsGeneral.className='rating-buttons__general active';
                ratingButtonsFriends.className='rating-buttons__friends';
                ratingButtonsShops.className='rating-buttons__shops';
                ratingButtonsCommunities.className='rating-buttons__communities';
                addAppToGroup.className='add-app-to-group inactive-button';

                list.render(window.users);
            }

            window.openFriendsRating = () => {
                const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                document.getElementsByClassName('rating-list')[0].style='margin: 0';
                
                ratingButtonsGeneral.className='rating-buttons__general';
                ratingButtonsFriends.className='rating-buttons__friends active';
                ratingButtonsShops.className='rating-buttons__shops';
                ratingButtonsCommunities.className='rating-buttons__communities';
                addAppToGroup.className='add-app-to-group inactive-button';

                list.render(window.friends);
            }

            window.openMerchantsRating = () => {
                const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                document.getElementsByClassName('rating-list')[0].style='margin: 0';

                ratingButtonsGeneral.className='rating-buttons__general';
                ratingButtonsFriends.className='rating-buttons__friends';
                ratingButtonsShops.className='rating-buttons__shops active';
                ratingButtonsCommunities.className='rating-buttons__communities';
                addAppToGroup.className='add-app-to-group inactive-button';

                list.render(window.merchants);
            }

            window.openGroupsRating = () => {
                const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                document.getElementsByClassName('rating-list')[0].style='margin-bottom: 70px';
                
                ratingButtonsGeneral.className='rating-buttons__general';
                ratingButtonsFriends.className='rating-buttons__friends';
                ratingButtonsShops.className='rating-buttons__shops';
                ratingButtonsCommunities.className='rating-buttons__communities active';
                addAppToGroup.className='add-app-to-group active-button';

                list.render(window.groups);
            }

            window.addAppToGroup = () => {
                window.bridge.send("VKWebAppAddToCommunity").then(data => {
                    window.socket.emit('addAppToGroup', { groupId: data.group_id });
                })
            }
        } else {
            setTimeout(() => {
                const ratingButtonsGeneral = document.getElementsByClassName('rating-buttons__general')[0];
                const ratingButtonsFriends = document.getElementsByClassName('rating-buttons__friends')[0];
                const ratingButtonsShops = document.getElementsByClassName('rating-buttons__shops')[0];
                const ratingButtonsCommunities = document.getElementsByClassName('rating-buttons__communities')[0];
                const addAppToGroup = document.getElementsByClassName('add-app-to-group')[0];

                window.openGeneralRating = () => {
                    const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                    document.getElementsByClassName('rating-list')[0].style='margin: 0';
                    
                    ratingButtonsGeneral.className='rating-buttons__general active';
                    ratingButtonsFriends.className='rating-buttons__friends';
                    ratingButtonsShops.className='rating-buttons__shops';
                    ratingButtonsCommunities.className='rating-buttons__communities';
                    addAppToGroup.className='add-app-to-group inactive-button';

                    list.render(window.users);
                }

                window.openMerchantsRating = () => {
                    const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                    document.getElementsByClassName('rating-list')[0].style='margin: 0';
                    
                    ratingButtonsGeneral.className='rating-buttons__general';
                    ratingButtonsFriends.className='rating-buttons__friends';
                    ratingButtonsShops.className='rating-buttons__shops active';
                    ratingButtonsCommunities.className='rating-buttons__communities';
                    addAppToGroup.className='add-app-to-group inactive-button';
    
                    list.render(window.merchants);
                }

                window.openFriendsRating = () => {
                    const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                    document.getElementsByClassName('rating-list')[0].style='margin: 0';
                    
                    ratingButtonsGeneral.className='rating-buttons__general';
                    ratingButtonsFriends.className='rating-buttons__friends active';
                    ratingButtonsShops.className='rating-buttons__shops';
                    ratingButtonsCommunities.className='rating-buttons__communities';
                    addAppToGroup.className='add-app-to-group inactive-button';

                    list.render(window.friends);
                }

                window.openGroupsRating = () => {
                    const list = ReactDOM.createRoot(document.getElementsByClassName('rating-list')[0]);
                    document.getElementsByClassName('rating-list')[0].style='margin-bottom: 70px';
                    
                    ratingButtonsGeneral.className='rating-buttons__general';
                    ratingButtonsFriends.className='rating-buttons__friends';
                    ratingButtonsShops.className='rating-buttons__shops';
                    ratingButtonsCommunities.className='rating-buttons__communities active';
                    addAppToGroup.className='add-app-to-group active-button';

                    list.render(window.groups);
                }

                window.showFriendsList = () => {
                    window.ratingList.render(window.friends);
                }

                window.openGeneralRating();
            }, 500);
        }
    }, [])

    return(
        <div className='wrapper'>
            <div className='header'>
                <img className='header__user-avatar' src={props.user.photo_200} alt=''></img>
                <div className='header__separator-line'></div>
            </div>
            <div className='content'>
                <div className='rating-buttons'>
                    <div className='rating-buttons__general active' onClick={() => { window.openGeneralRating() }}>Общий</div>
                    <div className='rating-buttons__friends' onClick={() => { window.openFriendsRating() }}>Друзья</div>
                    <div className='rating-buttons__shops' onClick={() => { window.openMerchantsRating() }}>Мерчанты</div>
                    <div className='rating-buttons__communities' onClick={() => { window.openGroupsRating() }}>Сообщества</div>
                </div>
                <div className='rating-list'></div>
                <div className='add-app-to-group inactive-button' onClick={() => { window.addAppToGroup() }}>Добавить в группу</div>
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

export default Rating;
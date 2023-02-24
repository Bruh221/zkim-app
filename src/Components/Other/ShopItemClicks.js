import React from 'react';
import numberSeparator from "number-separator";

const ShopItemClicks = props => {
    return(
        <div className='shop-item' onClick={props.onClick}>
            <img className='shop-item__img' src={props.img} alt=''></img>
            <div className='shop-item__info'>
                <div className='shop-item__name'>{props.name}</div>
                <div className='shop-item__total-earning'>Всего добыть: {numberSeparator(props.totalEarning)}</div>
                <div className='shop-item__price'>Цена: {numberSeparator(props.price)}</div>
                <div className='shop-item__increase'>Прибавка: {numberSeparator(props.increase)}</div>
            </div>
        </div>
    )
}

export default ShopItemClicks;
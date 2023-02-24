import React from 'react';
import numberSeparator from "number-separator";

const ShopItemSeconds = props => {
    return(
        <div className='shop-item' onClick={props.onClick}>
            <img className='shop-item__img' src={props.img} alt=''></img>
            <div className='shop-item__info'>
                <div className='shop-item__name'>{props.name}</div>
                <div className='shop-item__price' id={props.id}>Цена: {numberSeparator(props.price)}</div>
                <div className='shop-item__increase'>Прибавка: {numberSeparator(props.increase)}</div>
            </div>
        </div>
    )
}

export default ShopItemSeconds;
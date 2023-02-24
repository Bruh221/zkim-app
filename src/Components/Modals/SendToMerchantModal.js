import React from 'react';

const SendToMerchantModal = props => {
    if (!props.visible) return;

    function sendCoins() {
        const modal_status = document.getElementsByClassName('modal__status')[0];
        const amount = document.getElementsByClassName('modal__amount-transfer')[0].value;
        const recipient_id = props.recipient_id;

        if (amount === "") {
            modal_status.style='color: #FF3F3F';
            modal_status.innerHTML='Введите сумму';
            return;
        } else if (parseFloat(amount) > parseFloat(window.coins)) {
            modal_status.style='color: #FF3F3F';
            modal_status.innerHTML='Недостаточно коинов';
            return;
        } else {
            if (amount.indexOf(',') !== -1) {
                if (amount.replace(/,/g, '.').split('.')[1].length > 3) {
                    modal_status.style='color: #FF3F3F';
                    modal_status.innerHTML='После запятой или точки нельзя писать больше 3 цифр';
                    return;
                }
            } else if (amount.split('.')[1]) {
                if (amount.split('.')[1].length > 3) {
                    modal_status.style='color: #FF3F3F';
                    modal_status.innerHTML='После запятой или точки нельзя писать больше 3 цифр';
                    return;
                }
            }
        }
        
        window.socket.emit('sendCoinsToMerchant', {
            amount: amount,
            recipient_id: recipient_id
        })  
    }

    function handleChange(event) {
        let amount = event.target.value;
        const modal_status = document.getElementsByClassName('modal__status')[0];

        if (amount.indexOf(',') !== -1) {
            amount = amount.replace(/,/g, '.');
        }

        modal_status.style='color: #FF3F3F';
        parseFloat(window.coins) < parseFloat(amount) ? modal_status.innerHTML='Недостаточно коинов' : modal_status.innerHTML='';
	}
    if (!props.amount) {
        return(
            <div className='modal-wrapper'>
                <div className='modal-close' onClick={() => {props.onClose()}}></div>
                <div className='modal'>
                    <div className='modal__user'>
                        <img className='modal__avatar' src={props.avatar} alt=''></img>
                        <div className='modal__info'>
                            <div className='modal__name'>{props.name}</div>
                            <div className='modal__status'></div>
                        </div>
                    </div>
                    <input className='modal__amount-transfer' placeholder='Сумма' onChange={handleChange}></input>
                    <div className='modal__send-button' onClick={() => {sendCoins()}}>Отправить</div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='modal-wrapper'>
                <div className='modal-close' onClick={() => {props.onClose()}}></div>
                <div className='modal'>
                    <div className='modal__user'>
                        <img className='modal__avatar' src={props.avatar} alt=''></img>
                        <div className='modal__info'>
                            <div className='modal__name'>{props.name}</div>
                            <div className='modal__status'></div>
                        </div>
                    </div>
                    <input className='modal__amount-transfer' value={props.amount}></input>
                    <div className='modal__send-button' onClick={() => {sendCoins()}}>Отправить</div>
                </div>
            </div>
        )
    }
}

export default SendToMerchantModal;
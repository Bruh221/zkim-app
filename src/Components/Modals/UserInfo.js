import React from 'react';

const UserInfo = props => {
    if (!props.visible) return;

    function sendCoins() {
        const modal_status = document.getElementsByClassName('modal__status')[0];
        const amount = document.getElementsByClassName('modal__amount-transfer')[0].value;
        const recipient_id = props.recipient_id;
        
        if(parseInt(recipient_id) === parseInt(props.id)) {
            modal_status.style='color: #FF3F3F';
            modal_status.innerHTML='Нельзя перевести себе';
            return;
        } else {
            window.socket.emit('sendCoins', {
                amount: amount,
                recipient_id: recipient_id
            })
        }
    }

    function handleChange(event) {
        let amount = event.target.value;
        const modal_status = document.getElementsByClassName('modal__status')[0];

        if (amount.indexOf(',') !== -1) {
            amount = amount.replace(/,/g, '.');
        }

        modal_status.style='color: #FF3F3F';
        window.coins < amount ? modal_status.innerHTML='Недостаточно коинов' : modal_status.innerHTML='';
	}
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
                <div className='modal__send-button' onClick={() => {sendCoins()}}>Перевести</div>
            </div>
        </div>
    )
}

export default UserInfo;
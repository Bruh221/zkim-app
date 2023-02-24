import React from 'react';
import { Icon28CopyOutline } from '@vkontakte/icons';

const Merchant = props => {
    if (!props.visible) return null;

    return(
        <div className='modal-wrapper'>
            <div className='modal-close' onClick={() => { props.onClose() }}></div>
            <div className='modal'>
                <div className='modal__merchant-id'>ID мерчанта: неизвестно</div>
                <div className='modal__merchant-token'>Токен мерчанта: неизвестно</div>
                <div className='modal__buttons'>
                    <div className='modal__generate-token' onClick={() => { window.socket.emit('tokenUpdate') }}>Обновить токен</div>
                    <div className='modal__copy-token' onClick={() => {
                        window.bridge.send('VKWebAppCopyText', { 'text': `${window.tokenToCopy}` });
                    }}>
                        <Icon28CopyOutline className='modal__icon-copy-outline' width={30} height={30}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Merchant;
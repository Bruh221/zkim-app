import React from 'react';

const UserToken = props => {
    if (!props.visible) return null;

    return(
        <div className='modal-wrapper'>
            <div className='modal-close' onClick={() => { props.onClose() }}></div>
            <div className='modal'>
                <div className='modal__user-token'>Ваш токен: неизвестно</div>
                <div className='modal__buttons'>
                    <div className='modal__copy-user-token' onClick={() => {
                        window.bridge.send('VKWebAppCopyText', { 'text': `${window.userTokenToCopy}` });
                    }}>Скопировать токен</div>
                </div>
            </div>
        </div>
    )
}

export default UserToken;
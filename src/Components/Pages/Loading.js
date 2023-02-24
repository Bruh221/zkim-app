import React, { useState } from 'react';
import { Icon28SwitchOutline } from '@vkontakte/icons';

const Loading = () => {
    return(
        <div className='loading-wrapper'>
            <div className='loading'>
                <div className='rotate'>
                    <Icon28SwitchOutline width={42} height={42} className='rotate_icon'/>
                </div>
            </div>
        </div>
    )
}

export default Loading;
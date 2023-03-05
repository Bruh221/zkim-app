const { Keyboard } = require('vk-io')
const config = require('../config')

module.exports = {
    main_menu: Keyboard.keyboard([
	    [ 
    	Keyboard.textButton({ label: 'Купить', color: Keyboard.NEGATIVE_COLOR }),
    	Keyboard.textButton({ label: 'Профиль', color: Keyboard.POSITIVE_COLOR }),
    	],
    	[
    	Keyboard.textButton({ label: 'Информация', color: Keyboard.POSITIVE_COLOR })
       ],
    ]),

    information_menu: Keyboard.keyboard([
        [ 
        Keyboard.textButton({ label: 'Топ за все время', color: Keyboard.SECONDARY_COLOR }),
        ],
        [
        Keyboard.textButton({ label: 'Топ за сегодня', color: Keyboard.SECONDARY_COLOR })
       ],
    ]).inline()
};
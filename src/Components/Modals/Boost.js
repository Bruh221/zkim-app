const Boost = ({ visible, onClose }) => {
    if (!visible) return;

    const activate = () => {
        window.bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
        .then(data => {
            if (data.result) {
                window.socket.emit('activateBoost');
            }
        })
    }

    return(
        <div className='boost-modal-wrap'>
            <div className='close-modal' onClick={() => {onClose()}}></div>
            <div className='boost-modal'>
                <div className='boost-modal__info'>
                    <div className='boost-modal__ellipse'>x1.5</div>
                    <div className='boost-modal__name'>Буст клика x1.5 за рекламу на 30 сек</div>
                </div>
                <div className='boost-modal__button' onClick={() => {activate()}}>Активировать</div>
            </div>
        </div>
    )
}

export default Boost;
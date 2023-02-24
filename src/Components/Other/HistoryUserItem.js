import numberSeparator from "number-separator";

const HistoryUserItem = props => {
    if(parseInt(props.recipientId) !== parseInt(props.user.id)) {
        return(
            <div className='history-item'>
                <img className='history-item__user-avatar' src={props.avatar} alt=''></img>
                <div className='history-item__info'>
                    <div className='history-item__transfer-time'>{props.transferTime}</div>
                    <div className='history-item__name'>{props.name}</div>
                    <div className='history-item__amount red'>- {numberSeparator(props.amount)}</div>
                </div>
            </div>
        )
    } else {
        return(
            <div className='history-item'>
                <img className='history-item__user-avatar' src={props.avatar} alt=''></img>
                <div className='history-item__info'>
                <div className='history-item__transfer-time'>{props.transferTime}</div>
                    <div className='history-item__name'>{props.name}</div>
                    <div className='history-item__amount green'>+ {numberSeparator(props.amount)}</div>
                </div>
            </div>
        )
    }
}

export default HistoryUserItem;
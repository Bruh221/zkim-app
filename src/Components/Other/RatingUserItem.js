import numberSeparator from "number-separator";

const RatingUserItem = props => {
    if (props.id && !props.type) {
        return(
            <a className='rating-item' target='_blank' href={`https://vk.com/id${props.id}`}>
                <div className="rating-item__place">{props.place}</div>
                <img className='rating-item__user-avatar' src={props.avatar} alt=''></img>
                <div className='rating-item__info'>
                    <div className='rating-item__name'>{props.name}</div>
                    <div className='rating-item__coins'>{numberSeparator(parseFloat(props.coins).toFixed(3))}</div>
                </div>
            </a>
        )
    } else if (props.type === 'merchant' || props.type === 'group') {
        return(
            <a className='rating-item' target='_blank' href={`https://vk.com/public${props.id}`}>
                <div className="rating-item__place">{props.place}</div>
                <img className='rating-item__user-avatar' src={props.avatar} alt=''></img>
                <div className='rating-item__info'>
                    <div className='rating-item__name'>{props.name}</div>
                    <div className='rating-item__coins'>{numberSeparator(parseFloat(props.coins).toFixed(3))}</div>
                </div>
            </a>
        )
    }

    return(
        <div className='rating-item'>
            <div className="rating-item__place">{props.place}</div>
            <img className='rating-item__user-avatar' src={props.avatar} alt=''></img>
            <div className='rating-item__info'>
                <div className='rating-item__name'>{props.name}</div>
                <div className='rating-item__coins'>{numberSeparator(parseFloat(props.coins).toFixed(3))}</div>
            </div>
        </div>
    )
}

export default RatingUserItem;
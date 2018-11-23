import React from 'react'

function Thread(props) {



    return <div className='message'>
        <p className='message__name'>{props.name}:</p>
        <p>{props.text}</p>
    </div>

}

export default Thread
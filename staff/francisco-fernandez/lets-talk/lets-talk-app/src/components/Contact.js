import React from 'react'

function Contact(props) {



    return <section className='contact' onClick={()=>props.onGoContact(props.id)}>
        <h2 className='contact__name'>
            {props.name}
        </h2>
        <div className='img_container'>
            <img className='contact__image' src="./images/blank-profile-picture-973461_640.png"></img>
        </div>
    </section>

}

export default Contact
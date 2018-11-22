import React from 'react'

function Messages(props) {
    return     <main className='messages__page'>

    <section>
        <h3 className='subtitle'>Messages with...</h3>
    </section>


    <section className='messages'>
        <h2 className='messages__name'>
            Ana
        </h2>
        <div>
            <div className='message'>
                <p className='message__name'>Paco:</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sunt, dolore necessitatibus
                    repudiandae dicta nemo nihil rem commodi eveniet minima, perspiciatis consequuntur amet odit
                    incidunt accusamus facere cumque sit beatae?</p>
            </div>
            <div className='message'>
                <p className='message__name'>Ana:</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sunt, dolore necessitatibus
                    repudiandae dicta nemo nihil rem commodi eveniet minima, perspiciatis consequuntur amet odit
                    incidunt accusamus facere cumque sit beatae?</p>
            </div>
            <div className='message'>
                <p className='message__name'>Paco:</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sunt, dolore necessitatibus
                    repudiandae dicta nemo nihil rem commodi eveniet minima, perspiciatis consequuntur amet odit
                    incidunt accusamus facere cumque sit beatae?</p>
            </div>
        </div>
    </section>

    <section className='new-message'>
        <textarea className='new-message__text'>text here
                
            </textarea>
    </section>
    <div className='button_send'>
    <a className='button'>Send, good luck!</a>
    <a className='button'>Photos</a>
    </div>



</main>
}

export default Messages
import React from 'react'

function Navbar(props) {


    return <header><div className='header__logo'>
        <i className='fas fa-hand-holding-heart'></i>
    </div>

        <div className='header__title'>
            <h1>LETS TALK!!</h1>
        </div>

        <div className='header__menu'>
            <div className='dropdown'>
                <button className='dropbtn'>Menu</button>
                <div className='dropdown-content'>
                    <button className='button' onClick={()=>props.onGoContactsClick()} >Contacts</button><br/>
                    <button className='button' onClick={()=>props.onGoCandidatesClick()}>Candidates</button><br/>
                    <button className='button' onClick={()=>props.onGoProfileClick()}>Profile</button><br/>
                    <button className='button' onClick={()=>props.onLogoutClick()}>Logout</button>
                    
                </div>
            </div>
        </div>
    </header>
}


export default Navbar
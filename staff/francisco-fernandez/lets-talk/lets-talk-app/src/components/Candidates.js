import React, { Component } from 'react'
import logic from '../logic'

class Candidates extends Component {

    state = { error: '', listCandidates: false, ind: 0 }

    componentDidMount = () => {
        
        const id = logic._userId

        try {
            logic.retrieveCandidates(id)
                .then(listCandidates => this.setState({ listCandidates }))
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }
        
    }

    handleNext = () => {
        
        let ind = this.state.ind
        
        let length = this.state.listCandidates.length
        if(ind < length-1) ind++
        else ind = 0

        this.setState({ ind })

    }

    handlePrev = () => {
        
        let ind = this.state.ind

        let length = this.state.listCandidates.length
        if(ind === 0) ind = length-1
        else ind--
        
        this.setState({ ind })

    }

    handleNewMessage = () =>{
        const ind = this.state.ind

        const idContact = this.state.listCandidates[ind].id
        
        this.props.onMessage(idContact)
    }

    render() {

        return <main className='candidates'>

            <section>
                <h3 className='subtitle'>Say something interesting, funny...</h3>
            </section>


            <section className='presentation'>
                <h2 className='presentation__name' >
                    {this.state.listCandidates && this.state.listCandidates[this.state.ind].name}

                </h2>
                <p className='presentation__text'>
                    {this.state.listCandidates && this.state.listCandidates[this.state.ind].presentation}
                </p>
            </section>

            <section className='presentation__buttons'>
                <button className='button' onClick={this.handlePrev}>Prev</button>
                <button className='button' onClick={this.handleNewMessage}>New message</button>
                <button className='button' onClick={this.handleNext}>Next</button>
            </section>


        </main>
    }
}

export default Candidates
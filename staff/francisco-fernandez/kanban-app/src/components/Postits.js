import React, { Component } from 'react'
import logic from '../logic'
import InputForm from './InputForm'
import Post from './Post'
import Error from './Error'

class Postits extends Component {
    state = { postits: [], error: null, buddies: [] }

    componentDidMount() {
        try {
            logic.listPostits()
                .then(postits => { this.setState({ postits }) })
        } catch ({ message }) {
            this.setState({ error: message })
        }

        try {
            logic.listBuddies()
                .then(buddies => { this.setState({ buddies }) })
        } catch ({ message }) {
            this.setState({ error: message })
        }


    }

    handleSubmit = text => {
        try {
            logic.addPostit(text)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))
        } catch ({ message }) {

            this.setState({ error: message })
        }
    }

    handleBuddy = username => {
        try {
            logic.addBuddy(username)
        } catch ({ message }) {
            this.setState({ error: message })

        }
    }


    handleRemovePostit = id => {
        try {
            logic.removePostit(id)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))

        } catch ({ message }) {
            this.setState({ error: message })
        }
    }


    handleModifyPostit = (id, text) => {
        try {
            logic.modifyPostit(id, text)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }


    handleChangeStatus = (id, status) => {
        try {
            logic.modifyStatus(id, status)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))

        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    handleChangeAssignedTo = (id, assignTo) => {
        try {
            logic.assignTo(id, assignTo)
                .then(() => logic.listPostits())
                .then(postits => this.setState({ postits }))

        } catch ({ message }) {
            this.setState({ error: message })
        }

    }


    render() {
        const { error } = this.state
        return <div className='postits'>

            <div className='postits__head'>
                <h1 className='postits__title'>Post-It App <i className="fas fa-sticky-note"></i></h1>
                Create Postit<InputForm onSubmit={this.handleSubmit} />
                {error && <Error message={error} />}
                Add Buddy<InputForm onSubmit={this.handleBuddy} />
            </div>

            <div className='postits__container'>
                <section className='postits__column'>
                    <h1 className='postits__state'>To Do</h1>
                    {this.state.postits.filter(postit => postit.status === 'TODO').map(postit => <Post key={postit.id} buddies={this.state.buddies} text={postit.text} status={postit.status} assignedTo={postit.assignedTo} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onChangeStatus={this.handleChangeStatus} onChangeAssign={this.handleChangeAssignedTo} />)}
                </section>
                <section className='postits__column'>
                    <h1 className='postits__state'>Doing</h1>
                    {this.state.postits.filter(postit => postit.status === 'DOING').map(postit => <Post key={postit.id} buddies={this.state.buddies} text={postit.text} status={postit.status} assignedTo={postit.assignedTo} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onChangeStatus={this.handleChangeStatus} onChangeAssign={this.handleChangeAssignedTo} />)}
                </section>
                <section className='postits__column'>
                    <h1 className='postits__state'>Review</h1>
                    {this.state.postits.filter(postit => postit.status === 'REVIEW').map(postit => <Post key={postit.id} buddies={this.state.buddies} text={postit.text} status={postit.status} assignedTo={postit.assignedTo} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onChangeStatus={this.handleChangeStatus} onChangeAssign={this.handleChangeAssignedTo} />)}
                </section>
                <section className='postits__column'>
                    <h1 className='postits__state'>Done</h1>
                    {this.state.postits.filter(postit => postit.status === 'DONE').map(postit => <Post key={postit.id} buddies={this.state.buddies} text={postit.text} status={postit.status} assignedTo={postit.assignedTo} id={postit.id} onDeletePost={this.handleRemovePostit} onUpdatePost={this.handleModifyPostit} onChangeStatus={this.handleChangeStatus} onChangeAssign={this.handleChangeAssignedTo} />)}
                </section>
            </div>
        </div>
    }
}

export default Postits

import React, { Component } from 'react'
import logic from '../logic'

class Post extends Component {
    state = { text: this.props.text, status: this.props.status, assignedTo: this.props.assignedTo }

    componentDidMount() {
        try {
            logic.retrieveUser(this.state.assignedTo)
                .then(user => { this.setState({ assignedTo: user.username }) })
        } catch ({ message }) {
            this.setState({ error: message })
        }       
    }

    handleChange = event => {
        const text = event.target.value

        this.setState({ text })
    }

    handleStatusChange = event => {

        const status = event.target.value

        // this.setState({ status })

        this.props.onChangeStatus(this.props.id, status)
    }

    handleBlur = () => {
        this.props.onUpdatePost(this.props.id, this.state.text)
    }

    handleAssignToChange = event =>{

        const assignedTo = event.target.value

        // this.setState({ assignedTo })

        this.props.onChangeAssign(this.props.id, assignedTo)

    }

    render() {
        return <div className="post">
            <article className="post__article">
                <textarea className="post__textarea" defaultValue={this.state.text} onChange={this.handleChange} onBlur={this.handleBlur} />
                {this.state.assignedTo || 'no assigned'}
                <div className='post__buttons'>
                    <button className="post__button" onClick={() => this.props.onDeletePost(this.props.id)}><i className="far fa-trash-alt"></i></button>
                    <select className="post__dropdown" defaultValue={this.state.assignedTo} onChange={this.handleAssignToChange}>
                        <option value="assign">assign</option>
                        {this.props.buddies.map(buddy => <option value={buddy}>{buddy}</option>)}
                    </select>
                    <select className="post__select" defaultValue={this.state.status} className="post__select" onChange={this.handleStatusChange}>
                        <option value="TODO">To do</option>
                        <option value="DOING">Doing</option>
                        <option value="REVIEW">Review</option>
                        <option value="DONE">Done</option>
                    </select>
                    {/* <p>{this.state.assignedTo}</p> */}
                </div>
            </article>
        </div>
    }
}

export default Post
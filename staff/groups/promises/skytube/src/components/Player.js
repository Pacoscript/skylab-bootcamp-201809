import React, {Component} from 'react'
class Player extends Component {
    state = {open: false}

    iframe() {
        return {__html: this.props.video.player.embedHtml}
    }

    handleKeyPress = event => {
        const input = event.target
        if (event.key === 'Enter' && input.value) {
            this.props.onNewPlaylist(input.value)
            input.value = ''
        }
    }

    handleClick = () => {
        this.setState({open: !this.state.open})
    }

    render() {
        return <section className="player">
            <div className="player__video" dangerouslySetInnerHTML={this.iframe()}></div>
            <footer className="player-footer">
                <button className="player-footer__button" onClick={() => this.props.onNewFavourite(this.props.video.id)}><span>FAV</span></button>
                <button className="player-footer__button" onClick={() => this.props.onNewWatchLater(this.props.video.id)}><span>WL</span></button>
                <div className="playlists">
                    <button onClick={this.handleClick} className="player-footer__button"><span>LISTS</span></button>
                    <section className={this.state.open ? "playlists__content playlists__content--open" : "playlists__content"}>
                        <nav>
                            <h2 className="playlists__title">Add to...</h2>
                            <ul className="playlists__menu">
                                {this.props.playlists && this.props.playlists.length > 0 && (
                                    this.props.playlists.map(playlist => {
                                        return <label key={playlist.id} class="playlists__item">{playlist.title}
                                            <input type="checkbox" />
                                            <span class="checkmark"></span>
                                        </label>
                                    })
                                )}
                            </ul>
                            <input className="playlists__input" onKeyPress={this.handleKeyPress} placeholder="New playlist..." />
                        </nav>
                    </section>
                </div>
            </footer>
        </section>
    }
}

export default Player

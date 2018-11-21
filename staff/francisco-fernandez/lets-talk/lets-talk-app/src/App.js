import React, { Component } from 'react';
import logo from './logo.svg';
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import Candidates from './components/Candidates'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = 'http://localhost:5000/api'

class App extends Component {

  state = { error: null }

  handleGoRegister = () => {

    return this.props.history.push('/register')
  }

  handleGoLanding = () => {

    return this.props.history.push('/')
  }

  handleGoLogin = () => {

    return this.props.history.push('/login')
  }

  handleRegister = (name, surname, username, password, sex, age, city, presentation, minAge, maxAge) => {

    try {
      logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAge, maxAge)
        .then(() => {
          this.setState({ error: null }, () => this.props.history.push('/login'))
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }

  }

  handleLogin = (username, password) => {

    try {
      logic.login(username, password)
        .then(() => {
          this.setState({ error: null }, () => this.props.history.push('/candidates'))
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }

  }

  handleLogout = () => {
    logic.logout()

    this.props.history.push('/')
}

handleProfile = () =>{
  this.props.history.push('/profile')

}



  render() {
    return <div>
      {logic.loggedIn && <Route path="/" render={() => <LandingNavbar onGoRegisterClick={this.handleGoRegister} onGoLandingClick={this.handleGoLanding} onGoLoginClick={this.handleGoLogin} />} />}
      {!logic.loggedIn && <Route path="/" render={() => <Navbar onLogoutClick={this.handleLogout} onGoProfileClick={this.handleProfile}  />} />}
      <Route exact path="/" render={() => logic.loggedIn ? <Landing /> : <Redirect to="/candidates" />} />
      <Route path="/register" render={() => logic.loggedIn ? <Register onRegister={this.handleRegister} />: <Redirect to="/candidates" />} />
      <Route path="/login" render={() => logic.loggedIn ? <Login onLogin={this.handleLogin} />: <Redirect to="/candidates" />} />
      <Route path="/candidates" render={() => <Candidates />} />
      <Route path="/profile" render={() => <Profile />} />
      <Route path="/" render={() => <Footer />} />
    </div>

  }
}

export default withRouter(App)

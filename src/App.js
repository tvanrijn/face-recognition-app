import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition'
import Rank from './components/rank/Rank';
import SignIn from './components/signIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  error: '', 
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '', 
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name, 
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({ isSignedIn: true})
    }
    else {
      this.setState(initialState)
    }

    this.setState({ route: route })
  }

  calculateFaceLocation = (data) => {
    const result = [];

    for(const region of data.outputs[0].data.regions)
    {
      result.push({
        leftCol: region.region_info.bounding_box.left_col * 100,
        rightCol: 100 - (region.region_info.bounding_box.right_col * 100),
        topRow: region.region_info.bounding_box.top_row * 100,
        bottomRow: 100 - (region.region_info.bounding_box.bottom_row * 100)
      })
    }

    return result;
  }

  displayFaceBox = (box) => {
    this.setState({ box: box});
  }

  onInputChange = (event) => {
    this.setState({ 
        input: event.target.value, 
        error: '', 
        imageUrl: '', 
        box: [] 
    });
  }

  onSubmit = () => {
    if (this.state.input === '')
    {
      return;
    }

    this.setState({ imageUrl: this.state.input });

    fetch('https://gentle-beach-71242.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imageUrl: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response !== 'Error while processing image.') {
        fetch('https://gentle-beach-71242.herokuapp.com/imagecount', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
            if (
              count !== 'No such user.' && 
              count !== 'Error while updating user entries.'            
            )
            {
              this.setState(Object.assign(
                this.state.user, { entries: count }
              ))
            }
        })
        .catch(err => {
          this.setState(
            { error: err},
            () => console.log(err)
          )
        })
      
        this.displayFaceBox(this.calculateFaceLocation(response))
      }
      else {
        this.setState({ error: response})
      }
    })
    .catch(console.log)
  }

  render() {
    const { isSignedIn, route, box, imageUrl, error, user } = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={particlesOptions}
        />
        <Navigation 
          onRouteChange={this.onRouteChange} 
          isSignedIn={isSignedIn}
        />
        { 
          route === 'signIn' 
          ? <SignIn 
              onRouteChange={this.onRouteChange} 
              loadUser={this.loadUser}
            />
          : route === 'register'
          ? <Register 
              onRouteChange={this.onRouteChange} 
              loadUser={this.loadUser}
            />
          :
          <div> 
              <Logo />
              <Rank 
                name={user.name}
                entries={user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onSubmit={this.onSubmit}
              />
              <FaceRecognition 
                box={box} 
                imageUrl={imageUrl}
                error={error}
              />
            </div>
        }
      </div>
    );
  }
}

export default App;

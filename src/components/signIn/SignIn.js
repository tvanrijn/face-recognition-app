import React, { Component } from 'react';

class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            signInEmail: '',
            signInPassword: '',
            error: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({
            signInEmail: event.target.value,
            error: ''
        })
    }

    onPasswordChange = (event) => {
        this.setState({
            signInPassword: event.target.value,
            error: ''
        })
    }

    onSubmitSignIn = () => {
        if(this.state.signInEmail === '')
        {
            this.setState({ error: 'Email is required.'});
            return;
        }

        if(this.state.signInPassword === '')
        {
            this.setState({ error: 'Password is required.'});
            return;
        }

        fetch('https://gentle-beach-71242.herokuapp.com/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(user => {
            if (user.email && user.email === this.state.signInEmail)
            {
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
            else 
            {
                this.setState({ error: 'Invalid credentials.'});
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={this.onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={this.onPasswordChange}/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input 
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value="Sign in"
                            onClick={this.onSubmitSignIn}
                        />
                        <div className='red f5 mt3'>
                            {this.state.error}
                        </div>
                    </div>
                    <div className="lh-copy mt3">
                        <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
                </main>
            </article>
        );
    }
}

export default SignIn;
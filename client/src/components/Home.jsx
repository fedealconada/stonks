import React, { useEffect, useState } from 'react';
import { StreamerPage } from './StreamerPage';
import CONFIG from '../config/config';
import { Button, Collapse, Container, Jumbotron, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
import { login } from '../config/helpers';

const Home = () => {

  const [user, setUser] = useState({});
  const [error, setError] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamer, setStreamer] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        let response = await login()
        if (response?.data?.user) {
          setAuthenticated(true);
          setUser(response.data.user);
        } else {
          setError('Failed to authenticate user');
        }
        setLoading(false);
      } catch (e) {
        setAuthenticated(false);
        setError('Failed to authenticate user');
        setLoading(false);
      }
    };
    if (!loading) {
      getData();
    }
  }, [user]);

  const _handleLogin = () => {
    window.open(`${CONFIG.API_HOST}/auth/twitch`, '_self');
  };

  const _handleLogout = () => {
    window.open(`${CONFIG.API_HOST}/auth/logout`, '_self');
    setAuthenticated(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <div>
        {!authenticated ? (
          <Jumbotron fluid>
            <Container fluid className='text-center'>
              <h1 className="display-3">Hi, log in to start!</h1>
              <p className="lead">You will be redirected to Twitch authorisation page.</p>
              <Button onClick={_handleLogin}>Log in!</Button>
            </Container>
          </Jumbotron>
        ) : (
          <div>
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/">Stankos</NavbarBrand>
              <NavbarToggler onClick={toggle}/>
              <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  {authenticated ? (
                    <>
                      <NavItem>Welcome, {user.display_name}!&nbsp;</NavItem>
                      <NavItem onClick={_handleLogout}>
                        <Button>Logout</Button>
                      </NavItem>
                    </>
                  ) : (
                    <NavItem onClick={_handleLogin}>
                      <Button>Login</Button>
                    </NavItem>
                  )}
                </Nav>
              </Collapse>
            </Navbar>
            <Jumbotron fluid>
              <StreamerPage user={user} streamer={streamer} setStreamer={setStreamer}/>
            </Jumbotron>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
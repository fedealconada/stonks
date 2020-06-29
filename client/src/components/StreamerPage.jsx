import React, { useState } from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { Button, Col, Container, InputGroup, InputGroupAddon, Row } from 'reactstrap';
import { Events } from './Events';
import { getStreamer } from '../config/helpers';

export const StreamerPage = ({ streamer, setStreamer }) => {
  const [error, setError] = useState(null)
  const valueRef = React.useRef();

  const initTwitch = async username => {
    try {
      let response = await getStreamer(username);
      if (response?.data?.data) {
        setError(null)
        setStreamer(response?.data?.data || {});
      } else {
        setStreamer(null)
        setError('No streamer found')
      }
    } catch (e) {
      setStreamer(null)
      setError('No streamer found')
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <InputGroup>
            <input placeholder="Streamer username..." ref={valueRef}/>
            <InputGroupAddon addonType="append">
              <Button onClick={() => initTwitch(valueRef.current.value)} color="secondary">Search</Button>
            </InputGroupAddon>
          </InputGroup>
          { error && (
            <h5>{error}</h5>
          )}
        </Col>
      </Row>
      {streamer && (
        <>
          <Row className='mt-3'>
            <Col>
              <ReactTwitchEmbedVideo channel={streamer.display_name} width={'100%'} height={'700'}/>
            </Col>
            <Col>
              <h4>Last Events</h4>
              <Events streamer={streamer} />
            </Col>
          </Row>
        </>
      )
      }
    </Container>
  );
};
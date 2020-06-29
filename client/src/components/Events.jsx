import React, { useEffect, useReducer, useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import CONFIG from '../config/config';
import io from 'socket.io-client';
import { subscribeEvent } from '../config/helpers';

export const Events = ({ streamer }) => {
  const [socket, setSocket] = useState(null)
  const [events, setEvents] = useReducer((events, event) => {
    if (events.length === 10) {
      events.shift();
    }
    return [...events, event];
  }, []);

  useEffect(() => {
    if (streamer) {
      disconnect();
      subscribe();
      connect();
    }
  }, [streamer]);

  const subscribe = async () => {
    await subscribeEvent(streamer.id);
  };

  const connect = () => {
    const socket = io(CONFIG.API_HOST);
    socket.on(streamer.id, (event) => {
      setEvents(event);
    });
    setSocket(socket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  if (streamer) {
    return (
      <ListGroup>
        {events && events.map((event, i) => {
          return (
            <ListGroupItem key={i}>
              {!event.title ? (
                `${event.from_name} has started following ${event.to_name}`
              ) : (`The current stream has changed its info...`)
              }
            </ListGroupItem>
          );
        })
        }
      </ListGroup>
    );
  }
};
import React, { useState, useRef, useEffect } from 'react'

import './NotFoundMessage.scss';


function NotFoundMessage() {
  const notFoundMsgElement = useRef(null);

  const [notFoundMsgPosition, setNotFoundMsgPosition] = useState({
    x: null,
    y: null,
    velocity: {
      x: 5,
      y: 5
    }
  });
  useEffect(() => {
    if (notFoundMsgPosition.x !== null && notFoundMsgPosition.y !== null) {
      notFoundMsgElement.current.style.bottom = `${notFoundMsgPosition.y}px`;
      notFoundMsgElement.current.style.left = `${notFoundMsgPosition.x}px`;
    }
  }, [notFoundMsgPosition.x, notFoundMsgPosition.y]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const {height, width, bottom, left} = notFoundMsgElement.current.getBoundingClientRect();

    setNotFoundMsgPosition((prevPosition) => ({...prevPosition, x: left, y: window.innerHeight - bottom}));
    notFoundMsgElement.current.style.position = 'absolute';

    setInterval(function animateNotFoundMsg() {
      const leftBound = 0;
      const rightBound = window.innerWidth - width;
      const topBound = window.innerHeight - document.getElementById('header').getBoundingClientRect().height - height;
      const bottomBound = document.getElementById('footer').getBoundingClientRect().height;

      setNotFoundMsgPosition(function calculateNewPosition(prevPosition) {
        const newVelocity = prevPosition.velocity;
        const newPosition = {
          x: prevPosition.x + newVelocity.x,
          y: prevPosition.y + newVelocity.y
        };

        if (newPosition.x <= leftBound) {
          newVelocity.x = Math.abs(newVelocity.x);
        }
        if (newPosition.x >= rightBound) {
          newVelocity.x = -1 * Math.abs(newVelocity.x);
        }
        if (newPosition.y <= bottomBound) {
          newVelocity.y = Math.abs(newVelocity.y);
        }
        if (newPosition.y >= topBound) {
          newVelocity.y = -1 * Math.abs(newVelocity.y);
        }

        return {
          ...prevPosition,
          x: prevPosition.x + newVelocity.x,
          y: prevPosition.y + newVelocity.y
        };
      });
    }, 50);
  }, []);

  return (
    <div ref={notFoundMsgElement} id='not-found-message'>
      <h1>404 NOT FOUND</h1>

      <p style={{marginBottom: 0}}>Oops, this page doesn&#39;t exist.</p>
    </div>
  );
}

export default NotFoundMessage;

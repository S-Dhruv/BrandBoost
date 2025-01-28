import React from 'react';

const WaveAnimation = () => {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100px' }}
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="moving-waves">
          <use
            href="#wave"
            x="48"
            y="0"
            fill="rgba(34, 106, 220, 0.8)"
            style={{
              animation: 'moveForever 15s cubic-bezier(.55,.5,.45,.5) infinite',
              animationDelay: '-2s',
            }}
          />
          <use
            href="#wave"
            x="48"
            y="3"
            fill="rgba(30, 93, 195, 0.8)"
            style={{
              animation: 'moveForever 15s cubic-bezier(.55,.5,.45,.5) infinite',
              animationDelay: '-3s',
              animationDuration: '7s',
            }}
          />
          <use
            href="#wave"
            x="48"
            y="5"
            fill="rgba(64, 131, 239, 0.8)"
            style={{
              animation: 'moveForever 15s cubic-bezier(.55,.5,.45,.5) infinite',
              animationDelay: '-4s',
              animationDuration: '10s',
            }}
          />
          <use
            href="#wave"
            x="48"
            y="7"
            fill="rgba(93, 155, 255, 0.8)"
            style={{
              animation: 'moveForever 15s cubic-bezier(.55,.5,.45,.5) infinite',
              animationDelay: '-5s',
              animationDuration: '13s',
            }}
          />
        </g>
      </svg>

      <style>
        {`
          @keyframes moveForever {
            0% { transform: translate3d(-90px,0,0); }
            100% { transform: translate3d(85px,0,0); }
          }
        `}
      </style>
    </div>
  );
};

export default WaveAnimation;

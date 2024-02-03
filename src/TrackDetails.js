import React, { useState } from 'react';
import Draggable from 'react-draggable';

const TrackDetails = ({ track, isQueue }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    setPosition({ x: ui.x, y: 0 }); // Only update the x-coordinate
  };

  const handleStop = () => {
    // Get the container width
    const containerWidth = document.querySelector('.items-container').offsetWidth;
    // Calculate the position percentage
    const positionPercentage = (position.x / containerWidth) * 100;

    // Check if the item is dragged too much to the left or right
    // Here you can define your threshold and set the position back to center if needed
    if (positionPercentage < -50) {
      console.log("remove")
    } else if (positionPercentage > 50) {
      console.log("up")
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const convertMsToTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Draggable disabled = {!isQueue}
      axis="x" // Restrict dragging to horizontal axis
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div className="item">
        <img src={track.album.images[0].url} alt="Music" className="item-image" />
        <div className="item-info">
          <h3 className="music-name">{track.name}</h3>
          <p className="artist-name">{track.artists[0].name}</p>
        </div>
        <p className="length">{convertMsToTime(track.duration_ms)}</p>
      </div>
    </Draggable>
  );
};

export default TrackDetails;

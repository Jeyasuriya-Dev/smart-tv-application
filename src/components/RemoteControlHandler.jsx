import { useEffect } from 'react';

const RemoteControlHandler = ({ onKey }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (onKey) onKey(event.keyCode); // Forward keyCode to parent if needed

      switch (event.keyCode) {
        case 13: // OK
          console.log("OK pressed");
          break;
        case 37: // LEFT
          console.log("LEFT pressed");
          break;
        case 38: // UP
          console.log("UP pressed");
          break;
        case 39: // RIGHT
          console.log("RIGHT pressed");
          break;
        case 40: // DOWN
          console.log("DOWN pressed");
          break;
        case 461: // BACK
          console.log("BACK pressed");
          window.history.back(); // Or custom logic
          break;
        default:
          console.log("Other key pressed: ", event.keyCode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey]);

  return null;
};

export default RemoteControlHandler;

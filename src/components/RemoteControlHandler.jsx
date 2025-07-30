import { useEffect } from 'react';

const RemoteControlHandler = ({ onKey }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isInputFocused =
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

      // Only prevent default for remote control-style navigation keys
      const remoteKeys = [13, 37, 38, 39, 40, 461];

      if (remoteKeys.includes(event.keyCode) && !isInputFocused) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (onKey) onKey(event.keyCode);

      switch (event.keyCode) {
        case 13: // OK/Enter
          const input = document.getElementById('unique-number');
          if (input && document.activeElement !== input) {
            input.focus();
			console.log("ENTER pressed");
			
          }
          break;
        case 37:
          console.log("LEFT pressed");
          break;
        case 38:
          console.log("UP pressed");
          break;
        case 39:
          console.log("RIGHT pressed");
          break;
        case 40:
          console.log("DOWN pressed");
          break;
        case 36: // BACK
          console.log("BACK pressed");
          window.history.back();
          break;
        default:
          console.log("Other key pressed:", event.keyCode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey]);

  return null;
};

export default RemoteControlHandler;

import { useEffect, useRef } from 'react';

const RemoteControlHandler = ({ onKey }) => {
	const lastEnterPressTime = useRef(0);

	useEffect(() => {
		const handleKeyDown = (event) => {
			const isInputFocused =
				document.activeElement &&
				(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

			const remoteKeys = [13, 37, 38, 39, 40, 461];

			if (remoteKeys.includes(event.keyCode) && !isInputFocused) {
				event.preventDefault();
				event.stopPropagation();
			}

			if (onKey) onKey(event.keyCode);

			switch (event.keyCode) {
				case 13: {
					const now = Date.now();
					const delta = now - lastEnterPressTime.current;

					lastEnterPressTime.current = now;

					// If double press within 500ms
					if (delta < 500) {
						console.log("DOUBLE ENTER pressed, submitting form");

						const submitBtn = document.getElementById('submit-button');
						if (submitBtn) submitBtn.click();
					} else {
						console.log("SINGLE ENTER pressed");

						// Focus input if not focused
						const input = document.getElementById('unique-number');
						if (input && document.activeElement !== input) {
							input.focus();
						}
					}
					break;
				}
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
				case 36: // HOME
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

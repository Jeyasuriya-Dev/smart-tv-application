// src/API-Handling/useOnlineStatusCheck.jsx
// Needs AndroidID and Clientname

import axios from 'axios';

const CHECK_URL = 'http://192.168.70.100:8585/iqworld/api/v1/device/checkonline';

const checkDeviceOnline = async () => {
	try {
		const res = await axios.get(CHECK_URL, {
			params: {
				adrid: 'ABCDEFGHIJ',
				clientname: 'dfgdf'
			}
		});

		// Return true only if 200 OK
		return res.status === 200;
	} catch (err) {
		console.warn('Device is offline or API unreachable.');
		return false;
	}
};

export default checkDeviceOnline;

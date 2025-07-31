// src/API-Handling/useOnlineStatusCheck.jsx
// Needs AndroidID and Clientname

import axios from 'axios';

const CHECK_URL = 'https://ds.iqtv.in:8080/iqworld/api/v1/device/checkonline';

const checkDeviceOnline = async () => {
	try {
		const res = await axios.get(CHECK_URL, {
			params: {
				adrid: '0461dbdd0ce43fd2',
				clientname: 'ridsysc'
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

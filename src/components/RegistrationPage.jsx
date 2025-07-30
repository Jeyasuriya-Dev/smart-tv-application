import React, { useEffect, useState } from 'react';
import '../app.css';
import Qrcode from './Qrcode';
import userAndroidIDStore from '../store/userAndroididStore';
import userDeviceStore from '../store/userDeviceStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function RegistrationPage() {
	const [uniqueNumber, setUniqueNumber] = useState('');
	const [qrValue, setQrvalue] = useState(true);
	const deviceid = 'de568fcc560faa62'
	//   This value for to show the new Registration page
	const [value, setValue] = useState(`http://192.168.70.100:8585/#/iqworld/digitalsignage/device/registrationform/${deviceid}`)
	const [deviceId, setDeviceId] = useState('');

	const { setAndroidId } = userAndroidIDStore();

	const [regSuccess, setRegSuccess] = useState(false)


	useEffect(() => {
		const url = window.location.href;
		const match = url.match(/registrationform\/([^/]+)/);
		if (match && match[1]) {
			const androidIdFromURL = match[1];
			setAndroidId(androidIdFromURL);
		}
	}, []);

	const androidID = userAndroidIDStore(state => state.androidID);

	const handleQrcodevalue = (e) => {
		setValue(e.target.value)
	}

	const handleQrcodechange = (e) => {
		e.preventDefault();
		setQrvalue(true);
	}

	const handleChange = (e) => {
		setUniqueNumber(e.target.value)
	}

	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault();
		const deviceDetails = userDeviceStore.getState().deviceDetails;
		const { setIsRegistered } = userDeviceStore.getState();

		if (deviceDetails && uniqueNumber === deviceDetails.username) {
			toast.success("Registration successful");
			setIsRegistered(true); // Set global registration flag
			navigate('/');          // Redirect to streaming page
		} else {
			toast.error(" Invalid username");
		}
	};




	useEffect(() => {
		if (window.webOS && window.webOS.deviceInfo) {
			window.webOS.deviceInfo((info) => {
				console.log("webOS Emulator DUID:", info.duid);
			});
		} else {
			setDeviceId('webOS API not available');
		}
	}, []);



	return (
		<div>
			<div className="container">
				<div className='contents-container'>
					<img src="./applogo.jpeg" alt="IQ World Logo" className="logo" />
					<p className="tagline">INDIA KA IQ</p>
					<div className='head'>
						<h2>New Device Registration</h2>
					</div>
					{
						qrValue ? <Qrcode value={value} /> : null

						// If need  QR code Generator in page


						// <div className='qr-container'>
						//     <h1>QR Code Generator</h1>
						//     <input type="text" className='generator-ip' placeholder='Enter Value ' onChange={handleQrcodevalue} value={value}/>
						//     <button onClick={handleQrcodechange} className='submit-btn'>Generate QR</button>
						// </div>
					}

					<div className="form-group">
						<label htmlFor="unique-number">Unique Number</label>
						<input type="text" id="unique-number" onChange={handleChange} />
					</div>
					<div className='button-container'>
						<button className="submit-btn" onClick={handleSubmit}>Submit</button>
						<p>{deviceId}</p>
					</div>
				</div>
				<div className='version-container'>
					<p className="version">de568fcc560fca62 <br /> V-1.0</p>
				</div>

			</div>


		</div>
	);
}
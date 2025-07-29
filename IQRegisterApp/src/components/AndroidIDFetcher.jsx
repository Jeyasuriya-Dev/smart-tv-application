import React, { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

const AndroidIDFetcher = () => {
  useEffect(() => {
    const fetchAndRedirect = async () => {
      const androidId = await DeviceInfo.getAndroidId();
      const redirectUrl = `https://ds.iqtv.in/#/iqworld/digitalsignage/device/registrationform/${androidId}`;
      // Redirect to React JS registration page
      window.location.href = redirectUrl;
    };

    fetchAndRedirect();
  }, []);

  return null; // No UI needed
};

export default AndroidIDFetcher;

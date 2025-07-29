import React, { useEffect } from 'react';
import axios from 'axios';

const DeviceStatusPoller = () => {
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          'http://192.168.70.100:8585/iqworld/api/v1/device/checkonline',
          {
            params: {
              adrid: '0461dbdd0ce43fd2',
              clientname: 'ridsysc',
            },
            timeout: 2000, // Optional: fail fast if unreachable
          }
        );

        if (response.status === 200 ) {
          console.log('✅ Device is ONLINE');
        } else {
          console.log('❌ Device is OFFLINE');
        }
      } catch (err) {
        console.log('❌ Device is OFFLINE or API Error');
      }
    }, 1000); // 1000 ms = 1 second

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return null; // No UI needed
};

export default DeviceStatusPoller;

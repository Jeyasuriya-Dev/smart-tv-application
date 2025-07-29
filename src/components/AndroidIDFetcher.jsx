// src/components/AndroidIDFetcher.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import userAndroididStore from '../store/userAndroididStore';

const   AndroidIDFetcher = () => {
  const location = useLocation();
  const setAndroidId = userAndroididStore((state) => state.setAndroidId);

  useEffect(() => {
    // Extract the Android ID from the URL path
    const pathSegments = location.pathname.split('/');
    const androidId = pathSegments[pathSegments.length - 1];

    if (androidId) {
      setAndroidId(androidId);
      console.log('Android ID set to store:', androidId);
    }
  }, [location.pathname, setAndroidId]);

  return null; // This component does not render anything
};

export default AndroidIDFetcher;

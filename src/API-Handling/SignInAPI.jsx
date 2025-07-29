import { useEffect, useState } from 'react';

const SignInAPI = () => {

  const [username,setUserName] = useState('');
  const [password,setPassword] = useState('');
  

  const BASE_URL = 'https://ds.iqtv.in:8080/iqworld';
  const TEST_URL = 'http://192.168.0.43:8585';

  useEffect(() => {
    const login = async () => {
      try {
        console.log
        const response = await fetch(`${TEST_URL}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'admin',   // Replace with actual username for testing : admin  
            password: 'admin@123'    // Replace with actual password : admin@123
          }),
        });

        const data = await response.json();
        console.log('=== Sign In API Response ===');
        console.log(JSON.stringify(data, null, 2));
        
      } catch (err) {
        console.error('Sign In API Error:', err);
      }
    };

    login();
  }, []);

  return null; // This component doesn't render UI, only calls the API
};

export default SignInAPI;

// src/API-Handling/useServerPoll.jsx


import { useEffect, useState } from 'react';
import axios from 'axios';

const useServerPoll = (shouldPoll,onServerResponse,url) => {
  // const LIVE_URL = import.meta.env.VITE_SERVER_LIVE_URL;//This is Live URL 
  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

    // calling api while video end  for every Second
  useEffect(() => {
    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      axios.get(`${BASE_URL}/api/server/getserverdetails`)
        .then(response => {
          // console.log('Polled API:', response.data);
          
          // console.log(applicationURL)
            // Pass response back to the caller
          if (onServerResponse) {
            onServerResponse(response.data);
          }
          })
        .catch(error => {
          console.error('Polling Error:', error);
          if (onServerResponse) {
            onServerResponse(null, error); // Forward error as second param
          }     
        });
    }, 1000); // Poll every second

    return () => clearInterval(intervalId);
  }, [shouldPoll, onServerResponse]);
};

export default useServerPoll;

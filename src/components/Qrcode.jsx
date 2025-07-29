import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function Qrcode(props){
    

    return (
        <div>
            <div className="qr-container">

                {/* QR code Generator Value */}
                <QRCode value={props.value}/>

                <p>Scan Qr code</p>
          </div>
        </div>
    );
};


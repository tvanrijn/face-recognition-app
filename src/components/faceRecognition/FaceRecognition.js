import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ box, imageUrl, error }) => {
    
    const faceBoxes = box.map((item, i) =>
        <div key={i} className='bounding-box' style={{
            top: item.topRow+'%', 
            right: item.rightCol+'%',
            bottom: item.bottomRow+'%', 
            left: item.leftCol+'%'
        }}></div>
    );

    return (
        <div className='center'>
            <div className='absolute mt2'>
                <img src={imageUrl} alt='' width='500px' height='auto'/>
                {faceBoxes}
                <div className='red f3'>
                    {error}
                </div>
            </div>
        </div>
    );
}

export default FaceRecognition;
import React from 'react';

const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className='blue f3'>
                {`${name}, your current number of entries is ...`}
            </div>
            <div className='blue f1'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;
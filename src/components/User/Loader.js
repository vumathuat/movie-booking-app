import React from 'react';
import fade from '../../assets/img/web-logo.png';
export default function Loader() {
    return (
        <div className='logo-loading'>
            <img className='animated tada' src={fade} alt='Loading'/>
        </div>
    );
}

import React, { useRef, useEffect } from 'react';
import data from '../../services/fixures/provinces.json';

const Dropdown = ({ setIsOpen, setLocation }) => {
    const handleProvinceSelection = (name) => {
        setLocation(name);
        setIsOpen(false);
    };

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }

            // Bind the event listener
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <ul
            className='navbar__right-location-dropdown'
            id='custom-scrollbar'
            ref={wrapperRef}
        >
            {data.map((province) => (
                <li
                    key={province.id}
                    className='navbar__right-location-dropdown-list'
                    onClick={handleProvinceSelection.bind(this, province.name)}
                >
                    {province.name}
                </li>
            ))}
        </ul>
    );
};

export default Dropdown;

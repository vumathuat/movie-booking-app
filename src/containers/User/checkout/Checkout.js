import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import CheckoutStep1 from './CheckoutStep1';
import CheckoutStep2 from './CheckoutStep2';
import CheckoutStep3 from './CheckoutStep3';
import Loader from '../../../components/User/Loader';

export default function Checkout(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [chosenMovie, setchosenMovie] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [step, setStep] = useState(1);
    const [numOfSeats, setNumOfSeats] = useState({});
    console.log(props.history)

    const nextStep = (step, numOfSeats) => {
        setNumOfSeats(numOfSeats);
        setStep(step);
    };

    const backStep = () => {
        setStep(1);
    };

    let screening = window.localStorage.getItem('SCREENING');
    const renderSchedule = () => {
        return schedule
        .filter(
            (item) =>
                item.screening_id == screening
        ).map((item, index) => {
            return (
                <p className='cinema__time'
                key={index}>
                    Watch date: {item.time_start_d} 
                    <br></br>
                    Showtime: {item.time_start_t} 
                </p>
              );
        });
    }
    
    const id = props.match.params.id;
    useEffect(() => {
        const fetchMovieDetails = async () => {
            const id = props.match.params.id;
            try {
                const response = await Axios.get(`http://localhost:5000/films?id=${id}`);
                setchosenMovie(response.data[0]);
                setIsLoading(false);
                const result = await Axios.get(`http://localhost:5000/schedule?id=${id}`);
                setSchedule(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMovieDetails();
    }, [props.match.params.id]);

    const renderStepPage = () => {
        switch (step) {
            case 1:
                return (
                    <CheckoutStep1
                        id={id}
                        history={props.history}
                        prePage={props.history.location.prePage}
                        chosenMovie={chosenMovie}
                        schedule={schedule}
                        nextStep={nextStep}
                        renderSchedule={renderSchedule}
                        
                    />
                );
            case 2:
                return (
                    <CheckoutStep2
                        prePage={props.history.location.prePage}
                        history={props.history}
                        backStep={backStep}
                        chosenMovie={chosenMovie}
                        numOfSeats={numOfSeats}
                        schedule={schedule}
                        renderSchedule={renderSchedule}
                    />
                );
            case 3:
                return <CheckoutStep3 />;
            default:
                break;
        }
    };
    return (
        <div className='checkout'>
            <div className='step-checkout'>
                <div className='step-checkout__left'>
                    <ul>
                        {step === 1 ? (
                            <li className={`${step}` === '1' ? 'active' : ''}>
                                <span className='mr-1'>01</span>PICK SEAT TYPES
                            </li>
                        ) : (
                            <li
                                onClick={backStep}
                                style={{ cursor: 'pointer' }}
                                className={`${step}` === '1' ? 'active' : ''}
                            >
                                <span className='mr-1'>01</span>PICK SEAT TYPES
                            </li>
                        )}
                        <li className={`${step}` === '2' ? 'active' : ''}>
                            <span className='mr-1'>02</span>PICK SEATS & CHECKOUT
                        </li>
                        <li className={`${step}` === '3' ? 'active' : ''}>
                            <span className='mr-1'>03</span>BOOKING RESULT
                        </li>
                    </ul>
                </div>
            </div>
            <div
                className='blank d-none d-md-block'
                style={{ height: '80px' }}
            ></div>
            {isLoading ? <Loader /> : renderStepPage()}
        </div>
    );
}

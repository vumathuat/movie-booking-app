import React, { useState } from 'react';
import cancel from '../../../assets/img/cancel-arrow.png';
import back from '../../../assets/img/back.png';
export default function CheckoutStep1(props) {
    const typeSeat = [
        props.chosenMovie.seat_price, props.chosenMovie.VIP_price,
    ];

    const initialSeat = [];

    typeSeat.forEach(function (element, index) {
        if (element === 80000) {
            initialSeat.push({
                type: " Normal",
                num: 2,
                price: 80000,
            });
        } else {
            initialSeat.push({
                type: " VIP",
                num: 0,
                price: 100000,
            });
        }
    });

    const [numOfSeats, setNumOfSeats] = useState(initialSeat);

    let totalCost = numOfSeats.reduce(
        (totalCost, seat) => totalCost + seat.price * seat.num,
        0
    );

    const returnDetailMoviePage = () => {
        if (props.history.location.prePage) {
            props.history.push(props.history.location.prePage);
        } else {
            props.history.push('/');
        }
    };

    const changeNumTicket = (key, plus) => {
        let tempNumOfSeats = [...numOfSeats];
        if (
            (plus && tempNumOfSeats[key].num > 9) ||
            (!plus && tempNumOfSeats[key].num === 0)
        ) {
            return;
        }
        plus ? tempNumOfSeats[key].num++ : tempNumOfSeats[key].num--;
        setNumOfSeats(tempNumOfSeats);
    };

    const renderTicket = () => {
        let ticketArray = [];
        for (const key in numOfSeats) {
            ticketArray.push(
                <div key={key} className='ticket row m-0 align-items-center'>
                    <div className='ticket__type col-7 col-md-4 p-0'>
                        <span>
                            Ticket 
                            {numOfSeats[key].type === 'Normal'
                                ? 'Normal'
                                : numOfSeats[key].type}
                        </span>
                        <span className='ticket__price--mobile d-block d-md-none'>{`${numOfSeats[
                            key
                        ].price.toLocaleString()} đ`}</span>
                    </div>
                    <div className='ticket__price col-md-4 p-0 text-center'>
                        <span>{`${numOfSeats[
                            key
                        ].price.toLocaleString()} đ`}</span>
                    </div>
                    <div className='ticket__num col-md-4 col-5 p-0'>
                        <button onClick={() => changeNumTicket(key, false)}>
                            -
                        </button>
                        <span>{numOfSeats[key].num}</span>
                        <button onClick={() => changeNumTicket(key, true)}>
                            +
                        </button>
                    </div>
                </div>
            );
        }
        return ticketArray;
    };

    return (
        <>
            <div className='step-checkout--mobile'>
                <div onClick={returnDetailMoviePage} className='backMobile'>
                    <img
                        className='img-fluid'
                        src={cancel}
                        alt='cancel-arrow'
                    />
                </div>
                <div className='step-name'>01. PICK YOUR TICKET CLASS</div>
                <div></div>
            </div>
            <div
                className='checkout__top--mobile'
                style={{
                    background: `url(${props.chosenMovie.poster}) no-repeat center`,
                    backgroundSize: 'cover',
                }}
            >
                <div className='checkout__top__overlay'>
                    <div className='detail-movie__info'>
                        <p className='ten-phim'>
                            <span className='age-type'>C13</span>
                            {props.chosenMovie.title}
                        </p>
                        <p className='time'>{props.chosenMovie.duration} minutes - {props.chosenMovie.rating} IMDb - 2D/Digital</p>
                    </div>
                </div>
            </div>
            <div className='checkout-content-1 row m-0 p-0'>
                <div
                    className='checkout__left col-3 p-0'
                    style={{
                        background: `url(${props.chosenMovie.poster}) no-repeat center`,
                        backgroundSize: 'cover',
                    }}
                >
                    <div className='checkout__left__overlay'>
                        <div className='back' onClick={returnDetailMoviePage}>
                            <img src={back} alt='back-arrow' />
                        </div>
                        <div className='detail-movie__info'>
                            <p className='ten-phim'>
                                <span className='age-type'>C13</span>
                                {props.chosenMovie.title}
                            </p>
                            <p className='ngay-chieu'>
                                Director: {props.chosenMovie.director}
                            </p>
                            <p className='time'>
                                {props.chosenMovie.duration} minutes - {props.chosenMovie.rating} IMDb - 2D/Digital
                            </p>
                        </div>
                    </div>
                </div>
                <div className='checkout__right col-12 col-md-9'>
                    <div className='cinema'>
                        <div className='cinema__logo'></div>
                        <div className='cinema__info'>
                            {props.renderSchedule()}
                        </div>
                    </div>
                    <div className='tickets'>{renderTicket()}</div>
                    <div className='chosen-ticket d-flex justify-content-between align-items-center'>
                        <div className='total-cost'>
                            <p>MONEY SUM</p>
                            <p>{totalCost.toLocaleString()} đ</p>
                        </div>
                        {numOfSeats.reduce(
                            (countSeat, seat) => countSeat + seat.num,
                            0
                        ) ? (
                            <div
                                onClick={() => props.nextStep(2, numOfSeats)}
                                className='chosen-button'
                            >
                                PICK SEATS
                            </div>
                        ) : (
                            <div
                                className='chosen-button'
                                style={{
                                    backgroundColor: '#afafaf',
                                    cursor: 'auto',
                                    backgroundImage: 'none',
                                }}
                            >
                                PICK SEATS
                            </div>
                        )}
                    </div>
                    <div className='contact'>
                        <p>
                        Please note that you cannot cancel or change the showtime for purchased tickets.
                        </p>
                        <div className='hotline'>
                            <div>
                                <span className='hotline__title'>HOTLINE</span>
                                <span className='hotline__cost'>
                                    Cost for each hotline call 1000VND/min
                                </span>
                            </div>
                            <div>
                                <span className='hotline__phone'>
                                    &nbsp; 1900 545 436
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

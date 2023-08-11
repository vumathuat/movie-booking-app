import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import notify from "../../../assets/img/notification.png";
import screen from "../../../assets/img/screen.png";

export default function CheckoutStep2(props) {
  let user = JSON.parse(localStorage.getItem("User"));
  let screening = window.localStorage.getItem("SCREENING");
  const [modalShow, setModalShow] = useState(false);
  const [blankSeat, setBlankSeat] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [seat, setSeat] = useState([]);
  const [seatres, setSeatRes] = useState([]);

  const [blankSeatNoti, setBlankSeatNoti] = useState(
    "You cannot leave a seat empty at the beginning of each row."
  );
  const [step, setStep] = useState(1);

  const [ticket, setTicket] = useState({
    screening_id: screening,
    seat_id: [],
  });

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const backStep = () => {
    if (step === 2) {
      setStep(1);
    }
    if (step === 1) {
      props.backStep();
    }
  };

  const seatTypeCheck = (seat) => {
    if (seat.vip === 0) {
      return " Normal";
    } else {
      return " VIP";
    }
  };

  let chooseSeatDone =
    props.numOfSeats.reduce((a, b) => a.num + b.num) === ticket.seat_id.length;

  if (chooseSeatDone && !modalShow && !blankSeat) {
    let tempBlankSeat = blankSeat;
    ticket.seat_id.forEach((seat) => {
      let seatTag = document.getElementById(seat.seat_id);
      if (seatTag.nextSibling && seatTag.nextSibling.nextSibling) {
        let outmostChosenSeat = seatTag;
        while (
          outmostChosenSeat.previousSibling.classList.contains("choosing")
        ) {
          outmostChosenSeat = outmostChosenSeat.previousSibling;
        }

        if (
          !outmostChosenSeat.previousSibling.classList.contains("base") &&
          seatTag.nextSibling.nextSibling.classList.contains("base") &&
          !seatTag.nextSibling.classList.contains("choosing") &&
          !seatTag.nextSibling.classList.contains("base")
        ) {
          tempBlankSeat = true;
          setBlankSeatNoti(
            "You cannot leave a seat empty at the beginning of each row."
          );
        }
      }
      if (seatTag.previousSibling && seatTag.previousSibling.previousSibling) {
        let outmostChosenSeat = seatTag;
        while (outmostChosenSeat.nextSibling.classList.contains("choosing")) {
          outmostChosenSeat = outmostChosenSeat.nextSibling;
        }
        if (
          !outmostChosenSeat.nextSibling.classList.contains("base") &&
          seatTag.previousSibling.previousSibling.classList.contains("base") &&
          !seatTag.previousSibling.classList.contains("choosing") &&
          !seatTag.previousSibling.classList.contains("base")
        ) {
          tempBlankSeat = true;
          setBlankSeatNoti(
            "You cannot leave a seat empty at the beginning of each row."
          );
        }
      }
      if (
        seatTag.previousSibling &&
        seatTag.previousSibling.previousSibling &&
        seatTag.nextSibling &&
        seatTag.nextSibling.nextSibling
      ) {
        if (
          (!seatTag.nextSibling.classList.contains("choosing") &&
            seatTag.nextSibling.nextSibling.classList.contains("choosing") &&
            !seatTag.nextSibling.classList.contains("base")) ||
          (!seatTag.nextSibling.classList.contains("choosing") &&
            seatTag.nextSibling.nextSibling.classList.contains("choosing") &&
            !seatTag.nextSibling.classList.contains("base"))
        ) {
          tempBlankSeat = true;
          setBlankSeatNoti("You cannot leave a seat empty in the middle.");
        }
      }
    });
    if (tempBlankSeat) {
      setBlankSeat(true);
      setModalShow(true);
    }
  }

  const chooseSeat = (seatInfo) => {
    let chosenSeats = ticket.seat_id;
    let seatType = seatTypeCheck(seatInfo);
    if (chosenSeats.indexOf(seatInfo) < 0) {
      if (
        chosenSeats.filter((element) => element.seatType === seatType).length <
        props.numOfSeats.filter((element) => element.type === seatType)[0].num
      ) {
        document.getElementById(seatInfo.seat_id).classList.add("choosing");
        setTicket((prevState) => ({
          ...prevState,
          seat_id: [...prevState.seat_id, seatInfo],
        }));
      } else {
        let prevChosenSeats = [...chosenSeats];
        let seatRemove = prevChosenSeats.splice(
          prevChosenSeats.findIndex((item) => item.seatType === seatType),
          1
        );
        document
          .getElementById(seatRemove[0].seat_id)
          .classList.remove("choosing");
        document.getElementById(seatInfo.seat_id).classList.add("choosing");
        setTicket((prevState) => ({
          ...prevState,
          seat_id: [...prevChosenSeats, seatInfo],
        }));
      }
    } else {
      document.getElementById(seatInfo.seat_id).classList.remove("choosing");
      setTicket((prevState) => ({
        ...prevState,
        seat_id: [
          ...prevState.seat_id.filter(
            (item) => item.seat_id !== seatInfo.seat_id
          ),
        ],
      }));
    }
    setBlankSeat(false);
  };

  const bookTicket = () => {
    let ticketForm = { ...ticket };
    console.log(ticketForm);
    // ticketForm.seat_id = ticketForm.seat_id.map((item) =>
    //   (({ seat_id}) => ({ seat_id}))(item)
    // );
    ticketForm.seat_id = ticketForm.seat_id.map((item) =>
      (({ seat_id }) => JSON.stringify(seat_id))(item)
    );
    Axios({
      method: "POST",
      url: `http://localhost:5000/booking`,
      data: ticketForm,
      withCredentials: true,
    })
      .then((result) => {
        Swal.fire({
          icon: "success",
          text: "Book ticket successfully!",
          width: "400px",
          padding: "0 0 20px 0",
        }).then(() => {
          if (props.history.location.prePage) {
            props.history.push(props.history.location.prePage);
          } else {
            props.history.push("/");
          }
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const renderSeat = () => {
    let allSeat = [...seat];
    let mapSeat = [];
    let row = 0;
    let resSeat = [...seatres];
    let resid = [];
    resSeat.map((resseat) => {
      resid.push(resseat.seat_id);
    });
    do {
      let rowSeat = allSeat.splice(0, 16);
      rowSeat.splice(2, 0, null);
      rowSeat.splice(15, 0, null);
      mapSeat.push(
        <div className="row-seat" key={row}>
          <span className="row-name">{String.fromCharCode(row + 65)}</span>
          <span className="seat base null">
            <span>0</span>
          </span>
          {rowSeat.map((seat, index) => {
            if (seat === null) {
              return (
                <span className="seat base null" key={index}>
                  <span>0</span>
                </span>
              );
            }
            let seatType = seatTypeCheck(seat);
            if (resid.includes(seat.seat_id)) {
              return (
                <span
                  id={seat.seat_id}
                  className="seat chosen base"
                  key={index}
                >
                  <span>
                    {seat.seat_id % 16 === 0 ? 16 : seat.seat_id % 16}
                  </span>
                </span>
              );
            }
            if (
              !props.numOfSeats.find((element) => element.type === seatType).num
            ) {
              return (
                <span id={seat.seat_id} className="seat cantchoose" key={index}>
                  <span>
                    {seat.seat_id % 16 === 0 ? 16 : seat.seat_id % 16}
                  </span>
                </span>
              );
            } else if (seat.vip === 1) {
              return (
                <span
                  id={seat.seat_id}
                  className="seat notchosen vip"
                  key={index}
                  onClick={() => chooseSeat(seat)}
                >
                  <span>
                    {seat.seat_id % 16 === 0 ? 16 : seat.seat_id % 16}
                  </span>
                </span>
              );
            } else {
              return (
                <span
                  id={seat.seat_id}
                  className="seat notchosen"
                  key={index}
                  onClick={() => chooseSeat(seat)}
                >
                  <span>
                    {seat.seat_id % 16 === 0 ? 16 : seat.seat_id % 16}
                  </span>
                </span>
              );
            }
          })}
          <span className="seat base null">
            <span>0</span>
          </span>
        </div>
      );
      row++;
    } while (allSeat.length >= 16);
    return mapSeat;
  };

  const renderListSeat = () => {
    let listSeat = [];

    [...ticket.seat_id]
      .sort((a, b) => a.seat_id - b.seat_id)
      .forEach((ticket) => {
        listSeat.push(`${ticket.row}` + `${ticket.number}`);
      });
    return listSeat.join(", ");
  };

  //Time limit to book ticket
  let countdownTimer = 0;
  const countdownTimerF = () => {
    let seconds = 59;
    function secondPassed() {
      let minutes = Math.round((seconds - 30) / 60);
      let remainingSeconds = seconds % 60;
      if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      document.getElementById("countdown-timer").innerHTML =
        minutes + ":" + remainingSeconds;
      if (seconds === 0) {
        clearInterval(countdownTimer);
        document.getElementById("timeout-checkout").style.display = "block";
        setTimeOut(true);
      } else seconds--;
    }
    countdownTimer = setInterval(secondPassed, 1000);
  };

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        aria-labelledby="blankSeatNotification"
        centered
        className="blankSeatNotification text-center"
      >
        <Modal.Body>
          <img src={notify} alt="notification" />
          <span
            id="blankSeatNotification__text"
            className="blankSeatNotification__text"
          >
            {blankSeatNoti}
          </span>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  useEffect(() => {
    const fetchSeat = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:5000/seatLayout?all=1&scr_id=${screening}`
        );
        setSeat(response.data);
        const result = await Axios.get(
          `http://localhost:5000/seatLayout?all=0&scr_id=${screening}`
        );
        setSeatRes(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeat();
    countdownTimerF();
    return () => {
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <div className="step-checkout--mobile">
        <div className="backMobile" onClick={backStep}>
          <i className="fa fa-angle-left" aria-hidden="true"></i>
        </div>
        <div className="step-name">
          {step === 1 ? "02. PICK SEATS" : "03. CHECKOUT"}
        </div>
        <div></div>
      </div>
      <div id="timeout-checkout" className="timeout-checkout">
        <div className="contentfull">
          <span>
            The seat reservation time has expired. Please proceed with your
            order within 5 minutes.{" "}
            <span
              onClick={props.backStep}
              style={{ color: "#fb4226", cursor: "pointer" }}
            >
              Re-book the tickets
            </span>
          </span>
        </div>
      </div>
      <div className="checkout-content-2 row m-0 p-0">
        <div
          className={
            step === 1
              ? "checkout__left col-12 col-md-9"
              : "d-none-mobile checkout__left col-12 col-md-9"
          }
        >
          <div className="cinema">
            <div className="cinema__info">
              <p className="cinema__name">
                <span className="cinema__name__group">THEATRICAL</span> - GROUP
                4
              </p>
              <p className="cinema__time">{props.renderSchedule()}</p>
            </div>
            <div className="countdown-timer">
              <p>Seat reservation time</p>
              <span id="countdown-timer">0:00</span>
            </div>
          </div>
          <div className="seat-checkout__wrap">
            <div className="seat-checkout">
              <div className="seat-checkout__top">
                <img src={screen} alt="screen" />
              </div>
              <div className="seat-checkout__map">{renderSeat()}</div>
              <div className="seat-checkout__bottom row-seat">
                <span className="typeseat">
                  <span className="colorseat seat vip"></span>
                  <span className="nameseat">VIP seat</span>
                </span>
                <span className="typeseat">
                  <span className="colorseat seat"></span>
                  <span className="nameseat">Normal seat</span>
                </span>
                <span className="typeseat">
                  <span className="colorseat seat cantchoose"></span>
                  <span className="nameseat">This seat cannot be picked</span>
                </span>
                <span className="typeseat">
                  <span className="colorseat seat chosen"></span>
                  <span className="nameseat">This seat had been picked</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            step === 2
              ? "checkout__right col-12 col-md-3 p-0"
              : "d-none-mobile checkout__right col-12 col-md-3 p-0"
          }
        >
          <div className="ticket-info px-3">
            <div className="total-cost text-center">
              <span>
                {props.numOfSeats.reduce(
                  (totalPrice, element) =>
                    totalPrice + element.price * element.num,
                  0
                )}
                đ
              </span>
            </div>
            <div className="movie-info">
              <p className="name">
                <span className="age-type">C13</span>
                {props.chosenMovie.title}
              </p>
              <p className="cinema-name">
                {props.chosenMovie.duration} minutes -{" "}
                {props.chosenMovie.rating} IMDb - 2D/Digital
              </p>
            </div>
            <div className="seat">
              <div>
                <span>Seat</span>
                <span className="listSeat">{renderListSeat()}</span>
              </div>
              <span className="price">
                {props.numOfSeats.reduce(
                  (totalPrice, element) =>
                    totalPrice + element.price * element.num,
                  0
                )}
                đ
              </span>
            </div>
            <div className="user-info">E-mail</div>
            <div className="user-info">Phone</div>
            <div className="method-pay">
              <p>Checkout methods: Cash</p>
            </div>
            <div className="ticket__bottom">
              <div className="notice text-center">
                <p>
                  <i
                    className="fa fa-exclamation-circle mr-1"
                    style={{
                      color: "red",
                      fontSize: "16px",
                    }}
                    aria-hidden="true"
                  ></i>
                  Tickets that have been purchased cannot be exchanged or
                  refunded.
                </p>
                <p>
                  The ticket code will be sent via text message.{" "}
                  <span style={{ color: "#f79320" }}>ZMS</span> (Zalo messages)
                  and <span style={{ color: "#f79320" }}>Email</span> had been
                  put.
                </p>
              </div>
              {timeOut || !chooseSeatDone || blankSeat ? (
                <button disabled={true} className="buy-ticket btn">
                  Book Ticket
                </button>
              ) : (
                <button onClick={() => bookTicket()} className="buy-ticket btn">
                  Book Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="step-mobile--footer">
        <div className="blank"></div>
        <div className="wrap row m-0">
          <div className="list-seat col-6 p-0">{renderListSeat()}</div>
          <div className="next-step col-6 p-0">
            {step === 1 ? (
              <button
                className="next-step-2-2"
                onClick={nextStep}
                disabled={!chooseSeatDone || blankSeat}
              >
                CONTINUE
              </button>
            ) : timeOut || !chooseSeatDone || blankSeat ? (
              <button disabled={true} className="buy-ticket--mobile btn">
                BOOK TICKET
              </button>
            ) : (
              <button
                onClick={() => bookTicket()}
                className="buy-ticket--mobile btn"
              >
                BOOK TICKET
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { NavLink } from "react-router-dom";
import { Modal } from "react-bootstrap";

export default function Movie(props) {
  const [modalShow, setModalShow] = React.useState(false);
  let { movie } = props;

  //Modal Notify Blank seat
  function VideoModal(props) {
    return (
      <Modal
        size="lg"
        {...props}
        aria-labelledby="video-modal"
        centered
        className="video-modal text-center"
      >
        <Modal.Body>
          <iframe
            title={movie.biDanh}
            src={movie.trailer}
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <VideoModal show={modalShow} onHide={() => setModalShow(false)} />
      <div className="wrap-movie">
        <div className="movie">
          <div className="movie-img">
            <div className="movie-img__img">
              <img
                src={movie.hinhAnh}
                alt="movie-alt"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "/img/firm-0.webp";
                }}
              />
            </div>
            <NavLink to={`/detail-movie/${movie.maPhim}`}>
              <div className="movie-img__overlay"></div>
            </NavLink>
            <div className="movie__play">
              <i
                onClick={() => setModalShow(true)}
                className="fa fa-play"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="movie-info">
            <div className="info">
              <div className="name-movie">{movie.tenPhim}</div>
              <div className="info-movie">103 minutes - 7.3 IMDb</div>
            </div>
            <div className="book-ticket">
              <NavLink to={`/detail-movie/${movie.maPhim}`}>
                <span>MUA VÉ</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

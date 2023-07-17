import React, { Component } from "react";
import { connect } from "react-redux";
import * as action from "../../../services/redux/actions/movieActions";
import Movie from "../../../components/User/Movie";
import Slider from "react-slick";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Snipper from "../../../components/User/Spinner";

function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon style={{ fontSize: 45 }} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon style={{ fontSize: 45 }} />
    </div>
  );
}
class ListMovie extends Component {
  settings = {
    arrows: true,
    dots: false,
    infinite: true,
    autoplay: false,
    slidesPerRow: 4,
    rows: 2,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesPerRow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesPerRow: 2,
          arrows: false
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesPerRow: 2
        }
      }
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  componentDidMount() {
    this.props.getListMovie(); //Lấy danh sách phim
  }
  renderHTML = reverse => {
    let { listMovie } = this.props;
    if (reverse) {
      listMovie.reverse();
    }
    return listMovie.map((item, index) => {
      //Render danh sách phim
      return (
        <div className="slider" key={index}>
          <Movie key={index} movie={item} />
        </div>
      );
    });
  };
  showmore = () => {
    let boxs = document.getElementsByClassName("movie--more");
    let btn = document.getElementById("showmore-btn");
    for (let i = 0; i < boxs.length; i++) {
      let box = boxs[i];
      box.classList.toggle("d-none");
    }
    if (!btn.classList.contains("show")) {
      btn.innerHTML = "Show less";
      btn.classList.toggle("show");
    } else {
      btn.innerHTML = "Show more";
      btn.classList.toggle("show");
      document.getElementById("list-movie__wrap").scrollIntoView();
      window.scrollBy(0, -60);
    }
  };

  render() {
    let { listMovie } = this.props;
    if (listMovie.length) {
      return (
        <div id="list-movie__wrap" className="list-movie__wrap">
          <ul
            className="nav nav-tabs justify-content-center align-items-center"
            id="listMovieTab"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                id="dangchieu-tab"
                data-toggle="tab"
                href="#dangchieu"
                role="tab"
                aria-controls="dangchieu"
                aria-selected="true"
              >
                Now showing
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="sapchieu-tab"
                data-toggle="tab"
                href="#sapchieu"
                role="tab"
                aria-controls="sapchieu"
                aria-selected="false"
              >
                Upcoming 
              </a>
            </li>
          </ul>
          <div className="tab-content" id="listMovieTabContent">
            <div
              className="tab-pane fade show active"
              id="dangchieu"
              role="tabpanel"
              aria-labelledby="dangchieu-tab"
            >
              <Slider className="list-movie" {...this.settings}>
                {this.renderHTML(false)}
              </Slider>
            </div>
            <div
              className="tab-pane fade"
              id="sapchieu"
              role="tabpanel"
              aria-labelledby="sapchieu-tab"
            >
              <Slider className="list-movie" {...this.settings}>
                {this.renderHTML(true)}
              </Slider>
            </div>
          </div>
          <div className="showmore">
            <button
              id="showmore-btn"
              className="btn showmore-btn"
              onClick={this.showmore}
            >
              Show more
            </button>
          </div>
          <div className="blank"></div>
        </div>
      );
    }
    return <Snipper />;
  }
}

const mapDispathToProp = dispatch => {
  return {
    getListMovie: () => {
      dispatch(action.getListMovieAPI());
    }
  };
};

const mapStateToProps = state => {
  return {
    listMovie: state.movieReducer.listMovie
  };
};

export default connect(mapStateToProps, mapDispathToProp)(ListMovie);

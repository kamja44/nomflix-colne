import { useQuery } from "react-query";
import {
  getMovies,
  getPopular,
  getTopRated,
  getUpComing,
  IGetMoviesResult,
  IGetPopularResult,
  IGetTopRated,
  IGetUpComing,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  useViewportScroll,
} from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  // linar-gradient 배경1개, url배경 1개 각각 2개의 배경
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 60px;
  font-weight: 700;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -400px;
  height: 200px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: wheat;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 130px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const rowVars = {
  hidden: {
    x: window.outerWidth + 5, // 화면크기 + 5(gap)
  },
  visible: {
    x: 0,
  },
  exit: { x: -window.outerWidth - 5 }, // 화면크기 - 5(gap)
};
const offset = 6;
const BoxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
    font-weight: 700;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;
const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 500px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  top: -40px;
  padding: 10px;
`;
const BigOverview = styled.p`
  padding-left: 10px;
  position: relative;
  top: -40px;
  font-weight: 500;
  color: ${(props) => props.theme.white.lighter};
`;
const Subtitle = styled.h1`
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 800;
  margin-left: 10px;
`;
const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const infoVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
function Home() {
  const navigate = useNavigate(); //useHistory => useNavigate
  const bigMovieMatch = useMatch("/movies/:subTitle/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popular, isLoading: isPopularLoading } =
    useQuery<IGetPopularResult>(["popular_movie", "popular"], getPopular);
  const { data: topRate, isLoading: istopRateLoading } = useQuery<IGetTopRated>(
    ["topRate_movie", "topRate"],
    getTopRated
  );
  const { data: upComing, isLoading: isupComingLoading } =
    useQuery<IGetUpComing>(["upcoming_movie", "upcoming"], getUpComing);
  console.log(upComing);
  const Categories = [
    { subTitle: "Now Playing", data },
    { subTitle: "Popular", data: popular },
    { subTitle: "Top Rated", data: topRate },
    { subTitle: "Upcoming", data: upComing },
  ];
  console.log(data);
  const [index, setIndex] = useState(0); // map 안쓰고 Row 만들기
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number, subTitle: string) => {
    navigate(`/movies/${subTitle}/${movieId}`);
  };
  const onOverlayClick = () => navigate(`/`);
  const clickedMovie =
    (bigMovieMatch?.params.movieId &&
      data?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.movieId
      )) ||
    popular?.results.find(
      (popularMovie) => popularMovie.id + "" === bigMovieMatch?.params.movieId
    ) ||
    topRate?.results.find(
      (topMovie) => topMovie.id + "" === bigMovieMatch?.params.movieId
    ) ||
    upComing?.results.find(
      (upComingMovie) => upComingMovie.id + "" === bigMovieMatch?.params.movieId
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            {Categories.map((item, sliderIndex) => (
              <Slider key={sliderIndex}>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Subtitle>{item.subTitle}</Subtitle>
                  <Row
                    variants={rowVars}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={index}
                  >
                    {item.data?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)
                      .map((movie: any) => (
                        <Box
                          layoutId={`${movie.id} + ${item.subTitle}`}
                          onClick={() => onBoxClicked(movie.id, item.subTitle)}
                          transition={{ type: "tween" }}
                          variants={BoxVars}
                          whileHover="hover"
                          initial="normal"
                          key={movie.id}
                          $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVars}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </Slider>
            ))}
          </SliderWrapper>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 50,
                  }}
                  layoutId={`${bigMovieMatch.params.movieId} + ${bigMovieMatch.params.subTitle}`}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;

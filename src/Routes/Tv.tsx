import { useQuery } from "react-query";
import {
  getOnAir,
  getPopularTv,
  getTopTv,
  getTvs,
  IGetOnAir,
  IGetPopularTv,
  IGetTopTv,
  IGetTv,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import DetailMovie from "../Components/DetailMovie";
import DetailTv from "../Components/DetailTv";

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
  height: 400px;
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
  height: 300px;
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
const Arrow = styled(motion.div)`
  position: absolute;
  transform: translateY(-50%);
  margin-top: 150px;
  z-index: 100;
  width: 50px;
  height: 50px;
  color: white;
  display: flex;
  justify-content: center;
  align-content: center;
  cursor: pointer;
  opacity: 0;
  font-size: 40px;
`;
const RightArrow = styled(Arrow)`
  right: 10px;
`;

function Tv() {
  const navigate = useNavigate(); //useHistory => useNavigate
  const bigMovieMatch = useMatch("/tv/:subTitle/:tvId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetTv>(["tvs", "airingToday"], getTvs);
  const { data: popular, isLoading: isPopularLoading } =
    useQuery<IGetPopularTv>(["populartvs", "populartv"], getPopularTv);
  const { data: onAir, isLoading: isOnAirLoading } = useQuery<IGetOnAir>(
    ["onAir", "onAirs"],
    getOnAir
  );
  const { data: topRate, isLoading: istopRateLoading } = useQuery<IGetTopTv>(
    ["getTopTvs", "getTopTv"],
    getTopTv
  );

  const [index, setIndex] = useState(0); // map 안쓰고 Row 만들기
  const [indexpopular, setIndexpopular] = useState(0);
  const [indextopRate, setIndextopRate] = useState(0);
  const [indexonAir, setindexonAir] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const Categories = [
    { subTitle: "Airing Today", data, index },
    { subTitle: "On The Air", data: onAir, indexonAir },
    { subTitle: "Popular", data: popular, indexpopular },
    { subTitle: "Top Rated", data: topRate, indextopRate },
  ];
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = (category: any) => {
    if (category) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = category.data.results.length - 1;
      const popularMovies = category.data.results.length - 1;
      const topMovies = category.data.results.length - 1;
      const upComingMovies = category.data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const popularmaxIndex = Math.floor(popularMovies / offset) - 1;
      const topmaxIndex = Math.floor(topMovies / offset) - 1;
      const upComingmaxIndex = Math.floor(upComingMovies / offset) - 1;
      if (category.subTitle === "Airing Today") {
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else if (category.subTitle === "Popular") {
        setIndexpopular((prev) => (prev === popularmaxIndex ? 0 : prev + 1));
      } else if (category.subTitle === "Top Rated") {
        setIndextopRate((prev) => (prev === topmaxIndex ? 0 : prev + 1));
      } else if (category.subTitle === "On The Air") {
        setindexonAir((prev) => (prev === upComingmaxIndex ? 0 : prev + 1));
      }
    }
  };
  const onBoxClicked = (tvId: number, subTitle: string) => {
    navigate(`/tv/${subTitle}/${tvId}`);
  };
  const onOverlayClick = () => navigate(`/tv`);
  const clickedMovie =
    (bigMovieMatch?.params.tvId &&
      data?.results.find(
        (movie) => movie.id + "" === bigMovieMatch.params.tvId
      )) ||
    popular?.results.find(
      (popularMovie) => popularMovie.id + "" === bigMovieMatch?.params.tvId
    ) ||
    topRate?.results.find(
      (topMovie) => topMovie.id + "" === bigMovieMatch?.params.tvId
    ) ||
    onAir?.results.find(
      (onAirMovie) => onAirMovie.id + "" === bigMovieMatch?.params.tvId
    );

  return (
    <Wrapper>
      {isLoading || isPopularLoading || istopRateLoading || isOnAirLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            {Categories.map((category, sliderIndex) => (
              <>
                <Slider
                  key={sliderIndex}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <AnimatePresence
                    initial={false}
                    onExitComplete={toggleLeaving}
                  >
                    <Subtitle>{category.subTitle}</Subtitle>
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={
                        category.subTitle === "Airing Today"
                          ? index
                          : category.subTitle === "Popular"
                          ? indexpopular
                          : category.subTitle === "Top Rated"
                          ? indextopRate
                          : indexonAir
                      }
                    >
                      {category.data?.results
                        .slice(1)
                        .slice(
                          offset *
                            (category.subTitle === "Airing Today"
                              ? index
                              : category.subTitle === "Popular"
                              ? indexpopular
                              : category.subTitle === "Top Rated"
                              ? indextopRate
                              : indexonAir),
                          offset *
                            (category.subTitle === "Airing Today"
                              ? index
                              : category.subTitle === "Popular"
                              ? indexpopular
                              : category.subTitle === "Top Rated"
                              ? indextopRate
                              : indexonAir) +
                            offset
                        )
                        .map((movie: any) => (
                          <Box
                            layoutId={`${movie.id} + ${category.subTitle}`}
                            onClick={() =>
                              onBoxClicked(movie.id, category.subTitle)
                            }
                            transition={{ type: "tween" }}
                            variants={BoxVars}
                            whileHover="hover"
                            initial="normal"
                            key={movie.id}
                            $bgPhoto={makeImagePath(
                              movie.backdrop_path,
                              "w500"
                            )}
                          >
                            <Info variants={infoVars}>
                              <h4>{movie.title}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                  <RightArrow
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => increaseIndex(category)}
                  >
                    ▶
                  </RightArrow>
                </Slider>
              </>
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
                  layoutId={`${bigMovieMatch.params.tvId} + ${bigMovieMatch.params.subTitle}`}
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
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <DetailTv />
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
export default Tv;

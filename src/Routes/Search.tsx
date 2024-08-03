import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultiSearch, IMultiSearch, ISearch } from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import DetailSearch from "../Components/DetailSearch";
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
`;
const Keyword = styled.div`
  font-size: 30px;
  margin-top: 300px;
  margin-left: 60px;
  left: 0;
  position: absolute;
  font-weight: 800;
`;
const SearchWrapper = styled.div`
  margin-top: 350px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
  padding: 20px 60px;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 300px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 800;
  color: ${(props) => props.theme.black.darker};
`;
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
    color: ${(props) => props.theme.white.lighter};
  }
`;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;
const BigSearch = styled(motion.div)`
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

function Search() {
  const [searchClicked, setSearchClicked] = useState<ISearch>();
  const [boxId, setBoxId] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const searchIdMatch = location.search === `?keyword=${keyword}`;
  const { data, isLoading } = useQuery<IMultiSearch>(
    ["search", "multiSearch"],
    () => getMultiSearch(keyword!)
  );
  // console.log(data);
  const onBoxClicked = (id: number) => {
    navigate(`/search/detail?keyword=${keyword}`);
    setBoxId(id);
    setOverlay(true);
  };
  useEffect(() => {
    if (data) {
      const foundSearch = data.results.find((search) => search.id === boxId);
      setSearchClicked(foundSearch);
    }
  }, [boxId]);
  const onOverlayClick = () => {
    navigate(`/search?keyword=${keyword}`);
    setOverlay(false);
    console.log(`setOverlay ${overlay}`);
  };
  return (
    <Wrapper>
      <Keyword>검색결과 {keyword}</Keyword>
      <SearchWrapper>
        {data?.results.map((search) => (
          <Box
            onClick={() => onBoxClicked(search.id)}
            $bgPhoto={makeImagePath(
              search.backdrop_path ? search.backdrop_path : search.poster_path,
              "w500"
            )}
            key={search.id}
            transition={{ type: "tween" }}
            variants={BoxVars}
            whileHover="hover"
            initial="normal"
            layoutId={searchClicked?.id + ""}
          >
            {search.backdrop_path || search.poster_path
              ? null
              : "Image Not Founded"}
            <Info variants={infoVars}>
              <h4>{search.name || search.title}</h4>
            </Info>
          </Box>
        ))}
      </SearchWrapper>
      <AnimatePresence>
        {searchClicked && searchIdMatch && overlay ? (
          <>
            <Overlay
              exit={{ opacity: 0 }}
              onClick={onOverlayClick}
              animate={{ opacity: 1 }}
            />
            <BigSearch
              style={{
                top: scrollY.get() + 50,
              }}
              layoutId={`${searchClicked.id}`}
            >
              {searchClicked && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        searchClicked.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{searchClicked.title}</BigTitle>
                  <DetailSearch searchClicked={searchClicked} />
                </>
              )}
            </BigSearch>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}
export default Search;

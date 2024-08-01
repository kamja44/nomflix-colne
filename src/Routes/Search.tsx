import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getMultiSearch, IMultiSearch } from "../api";
import styled from "styled-components";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
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
function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IMultiSearch>(
    ["search", "multiSearch"],
    () => getMultiSearch(keyword!)
  );
  // console.log(keyword);
  console.log(data);
  return (
    <Wrapper>
      <Keyword>검색결과 {keyword}</Keyword>
      <SearchWrapper>
        {data?.results.map((search) => (
          <Box
            $bgPhoto={makeImagePath(
              search.backdrop_path ? search.backdrop_path : search.poster_path,
              "w500"
            )}
            key={search.id}
          >
            {search.backdrop_path || search.poster_path
              ? null
              : "Image Not Founded"}
          </Box>
        ))}
      </SearchWrapper>
    </Wrapper>
  );
}
export default Search;

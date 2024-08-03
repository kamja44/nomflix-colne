import { ISearch } from "../api";
import styled from "styled-components";
const Container = styled.div`
  padding-left: 10px;
  position: relative;
  top: -40px;
  font-weight: 500;
  color: ${(props) => props.theme.white.lighter};
`;
const Subtitle = styled.p`
  font-weight: 600;
  margin-bottom: 5px;
`;
const Genres = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 5px;
`;
const Overview = styled.p`
  font-weight: 500;
  margin-bottom: 5px;
`;
type searchClickedProps = {
  searchClicked: ISearch;
};

function DetailSearch({ searchClicked }: searchClickedProps) {
  return (
    <Container>
      {searchClicked?.adult ? (
        <Subtitle style={{ color: "red" }}>Adult Only</Subtitle>
      ) : null}
      <Subtitle>Media Type</Subtitle>
      <Genres>{searchClicked.media_type}</Genres>
      <Subtitle>Original Language</Subtitle>
      <Overview>{searchClicked?.original_language}</Overview>

      <Subtitle>Realese Date</Subtitle>
      <Overview>{searchClicked?.release_date}</Overview>
      <Subtitle>Vote_Average</Subtitle>
      <Overview>{searchClicked?.vote_average}</Overview>
      <Subtitle>Overview</Subtitle>
      <Overview>{searchClicked?.overview}</Overview>
    </Container>
  );
}

export default DetailSearch;

import { useQuery } from "react-query";
import { getDetailMovie, IDetailMovie } from "../api";
import { useParams } from "react-router-dom";
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

function DetailMovie() {
  const { id } = useParams<{
    id: string;
    subTitle: string;
  }>();
  const { data, isLoading } = useQuery<IDetailMovie>(
    ["detail_Movie", "detail"],
    () => getDetailMovie(Number(id))
  );
  console.log(data);
  return (
    <Container>
      {data?.adult ? (
        <Subtitle style={{ color: "red" }}>Adult Only</Subtitle>
      ) : null}
      <Subtitle>Genres</Subtitle>
      <Genres>
        {data?.genres.map((item) => (
          <p>{item.name}&nbsp;</p>
        ))}
      </Genres>
      <Subtitle>Homepage</Subtitle>
      <Overview>{data?.homepage}</Overview>
      <Subtitle>Runtime</Subtitle>
      <Overview>{data?.runtime}</Overview>
      <Subtitle>Vote_Average</Subtitle>
      <Overview>{data?.vote_average}</Overview>
      <Subtitle>Overview</Subtitle>
      <Overview>{data?.overview}</Overview>
    </Container>
  );
}

export default DetailMovie;

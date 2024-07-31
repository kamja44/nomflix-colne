import { useQuery } from "react-query";
import { getTvDetail, IGetTvDetail } from "../api";
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

function DetailTv() {
  const { id, subTitle } = useParams<{
    id: string;
    subTitle: string;
  }>();
  const { data, isLoading } = useQuery<IGetTvDetail>(
    ["detail_tv", "detailTv"],
    () => getTvDetail(Number(id))
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
      {data?.homepage ? (
        <>
          <Subtitle>Homepage</Subtitle>
          <Overview>{data?.homepage}</Overview>
        </>
      ) : null}
      <Subtitle>Runtime</Subtitle>
      <Overview>{data?.episode_run_time}</Overview>
      <Subtitle>Vote_Average</Subtitle>
      <Overview>{data?.vote_average}</Overview>
      <Subtitle>Overview</Subtitle>
      <Overview>{data?.overview}</Overview>
    </Container>
  );
}

export default DetailTv;

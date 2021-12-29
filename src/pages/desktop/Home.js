import React, { useEffect, useRef, useState } from "react";
import { sumDurations } from "@commons/utils";
import {
  useFetchLessons,
  useFetchTracking,
  useFetchQuestions,
} from "@hooks/useCourses";
import { StringParam, useQueryParam } from "use-query-params";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import CardInfo from "@components/CardInfo";
import Steps from "@components/Steps";
import { Video } from "@components/Video";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import LockedButton from "@assets/images/locked-button.svg";
import Time from "@assets/images/time.svg";
import Lessons from "@assets/images/lessons.svg";
import Loading from "@components/Loading";
import QuickQuestionary from "@components/QuickQuestionary";

const ContainerCards = styled.div`
  margin-top: 22px;
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  font-weight: 400 !important;
  font-size: 18px;
  line-height: 28px;
  font-family: ${({ theme }) => theme.fonts.mainFont};
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentLeft = styled.div`
  width: 60%;
`;

const ContentRight = styled.div`
  width: 40%;
  background: #fafafa;
  border-radius: 8px;
  margin: 0px 15px;
  padding: 16px;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const ContainerLoading = styled.div`
  width: 100%;
  height: 200px;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let timeOutFetch = 2;
let isPlay = false;
let isEnd = false;

const Home = () => {
  const history = useHistory();
  const [token, setToken] = useQueryParam("token", StringParam);
  const [idCurso, setIdCurso] = useQueryParam("idCurso", StringParam);

  const [isLoading, setIsLoading] = useState(false);
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);
  const videoRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [duration, setDuration] = useState();
  const [questionary, setQuestionary] = useState([]);
  const { fetch: fetchVideoByCourse, data: dataCourses } = useFetchLessons();
  const { fetch: fetchTracking, data: dataTracking } = useFetchTracking();
  const { fetch: fetchQuestions, data: dataQuestions } = useFetchQuestions();

  useEffect(() => {
    fetchVideoByCourse(token, idCurso);
  }, []);

  useEffect(() => {
    if (dataTracking?.success && isEnd) {
      console.log("SEND QUESTIONS DATAAAA");
      isEnd = false;
      setIsLoading(true);
      fetchQuestions(
        token,
        videoSelected?.item?.idCurso,
        videoSelected?.item?.idVideo
      );
      //fetchVideoByCourse(token, idCurso);
    }
  }, [dataTracking]);

  useEffect(() => {
    setIsLoading(false);
    if (dataQuestions?.success) {
      if (dataQuestions?.data?.length > 0) {
        setQuestionary(dataQuestions?.data);
      } else {
        fetchVideoByCourse(token, idCurso);
      }
    }
  }, [dataQuestions]);

  useEffect(() => {
    if (dataCourses?.success) {
      const data = dataCourses?.data;
      let find = null;
      if (data.length > 0) {
        if (videoSelected?.item) {
          find = {
            index: videoSelected?.index + 1,
            item: data[videoSelected?.index + 1],
          };
        } else {
          find = {
            index: 0,
            item: data[0],
          };
        }
      }
      setCourses(data);
      const sumDurations_ = sumDurations(dataCourses?.data);
      setDuration(sumDurations_.formatted);
      setVideoSelected(find);
    }
  }, [dataCourses]);

  const handleOnProgress = (e) => {
    const currentTime = e.playedSeconds;
    if (isPlay) {
      if (currentTime > timeOutFetch) {
        timeOutFetch = currentTime + timeOutFetch;
        fetchTracking(
          token,
          videoSelected?.item?.idCurso,
          videoSelected?.item?.idVideo,
          currentTime
        );
      }
    }
  };

  const handleOnPlay = () => {
    isEnd = false;
    isPlay = true;
    timeOutFetch = 2;
  };

  const handleOnEnded = () => {
    const currentTime = videoRef?.current.getDuration();
    if (isPlay) {
      isPlay = false;
      isEnd = true;
      fetchTracking(
        token,
        videoSelected?.item?.idCurso,
        videoSelected?.item?.idVideo,
        currentTime,
        true
      );
    }
  };

  const onFinished = () => {
    setQuestionary([]);
    fetchVideoByCourse(token, videoSelected?.item?.idCurso);
  };

  const onClickQuestionary = () => {
    /*history.push({
      pathname: "/certificate",
      state: {
        token,
        idCurso: videoSelected?.item?.idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });*/
    history.push({
      pathname: "/questionary",
      state: {
        token,
        idCurso: videoSelected?.item?.idCurso,
        nombreCurso: videoSelected?.item?.nombreCurso,
      },
    });
  };

  return (
    <div>
      <Link
        onClick={() => {
          window.parent.location.href =
            "https://unacemcantera.com.pe/capacitaciones/";
        }}
      >
        <img src={ArrowDoubleLeft} />
        <span>Volver</span>
      </Link>
      <Content>
        <ContentLeft>
          <div style={{ margin: "16px 0px" }}>
            {!isLoading ? (
              questionary?.length === 0 ? (
                <Video
                  innerRef={videoRef}
                  width="100%"
                  height="30%"
                  controls
                  src={
                    !isSelectedVideo
                      ? courses.length && `https://${courses[0].rutaPublica}`
                      : `https://${videoSelected?.item?.rutaPublica}`
                  }
                  seek={videoSelected?.item?.ultimoMinutoVisto}
                  onProgress={handleOnProgress}
                  onPlay={handleOnPlay}
                  onEnded={handleOnEnded}
                />
              ) : (
                <QuickQuestionary
                  questionary={questionary}
                  videoSelected={videoSelected}
                  token={token}
                  onFinished={onFinished}
                />
              )
            ) : (
              <ContainerLoading>
                <Loading />
              </ContainerLoading>
            )}
          </div>
          <Title type="lg">
            {!isSelectedVideo
              ? courses.length && `${courses[0].nombreCurso}`
              : `Lección ${videoSelected?.item?.index || 1}: ${
                  videoSelected?.item?.nombreVideo || ""
                }`}
          </Title>

          <>
            <ContainerCards>
              <CardInfo
                icon={Time}
                title="Duración del curso"
                subTitle={duration}
              />
              <CardInfo
                icon={Lessons}
                title="Lecciones"
                subTitle={`${courses.length} ${
                  courses.length > 1 ? "lecciones" : "leccion"
                }`}
              />
            </ContainerCards>
            <Paragraph>
              {courses.length ? courses[0].descripcionCurso : ""}
            </Paragraph>
          </>
          <Link
            style={{ color: "#333333", fontWeight: 700, marginTop: "20px" }}
            onClick={() => {
              window.parent.location.href =
                "https://unacemcantera.com.pe/capacitaciones/";
            }}
          >
            <img src={ArrowDoubleLeftDark} />
            <span>Ver todos los cursos</span>
          </Link>
        </ContentLeft>
        <ContentRight>
          <Steps
            lessons={courses}
            disabledClose
            videoSelected={videoSelected}
            onCallbackVideoSelected={(item, index) => {
              console.log("CALLBACKKKKK", item);
              setIsSelectedVideo(true);
              setVideoSelected({
                item,
                index,
              });
            }}
          />
          <Button
            disabled={
              courses?.find((item) => item.completoVista !== "SI")
                ? true
                : false
            }
            onClick={onClickQuestionary}
            label="OBTENER CERTIFICADO"
            iconLeft={LockedButton}
          />
          <Paragraph style={{ fontSize: "14px" }}>
            Recuerda que debes terminar el curso en su totalidad para realizar
            el cuestionario y obtener tu certificado.
          </Paragraph>
          <Link
            style={{ color: "#333333", fontWeight: 700, marginTop: "20px" }}
            onClick={() => {
              window.parent.location.href =
                "https://unacemcantera.com.pe/capacitaciones/";
            }}
          >
            <img src={ArrowDoubleLeftDark} />
            <span>Ver todos los cursos</span>
          </Link>
        </ContentRight>
      </Content>
    </div>
  );
};

export default Home;

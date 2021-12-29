import React, { useEffect, useRef, useState } from "react";
import { sumDurations } from "@commons/utils";
import { useFetchLessons } from "@hooks/useCourses";
import { StringParam, useQueryParam } from "use-query-params";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Link from "@components/Link";
import Button from "@components/Button";
import Title from "@components/Title";
import CardInfo from "@components/CardInfo";
import { Video } from "@components/Video";
import ArrowDoubleLeft from "@assets/images/arrow-double-left.svg";
import ArrowDoubleLeftDark from "@assets/images/arrow-double-left-dark.svg";
import ArrowDoubleRight from "@assets/images/arrow-double-right.svg";
import Time from "@assets/images/time.svg";
import Lessons from "@assets/images/lessons.svg";

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

const Home = () => {
  const history = useHistory();
  const [token, setToken] = useQueryParam("token", StringParam);
  const [idCurso, setIdCurso] = useQueryParam("idCurso", StringParam);

  const videoRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [videoSelected, setVideoSelected] = useState({ item: null, index: -1 });
  const [duration, setDuration] = useState();
  const { fetch: fetchVideoByCourse, data: dataCourses } = useFetchLessons();

  useEffect(() => {
    fetchVideoByCourse(token, idCurso);
  }, []);

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
      <>
        <div style={{ margin: "16px 0px" }}>
          {videoSelected?.item ? (
            <Video
              innerRef={videoRef}
              width="100%"
              height="30%"
              controls
              src={`https://${videoSelected?.item?.rutaPublica}`}
            />
          ) : null}
        </div>
        {videoSelected?.item && (
          <Title type="lg">{videoSelected?.item?.nombreCurso || ""}</Title>
        )}
        <>
          <div style={{ marginTop: "18px" }}>
            <Button
              onClick={() => {
                history.push({
                  pathname: "/lessons",
                  state: {
                    token,
                    idCurso,
                    nombreCurso: videoSelected?.item?.nombreCurso,
                  },
                });
              }}
              label="Comenzar"
              iconRight={ArrowDoubleRight}
            />
          </div>
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
      </>
    </div>
  );
};

export default Home;

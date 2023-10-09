import { FunctionComponent, useCallback } from “react”;
import { useNavigate } from “react-router-dom”;
import “./Frame.css”;

const Frame: FunctionComponent = () => {
  const navigate = useNavigate();

  const onContainer3Click = useCallback(() => {
    // Please sync “친구 추가” to the project
  }, []);

  const onFrameContainerClick = useCallback(() => {
    navigate(“/”);
  }, [navigate]);

  const onFrameContainer5Click = useCallback(() => {
    // Please sync “차단 목록” to the project
  }, []);

  const onContainer8Click = useCallback(() => {
    // Please sync “프로필” to the project
  }, []);

  return (
    <div className=“div”>
      <div className=“div1”>
        <div className=“div2">
          <div className=“div3”>
            <div className=“div4">
              <div className=“div5”>친구 목록</div>
              <div className=“div6">채팅 목록</div>
            </div>
          </div>
          <div className=“div7” />
        </div>
        <div className=“div8" onClick={onContainer3Click}>
          <div className=“div9”>친구 추가</div>
        </div>
      </div>
      <div className=“div10">
        <div className=“div11”>
          <div className=“wrapper” onClick={onFrameContainerClick}>
            <div className=“div12”>홈</div>
          </div>
          <div className=“container”>
            <div className=“div12”>알림</div>
          </div>
          <div className=“container”>
            <div className=“div12”>친구 목록</div>
          </div>
          <div className=“container”>
            <div className=“div12”>채팅방</div>
          </div>
          <div className=“container”>
            <div className=“div12”>순위</div>
          </div>
          <div className=“wrapper” onClick={onFrameContainer5Click}>
            <div className=“div12”>차단 목록</div>
          </div>
        </div>
      </div>
      <div className=“div18">
        <div className=“div19” onClick={onContainer8Click}>
          <div className=“div20">
            <img className=“image-5-icon” alt=“” src=“/image-5@2x.png” />
          </div>
          <div className=“div21">최대수닉네임</div>
        </div>
      </div>
      <div className=“center” />
      <div className=“div22" />
      <div className=“parent”>
        <div className=“div23">
          <div className=“x”>X</div>
        </div>
        <div className=“frame-parent”>
          <div className=“group”>
            <div className=“div24">
              <div className=“div25” />
            </div>
            <div className=“div26">
              <div className=“div27”>온라인친구임</div>
            </div>
          </div>
          <div className=“frame-group”>
            <div className=“parent1”>
              <div className=“div28">온라인 친구1</div>
              <div className=“div29”>
                <div className=“div30">
                  헬로 월드 나랏말싸미 중국에 달라 문자와 서로 사맞지 아니할세
                </div>
                <div className=“div31”>
                  헬로 월드 나랏말싸미 중국에 달라 문자와 서로 사맞지 아니할세
                </div>
              </div>
              <div className=“div32">
                <div className=“div33”>어쩔티비 저쩔티비 ㅋㅋ</div>
              </div>
            </div>
            <div className=“rectangle-parent”>
              <div className=“group-child” />
              <div className=“group-item” />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame;
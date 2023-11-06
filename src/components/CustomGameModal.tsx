import Modal from "react-modal";
import { useState } from "react";

interface CustomGameModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CustomGameModal: React.FC<CustomGameModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => {
  const [sliderValue, setSliderValue] = useState(1);

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}
      contentLabel="게임 옵션 설정"
    >
      <h2>게임 속도를 지정해주세요</h2>
      <h3>속도: {sliderValue}x</h3>
      <form onSubmit={onSubmit}>
        <input
          name="speed"
          type="range"
          min="1"
          max="3"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
        />
        <button type="submit">입력</button>
      </form>
      <button onClick={onRequestClose}>닫기</button>
    </Modal>
  );
};

export default CustomGameModal;

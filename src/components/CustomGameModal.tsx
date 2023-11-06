import Modal from "react-modal";

interface CustomGameModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CustomGameModal: React.FC<CustomGameModalProps> = ({
  isOpen,
  onRequestClose,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    contentLabel="게임 옵션 설정"
  >
    <h2>게임 속도를 지정해주세요</h2>
    <h3>1~10 사이의 숫자를 입력해주세요</h3>
    <form onSubmit={onSubmit}>
      <input type="number" min="1" max="10" />
      <button type="submit">입력</button>
    </form>
    <button onClick={onRequestClose}>닫기</button>
  </Modal>
);

export default CustomGameModal;

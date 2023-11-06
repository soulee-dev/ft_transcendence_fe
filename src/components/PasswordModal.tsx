import Modal from "react-modal";

interface PasswordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  joinPassword: string;
  setJoinPassword: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onRequestClose,
  joinPassword,
  setJoinPassword,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    contentLabel="비밀번호 입력"
  >
    <h2>비밀번호를 입력해주세요</h2>
    <form onSubmit={onSubmit}>
      <input
        name="joinPassword"
        type="password"
        placeholder="비밀번호"
        value={joinPassword}
        onChange={(e) => setJoinPassword(e.target.value)}
      />
      <button type="submit">입력</button>
    </form>
    <button onClick={onRequestClose}>닫기</button>
  </Modal>
);

export default PasswordModal;

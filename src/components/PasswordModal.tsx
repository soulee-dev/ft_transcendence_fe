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
    style={{
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0)',
        height: '770px',
      },
      content: {
        position: 'absolute',
        top: '40px',
        left: '40px',
        right: '40px',
        bottom: '40px',
        border: '1px solid #ccc',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0)',        
      }
    }}
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

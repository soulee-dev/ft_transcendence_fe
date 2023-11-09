import Modal from "react-modal";

interface InviteModalProps {
  isOpen: boolean;
  onReuqestClose: () => void;
  handleAcceptInvite: () => void;
  handleRejectInvite: () => void;
  inviteeUserName: string;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onReuqestClose,
  handleAcceptInvite,
  handleRejectInvite,
  inviteeUserName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onReuqestClose}
      contentLabel="게임 초대"
    >
      <h2>{inviteeUserName}의 게임 초대가 왔습니다!</h2>
      <button onClick={handleAcceptInvite}>수락</button>
      <button onClick={handleRejectInvite}>거절</button>
      <button onClick={onReuqestClose}>닫기</button>
    </Modal>
  );
};

export default InviteModal;

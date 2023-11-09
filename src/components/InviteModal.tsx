import Modal from "react-modal";
import { useContext } from "react";
import { SocketContext } from "@/contexts/SocketContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface InviteModalProps {
  isOpen: boolean;
  onReuqestClose: () => void;
  handleAcceptInvite: () => void;
  handleRejectInvite: () => void;
  inviteeUserName: string;
}

const InviteModal = () => {
  const {
    inviteeUserName,
    isInviteModalOpen,
    inviteData,
    closeInviteModal,
    socket,
  } = useContext(SocketContext);

  const router = useRouter();

  const handleAcceptInvite = () => {
    toast.success(
      <>
        초대를 수락했습니다.
        <br />곧 게임을 시작합니다.
      </>
    );
    // redirect after 3 sconds
    closeInviteModal();
    router.push(`/game?roomId=${inviteData.channelId}`);
  };

  const handleRejectInvite = () => {
    if (!socket) return;
    socket.emit("declineInvite", inviteData.channelId);
    toast.success("초대를 거절했습니다.");
    closeInviteModal();
  };

  const handleClose = () => {
    if (!socket) return;
    socket.emit("declineInvite", inviteData.channelId);
    closeInviteModal();
  };

  return (
    <Modal
      isOpen={isInviteModalOpen}
      ariaHideApp={false}
      onRequestClose={closeInviteModal}
      contentLabel="게임 초대"
    >
      <h2>{inviteeUserName}의 게임 초대가 왔습니다!</h2>
      <button onClick={handleAcceptInvite}>수락</button>
      <button onClick={handleRejectInvite}>거절</button>
      <button onClick={handleClose}>닫기</button>
    </Modal>
  );
};

export default InviteModal;

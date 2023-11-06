import Modal from "react-modal";

interface InviteModalProps {
  isOpen: boolean;
  onReuqestClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onReuqestClose,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onReuqestClose}
    contentLabel="게임 초대"
  >
    아직 내용은 생각 안함
  </Modal>
);

export default InviteModal;

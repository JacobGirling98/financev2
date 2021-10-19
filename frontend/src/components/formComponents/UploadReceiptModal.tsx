import React, { useState } from "react";
import Modal from "react-bootstrap/modal";

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const UploadReceiptModal: React.FC<ModalProps> = ({
  showModal, setShowModal
}) => {
  const [receipt, setReceipt] = useState<string>("");

  const readReceipt = () => {
    console.log(receipt);
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header key="upload">
        <Modal.Title>Upload Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-floating">
          <textarea
            className="form-control"
            placeholder="Upload your receipt"
            id="floatingTextarea"
            value={receipt}
            onChange={e => {
              setReceipt(e.target.value);
            }}
          ></textarea>
          <label htmlFor="floatingTextarea">Contents</label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={e => {
            setReceipt("");
            setShowModal(false);
          }}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={e => {
            readReceipt();
            setReceipt("");
            setShowModal(false);
          }}
        >
          Upload Waitrose
        </button>
        <button
          type="button"
          className="btn btn-sainsburys"
          onClick={e => {
            setReceipt("");
            setShowModal(false);
          }}
        >
          Upload Sainsbury's
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadReceiptModal;

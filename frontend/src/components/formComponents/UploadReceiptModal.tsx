import React, { useState } from "react";
import Modal from "react-bootstrap/modal";
import { Transaction } from "../../types/types";
import { TRANSACTION_FIELDS, TRANSACTION_TYPES } from "../../utils/constants";
import SelectCmp from "./SelectCmp";

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  addTransactions: (transactions: Transaction[]) => void;
}

const UploadReceiptModal: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  addTransactions
}) => {
  const [receipt, setReceipt] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("");

  const transactionTypes: string[] = [
    TRANSACTION_TYPES.credit,
    TRANSACTION_TYPES.debit
  ];

  const resetTransaction = () => {
    return {
      date: date,
      outgoing: true,
      value: 0,
      transactionType: transactionType,
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "",
      quantity: "",
    }
  }

  const resetState = () => {
    setReceipt("");
    setDate("");
    setTransactionType("");
    setShowModal(false);
  }

  const readReceipt = () => {
    const lines = receipt.valueOf().split("\n");
    let isProduct: boolean = false;
    let isQuantity: boolean = false;
    let isPrice: boolean = false;

    let transactions: Transaction[] = [];
    let transaction: Transaction = resetTransaction();

    for (let line of lines) {
      if (isProduct) {
        transaction.description = line;
        isProduct = false;
      } else if (isQuantity) {
        transaction.quantity = line;
        isQuantity = false;
      } else if (isPrice) {
        transaction.value = parseFloat(line.substring(1));
        isPrice = false;
        transactions.push(transaction);
        transaction = resetTransaction();
      }

      if (line === "Product Name") {
        isProduct = true;
      } else if (line === "Qty:") {
        isQuantity = true;
      } else if (line === "Cost:") {
        isPrice = true;
      }
    }
    console.log(transactions);
    addTransactions(transactions)
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header key="upload">
        <Modal.Title>Upload Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-md-6 ">
            <label htmlFor={TRANSACTION_FIELDS.date} className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id={TRANSACTION_FIELDS.date}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 ">
            <label htmlFor="transactionType" className="form-label">
              Transaction Type
            </label>
            <SelectCmp
              className="form-Select"
              options={transactionTypes}
              id="transactionType"
              value={transactionType}
              onChange={e => setTransactionType(e)}
            />
          </div>
        </div>
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
            resetState();
          }}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={e => {
            readReceipt();
            resetState();
          }}
        >
          Upload Waitrose
        </button>
        <button
          type="button"
          className="btn btn-sainsburys"
          onClick={e => {
            resetState();
          }}
        >
          Upload Sainsbury's
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadReceiptModal;

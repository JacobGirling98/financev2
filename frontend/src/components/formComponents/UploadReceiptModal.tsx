import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/modal";
import { useAppSelector } from "../../hooks/redux";
import {
  selectDescriptionMappings,
  selectDescriptions,
} from "../../stores/FormOptionsSlice";
import { DescriptionMapping, Transaction } from "../../types/types";
import { TRANSACTION_FIELDS, TRANSACTION_TYPES } from "../../utils/constants";
import CreatableSelectCmp from "./CreatableSelectCmp";
import SelectCmp from "./SelectCmp";

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  addTransactions: (transactions: Transaction[]) => void;
}

const UploadReceiptModal: React.FC<ModalProps> = ({
  showModal,
  setShowModal,
  addTransactions,
}) => {
  const [receipt, setReceipt] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("");
  const [unknownMappings, setUnkownMappings] = useState<DescriptionMapping[]>([]);
  const [unknownMappingsIndex, setUnkownMappingsIndex] = useState<number>(0);

  const descriptionMappings = useAppSelector(selectDescriptionMappings);
  const descriptions = useAppSelector(selectDescriptions);

  let unknownMappingsTemp: string[] = [];

  // useEffect(() => {
  //   console.log(unknownMappings);
  // }, [unknownMappings]);

  const transactionTypes: string[] = [
    TRANSACTION_TYPES.credit,
    TRANSACTION_TYPES.debit,
  ];

  const resetTransaction = () => {
    return {
      date: date,
      outgoing: true,
      value: "",
      transactionType: transactionType,
      outboundAccount: "",
      inboundAccount: "",
      destination: "",
      source: "",
      description: "",
      category: "Food",
      quantity: "",
    };
  };

  const resetState = () => {
    setReceipt("");
    setDate("");
    setTransactionType("");
    // setShowModal(false);
  };

  const mapDescription = async (description: string): Promise<string> => {
    const foundMapping = descriptionMappings.filter(
      mapping => mapping.fullDescription === description
    );
    if (foundMapping.length > 0) {
      return foundMapping[0].shortDescription;
    }
    unknownMappingsTemp.push(description);
    return description;
  };

  const readReceipt = async () => {
    const lines = receipt.valueOf().split("\n");

    let transactions: Transaction[] = [];
    let transaction: Transaction = resetTransaction();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "Product Name") {
        i++;
        transaction.description = await mapDescription(lines[i]);
      } else if (lines[i] === "Qty:") {
        i++;
        transaction.quantity = lines[i];
      } else if (lines[i] === "Cost:") {
        i++;
        transaction.value = lines[i].substring(1);
        transactions.push(transaction);
        transaction = resetTransaction();
      }
    }
    setUnkownMappings(unknownMappingsTemp.map(mapping => {
      return {fullDescription: mapping, shortDescription: ""}}
    ));
    // addTransactions(transactions);
  };

  const handleNewMapping = (newDescription: string): void => {
    let mappings: DescriptionMapping[] = unknownMappings;
    mappings[unknownMappingsIndex].shortDescription = newDescription;
    mappings.push({fullDescription: "", shortDescription: ""});
    setUnkownMappings(mappings);
    setUnkownMappingsIndex(unknownMappingsIndex + 1);
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header key="upload">
        <Modal.Title>Upload Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {unknownMappings.length === 0 && (
          <>
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
          </>
        )}
        {unknownMappings.length > 0 && 
        <>
          <p><i>Add new descriptions...</i></p>
          <div className="row">
            <div className="col-md">
              <label htmlFor="fullDescription" className="form-label">
                Given Description
              </label>
              <input
                type="text"
                disabled
                className="form-control"
                id="fullDescription"
                value={unknownMappings[unknownMappingsIndex].fullDescription}
              />
            </div>
            <div className="col-md">
              <label htmlFor="newDescription" className="form-label">
                New Description
              </label>
              <CreatableSelectCmp
                options={descriptions}
                id="newDescription"
                value={unknownMappings[unknownMappingsIndex].shortDescription}
                // nestedOnChange={handleSelectChange}
                // addOption={addDescription}
              />
            </div>
          </div>
        </>
        }
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
        {unknownMappings.length === 0 &&
        <>
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
        </>
        }
        {unknownMappings.length > 0 && 
        <>
          <button
            type="button"
            className="btn btn-warning"
            disabled={unknownMappingsIndex === 0}
            onClick={e => setUnkownMappingsIndex(unknownMappingsIndex - 1)}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={unknownMappingsIndex === unknownMappings.length - 1}
            onClick={e => handleNewMapping(e.currentTarget.value)}
          >
            Next
          </button>
        </>
        }
      </Modal.Footer>
    </Modal>
  );
};

export default UploadReceiptModal;

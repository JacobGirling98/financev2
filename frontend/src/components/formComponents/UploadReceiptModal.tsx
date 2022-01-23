import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/modal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ADD_DESCRIPTION } from "../../stores/actions";
import {
  addDescriptionMappings,
  selectDescriptionMappings,
  selectDescriptions,
} from "../../stores/FormOptionsSlice";
import { DescriptionMapping, Transaction } from "../../types/types";
import { DESCRIPTION_MAPPING_URL } from "../../utils/api-urls";
import { TRANSACTION_FIELDS, TRANSACTION_TYPES } from "../../utils/constants";
import CreatableSelectCmp from "./CreatableSelectCmp";
import SelectCmp from "./SelectCmp";
import axios from "axios";

interface ModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  addTransactions: (transactions: Transaction[]) => void;
}

interface readReceiptReturn {
  localTransactions: Transaction[];
  unknowns: String[];
}

enum Supermarket {
  WAITROSE,
  SAINSBURYS
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const descriptionMappings = useAppSelector(selectDescriptionMappings);
  const descriptions = useAppSelector(selectDescriptions);
  const dispatch = useAppDispatch();

  let unknownMappingsTemp: string[] = [];

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
    setUnkownMappings([]);
    setUnkownMappingsIndex(0);
    setTransactions([]);
    setShowModal(false);
  };

  const mapDescription = (description: string): string => {
    const foundMapping = descriptionMappings.filter(
      mapping => mapping.fullDescription === description
    );
    if (foundMapping.length > 0) {
      return foundMapping[0].shortDescription;
    }
    unknownMappingsTemp.push(description);
    return description;
  };

  const readReceipt = (source: Supermarket): readReceiptReturn => {
    const lines = receipt.valueOf().split("\n");

    let localTransactions: Transaction [] = source === Supermarket.WAITROSE ? readWaitroseReceipt(lines) : readSainsburysReceipt(lines)

    if (unknownMappingsTemp.length > 0) {
      setUnkownMappings(unknownMappingsTemp.map(mapping => {
        return {fullDescription: mapping, shortDescription: ""}
      }));
    }
    return {
      localTransactions,
      unknowns: unknownMappingsTemp
    };
  };

  const getCost = (cost: string): string => {
    if (cost.includes("£")) {
      return cost.substring(1);
    } else {
      return `0.${cost.substring(0, cost.length - 1)}`;
    }
  }

  const readWaitroseReceipt = (lines: string[]): Transaction[]  => {
    let transaction: Transaction = resetTransaction();
    let localTransactions: Transaction[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "Product Name") {
        i++;
        transaction.description = mapDescription(lines[i]);
      } else if (lines[i] === "Qty:") {
        i++;
        transaction.quantity = lines[i][0];
        i++;
        transaction.value = getCost(lines[i]);
        localTransactions.push(transaction);
        transaction = resetTransaction();
      }
    }
    return localTransactions;
  }

  const readSainsburysReceipt = (lines: string[]): Transaction[] => {
    let localTransactions: Transaction[] = [];

    for (let i = 0; i < lines.length; i++) {
      let transaction: Transaction = resetTransaction();
      const line = lines[i].split(" ")
      const finalIndex = line.length - 1;
      const quantity = parseQuantity(line[0])
      
      if (quantity) {
        transaction.quantity = quantity
        if (isValue(line[finalIndex])) {
          transaction.value = line[finalIndex].substring(1)
          transaction.description = mapDescription(line.splice(1, finalIndex - 1).join(" "))
        } else {
          i++
          const nextLine = lines[i].split(" ")
          transaction.value = nextLine[nextLine.length - 1].substring(1)
          const combinedLine = line.concat(nextLine)
          transaction.description = mapDescription(combinedLine.splice(1, combinedLine.length - 2).join(" "))
        }
        localTransactions.push(transaction)
      }
    }
    return localTransactions
  }

  const parseQuantity = (rawQuantity: string): string => {
    let quantity: number
    if (rawQuantity.substring(rawQuantity.length - 1) === "g" || rawQuantity.substring(rawQuantity.length - 2) === "kg") {
      quantity = 1
    } else {
      quantity = parseInt(rawQuantity)
      if (isNaN(quantity)) {
        quantity = 0
      }
    }
    return quantity.toString()
  }

  const isValue = (value: string): boolean => {
    return value[0] === "£"
  }

  const handleNewMapping = (): void => {
    setUnkownMappingsIndex(unknownMappingsIndex + 1);
  }

  const handleSelectChange = (
    value: string
  ): void => {
    let mappings: DescriptionMapping[] = [...unknownMappings];
    mappings[unknownMappingsIndex].shortDescription = value;
    setUnkownMappings(mappings);
  };

  const handleUpload = (source: Supermarket) => {
    const {localTransactions, unknowns } = readReceipt(source);
    if (unknowns.length === 0) {
      const updatedTransactions = updateTransactions(localTransactions);
      addTransactions(updatedTransactions);
      resetState();
    } else {
      setTransactions(localTransactions);
    }
  }

  const handleNewMappingsSubmit = async () => {
    let res = await axios.post(DESCRIPTION_MAPPING_URL, { unknownMappings });
    const updatedTransactions = updateTransactions(transactions);
    dispatch(addDescriptionMappings(unknownMappings));
    addTransactions(updatedTransactions);
    resetState();
  };

  const addDescription = (value: string): void => {
    dispatch(ADD_DESCRIPTION(value));
  }

  const updateTransactions = (oldTransactions: Transaction[]): Transaction[] => {
    const localMappings: DescriptionMapping[] = [...descriptionMappings, ...unknownMappings];
    oldTransactions.forEach(transaction => {
      let matchingDescription = localMappings.filter(mapping => mapping.fullDescription === transaction.description);
      if (matchingDescription.length > 0) {
        transaction.description = matchingDescription[0].shortDescription;
      }
    });
    return oldTransactions;
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
                onChange={handleSelectChange}
                addOption={addDescription}
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
              handleUpload(Supermarket.WAITROSE);
            }}
          >
            Upload Waitrose
          </button>
          <button
            type="button"
            className="btn btn-sainsburys"
            onClick={e => {
              handleUpload(Supermarket.SAINSBURYS);
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
          {unknownMappingsIndex < unknownMappings.length - 1 &&
          <>
            <button
              type="button"
              className="btn btn-primary"
              disabled={unknownMappings[unknownMappingsIndex].shortDescription === ""}
              onClick={() => handleNewMapping()}
            >
              Next
            </button>
          </>
          }
          {unknownMappingsIndex === unknownMappings.length - 1 &&
          <>
            <button
              type="button"
              className="btn btn-success"
              disabled={unknownMappings[unknownMappingsIndex].shortDescription === ""}
              onClick={() => handleNewMappingsSubmit()}
            >
              Submit
            </button>
          </>
          }
        </>
        }
      </Modal.Footer>
    </Modal>
  );
};

export default UploadReceiptModal;

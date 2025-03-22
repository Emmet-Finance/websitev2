import React from 'react';
import Modal from "react-modal";

export default function AlertModal ({ msg, alertIsOpen, closedAlert }) {

  return (
    <div>
      <Modal
        isOpen={alertIsOpen}
        onRequestClose={() => closedAlert()}
        // style={customStyles}
        contentLabel="Example Modal"
        className="alertModal whiteBorder"
        overlayClassName="alertModalOverlay"
      >
        <div className="alertModalHeader">
          <h4 className="alertModalTitle">Request Response</h4>
          <button
            className="alertModalCloseBtn"
            onClick={() => closedAlert()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{msg}</div>
      </Modal>
    </div>
  );
};
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../../Footer/Footer.module.css";

function NewsLetter(props) {
  const { show, handleClose, footerData } = props;
  // className={styles.signupContainer}

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className={`text-center ${``}`}>
          {footerData?.footer_page_phases?.newsletter_text}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default NewsLetter;

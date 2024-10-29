import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Col,
  Container,
  Form,
  NavDropdown,
  Row,
} from "react-bootstrap";
import NewsLetter from "../Common/NewsLetter/newsLetter.jsx";
import { useEffect, useState } from "react";
export default function Footer({ footerData }) {
  // (footerData);
  // news letter pop up
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("italian");
  const handleOnchangeLanguage = (e) => {
    setLanguage(e.target.value);
    const selectedLanguage = e.target.value;
    const selectedLanguageData = footerData.languages.find(
      (langData) => langData.language === selectedLanguage
    );
    if (selectedLanguageData && selectedLanguageData.url) {
      window.location.href = selectedLanguageData.url;
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <footer>
      <div className={styles.signupContainer}>
        <Container>
          <Row className="align-items-center ">
            <Col lg={6} md={12} xs={12}>
              <div className={"text-uppercase " + styles.singupNewsletter}>
                {footerData?.footer_page_phases?.sign_up_text}
              </div>
              <p className="space-bottom-para">
                {footerData?.footer_page_phases?.sign_up_label}
              </p>
            </Col>
            <Col lg={6} md={12} xs={12} className="top-space">
              <Form className={"d-flex " + styles.emailinput}>
                <div className="search-icon">
                  <i className="ri-mail-line"></i>
                </div>
                <Form.Control
                  type="email"
                  placeholder={`${footerData?.footer_page_phases?.sign_up_placeholder}`}
                  aria-label="Search"
                />
                <Button onClick={handleShow}>
                  {footerData?.footer_page_phases?.sign_up_button}
                </Button>
                <NewsLetter
                  show={show}
                  setShow={setShow}
                  handleClose={handleClose}
                  handleShow={handleShow}
                  footerData={footerData}
                />
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="footer-container">
        <Row>
          <Col lg={3} md={6}>
            <div className="footer-content">
              {/* {console.log(footerData)} */}
              <img
                src={`${footerData?.logo}`}
                alt="Logo"
                width={60}
                height={60}
              />
              <p>{footerData && footerData?.column_one?.desc}</p>
              <div className="social-icon">
                {Object.keys(footerData?.column_one || {}).map((platform) => {
                  const link = footerData.column_one[platform];
                  const iconClass = `ri-${platform.replace("_link", "")}-fill`;

                  return (
                    link && (
                      <a key={platform} href={link} target="_blank">
                        <i className={iconClass}></i>
                      </a>
                    )
                  );
                })}
              </div>
              <div className="location__select">
                <label htmlFor="footer-country-switch-id">
                  <i className="ri-map-pin-line"></i>
                </label>
                <select
                  id="footer-country-switch-id"
                  value={language}
                  onChange={handleOnchangeLanguage}
                >
                  <option value={footerData?.default_language}>
                    {footerData?.default_language}
                  </option>
                  {footerData?.languages?.map((langData, index) => {
                    return (
                      <>
                        <option value={langData?.language} key={index}>
                          {langData?.language}
                        </option>
                      </>
                    );
                  })}
                </select>
              </div>
            </div>
          </Col>
          <Col lg={3} md={6} className="">
            <span className="footer_heading">
              {footerData?.column_two?.c2nd_title}
            </span>
            <div className="address-section">
              {footerData?.column_two?.address && (
                <div className="inner-item">
                  <img
                    src="/images/location.svg"
                    width={20}
                    height={20}
                    alt={footerData?.column_two?.address}
                  />
                  <p>{footerData?.column_two?.address}</p>
                </div>
              )}
              {footerData?.column_two?.phone && (
                <div className="inner-item">
                  <img
                    src="/images/call.svg"
                    width={20}
                    height={20}
                    alt={footerData?.column_two?.phone}
                  />
                  <p>{footerData?.column_two?.phone}</p>
                </div>
              )}
              {footerData?.column_two?.email && (
                <div className="inner-item">
                  <img
                    src="/images/message.svg"
                    width={20}
                    height={20}
                    alt={footerData?.column_two?.email}
                  />
                  <p>{footerData?.column_two?.email}</p>
                </div>
              )}
            </div>
          </Col>
          <Col lg={3} md={6} xs={6} className="top-space">
            <span className="footer_heading">
              {footerData?.column_three?.c3rd_title}
            </span>
            {footerData &&
              footerData?.column_three?.name_link?.map((item, index) => {
                return (
                  <ul
                    className={
                      item[`name${index + 1}`] != null ? "footer_list-item" : ""
                    }
                    key={index}
                  >
                    <li>
                      <a href={item[`link${index + 1}`] || ""}>
                        {item[`name${index + 1}`] != null
                          ? item[`name${index + 1}`]
                          : ""}
                      </a>
                    </li>
                  </ul>
                );
              })}
          </Col>
          <Col lg={3} md={6} xs={6} className="top-space">
            <span className="footer_heading">
              {footerData?.column_four?.title}
            </span>
            <ul className="footer_list-item">
              {footerData &&
                footerData?.column_four?.categories?.map((cat, index) => {
                  return (
                    cat?.title && (
                      <li key={index}>
                        <a href={`/${cat?.permalink}`}>{cat?.title}</a>
                        {/* {(cat)} */}
                      </li>
                    )
                  );
                })}
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="copy-right">
        <p className="text-center">
          {footerData?.footer_page_phases?.copyright}
        </p>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: footerData?.footer_tag_code }}
      ></div>
    </footer>
  );
}

"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Accordion,
  Navbar,
  Modal,
} from "react-bootstrap";
import SearchList from "../Search/SearchList";
import CompareModal from "../Common/Comparison/CompareModal";
export default function Header({ headerData, headerPhase, logo }) {
  // (headerPhase?.page_phases);
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const scrollDirection = useScrollDirection();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState(null);
    // (headerPhase);

    useEffect(() => {
      let lastScrollY = window.pageYOffset;

      const updateScrollDirection = () => {
        const scrollY = window.pageYOffset;
        const direction = scrollY > lastScrollY ? "down" : "up";
        if (
          direction !== scrollDirection &&
          (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)
        ) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      window.addEventListener("scroll", updateScrollDirection); // add event listener
      return () => {
        window.removeEventListener("scroll", updateScrollDirection); // clean up
      };
    }, [scrollDirection]);

    return scrollDirection;
  }
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  // (headerPhase);
  const openCompareModel = () => {
    setIsOpen(true);
    setShow(false);
    document.body.style.overflow = "hidden";
  };
  const handleClear = () => {
    setSearch("");
    setIsFocused(false); // Close the search results
  };
  return (
    <header
      className={`sticky ${
        scrollDirection === "down" ? "top-sticky-not" : "top-sticky"
      }`}
    >
      {/* {(headerPhase)} */}
      <Container>
        <Row className="py-2 align-items-center logo-header">
          <Col lg={2} md={1} xs={2} className="hidden">
            <div className="menu-hambergar text-start">
              <Button className="hambergar-btn" onClick={() => setShow(true)}>
                <i className="ri-menu-line"></i>
              </Button>
              <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                className="menuModal"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-custom-modal-styling-title">
                    Menu
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                  <Accordion>
                    {headerData &&
                      headerData?.map((item, headerDataKey) => (
                        <Accordion.Item
                          eventKey={headerDataKey}
                          key={headerDataKey}
                        >
                          <Accordion.Header as="div">
                            {item?.primary_category}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row>
                              {item?.secondaryCategory_guides?.map(
                                (items, index) => {
                                  return (
                                    <Col lg={3} md={6} xs={12} key={index}>
                                      <div className="nav-list-section">
                                        <span>{items?.secondary_category}</span>
                                        <ul>
                                          {items?.guides &&
                                            items?.guides?.map(
                                              (guide, guideIndex) => (
                                                <li key={guideIndex}>
                                                  <a
                                                    href={`/${guide?.category_url}/${guide?.permalink}`}
                                                    style={{ color: "#fff" }}
                                                  >
                                                    {console.log(guide)}
                                                    {guide?.short_name}
                                                  </a>
                                                </li>
                                              )
                                            )}
                                        </ul>
                                      </div>
                                    </Col>
                                  );
                                }
                              )}
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                  <Navbar className="nav-links-mobile">
                    <Navbar.Brand
                      href=""
                      role="button"
                      onClick={openCompareModel}
                    >
                      {headerPhase && headerPhase?.page_phases?.compare}
                    </Navbar.Brand>
                    <Navbar.Brand
                      href={`/${headerPhase?.page_phases?.how_we_rank_url}`}
                    >
                      {headerPhase?.page_phases &&
                        headerPhase?.page_phases?.how_we_rank}
                    </Navbar.Brand>
                    <Navbar.Brand
                      href={`${headerPhase?.page_phases?.about_us_url}/${headerPhase?.page_phases?.about_us_permalink}`}
                    >
                      {headerPhase?.page_phases &&
                        headerPhase?.page_phases?.about_us}
                    </Navbar.Brand>
                    <Navbar.Brand href="#">
                      {headerData && headerData?.page_phases?.contact}
                    </Navbar.Brand>
                  </Navbar>
                </Modal.Body>
              </Modal>
            </div>
          </Col>
          <Col lg={2} md={10} xs={8} className="text-center">
            <a href="/" className="mobile_logo">
              <img
                src={`${logo}`}
                className="logo mx-auto d-block"
                width={155}
                height={52}
                alt="Logo"
              />
            </a>
          </Col>
          <Col md={1} xs={2} className="hidden"></Col>
          <Col lg={5} md={12} xs={12} className="form-search">
            {pathname !== "/" && (
              <>
                <Form className={"d-flex " + styles.searchbar}>
                  <Form.Control
                    type="search"
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    placeholder={headerPhase?.page_phases?.search_header_text}
                    aria-label="Search"
                    value={search}
                    onChange={handleSearch}
                  />
                  {search !== "" && (
                    <span className="search__close__btn" onClick={handleClear}>
                      <i className="ri-close-line"></i>
                    </span>
                  )}

                  <Button className="searchBarInner">
                    <i className="ri-search-line"></i>
                  </Button>
                  <SearchList
                    setsearch={setSearch}
                    search={search}
                    isFocused={isFocused}
                    setIsFocused={setIsFocused}
                    noDataFoundPhase={
                      headerPhase?.page_phases?.no_results_found
                    }
                  />
                </Form>
              </>
            )}
          </Col>
          <Col lg={5} md={6} className="hide-header-list">
            <ul className={styles.navitem}>
              <li onClick={openCompareModel} role="button">
                {headerPhase && headerPhase?.page_phases?.compare}
              </li>
              <li>
                <a href={`/${headerPhase?.page_phases?.how_we_rank_url}`}>
                  {" "}
                  {headerPhase?.page_phases &&
                    headerPhase?.page_phases?.how_we_rank}
                </a>
              </li>
              {/* {(headerPhase)} */}
              <li>
                <a href={`/${headerPhase?.page_phases?.about_us_url}`}>
                  {headerPhase?.page_phases &&
                    headerPhase?.page_phases?.about_us}
                </a>
              </li>
              <li>
                <a href="#">{headerData && headerData?.contact}</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <nav className={styles.categories_nav_item}>
        <nav className={styles.categories_nav_item}>
          <div className={"nav-dropdown-item " + styles.inner_container}>
            {headerData &&
              headerData?.map((item, headerDataKey) => (
                <div className="cat-nav-item" key={headerDataKey}>
                  <div className="dropdown-toggle nav-link">
                    <a
                      href={`/${item?.primary_category}`}
                      style={{ color: "#fff" }}
                    >
                      {item?.primary_category}
                    </a>
                  </div>

                  <Container className="dropdown-menu">
                    <Row>
                      {item?.secondaryCategory_guides?.map((items, index) => {
                        return (
                          <Col md={3} key={index}>
                            <div className="nav-list-section">
                              <span>{items?.secondary_category}</span>
                              <ul>
                                {items?.guides &&
                                  items?.guides?.map((guide, guideIndex) => (
                                    <li key={guideIndex}>
                                      <a
                                        href={`/${guide?.category_url}/${guide?.permalink}`}
                                        style={{ color: "#fff" }}
                                      >
                                        {guide?.short_name}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Container>
                </div>
              ))}
          </div>
        </nav>
      </nav>
      {/* {(headerPhase)} */}
      {isOpen && <CompareModal favSlider={headerPhase} setIsOpen={setIsOpen} />}
    </header>
  );
}

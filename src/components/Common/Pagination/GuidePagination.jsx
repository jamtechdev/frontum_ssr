import { useEffect, useState, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListing from "../ProductListing/ProductListing";

const GuidePagination = ({ pagination, productPhaseData }) => {
  const { current_page, total_pages } = pagination;
  const [currentPage, setCurrentPage] = useState(current_page || 1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productListRef = useRef(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const pageParam = url.searchParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, []);

  const handlePageClick = (page) => {
    if (page === "...") {
      return; // Ignore clicks on dots
    }
    let newPage;

    if (page === productPhaseData?.previous_page) {
      newPage = currentPage - 1;
    } else if (page === productPhaseData?.next_page) {
      newPage = currentPage + 1;
    } else {
      newPage = page;
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    const url = new URL(window.location.href);
    setCurrentPage(newPage);
    currentParams.set("page", newPage);
    url.searchParams.set("page", newPage);
    window.history.pushState({}, "", url.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });

    const productListElement = document.getElementById("scroll__top");
    if (productListElement) {
      productListElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  let pagesArray = [];

  if (total_pages > 0) {
    if (currentPage !== 1) {
      pagesArray.push(productPhaseData?.previous_page);
    }

    if (total_pages <= 5) {
      for (let i = 1; i <= total_pages; i++) {
        pagesArray.push(i);
      }
    } else {
      pagesArray.push(1);
      if (currentPage > 3) {
        pagesArray.push("...");
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(total_pages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pagesArray.push(i);
      }
      if (currentPage < total_pages - 2) {
        pagesArray.push("...");
      }
      pagesArray.push(total_pages);
    }

    if (currentPage !== total_pages) {
      pagesArray.push(productPhaseData?.next_page);
    }
  }

  return (
    <>
      <Row className="mt-4">
        <Col className="d-flex justify-content-center text-center">
          <ul className="custom-pagination">
            {pagesArray.map((item, index) => (
              <li
                onClick={() => handlePageClick(item)}
                className={
                  item === currentPage
                    ? "page_active"
                    : item === "..." ||
                      item === productPhaseData?.previous_page ||
                      item === productPhaseData?.next_page
                    ? "page_default"
                    : ""
                }
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <div ref={productListRef}>
        <ProductListing />
      </div>
    </>
  );
};

export default GuidePagination;

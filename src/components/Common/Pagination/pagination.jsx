import { Pagination, Col, Row, Button } from "react-bootstrap";

const Pagenation = ({
  totalPages,
  setCurrentPage,
  currentPage,
  setLoadMore,
}) => {
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleLoadMoreClick = () => {
    setLoadMore(true);
    setCurrentPage(currentPage + 1);
  };

  const pagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <>
      <Row>
        <Col md={12} className="text-center">
          <Button className="view-blog load-more" onClick={handleLoadMoreClick}>
            Load more <i className="ri-arrow-right-s-line"></i>
          </Button>
        </Col>
        <Col className="d-flex justify-content-center text-center">
          {/* <Pagination className="pagination-group">
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageClick(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageClick(currentPage - 1)}
            />
            {pagesArray.map((item, index) => (
              <Pagination.Item
                key={index}
                active={currentPage === item}
                onClick={() => handlePageClick(item)}
              >
                {item}
              </Pagination.Item>
            ))}
            <Pagination.Next
              className=" pagination-next"
              disabled={currentPage === totalPages}
              onClick={() => handlePageClick(currentPage + 1)}
            />
            <Pagination.Last
              className=" pagination-last"
              disabled={currentPage === totalPages}
              onClick={() => handlePageClick(totalPages)}
            />
          </Pagination> */}

          <ul className="custom-pagination">
            {pagesArray.map((item, index) => {
              return (
                <li
                  onClick={() => handlePageClick(item)}
                  className={item == currentPage ? "page_active" : ""}
                  key={index}
                >
                  {item}
                </li>
              );
            })}
            <li
              className="page_next"
              onClick={() => handlePageClick(currentPage + 1)}
            >
              Next
            </li>
            <li
              className="page_last"
              onClick={() => handlePageClick(totalPages)}
            >
              Last
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
};

export default Pagenation;

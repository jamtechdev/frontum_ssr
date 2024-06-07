"use client";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";

const IMAGE_ALT_TEXT = "Category Images";
export default function Category({ categories }) {
  // 
  categories;
  return (
    <Row>
      {categories?.map((section, index) => (
        <Col
          xl={3}
          lg={4}
          md={6}
          xs={6}
          key={index}
          // onClick={() => {
          //   router.push(`/${section?.primary_archive_category}`);
          // }}
        >
          {/* {(section)} */}
          <div className="category-section">
            <a href={`/${section?.permalink}`}>
              <img
                src={
                  section?.square_image
                    ? section?.square_image
                    : "/images/nofound.png"
                }
                width={0}
                height={0}
                sizes="100%"
                alt={`/${section?.primary_archive_category}`}
              />

              <span className="category_name" style={{textTransform: 'uppercase'}}>
                {section?.primary_archive_category
                  ? section.primary_archive_category
                  : "NOT-FOUND"}
              </span>
            </a>
          </div>
        </Col>
      ))}
    </Row>
  );
}

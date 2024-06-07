import Image from "next/image";
import { Col, Row } from "react-bootstrap";

export default function Sponsor({ asSeenOn }) {
  return (
    <Row>
      <>
        {asSeenOn.map((section, index) => {
          return (
              <Col lg={2} md={4} xs={6} key={index}>
                <div className="sponsor-image-container">
                  <img
                    src={section.image}
                    width={0}
                    height={0}
                    sizes="100%"
                    alt="Sponcers Image"
                  />
                </div>
              </Col>
          );
        })}
      </>
    </Row>
  );
}

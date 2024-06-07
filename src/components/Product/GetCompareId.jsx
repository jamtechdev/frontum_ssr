"use client"
import React, { useState, useEffect } from "react";
import { productService } from "../../_services";
export const GetCompareId = React.memo(({ finalProducts }) => {
  const [getDataByCompareId, setCompareId] = useState(null);
  const [categoryAttribute, setCategoryAttributes] = useState(null);
  const fetchData = async () => {
    const compareByCatID = await productService?.getCompareProductByCatID(
      finalProducts[0]?.category_id
    );
    setCompareId(compareByCatID);
    const categoryAttributes =
      await productService?.getCategoryAttributesById(
        finalProducts[0]?.category_id
      );
    setCategoryAttributes(categoryAttribute)
  };

  useEffect(() => {
    fetchData()
  }, []);

  return (
    getDataByCompareId &&
    getDataByCompareId?.data && (
      <section>
        <Container>
          <Row className="table-section-mobile">
            <Col md={12}>
              <h2 className="site-main-heading pt-5">
                Comparing Samsung New VR Headset Oculus 2.0 with best robot
                vacuum cleaners
              </h2>
            </Col>
            <Col md={12}>
              <ProductCompareTable
                products={getDataByCompareId.data?.data}
                categoryAttributes={categoryAttribute?.data?.data}
              />
            </Col>
          </Row>
        </Container>
      </section>
    )
  );
})

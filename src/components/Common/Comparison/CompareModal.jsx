import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import { productService } from "@/_services";
import { useSelector, useDispatch } from "react-redux";
import CompareForm from "./CompareForm";
import {
  addCompareProductForGuide,
  updateCompareProduct,
} from "@/redux/features/compareProduct/compareProSlice";
import toast, { Toaster } from "react-hot-toast";
import formatValue from "@/_helpers/formatValue";
const CompareModal = ({ setIsOpen, location, favSlider }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.comparePro.compareProduct)[0];
  // (reduxData);
  const [oftenProducts, setOftenProducts] = useState();
  const [categoryId, setCategoryId] = useState(
    reduxData?.category ? reduxData?.category : undefined
  );
  // (favSlider,"check favslider")

  const handelCloseCompareModel = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };
  const handelCategoryForOffenProduct = (id) => {
    setCategoryId(id);
  };
  // (reduxData);
  const handelOffenProductClick = (product, index) => {
    // (reduxData?.productFirst?.name);
    // (product);
    if (
      reduxData?.productFirst === undefined ||
      reduxData?.productFirst === null
    ) {
      let productData = {
        name: product.name,
        category_id: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };
      dispatch(
        updateCompareProduct({ key: "productFirst", data: productData })
      );
      return;
    }
    if (
      reduxData?.productSecond === undefined ||
      reduxData?.productSecond === null
    ) {
      if (reduxData?.productFirst?.permalink === product.permalink) {
        toast.error("This product has already been added to compare list.");
        return;
      }
      let productData = {
        name: product.name,
        category_id: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };
      dispatch(
        updateCompareProduct({ key: "productSecond", data: productData })
      );
      return;
    }
    if (
      reduxData?.productThird === undefined ||
      reduxData?.productThird === null
    ) {
      if (
        reduxData?.productSecond?.permalink === product.permalink ||
        reduxData?.productFirst?.permalink === product.permalink
      ) {
        toast.error("This product has already been added to compare list.");
        return;
      }
      let productData = {
        name: product.name,
        category_id: product.category_id,
        category_url: product.category_url,
        permalink: product.permalink,
        image: product.main_image ? product.main_image : "/images/nofound.png",
      };

      dispatch(
        updateCompareProduct({ key: "productThird", data: productData })
      );
      return;
    }
  };
  // (reduxData?.productSecond?.name);

  useEffect(() => {
    if (categoryId) {
      // (categoryId, "NEET");
      productService
        .getComparedoftenProduct(categoryId)
        .then((res) => {
          if (res.data.data.length > 0) {
            const filteredProducts = res.data.data.filter(
              (item) =>
                item.name !== reduxData?.productSecond?.name &&
                item.name !== reduxData?.productThird?.name &&
                item.name !== reduxData?.productFirst?.name
            );

            // (reduxData);

            // (filteredProducts?.length);
            setOftenProducts(filteredProducts);
          }
        })
        .catch((error) => {
          //(error);
        });
    }
  }, [categoryId]);
  // (reduxData?.productFirst);

  return (
    <section className="add-product-modal">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="add-product-modal-header">
        <Container>
          <Row>
            <Col md={12}>
              <span
                className="d-block text-end"
                onClick={handelCloseCompareModel}
              >
                <i className="ri-close-circle-line close_icon"></i>
              </span>
            </Col>

            <Col md={12}>
              <h2 className="site-main-heading">
                {favSlider && favSlider?.page_phases?.add_to_comparison}
              </h2>
              <CompareForm
                location="ON_MODEL"
                favSlider={favSlider && favSlider?.page_phases}
                handelCloseCompareModel={handelCloseCompareModel}
                handelCategoryForOffenProduct={handelCategoryForOffenProduct}
              />
            </Col>
          </Row>
        </Container>
      </div>
      {oftenProducts?.length > 0 && (
        <Container className="mt-4">
          <Row>
            <Col md={12}>
              <h2 className="site-main-heading">
                {favSlider?.page_phases?.often_compared}
              </h2>
            </Col>
          </Row>
          {reduxData?.productFirst !== null && (
            <Row>
              {oftenProducts?.map(function (item, index) {
                return (
                  <Col
                    xl={2}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={6}
                    className="my-3"
                    key={index}
                    onClick={() => handelOffenProductClick(item, index + 1)}
                  >
                    <div className="review-wrapper">
                      <div className="review-card">
                        <img
                          src={
                            item?.main_image === null
                              ? "/images/nofound.png"
                              : item?.main_image
                          }
                          width={0}
                          height={0}
                          sizes="100%"
                          alt="Not Found"
                        />

                        <div className="footer_content">
                          <div className="flex-container-section">
                            <span className="text-wrapper">{item?.name}</span>
                          </div>

                          <p>{item?.category || ""}</p>
                        </div>
                        <span
                          className="rating_count"
                          style={{
                            background:
                              item?.overall_score >= 7.5
                                ? "#093673"
                                : item?.overall_score >= 5 &&
                                  item?.overall_score < 7.5
                                ? "#437ECE"
                                : " #85B2F1",
                          }}
                        >
                          {formatValue(item?.overall_score) || ""}
                        </span>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      )}
    </section>
  );
};

export default CompareModal;

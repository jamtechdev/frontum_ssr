"use client";
import BreadCrumb from "@/components/Common/BreadCrumb/breadcrum";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import useChart, { searchForPatternAndReplace } from "@/hooks/useChart";
import ProductSliderBlog from "@/components/Common/ProductSliderBlog/ProductSliderBlog";
import BlogSlider from "@/components/Common/BlogSlider/blogSlider";
import ProductSlider from "@/components/Common/ProductSlider/productSlider";
import OutlineGenerator from "@/components/Common/OutlineGenerator/OutlineGenerator";
import debounce from "lodash/debounce";
import GraphReplacer from "@/_helpers/GraphReplacer";
import { useDispatch, useSelector } from "react-redux";
import { storeTextPartShortCode } from "@/redux/features/compareProduct/compareProSlice";

export default function BlogPage({ slug, blogData, categorySlug }) {
  // (blogData[0]?.data?.page_phases?.updated);
  const [activeOutlineId, setActiveOutlineId] = useState("");
  const contentRef = useRef(null);
  const lastHeadingIdRef = useRef(null);
  const dispatch = useDispatch();
  const addIdsToHeadings = (content) => {
    const headings = content?.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/g) || [];

    headings.forEach((heading) => {
      const id = heading
        .replace(/<\/?[^>]+(>|$)/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
      const newHeading = heading.replace(">", ` id="${id}">`);
      content = content.replace(heading, newHeading);
    });

    return content;
  };
  const contentWithIds = addIdsToHeadings(blogData[0]?.data?.text_part);

  const getGuideTextPartShortcode = useSelector(
    (state) => state.comparePro.text_part_main?.content
  );

  useEffect(() => {
    const replaceShortcodes = () => {
      const elements = document.querySelectorAll(".addClassData");
      elements.forEach((element) => {
        if (!element.classList.contains("observed")) {
          element.classList.add("observed");
          let innerHTML = element.innerHTML;
          const shortCodepatternsRE =
            /\[(pie-chart|vertical-chart|horizontal-chart|correlation-chart)-\d+\]/g;

          innerHTML = innerHTML.replace(shortCodepatternsRE, (match) => {
            return `<span class="chart-placeholder" data-shortcode="${match}">${match}</span>`;
          });
          (innerHTML);

          element.innerHTML = innerHTML;
          dispatch(storeTextPartShortCode({ content: innerHTML }));
        }
      });
    };

    // Delay the execution of replaceShortcodes to ensure the elements are rendered
    const timeoutId = setTimeout(replaceShortcodes, 100);

    const observer = new MutationObserver(replaceShortcodes);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function to clear timeout and disconnect observer
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* <h1>{blogData[0]?.data?.text_part}</h1> */}
      {/* <div>{useChart()}</div> */}
      <section className="product-header">
        <Container>
          <Row className="align-items-center">
            <Col md={12}>
              <BreadCrumb
                firstPageName={categorySlug}
                secondPageName={{ heading_title: blogData[0]?.data?.title }}
                productPhaseData={blogData[0]?.data?.page_phases}
              />
            </Col>
            <Col md={12} lg={12} xl={9}>
              <h1 className="site-main-heading">{blogData[0]?.data?.title}</h1>
            </Col>

            <Col md={12} lg={12} xl={3}>
              <div className="user-info-section">
                {blogData[0]?.data?.author && (
                  <div className="user-section">
                    {blogData[0]?.data?.author?.image && (
                      <img
                        src={
                          blogData[0]?.data?.author?.image
                            ? blogData[0]?.data?.author?.image
                            : "/images/user.png"
                        }
                        width={0}
                        height={0}
                        sizes="100%"
                        alt=""
                      />
                    )}

                    <div className="user-detail">
                      <p>
                        <Link href={`/author/${blogData[0]?.data?.author?.id}`}>
                          {blogData[0]?.data?.author?.name}{" "}
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
                <span>
                  {blogData[0]?.data?.page_phases?.updated} {""}
                  {""}{" "}
                  <i>
                    {""}
                    {blogData[0]?.data?.updated_at
                      .split("/")
                      .reverse()
                      .join("-")}
                  </i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="contentSec my-3">
        <Container>
          <div className="custom-row">
            <div className="left-side-bar">
              <div className="outline-section top-sticky-0">
                <p>{blogData[0]?.data?.page_phases?.outline}</p>
                <OutlineGenerator
                  // currentIndexId={activeOutlineId}
                  blogData={contentWithIds}
                />
                {/* <ol>
                  <li>Overall</li>
                  <li>Technical</li>
                  <li>VS Average</li>
                  <li className="outline-active">
                    Review
                    <ol>
                      <li>Subtile</li>
                      <li>Subtile</li>
                    </ol>
                  </li>
                  <li>Pros/Cons</li>
                </ol> */}
              </div>
            </div>
            <div className="center-section">
              {getGuideTextPartShortcode !== undefined ? (
                <div
                  id="shortCodeText"
                  ref={contentRef}
                  className="addClassData content-para mt-1"
                  dangerouslySetInnerHTML={{
                    __html: getGuideTextPartShortcode,
                  }}
                />
              ) : (
                <div
                  id="shortCodeText"
                  ref={contentRef}
                  className="addClassData content-para mt-1"
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              )}
             
              {blogData[0]?.data?.author && (
                <div className="fonzi p-3 my-md-4 my-xs-0">
                  <div className="profile mb-2">
                    <div className="avatar">
                      <img
                        src={
                          blogData[0]?.data?.author?.image
                            ? blogData[0]?.data?.author?.image
                            : "/images/user.png"
                        }
                        width={0}
                        height={0}
                        sizes="100%"
                        alt=""
                      />
                    </div>
                    <div className="label">
                      <Link href={`/author/${blogData[0]?.data?.author?.id}`}>
                        <p className="name">
                          {blogData[0]?.data?.author?.name}
                        </p>
                      </Link>
                      <p>{blogData[0]?.data?.author?.summary}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mobile-hide right-side-bar productSlider-Container">
              <Row className="mt-3">
                <Col md={12}>
                  <div className="heading-primary secondary mb-2">
                    {blogData[0]?.data?.page_phases?.related_guides_sidebar}
                  </div>
                </Col>
                <Col md={12}>
                  <ProductSliderBlog
                    favSlider={blogData[0]?.data?.related_guides}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>
      {blogData && blogData[0]?.data?.related_blogs?.length > 0 && (
        <section className="blog-slides">
          <Container>
            <Row className="my-3">
              <Col md={12}>
                <h2 className="heading-primary secondary blog-post">
                  {blogData[0]?.data?.page_phases?.blog_posts}
                </h2>
              </Col>
              <Col md={12}>
                <BlogSlider blogData={blogData[0]?.data?.related_blogs} />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {blogData && blogData[0]?.data?.related_guides?.length > 0 && (
        <section>
          <Container>
            <Row className="my-3">
              <Col md={12}>
                <h2 className="heading-primary secondary related-guides">
                  {blogData[0]?.data?.page_phases?.related_guides_bottom}
                </h2>
              </Col>
              <Col md={12}>
                <ProductSlider favSlider={blogData[0]?.data?.related_guides} />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <GraphReplacer />
    </>
  );
}

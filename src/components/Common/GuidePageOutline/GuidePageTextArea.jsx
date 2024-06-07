  import React, { useEffect, useRef, useState } from "react";
  import { Col, Row } from "react-bootstrap";
  import OutlineGenerator from "../OutlineGenerator/OutlineGenerator";
  import Link from "next/link";
  import GraphReplacer from "@/_helpers/GraphReplacer";
  import { useDispatch, useSelector } from "react-redux";
  import { storeTextPartShortCode } from "@/redux/features/compareProduct/compareProSlice";

  function GuidePageTextArea({ guide }) {
    const dispatch = useDispatch();

    // get storeTextPartShortCode from redux store
    const getGuideTextPartShortcode = useSelector(
      (state) => state.comparePro.text_part_main?.content
    );
    // (getGuideTextPartShortcode);

    const [activeOutlineId, setActiveOutlineId] = useState("");
    const contentRef = useRef(null);

    const addIdsToHeadings = (content) => {
      const headings = content.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/g) || [];
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

    const contentWithIds = addIdsToHeadings(guide?.text_third_part_main);

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
            // (innerHTML);

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
        <Row className="mt-3">
          <Col md={3} lg={2}>
            <div className="outline-section">
              <p>{guide && guide?.page_phrases?.outline}</p>
              <OutlineGenerator
                currentIndexId={activeOutlineId}
                blogData={guide?.text_third_part_main}
              />
            </div>
          </Col>

          <Col md={9} lg={8}>
            {getGuideTextPartShortcode !== undefined ? (
              <div
                id="shortCodeText"
                ref={contentRef}
                className="addClassData content-para mt-1"
                dangerouslySetInnerHTML={{ __html: getGuideTextPartShortcode }}
              />
            ) : (
              <div
                id="shortCodeText"
                ref={contentRef}
                className="addClassData content-para mt-1"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            )}

            <br />
          </Col>
          <Col className="mobile-hide" md={12} lg={2}>
            <div className="ranking-section">
              <div className="site-main-heading">
                {guide && guide?.page_phases?.similar_guides}
              </div>
              {guide?.recommended_guides &&
                guide?.recommended_guides.slice(0, 3)?.map((data, index) => {
                  return (
                    <div className="product-card" key={index}>
                      <a
                        className="product-link-cover"
                        href={`/${data?.category_url}/${data?.permalink}`}
                        style={{ color: "#326ebf" }}
                      ></a>
                      <img
                        src={
                          data?.bannerImage === null
                            ? "/images/nofound.png"
                            : data?.bannerImage
                        }
                        width={0}
                        height={0}
                        sizes="100%"
                        alt=""
                      />
                      <span>{data?.short_name}</span>
                    </div>
                  );
                })}
            </div>
          </Col>
          <GraphReplacer />
        </Row>
      </>
    );
  }

  export default GuidePageTextArea;

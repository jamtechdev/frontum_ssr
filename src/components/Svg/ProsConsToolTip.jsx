import React, { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";
import useScreenSize from "@/_helpers/useScreenSize";

const ProsConsToolTip = (props) => {
  const {
    comment,
    hover_phrase,
    info_not_verified,
    info_not_verified_text,
    data,
    
    typeComp,
    finalvalue,
    expert_reviews,
  } = props;

  const { isMobile } = useScreenSize();
  // (info_not_verified)

  let tooltipStyles = {};
  // (expert_reviews&&expert_reviews);
  // const [width, setWidth] = useState(0);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth);
  //   };

  //   handleResize();

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // let result = width - 250
  // let finalvalue = result / 2 -250
  // (finalvalue, "test")

  // if (typeComp === "cons") {
  //   tooltipStyles = {
  //      left:finalvalue,
  //   };
  // } else {
  //   tooltipStyles = {
  //    right: finalvalue,
  //   };
  // }

  return (
    <>
      {hover_phrase && (
        // <div className="tooltip-display-content" style={{ left: isMobile ? finalvalue : 0 ,width:"150px",marginLeft:"50px"}} >
        <div
          className="tooltip-display-content why-tooltip"
          style={{
            left: isMobile ? "50%" : 0,
            transform: isMobile ? "translateX(-60%)" : "translateX(-10%)",
            width: isMobile ? "180px" : "250px", 
             marginBottom:"3px",
             marginTop:"3px"
          }}
        >
          <div
            className="prosconsColor"
            dangerouslySetInnerHTML={{ __html: hover_phrase }}
          ></div>

          {comment && <div className="test__phrase__content ">{comment}</div>}

          {/* {info_not_verified && (
            <>
              <hr />

              <span className="mb-2">
                <i dangerouslySetInnerHTML={{ __html: info_not_verified_text }}>
                  
                </i>
              </span>
            </>
          )} */}
          {/* for expert review  now I comment this code */}
          {/* <div className="user__rating__popup">
              <div className="user__rating__popup__list">
                <span className="user__rating__popup__rating">4.5</span>
                <div className="user__rating__popup__content">
                  <img src="https://frontum.online/expert-review-logo/NationalPost_1709634578.png"/>
                  <p>Nationalpost.com</p>
                </div>
              </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default ProsConsToolTip;

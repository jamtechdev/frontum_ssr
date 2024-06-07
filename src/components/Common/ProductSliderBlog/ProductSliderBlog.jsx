"use client";
import { useState } from "react";
export default function ProductSliderBlog({ favSlider }) {
  const [showFullData, setShowFullData] = useState(false);
  // (favSlider);

  const toggleShowFullData = () => {
    setShowFullData(!showFullData);
  };

  return (
    <section className="product-slider single-blog">
      {favSlider &&
        favSlider
          ?.slice(0, showFullData ? favSlider?.length : 2)
          .map(function (item, index) {
            // (favSlider,"checking sidebar")
            return (
              <div className="product-card mb-3" key={index}>
                <a href={`/${item?.category_url}/${item?.permalink}`}>
                  <img
                    src={
                      item.bannerImage == null
                        ? `/images/nofound.png`
                        : item?.bannerImage
                    }
                    width={0}
                    height={0}
                    sizes="100%"
                    alt=""
                  />
                </a>

                <span>
                  {" "}
                  <a
                    href={`/${item?.category_url}/${item?.permalink}`}
                    style={{ color: "#27304e" }}
                  >
                    {item?.short_name || item?.guide_name}
                  </a>
                </span>
              </div>
            );
          })}
    </section>
  );
}

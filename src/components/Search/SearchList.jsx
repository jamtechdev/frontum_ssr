import React, { useEffect, useState } from "react";
import { homePage } from "../../_services/homepage.service";
import Link from "next/link";
const SearchList = ({ search, isFocused,noDataFoundPhase }) => {
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    if (search !== "" && search !== undefined) {
      homePage
        .searchFilter(search)
        .then((res) => {
          setFilteredData(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [search]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <>
      <div className={isFocused && search?.length > 0 ? "" : "d-none"}>
        <div className="search-dropdown-list">
          {filteredData &&
            Object.keys(filteredData).map((category, index) => (
              <div className="search-data-list" key={index}>
                <h2 className="search-data-heading">
                  {capitalizeFirstLetter(category)}
                </h2>
                <ul>
                  {filteredData[category].map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href={`/${item?.category_url}/${item?.permalink}`}
                        style={{ cursor: "pointer" }}
                      >
                        {/* {(${item?.category_url}/${item?.permalink})} */}
                        {/* {(item)} */}
                        <span style={{ cursor: "pointer" }}>
                          {item?.short_name || item?.title}
                        </span>

                        {item?.banner_image && (
                          <img
                            src={item?.banner_image || item?.image}
                            alt={`Image ${itemIndex}`}
                          />
                        )}
                        {category === "products" && (
                          <span className="d-flex justify-content-end">
                            <i style={{ opacity: 0.6 }}>
                              (
                              {item?.category
                                ? item?.category.charAt(0).toUpperCase() +
                                  item?.category.slice(1)
                                : ""}
                              )
                            </i>
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
          {!filteredData && search !== "" && (
            <div className="search-data-list">
              <span className="no-result-found">{noDataFoundPhase}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchList;

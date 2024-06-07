//Updated
export const getFilteredAttributeValues = (obj) => {
  let uniq = [];
  // (obj)
  let product = [];
  const uniqueValues = obj.values.reduce((acc, currentValue) => {
    if (!acc.includes(currentValue.name)) {
      acc.push(currentValue.name);
    }
    return acc;
  }, []);
  if (obj?.algorithm == "absolute_value") {
    for (let i = 0; i < uniqueValues.length; i++) {
      if (
        !uniq.includes(obj.values[i].name) &&
        obj.values[i].name != "" &&
        obj.values[i].name != "-" &&
        obj.values[i].name != "?" && 
        !obj.values[i].product_count
      ) {
        uniq.push(obj.values[i].name);
      }
      if (
        !uniq.includes(obj.values[i].name) &&
        obj.values[i].name != "" &&
        obj.values[i].name != "-" &&
        obj.values[i].name != "?" &&
        obj.values[i].product_count
      ) {
        uniq.push([obj.values[i].name]);
        product.push([obj.values[i].product_count]);

      }
    }
    // if uniq contain yes or no one of them only then add second one automatically
    if (uniq.includes("no") || uniq.includes("yes")) {
      uniq = ["yes"];
    }
    
    if (uniq.length > 0)
      return {
        type: "dropdown",
        values: uniq,
        product_count: product,
        unit: obj.unit,
      };
  } else if (
    obj.algorithm == "highest_to_lowest" ||
    obj.algorithm == "lowest_to_highest"
  ) {
    for (let i = 0; i < obj.values.length; i++) {
      if (
        !uniq.includes(obj.values[i].name) &&
        obj.values[i].name != "" &&
        obj.values[i].name != "-"
      ) {
        uniq.push(obj.values[i].name);
      }
    }
    let numberedUniq = uniq
      .map((ele) => Number(ele))
      .filter((element) => !isNaN(element));
    let sortedArray = numberedUniq.sort(function (a, b) {
      return a - b;
    });
    // exract productCount
    let countProduct = [];
    // (uniq);
    for (let i = 0; i < obj.values.length; i++) {
      // Check if the name is not blank or "-"
      const name = obj.values[i].name;
      if (
        !obj.values.includes(obj.values[i].name) &&
        name !== "" &&
        name !== "?" &&
        name !== "-"
      ) {
        // Check if the product_count is not already included
        countProduct.push(obj.values[i].product_count);
      }
    }
    // (countProduct, "productCount");
    let numberProductCount = countProduct
      .map((ele) => Number(ele))
      .filter((element) => !isNaN(element));
    let sortedProductCountArray = numberProductCount.sort(function (a, b) {
      return a - b;
    });
    // (sortedProductCountArray);

    if (sortedArray.length <= 4) {
      if (sortedArray.length > 0)
        return {
          type: "dropdown",
          values: sortedArray,
          unit: obj.unit,
          product_count: sortedProductCountArray,
        };
    } else {
      return {
        type: "range",
        values: sortedArray,
        minValue: Math.min(...sortedArray),
        maxValue: Math.max(...sortedArray),
        unit: obj.unit || "",
      };
    }
  }
};

export const removeDecimalAboveNine = (value) => {
  if (value > 9) {
    return Math.floor(value);
  } else {
    return value.toFixed(1);
  }
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const isAreObjectsEqual = (obj1, obj2) => {
  const keys1 = Object?.keys(obj1);
  const keys2 = Object?.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return false;
};

export const getAttributeHalf = (product, half) => {
  if (!product?.attributes) {
    return null;
  }
  const attributeKeys = Object.keys(product.attributes_new);
  const halfLength = Math.ceil(attributeKeys.length / 2);
  if (half === "first") {
    const firstHalfKeys = attributeKeys.slice(0, halfLength);
    const firstHalfAttributes = {};
    firstHalfKeys.forEach((key) => {
      firstHalfAttributes[key] = product.attributes_new[key];
    });
    // (firstHalfAttributes)
    return firstHalfAttributes;
    
  } else if (half === "second") {
    const secondHalfKeys = attributeKeys.slice(halfLength);
    const secondHalfAttributes = {};
    secondHalfKeys.forEach((key) => {
      secondHalfAttributes[key] = product.attributes_new[key];
    });
    return secondHalfAttributes;
  } else {
    throw new Error("Invalid 'half' argument. Use 'first' or 'second'.");
  }
};

// this funcation designed to extract and return half of the attributes from a given product object.
export const getAttributeProductHalf = (product, half) => {
 
  if (!product?.attributes) {
    return null;
  }
  const attributeKeys = Object.keys(product.attributes);
  // attributeKeys.push('Overall')
  // (attributeKeys)
  // (...attributeKeys)
  const halfLength = Math.ceil(attributeKeys.length / 2);
  // (halfLength)
  if (half === "first") {
    const firstHalfKeys = attributeKeys.slice(0, halfLength);
    // (firstHalfKeys)
    const firstHalfAttributes = {};
    firstHalfKeys.forEach((key) => {
      firstHalfAttributes[key] = product.attributes[key];
    });
    return firstHalfAttributes;
  } else if (half === "second") {
    const secondHalfKeys = attributeKeys.slice(halfLength);
    // (secondHalfKeys)
    const secondHalfAttributes = {};
    secondHalfKeys.forEach((key) => {
      secondHalfAttributes[key] = product.attributes[key];
    });
    return secondHalfAttributes;
  } else {
    throw new Error("Invalid 'half' argument. Use 'first' or 'second'.");
  }
};

export const handleFilterValueChange = (
  filterObj,
  setFilterObj,
  category,
  attribute,
  value,
  e
) => {
  let obj = { ...filterObj };
  if (!obj[category]) {
    obj[category] = {};
  }
  if (!obj[category][attribute]) {
    obj[category][attribute] = [];
  }

  if (e.target.checked) {
    // for handling yes no in filterObj if yes no are radio buttons
    // if (value === "yes" && obj[category][attribute].includes("no")) {
    //   // Remove "no" if it exists
    //   obj[category][attribute] = obj[category][attribute].filter(item => item !== "no");
    // }
    // else if (value === "no" && obj[category][attribute].includes("yes")) {
    //   // Remove "yes" if it exists
    //   obj[category][attribute] = obj[category][attribute].filter(item => item !== "yes");
    // }

    // Push the new value
    obj[category][attribute].push(value);
  } else {
    // Remove value if it is in obj[category][attribute]
    obj[category][attribute] = obj[category][attribute].filter(
      (item) => item !== value
    );

    // Remove the object key if it becomes empty
    if (obj[category][attribute].length === 0) {
      delete obj[category][attribute];
    }
    // Remove obj[category] if no any obj[category][attribute]
    if (Object.keys(obj[category]).length === 0) {
      delete obj[category];
    }
  }
  setFilterObj({ ...obj });
  // (obj);
};

export const isCheckboxChecked = (filterObj, category, attribute, value) => {
  const categoryFilter = filterObj[category];
  if (categoryFilter && categoryFilter[attribute]) {
    return categoryFilter[attribute].includes(value);
  }
  return false;
};

export const filterProducts = (
  filterObject,
  products,
  sortBy = { algo: "", rangeAttributes: "Overall" }
) => {
  // if (Object.entries(filterObject).length == 0) return products;
  const filterdProducts = products.filter((product) => {
    // Iterate over the filter categories
    for (const categoryName in filterObject) {
      // Find the attribute category within the product
      const categoryAttributes = product.attributes.filter(
        (attr) => attr.attribute_category.name == categoryName
      );

      if (categoryAttributes.length > 0) {
        // Iterate over the attributes and their values within the category
        for (const attributeName in filterObject[categoryName]) {
          const attributeValues = filterObject[categoryName][attributeName].map(
            // (value) => String(value)
            (value) => {
              if (typeof value === "object") {
                return value;
              } else return String(value);
            }
          );

          // Find the corresponding attribute within the categoryAttributes
          const attribute = categoryAttributes.find(
            (attr) => attr.attribute == attributeName
          );

          if (attribute) {
            // (attribute.attribute_value)
            // Check if the attribute value matches any of the filter values
            if (typeof attributeValues[0] == "object") {
              if (
                attributeValues[0].min <= attribute.attribute_value &&
                attributeValues[0].max >= attribute.attribute_value
              )
                continue;
              else return false;
            } else if (attributeValues.includes(attribute.attribute_value)) {
              continue;
            } else {
              return false; // At least one attribute did not match, so skip this product
            }
          } else {
            return false; // Attribute not found, skip this product
          }
        }
      } else {
        return false; // Category not found, skip this product
      }
    }

    return true; // All filter conditions matched, include this product
  });

  if (sortBy.algo == "") {
    return [...filterdProducts];
  } else {
    // (sortBy.algo)
    const sortedProducts = [...filterdProducts];
    if (sortBy.algo == "highest_to_lowest") {
      sortedProducts.sort((a, b) => {
        const productAattr = a.attributes.find(
          (attribute) => attribute.attribute === sortBy.rangeAttributes
        );
        const productBattr = b.attributes.find(
          (attribute) => attribute.attribute === sortBy.rangeAttributes
        );

        if (productAattr && productBattr) {
          const valueA = Number(productAattr.attribute_value);
          const valueB = Number(productBattr.attribute_value);

          // Sort in descending order
          return valueB - valueA;
        } else {
          return 0;
        }
      });
    } else if (sortBy.algo == "lowest_to_highest") {
      sortedProducts.sort((a, b) => {
        const productAattr = a.attributes.find(
          (attribute) => attribute.attribute == sortBy.rangeAttributes
        );
        const productBattr = b.attributes.find(
          (attribute) => attribute.attribute == sortBy.rangeAttributes
        );
        // (productAattr)
        if (productAattr && productBattr) {
          const valueA = Number(productAattr.attribute_value);
          const valueB = Number(productBattr.attribute_value);

          // Sort in ascending order
          return valueA - valueB;
        } else {
          return 0;
        }
      });
    } else if (sortBy.algo == "high-low") {
      sortedProducts.sort((a, b) => {
        if (b[sortBy.rangeAttributes] && a[sortBy.rangeAttributes])
          return b[sortBy.rangeAttributes] - a[sortBy.rangeAttributes];
        else return 0;
      });
    } else if (sortBy.algo == "low-high") {
      sortedProducts.sort((a, b) => {
        if (b[sortBy.rangeAttributes] && a[sortBy.rangeAttributes])
          return a[sortBy.rangeAttributes] - b[sortBy.rangeAttributes];
        else return 0;
      });
    }
    return sortedProducts;
  }
};

export const arrangeProducts = (apiGuideData) => {
  let topCounts;
  let priceRangeAndBrandsArray;
  let guides;
  const productListing = [...apiGuideData?.product_listing];
  const products = [...apiGuideData?.products];

  const sortedProducts = [];
  productListing.forEach((productName, index) => {
    const product = products.find((p) => p.name === productName);
    if (product) {
      product.position = index + 1;
      sortedProducts.push(product);
    }
  });
  const newApiGuideData = { ...apiGuideData, products: sortedProducts };
  let priceArray = [];
  products.forEach((product, index) => {
    priceArray.push(product.highest_price);
  });
  //final guide
  guides = newApiGuideData;
  priceRangeAndBrandsArray = {
    priceRange: { min: Math.min(...priceArray), max: Math.max(...priceArray) },
    brands: [...apiGuideData.brands],
  };
  topCounts = { ...newApiGuideData.top_guide_counts };

  return { guides, priceRangeAndBrandsArray, topCounts };
};

export const arrangeCategories = (apiCategoryData, setCategoryAttributes) => {
  const sortedCategoryData = [...apiCategoryData].sort(
    (a, b) => a.position - b.position
  );
  // (sortedCategoryData)
  setCategoryAttributes(sortedCategoryData);
};

export const productsLastFilter = (
  filterObjPriceBrand,
  products,
  isInitialLoad
) => {
  if (!Object.keys(filterObjPriceBrand).length) {
    return products; // No filters, return the original products array
  } else {
    let finalProducts = [...products]; // Copy the original products array

    if (filterObjPriceBrand.price) {
      finalProducts = finalProducts.filter(
        (product) =>
          filterObjPriceBrand.price.min <= product.highest_price &&
          product.highest_price <= filterObjPriceBrand.price.max
      );
    }

    if (filterObjPriceBrand.available) {
      finalProducts = finalProducts.filter(
        (product) => product.price_websites.length > 0
      );
    }

    if (filterObjPriceBrand.brand && filterObjPriceBrand.brand.length > 0) {
      finalProducts = finalProducts.filter((product) =>
        filterObjPriceBrand.brand.includes(product.brand)
      );
    }

    return finalProducts;
  }
};

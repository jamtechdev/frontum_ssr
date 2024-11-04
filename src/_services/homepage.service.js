import axios from "axios";
export const homePage = {
  counterApi,
  searchFilter,
  getAllSearchedProducts,
  getAllSearchedProductsByCategory,
  getMainPageBannerCounts,
  getFavouriteGuides,
};
// api headers
const headers = {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    "Content-type": "application/json",
  },
};

// counter api
async function counterApi(data) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/homepage/counts`,
    headers,
    data
  );
}
// search start https://panel.mondopedia.it/api/v1/
async function searchFilter(query) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/search?query=${query}`,
    headers
  );
}

async function getAllSearchedProducts(query) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/compare/products?query=${query}`,
    headers
  );
}

async function getAllSearchedProductsByCategory(catId, query) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/compare/products/${catId}?query=${query}`,
    headers
  );
}

async function getMainPageBannerCounts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/homepage/counts`,
    {
      next: { revalidate: 10 },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data", response);
  }
  let result = await response.json();
  return result.data;
}
async function getFavouriteGuides() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      "Content-type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data", response);
  }
  
  const result = await response.json();
  return result.data;
}
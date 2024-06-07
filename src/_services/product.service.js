import axios from "axios";
export const productService = {
  getProducts,
  getProductsTestPermalink,
  getCompareProductByCatID,
  getCategoryAttributesById,
  getComparedProPermalink,
  getComparedoftenProduct
};
const config = {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` },
};
async function getProducts(data) {
  return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product`, data);
}

async function getProductsTestPermalink(permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${permalink}`,
    config
  );
}
async function getCompareProductByCatID(id) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/compare-product/${id}`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
  );
}

async function getCategoryAttributesById(id) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}/attributes`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
  );
}

async function getComparedProPermalink(permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${permalink}`,
    config
  );
}

// / https://panel.mondopedia.it/api/v1/product/compare/often-products/1

async function getComparedoftenProduct(id) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/product/compare/often-products/${id}`,
    config
  );
}

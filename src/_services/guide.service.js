import axios from "axios";
export const guideService = {
  getCategoryAttributes,
  getTopGuideCount,
  getAllguides,
};
async function getCategoryAttributes(category_id,permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/guide/${category_id}/${permalink}/attributes`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
  );
}
async function getTopGuideCount(permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/guide/top-guide-counts/${permalink}`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
  );
}
async function getAllguides(permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/guide/archive-page/${permalink}`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` } }
  );
}



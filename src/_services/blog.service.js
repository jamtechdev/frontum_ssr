import axios from "axios";
export const blogService = {
  getBlogByPermalink,
  getAuthorById,
  allBlogs,
};
const config = {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` },
};

async function getBlogByPermalink(permalink) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/${permalink}`,
    config
  );
}

async function getAuthorById(authorId) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/author/${authorId}`,
    config
  );
}
async function allBlogs(cat_name, page) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs/blog-by-primary-category/${cat_name}?page=${page}`,
    config
  );
}

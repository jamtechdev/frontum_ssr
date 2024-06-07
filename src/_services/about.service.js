import axios from "axios";
export const aboutUsService = {
  aboutUsAPi,
  getAuthorById,
  notDataFound
};

async function aboutUsAPi() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about-us`, {
    next: { revalidate: 10 },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data", response);
  }
  let result = await response.json();
  return result.data;
}

async function getAuthorById(authorId) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/author/${authorId}`,
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

async function notDataFound() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/page-not-found`,
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

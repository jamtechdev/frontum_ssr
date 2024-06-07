import axios from "axios";
export const getterService = {
  getAboutUs,
  getPrivacyPolicy,
  getTermCondition,
  getFaq,
  getFooterData,
  getTopNavBarData,
};

async function getAboutUs(data) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}getters/about-us`,
    data
  );
}

async function getPrivacyPolicy(data) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}getters/privacy-policy`,
    data
  );
}

async function getTermCondition(data) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}getters/terms-and-condition`,
    data
  );
}

async function getFaq(data) {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}getters/faq`, data);
}

//New Service Migrations
async function getFooterData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/footer`, {
    next: { revalidate: 10 },
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`, 'Content-type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data', response)
  }
  let result = await response.json();
  return result.data;
}

async function getTopNavBarData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/header`, {
    next: { revalidate: 10 },
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`, 'Content-type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch data', response)
  }
  let result = await response.json();
  return result.data;
}

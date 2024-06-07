import axios from "axios";
export const newsLetterService = {
  getNewsLetter,
};

async function getNewsLetter(data) {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}news-letter/subscription`,
    data
  );
}

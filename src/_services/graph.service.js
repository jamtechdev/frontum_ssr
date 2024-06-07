import axios from "axios";
export const graphService = {
  getGraphData,
};

async function getGraphData(params) {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-graph`,
    {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}` },
      params: params
    }
  );
}

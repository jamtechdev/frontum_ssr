import React from "react";
import MainPage from "./_components/MainPage";
import { homePage } from "@/_services";
export default async function Page() {
  const bannerCounts = await homePage.getMainPageBannerCounts();
  const favGuideSlider = await homePage.getFavouriteGuides();

  return (
    <React.Suspense fallback={<p>Loading....</p>}>
      <MainPage bannerCounts={bannerCounts} favSlider={favGuideSlider} />
    </React.Suspense>
  );
}
export async function generateMetadata(params) {
  const meta_data = await getMetaData();
  const siteURL = "https://mondopedia.it";
  return {
    title: meta_data?.data?.title || "Comparison web",
    generator: "Comparison web",
    applicationName: "Comparison web",
    referrer: "origin-when-cross-origin",
    keywords: ["compare", "product"],
    description: meta_data?.data?.description || "Comparison web",
    alternates: {
      canonical: `${siteURL}`,
    },
    ogType: "FRONTUM",
    language: "en", // Language meta tag
  };
}
async function getMetaData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/homepage/meta`,
    {
      next: { revalidate: 10 },
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }
  );
  if (!response.ok) {
  }
  return response.json();
}

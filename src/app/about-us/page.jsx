import React from "react";
import AboutPage from "../_components/AboutPage";
import { aboutUsService } from "@/_services";
import Head from "next/head";

export default async function Page() {
  const aboutData = await aboutUsService.aboutUsAPi();
  return (
    <>
      <React.Suspense fallback={<p>Loading....</p>}>
        <AboutPage aboutData={aboutData} />
      </React.Suspense>
    </>
  );
}

export async function generateMetadata(params) {
  const aboutData = await aboutUsService.aboutUsAPi();
  const siteURL = process.env.NEXT_BASE_URL;
  return {
    title: aboutData?.title || "Comparison web",
    generator: "Comparison web",
    applicationName: "Comparison web",
    referrer: "origin-when-cross-origin",
    keywords: ["compare", "product"],
    description: aboutData?.meta_description || "Comparison web",
    alternates: {
      canonical: `${siteURL}/about-us`,
    },
  };
}

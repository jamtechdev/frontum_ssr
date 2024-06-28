import React from "react";
import AuthorPage from "@/app/_components/AuthorPage";
import { aboutUsService } from "@/_services";

export default async function Page(props) {
  const { params } = props;
  const authorData = await aboutUsService.getAuthorById(params?.author);
  return (
    <React.Suspense fallback={<p>Loading....</p>}>
      <AuthorPage authorData={authorData} />
    </React.Suspense>
  );
}

export async function generateMetadata(props) {
  const { params } = props;
  // (params)
  const authorData = await aboutUsService.getAuthorById(params?.author);
  // (authorData)

  const siteURL = process.env.NEXT_BASE_URL;
  return {
    title: authorData?.name,
    generator: "Comparison web",
    applicationName: "Comparison web",
    referrer: "origin-when-cross-origin",
    keywords: ["compare", "product"],
    description: "Comparison web",
    alternates: {
      canonical: `${siteURL}/${params?.author}`,
    },
    ogType: "FRONTUM",
    language: "en", // Language meta tag
  };
}

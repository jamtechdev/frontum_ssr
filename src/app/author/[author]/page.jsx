import React from "react";
import AuthorPage from "@/app/_components/AuthorPage";
import { aboutUsService } from "@/_services";
import NotFound from "@/app/not-found";

export async function generateMetadata({ params }) {
  const authorData = await aboutUsService.getAuthorById(params?.author);

  if (!authorData || authorData === 404) {
    return {
      title: "Author Not Found",
      description: "This author does not exist",
    };
  }

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL; // Ensure this environment variable is set
  return {
    title: authorData.name || "Author Page",
    description: authorData.summary || "Comparison web",
    alternates: {
      canonical: `${siteURL}/author/${params.author}`,
    },
    openGraph: {
      type: "profile",
      url: `${siteURL}/author/${params.author}`,
      title: authorData.name || "Author Page",
      description: authorData.summary || "Comparison web",
    },
    twitter: {
      card: "summary",
      title: authorData.name || "Author Page",
      description: authorData.summary || "Comparison web",
    },
  };
}

export default async function Page({ params }) {
  const authorData = await aboutUsService.getAuthorById(params?.author);

  if (authorData === 404) return <NotFound />;
  return (
    <React.Suspense fallback={<p>Loading....</p>}>
      <AuthorPage authorData={authorData} />
    </React.Suspense>
  );
}

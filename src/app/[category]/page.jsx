import PageSwitch from "@/app/_components/PageSwitch";
import NotFound from "../not-found";

// Main Page Component
export default async function Page({ params: { category } }) {
  try {
    const slugType = await getSlugType(category);
    if (!slugType.type) return <NotFound />;

    const pageData = await fetchDataBasedOnPageType(category, slugType.type);
    if (pageData) {
      return (
        <PageSwitch
          PageType={slugType.type}
          slug={category}
          pageData={pageData}
        />
      );
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
  return <NotFound />;
}

// Function to Get the Type of a Slug
async function getSlugType(category) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/check/${category}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch slug type");
    return await response.json();
  } catch (error) {
    console.error("Error in getSlugType:", error);
    return { error: "Permalink not found" };
  }
}

// Function to Fetch Metadata for a Given Category
async function getSlugMetaData(category) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meta-data/${category}`,
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
    if (!response.ok) throw new Error("Failed to fetch metadata");
    return await response.json();
  } catch (error) {
    console.error("Error in getSlugMetaData:", error);
    return null;
  }
}

// Function to Fetch 'Page Not Found' Data
async function getNoDataFound() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/page-not-found`,
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
    if (!response.ok) throw new Error("Failed to fetch 'Page Not Found' data");
    return await response.json();
  } catch (error) {
    console.error("Error in getNoDataFound:", error);
    return null;
  }
}

// Generate Metadata for a Given Category
export async function generateMetadata({ params: { category } }) {
  const siteURL = process.env.NEXT_BASE_URL;
  let metaData = (await getSlugMetaData(category)) || {};

  const slugType = await getSlugType(category);
  if (slugType.error === "Permalink not found") {
    metaData = (await getNoDataFound()) || {};
  }

  return {
    title: metaData.data?.title || "Comparison Web",
    description:
      metaData.data?.meta_description || "Comparison web description",
    generator: "Comparison web",
    applicationName: "Comparison web",
    referrer: "origin-when-cross-origin",
    lang: "en",
    keywords: ["compare", "product"],
    alternates: {
      canonical: `${siteURL}/${category}`,
    },
    openGraph: {
      type: "website",
    },
  };
}

// Function to Fetch Data Based on Page Type and Category
async function fetchDataBasedOnPageType(slug, pageType) {
  try {
    const apiUrls = getApiUrls(pageType, slug);
    const responses = await Promise.all(
      apiUrls.map(async (apiUrl) => {
        const response = await fetch(apiUrl, {
          next: { revalidate: 10 },
          cache: "no-cache",
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error in fetchDataBasedOnPageType:", error);
    return null;
  }
}

// Helper Function to Get API URLs Based on Page Type
function getApiUrls(pageType, slug) {
  switch (pageType) {
    case "PrimaryArchiveCategory":
      return [`${process.env.NEXT_PUBLIC_API_URL}/guide/archive-page/${slug}`];
    case "ProductCategory":
      return [
        `${process.env.NEXT_PUBLIC_API_URL}/category/archive-page/${slug}`,
      ];
    case "SinglePage":
      return [`${process.env.NEXT_PUBLIC_API_URL}/single-page/${slug}`];
    case "AboutUs":
      return [`${process.env.NEXT_PUBLIC_API_URL}/about-us`];
    default:
      return [];
  }
}

import PageSwitch from "@/app/_components/PageSwitch";
import NotFound from "@/app/not-found";

// Main Page Component
export default async function Page({ params: { category, slug }, searchParams }) {
  try {
    const categorySlugType = await getSlugType(category);
    if (categorySlugType.error) return <NotFound />;

    const slugType = await getSlugType(slug);
    if (!slugType.type) return <NotFound />;

    const pageData = await fetchDataBasedOnPageType(slug, slugType.type, category, searchParams);
    if (pageData) {
      return (
        <PageSwitch
          PageType={slugType.type}
          categorySlug={category}
          slug={slug}
          pageData={pageData}
          searchParams={searchParams}
        />
      );
    }
  } catch (error) {
    console.error("Error loading page:", error);
    return <NotFound />;
  }
  return <NotFound />;
}

// Fetch Metadata for a Slug and Category
async function getSlugMetaData(slug, category) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/meta-data/${slug}?category=${category}`, {
        next: { revalidate: 10 },
        cache: "no-cache",
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch slug metadata");
    return response.json();
  } catch (error) {
    console.error("Error in getSlugMetaData:", error);
    return null;
  }
}

// Fetch No Data Found Scenario Metadata
async function getNoDataFound() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page-not-found`, {
      next: { revalidate: 10 },
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch 'No Data Found' metadata");
    return response.json();
  } catch (error) {
    console.error("Error in getNoDataFound:", error);
    return null;
  }
}

// Generate Metadata Function
export async function generateMetadata({ params: { slug, category } }) {
  const capitalizeFirstLetter = (str) =>
    str.replace(/-/g, " ").replace(/\b(\w)/g, (match) => match.toUpperCase());

  if (slug.includes("-vs-")) {
    const metaData = await getSlugMetaData(slug, category);
    return constructMetadata(metaData, slug, category);
  } else {
    const slugType = await getSlugType(slug);
    if (slugType.error === "Permalink not found") {
      const metaData = await getNoDataFound();
      return constructMetadata(metaData, slug, category);
    } else {
      const metaData = await getSlugMetaData(slug, category);
      return constructMetadata(metaData, slug, category);
    }
  }
}

// Helper Function for Metadata Construction
function constructMetadata(metaData, slug, category) {
  const siteURL = process.env.NEXT_BASE_URL;
  if (metaData && metaData.data) {
    return {
      title: metaData.data.title || "Comparison web",
      description: metaData.data.meta_description || "Comparison web",
      generator: "Comparison web",
      applicationName: "Comparison web",
      referrer: "origin-when-cross-origin",
      lang: "en",
      keywords: ["compare", "product"],
      alternates: { canonical: `${siteURL}/${category}/${slug}` },
      openGraph: { type: "website" },
    };
  }
  console.error("Invalid metadata response:", metaData);
  return "";
}

// Fetch the Type of a Slug
async function getSlugType(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check/${slug}`, {
      next: { revalidate: 10 },
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch slug type");
    return response.json();
  } catch (error) {
    console.error("Error in getSlugType:", error);
    return { error: "Permalink not found" };
  }
}

// Fetch Data Based on Page Type
async function fetchDataBasedOnPageType(slug, pageType, category, searchParams) {
  try {
    const apiUrls = getApiUrls(pageType, slug, category, searchParams);
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
        return response.json();
      })
    );
    return responses;
  } catch (error) {
    console.error("Error in fetchDataBasedOnPageType:", error);
    return null;
  }
}

// Get API URLs Based on Page Type
function getApiUrls(pageType, slug, category, searchParams) {
  let apiUrls = [];
  switch (pageType) {
    case "Guide":
      let guideUrl = `${process.env.NEXT_PUBLIC_API_URL}/guide/products/${category}/${slug}?query=${JSON.stringify(
        searchParams
      )}`;
      if (searchParams?.page) guideUrl += `&page=${searchParams.page}`;
      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/guide/${category}/${slug}`,
        guideUrl,
      ];
      break;
    case "Blog":
      apiUrls = [`${process.env.NEXT_PUBLIC_API_URL}/blogs/${category}/${slug}`];
      break;
    case "Product":
      apiUrls = [`${process.env.NEXT_PUBLIC_API_URL}/product/${category}/${slug}`];
      break;
    case "Compare":
      const permalinks = [...new Set(slug.split("-vs-"))];
      apiUrls = permalinks.map(
        (permalink) =>
          `${process.env.NEXT_PUBLIC_API_URL}/product/${category}/${permalink}?compare=${slug}`
      );
      break;
    default:
      return [];
  }
  return apiUrls;
}

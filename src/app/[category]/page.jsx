import PageSwitch from "@/app/_components/PageSwitch";
import NotFound from "../not-found";
export default async function Page({ params: { category } }) {
  // Get the type of slug for the category
  const slugType = await getSlugType(category);
  if (slugType.type) {
    // Fetch data based on page type
    const pageData = await fetchDataBasedOnPageType(category, slugType.type);
    if (pageData != null) {
      // Render PageSwitch component with fetched data
      return (
        <PageSwitch
          PageType={slugType.type}
          slug={category}
          pageData={pageData}
        />
      );
    } else {
      // Render NotFound component if no data is found
      return <NotFound />;
    }
  } else {
    // Render NotFound component if slug type does not exist
    return <NotFound />;
  }
}
// Function to fetch the slug type for a given category
async function getSlugType(category) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/check/${category}`,
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
// Function to fetch metadata for a given category
async function getSlugMetaData(category) {
  // (category)
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
  if (!response.ok) {
  }
  return response.json();
}
// Function to fetch 'Page not found' data for a given category
async function getNoDataFound(category) {
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
  if (!response.ok) {
  }
  return response.json();
}

// Function to generate metadata for a given category
export async function generateMetadata({ params: { category } }) {
  let meta_data = { data: {} };
  const siteURL = process.env.NEXT_BASE_URL;

  try {
    const response = await getSlugMetaData(category);
    // (response);
    if (response && response.data) {
      meta_data = response.data;
      // (meta_data);
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
  const slugType = await getSlugType(category);
  if (slugType.error === "Permalink not found") {
    const meta_data = await getNoDataFound();
    const siteURL = process.env.NEXT_BASE_URL;
    if (meta_data && meta_data.data) {
      return {
        title: meta_data.data.title,
        description: meta_data.data.meta_description || meta_data.data.title,
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
    } else {
      console.error("Invalid meta_data response:", meta_data);
      return "";
    }
  }

  return {
    title: meta_data?.title || "web",
    generator: "Comparison web",
    applicationName: "Comparison web",
    referrer: "origin-when-cross-origin",
    keywords: ["compare", "product"],
    description: meta_data?.meta_description || "Comparison web description",
    alternates: {
      canonical: `${siteURL}/${category}`,
    },
  };
}

// Function to fetch data based on page type and category
async function fetchDataBasedOnPageType(slug, pageType) {
  let apiUrls = [];
  switch (pageType) {
    case "PrimaryArchiveCategory":
      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/guide/archive-page/${slug}`,
      ];
      break;
    case "ProductCategory":
      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/category/archive-page/${slug}`,
      ];
      break;
    case "SinglePage":
      apiUrls = [`${process.env.NEXT_PUBLIC_API_URL}/single-page/${slug}`];
      break;
    case "AboutUs":
      apiUrls = [`${process.env.NEXT_PUBLIC_API_URL}/about-us`];
      break;
    default:
      return null;
  }

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
      if (!response.ok) {
      }
      return response.json();
    })
  );
  return responses;
}

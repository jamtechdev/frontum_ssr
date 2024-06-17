import PageSwitch from "@/app/_components/PageSwitch";
import NotFound from "@/app/not-found";

export default async function Page({
  params: { category, slug },
  searchParams,
}) {
  try {
    const categoryslugType = await getSlugType(category);
    // Check the category slug type
    if (categoryslugType.error) {
      return <NotFound />;
    }
    // Check the slug type
    const slugType = await getSlugType(slug);
    if (slugType.type) {
      // Fetch data based on page type
      const pageData = await fetchDataBasedOnPageType(
        slug,
        slugType.type,
        category,
        searchParams
      );
      // (pageData)
      if (pageData) {
        // Render the page based on the page type
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
    }
  } catch (error) {
    // Return NotFound component if there's an error
    return <NotFound />;
  }
  return <NotFound />;
}
// Function to fetch metadata for a given slug and category
async function getSlugMetaData(slug, category) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meta-data/${slug}?category=${category}`,
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

// Function to fetch data for 'Page not found' scenario
async function getNoDataFound(slug, category) {
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
// Function to fetch  metadata based on slug and category
export async function generateMetadata({ params: { slug, category } }) {
  const capitalizeFirstLetter = (str) =>
    str.replace(/-/g, " ").replace(/\b(\w)/g, (match) => match.toUpperCase());

  const generateComparisonMetaData = (extractedUrls, category) => {
    const siteURL = process.env.NEXT_BASE_URL;
    // (category);
    const firstTitle = capitalizeFirstLetter(extractedUrls[0]);
    const secondTitle = capitalizeFirstLetter(extractedUrls[1]);
    const thirdTitle =
      extractedUrls.length > 2 ? capitalizeFirstLetter(extractedUrls[2]) : "";

    const title =
      extractedUrls.length > 2
        ? `${firstTitle} vs ${secondTitle} vs ${thirdTitle}`
        : `${firstTitle} vs ${secondTitle}`;
    return {
      title: title || "Comparison web",
      generator: "Comparison web",
      applicationName: "Comparison web",
      referrer: "origin-when-cross-origin",
      keywords: ["compare", "product"],
      lang: "en",
      description: "compare-page",
      openGraph: {
        type: "website",
      },
      alternates: {
        canonical: `${siteURL}/${category}/${extractedUrls}`,
      },
    };
  };

  if (slug.includes("-vs-")) {
    const meta_data = await getSlugMetaData(slug, category);
    // (meta_data);
    const siteURL = process.env.NEXT_BASE_URL;
    if (meta_data && meta_data.data) {
      return {
        title: meta_data.data.title,
        description: meta_data.data.meta_description,
        generator: "Comparison web",
        applicationName: "Comparison web",
        referrer: "origin-when-cross-origin",
        lang: "en",
        keywords: ["compare", "product"],
        alternates: {
          canonical: `${siteURL}/${category}/${slug}`,
        },
        openGraph: {
          type: "website",
        },
      };
    } else {
      console.error("Invalid meta_data response:", meta_data);
      return "";
    }
  } else {
    const slugType = await getSlugType(slug);
    if (slugType.error === "Permalink not found") {
      const meta_data = await getNoDataFound();
      const siteURL = process.env.NEXT_BASE_URL;
      if (meta_data && meta_data.data) {
        return {
          title: meta_data.data.title,
          description: meta_data.data.meta_description,
          generator: "Comparison web",
          applicationName: "Comparison web",
          referrer: "origin-when-cross-origin",
          lang: "en",
          keywords: ["compare", "product"],
          alternates: {
            canonical: `${siteURL}/${category}/${slug}`,
          },
          openGraph: {
            type: "website",
          },
        };
      } else {
        console.error("Invalid meta_data response:", meta_data);
        return "";
      }
    } else {
      const meta_data = await getSlugMetaData(slug, category);
      const siteURL = process.env.NEXT_BASE_URL;
      if (meta_data && meta_data.data) {
        return {
          title: meta_data.data.title,
          description: meta_data.data.meta_description,
          generator: "Comparison web",
          applicationName: "Comparison web",
          referrer: "origin-when-cross-origin",
          lang: "en",
          keywords: ["compare", "product"],
          alternates: {
            canonical: `${siteURL}/${category}/${slug}`,
          },
          openGraph: {
            type: "website",
          },
        };
      } else {
        console.error("Invalid meta_data response:", meta_data);
        return "";
      }
      // ("test", meta_data?.data?.meta_description);
    }
  }
}
// Function to get the type of a slug
async function getSlugType(slug) {
  // (slug)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/check/${slug}`,
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

// Function to fetch data based on page type
async function fetchDataBasedOnPageType(
  slug,
  pageType,
  category,
  searchParams
) {
  // ("Abhay", pageType);
  let apiUrls = [];
  switch (pageType) {
    case "Guide":
      let productApiUrl = `${
        process.env.NEXT_PUBLIC_API_URL
      }/guide/products/${category}/${slug}?query=${JSON.stringify(
        searchParams
      )}`;
      // (productApiUrl);

      if (searchParams?.page) {
        productApiUrl += `&page=${searchParams.page}`;
      }

      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/guide/${category}/${slug}`,
        productApiUrl,
      ];
      // console.log(apiUrls);

      break;
    case "Blog":
      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${category}/${slug}`,
      ];
      break;
    case "Product":
      apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/product/${category}/${slug}`,
      ];
      break;
    case "Compare":
      const permalinks = slug.split("-vs-");
      // (permalinks, "permalinks");
      const removeDuplicatePermalinks = Array.from(new Set(permalinks));
      // (removeDuplicatePermalinks);
      apiUrls = removeDuplicatePermalinks.map(
        (permalink) =>
          `${process.env.NEXT_PUBLIC_API_URL}/product/${category}/${permalink}?compare=${slug}`
      );
      // (apiUrls)
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

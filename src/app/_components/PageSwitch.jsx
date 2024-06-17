import GuidePage from "./GuidePage";
import BlogPage from "./BlogPage";
import ProductPage from "./ProductPage";
import CategoryArchive from "./CategoryArchive";
import ProductCategoryArchivePage from "./ProductCategoryArchivePage";
import Comparison from "./Comparison";
import SinglePage from "./SinglePage";
import AboutPage from "./AboutPage";
import ProductPageSSR from "./ProductPageSSR";
export default async function PageSwitch({
  PageType,
  slug,
  categorySlug,
  pageData,
  searchParams,
}) {
  let PageToRender;
  // (PageType,slug);
  // decode html string
  function searchCharts(text) {
    const regex = /\[(.*?)\]/g;
    let matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
    }
    return matches;
  }
  function replaceTextPart(matchShortCode, third_text) {
    for (let i = 0; i < matchShortCode?.length; i++) {
      third_text = third_text?.replace(matchShortCode[i], `hello navneet`);
    }

    return third_text;
  }
  // Switch statement to determine which page component to render based on PageType
  switch (PageType) {
    case "Guide":
      // Render GuidePage component
      const guide = pageData[0]?.data;
      const attributes = await getCategoryAttributes(guide?.category_id, slug);
      const productTable = await getProductForTable(guide?.category_url, slug);
      const third_text = pageData[0]?.data?.text_third_part_main;
      const matchShortCode = searchCharts(third_text);
      PageToRender = (
        <GuidePage
          slug={slug}
          categorySlug={categorySlug}
          guideData={pageData}
          filters={attributes?.data}
          attributesForTable={attributes?.data?.attribute_categories}
          productForTable={productTable?.data}
          searchParams={searchParams}
          matchShortCode={matchShortCode}
        />
      );
      break;
    case "Blog":
      // Render BlogPage component
      PageToRender = (
        <BlogPage slug={slug} categorySlug={categorySlug} blogData={pageData} />
      );
      break;
    case "Product":
      // Render ProductPageSSR component
      const product = pageData[0]?.data;
      const productCatAttribute = await getProductCategroyAttributes(
        product?.category_id
      );

      const getProductCompare = await getCompareProductByCatID(
        product?.category_id,
        slug
      );
      const getProConsForAccordion = await getProsConsForAccidion(
        categorySlug,
        slug
      );
      productCatAttribute;
      PageToRender = (
        <ProductPageSSR
          slug={slug}
          categorySlug={categorySlug}
          productData={pageData}
          productCatAttributes={productCatAttribute}
          compareByCatID={getProductCompare}
          prosConsAccordion={getProConsForAccordion?.data}
        />
      );
      break;
    case "PrimaryArchiveCategory":
      // Render CategoryArchive component
      PageToRender = <CategoryArchive slug={slug} ArchiveData={pageData} />;
      break;
    case "ProductCategory":
      // Render ProductCategoryArchivePage component

      // (pageData);
      PageToRender = (
        <ProductCategoryArchivePage slug={slug} categoryData={pageData} />
      );
      break;
    case "Compare":
      // Render Comparison component
      const compareData = pageData[0];

      const graphComparisonProsCons = await getGraphComparisonProsCons(
        pageData,
        categorySlug
      );
      // console.log(compareData)

      const compareDataCatAttribute = await getProductCategroyAttributes(
        compareData?.category_id
      );
      const getComparisonPhase = await getComparePhaseData(categorySlug, slug);
      const getProsConsforVsPage = await getProsConsForVsPage(
        categorySlug,
        slug
      );
      console.log(getProsConsforVsPage);
      PageToRender = (
        <Comparison
          slug={slug}
          categorySlug={categorySlug}
          comparisonData={pageData}
          categroyAttributes={compareDataCatAttribute}
          graphComparisonProsCons={graphComparisonProsCons}
          getComparisonPhase={getComparisonPhase}
          getProsConsforVsPage={getProsConsforVsPage}
        />
      );
      break;
    case "SinglePage":
      // Render SinglePage component
      PageToRender = (
        <SinglePage
          slug={slug}
          categorySlug={categorySlug}
          singlePageData={pageData[0]?.data}
        />
      );

      break;
    case "AboutUs":
      // Render AboutPage component
      PageToRender = (
        <AboutPage
          slug={slug}
          categorySlug={categorySlug}
          aboutData={pageData[0]?.data}
        />
      );
      break;
    default:
      // Render default component if no matching PageType
      PageToRender = () => <div>No Page Found</div>;
      break;
  }

  return PageToRender;
}

async function getCategoryAttributes(category_id, slug) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/guide/${category_id}/${slug}/attributes`,
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

// Calling API's

async function getComparePhaseData(category_id, slug) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/compare/products?slug=${slug}`,
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

async function getProsConsForVsPage(categorySlug, slug) {
  const splitSlug = slug.split("-vs-");
  if (splitSlug.length === 2) {
    const [firstPermalink, secondPermalink] = splitSlug;
    // console.log(firstPermalink, secondPermalink);

    const apiFirstUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${firstPermalink}&permalink2=${secondPermalink}`;
    const apiSecondUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${secondPermalink}&permalink2=${firstPermalink}`;

    const options = {
      next: { revalidate: 10 },
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    };

    try {
      const [apiFirst, apiSecond] = await Promise.all([
        fetch(apiFirstUrl, options),
        fetch(apiSecondUrl, options),
      ]);

      if (!apiFirst.ok || !apiSecond.ok) {
        throw new Error("Failed to fetch data");
      }

      const apiFirstJson = await apiFirst.json();
      const apiSecondJson = await apiSecond.json();

      return { apiFirst: apiFirstJson, apiSecond: apiSecondJson };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Failed to fetch data" };
    }
  }
  if (splitSlug.length === 3) {
    const [firstPermalink, secondPermalink, thirdPermalik] = splitSlug;
    // console.log(firstPermalink, secondPermalink, thirdPermalik);

    const apiFirstUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${firstPermalink}&permalink2=${secondPermalink}&permalink3=${thirdPermalik}`;
    const apiSecondUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${secondPermalink}&permalink2=${firstPermalink}&permalink3=${thirdPermalik}`;
    const apiThirdUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${thirdPermalik}&permalink2=${secondPermalink}&permalink3=${firstPermalink}`;

    const options = {
      next: { revalidate: 10 },
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    };

    try {
      const [apiFirst, apiSecond, apiThird] = await Promise.all([
        fetch(apiFirstUrl, options),
        fetch(apiSecondUrl, options),
        fetch(apiThirdUrl, options),
      ]);

      if (!apiFirst.ok || !apiSecond.ok || !apiThird.ok) {
        throw new Error("Failed to fetch datas");
      }

      const apiFirstJson = await apiFirst.json();
      const apiSecondJson = await apiSecond.json();
      const apiThirdJson = await apiThird.json();

      return {
        apiFirst: apiFirstJson,
        apiSecond: apiSecondJson,
        apiThird: apiThirdJson,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Failed to fetch data" };
    }
  }
}

async function getProductForTable(category_url, slug) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/guide/products-table/${category_url}/${slug}`,
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

async function getProductCategroyAttributes(category_id) {
  console.log(category_id);
  // (category_id);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${category_id}/attributes`,
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

async function getCompareProductByCatID(category_id, slug) {
  // (slug,category_id);
  // ${process.env.NEXT_PUBLIC_API_URL}/product/compare-product/${id}`
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/compare-product/${category_id}?product=${slug}`,
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

async function getGraphComparisonProsCons(data, categorySlug) {
  if (data.length === 2) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${data[0]?.data?.permalink}&permalink2=${data[1]?.data?.permalink}`,
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
  } else {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/average/${categorySlug}?permalink1=${data[0]?.data?.permalink}&permalink2=${data[1]?.data?.permalink}&permalink3=${data[2]?.data?.permalink}`,
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
}

async function getProsConsForAccidion(categorySlug, slug) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-chart/${categorySlug}?permalink2=${slug}&permalink1=average`,
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

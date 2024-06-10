import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import "../../public/font/font.css";
import Layout from "@/components/Layout";
import { getterService } from "@/_services";
import Head from "next/head";

export default async function RootLayout({ children }) {
  const footerData = await getterService.getFooterData();
  const headerData = await getterService.getTopNavBarData();
  // (footerData);
  // Function to construct the canonical URL dynamically
  // (footerData);
  // (footerData?.footer_tag_code);
  // (footerData?.favicon)
  // console.log(footerData, headerData);

  return (
    <html lang={footerData?.website_language?.toLowerCase()}>
      <link rel="icon" href={`${footerData?.favicon}`} sizes="any" />
      <head
        dangerouslySetInnerHTML={{ __html: footerData?.head_tag_code }}
      ></head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: footerData?.body_tag_code }} />
        <Layout footerData={footerData} headerData={headerData}>
          {children}
          {/* <div
            dangerouslySetInnerHTML={{ __html: footerData?.body_tag_code }}
          ></div>
          */}
        </Layout>
      </body>
    </html>
  );
}

"use client";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  BreadcrumbItem,
} from "react-bootstrap";
export default function BreadCrum({
  firstPageName,
  secondPageName,
  pageType,
  productPhaseData,
}) {
  const router = useRouter();
  // (productPhaseData);
  return (
    <>
      <Breadcrumb className="breadcrumb-group">
      
        <BreadcrumbItem className="breadcrumb-items" href="/">
          {productPhaseData?.breadcrumb_homepage || "Home"}
        </BreadcrumbItem>
        {firstPageName == "" ? (
          ""
        ) : (
          <BreadcrumbItem
            className="breadcrumb-items fristWord"
            href={`/${firstPageName}`}
          >
            {firstPageName?.replace(/-/g, " ").charAt(0).toUpperCase() +
              firstPageName?.replace(/-/g, " ").slice(1).toLowerCase()}
          </BreadcrumbItem>
        )}
        {secondPageName == "" ? (
          ""
        ) : pageType === "comparision" ? (
          <>
            <BreadcrumbItem
              className="breadcrumb-items breadcrumb-active"
              href={`/${firstPageName}/${secondPageName}`}
            >
              {secondPageName}
            </BreadcrumbItem>
          </>
        ) : (
          <>
            <BreadcrumbItem className="breadcrumb-items breadcrumb-active">
             
              {secondPageName?.name ?? secondPageName?.heading_title}
            </BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
    </>
  );
}

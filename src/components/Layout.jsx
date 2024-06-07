"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import store from "../redux/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

export default async function Layout({ children, footerData, headerData }) {
  const pathname = usePathname();
  if (pathname == "/link") {
    return <Provider store={store}>{children}</Provider>;
  }
  return (
    <>
      <Provider store={store}>
        <Header
          headerData={headerData}
          headerPhase={footerData}
          logo={footerData && footerData?.logo}
          favicon={footerData?.favicon}
        />
        {children}

        <Footer footerData={footerData} />
      </Provider>
    </>
  );
}

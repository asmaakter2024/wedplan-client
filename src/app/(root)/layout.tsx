import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {/* <Banner  /> */}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default RootLayout;

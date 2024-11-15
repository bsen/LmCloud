import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Description from "./components/Description";
import Working from "./components/Working";
import Applications from "./components/Applications";
import Performance from "./components/Performance";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

const page = () => {
  return (
    <div
      className="scroll-smooth"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      <Header />
      <Hero />
      <Description />
      <Working />
      <Applications />
      <Performance />
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;

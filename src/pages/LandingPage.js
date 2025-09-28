import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import SearchBar from "../components/SearchBar";
import FooterSmall from "../components/FooterSmall";

function LandingPage() {
  return (
    <div className="page-wrapper">
      <div className="container landing">
        <Header />

        {/* service placeholders */}
        <div className="services-row">
          <ServiceCard title="Hair" />
          <ServiceCard title="Car Wash" />
          <ServiceCard title="Barber" />
        </div>

        <SearchBar />

        <p className="lead">
          Discover a smarter way to connect with reliable local service providers.
          Whether you're at home or on the go, get things done effortlessly with
          vetted professionals at your fingertips.
        </p>

        <div className="actions">
          <Link to="/signup-client">
            <button className="btn primary">JOIN AS A CLIENT</button>
          </Link>
          <Link to="/signup-provider">
            <button className="btn outline">JOIN AS A PROVIDER</button>
          </Link>
        </div>

        <FooterSmall />
      </div>
    </div>
  );
}

export default LandingPage;

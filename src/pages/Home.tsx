import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="dhiwise-navigation">
      <h1>Homepage</h1>
      <p className="headline">
        This project was generated By{" "}
        <a href="https://www.dhiwise.com">Dhiwise</a>. Quickly use below links
        to navigate through all pages.
      </p>
      <ul>
        <li>
          <Link to="/desktophdeight">DesktopHDEight</Link>
        </li>
        <li>
          <Link to="/signin">SignIn</Link>
        </li>
        <li>
          <Link to="/desktophdnine">DesktopHDNine</Link>
        </li>
        <li>
          <Link to="/desktophdsixteen">DesktopHDSixteen</Link>
        </li>
        <li>
          <Link to="/desktophdsix">DesktopHDSix</Link>
        </li>
        <li>
          <Link to="/desktophdfour">DesktopHDFour</Link>
        </li>
        <li>
          <Link to="/desktophdseven">DesktopHDSeven</Link>
        </li>
        <li>
          <Link to="/desktophd">DesktopHD</Link>
        </li>
        <li>
          <Link to="/desktophdfifteen">DesktopHDFifteen</Link>
        </li>
        <li>
          <Link to="/desktophdfive">DesktopHDFive</Link>
        </li>
        <li>
          <Link to="/desktophdtwelve">DesktopHDTwelve</Link>
        </li>
        <li>
          <Link to="/desktophdthirteen">DesktopHDThirteen</Link>
        </li>
        <li>
          <Link to="/desktophdone">DesktopHDOne</Link>
        </li>
        <li>
          <Link to="/desktophdthree">DesktopHDThree</Link>
        </li>
        <li>
          <Link to="/desktophdten">DesktopHDTen</Link>
        </li>
        <li>
          <Link to="/desktophdeleven">DesktopHDEleven</Link>
        </li>
        <li>
          <Link to="/desktophdtwo">DesktopHDTwo</Link>
        </li>
        <li>
          <Link to="/desktophdfourteen">DesktopHDFourteen</Link>
        </li>
      </ul>
    </div>
  );
};
export default Home;

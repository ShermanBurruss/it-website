import React from "react";
import Footer from "./Footer";



export default function Home(){
    return (
        <div className="body">

<section id="title" className="colored-bg">
  <div className="container-fluid">
    {/* <!-- Nav Bar --> */}
    {/* <nav className="navbar navbar-expand-lg navbar-dark">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul className="navbar-nav  ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="http://www.innovativetruckingllc.net/contact">Contact</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://www.innovativetruckingllc.net/gallery">Gallery</a>
          </li>
          <li className="nav-item">
           <a className="nav-link" href="http://www.innovativetruckingllc.net/about">About</a>
          </li>
        </ul>
      </div>
    </nav> */}

    {/* <!-- Title --> */}
    <div className="row">
      <div className="col-lg-6 col-sm-12">
        <img className="title-image" src="images/Truck.jpeg" alt="Semi-Tractor" />
        <h1>Unlike any trucking job you've ever seen.</h1>
        
      </div>
      <div className = "col-lg-6 col-sm-12">
      <h1>Looking for a new job with a GREAT company?</h1>
      <h2>Tired of being gone from home?</h2>
      <h2>Sick of driving ragged equipment?</h2>
      <h2>Worn out by unpredictable schedules?</h2>
      <button type="button" className="btn btn-dark btn-lg download-button">APPLY TODAY!</button>
      </div>
    </div>
  </div>
</section>


{/* <!-- Features --> */}

<section id="features" className="white-bg">
  <div className="container-fluid">
    <div className="row">
      <div className="col-lg-4 feature-box">
        <i className="fa-sharp fa-solid fa-calendar-days"></i>
        <h3 className=" feature-title">3-Day Work Week.</h3>
        <p>Most drivers work 3 days and are off for 4. and are home every day.</p>
      </div>
      <div className="col-lg-4 feature-box">
        <i className="fa-sharp fa-solid fa-hands-bubbles"></i>
        <h3 className=" feature-title">No Touch Freight</h3>
        <p>Hook up and drive away, drop it and repeat.</p>
      </div>
      <div className="col-lg-4 feature-box">
      <i className="fa-solid fa-house-chimney"></i>
        <h3 className=" feature-title">Dependable Work Schedule.</h3>
        <p>The ability to schedule your life.</p>
      </div>
    </div>

  </div>


</section>



{/* <!-- Call to Action --> */}

<section id="cta" className="colored-bg">

  <div className="container-fluid">
    <h3 className="main-title">Call us today,<span className="cta-text">TODAY</span> as we grow to a better tomorrow.</h3>
    <button type="button" className="btn btn-dark btn-lg download-button">APPLY TODAY!</button>
  </div>
</section>


{/* <!-- Footer --> */}

<Footer />

<script type="text/javascript" src="index.js" charSet="utf-8"></script>
</div>
 );
}
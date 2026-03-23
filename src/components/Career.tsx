import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My learning <span>&</span>
          <br /> journey
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Started Coding</h4>
                <h5>Self-taught, Bhaktapur, Nepal</h5>
              </div>
              <h3>EARLY</h3>
            </div>
            <p>
              Began with C programming to understand how computers think.
              Then moved into HTML & CSS to build my first web pages.
              Every bug was a lesson learned the hard way.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>JavaScript & Real Projects</h4>
                <h5>Weather App, Todo App, Snippets</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Picked up JavaScript and started shipping real projects —
              a Weather App using REST APIs, a Todo App with localStorage,
              and a Code Snippet Manager. Learning by building.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Exploring Web3</h4>
                <h5>Blockchain, DeFi, IT Degree</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Pursuing a Bachelor's in IT while diving into Web3 and
              blockchain. Learning how Ethereum, L2s, and DeFi actually work.
              Still early, still building — and excited about what's next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

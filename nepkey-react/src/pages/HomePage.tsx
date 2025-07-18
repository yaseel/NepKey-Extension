import React from "react";
import Button from "../common/Button/Button.tsx";
import questionMark from "../../public/images/questionMark.png";
import settings from "../../public/images/settings.png";


const HomePage = () => {
  return (
    <>
      <div>
          <h1>NepKey</h1>
          <div>
              <Button icon={questionMark}/>
              <Button icon={settings}/>
          </div>
      </div>
    </>
  );
};

export default HomePage;

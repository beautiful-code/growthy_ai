import { useState } from "react";
import { FixtureWrapper } from "fixtures/FixtureWrapper";
import { Outline } from "common/components/outline/Outline";
import { UIOutline } from "domain/common/UIOutline";

export default {
  "base case": () => {
    const [outlineXML, setOutlineXML] = useState(
      "<Outline><Section name='section1'><Task name='task1' /><Task name='task2' /></Section></Outline>"
    );

    return (
      <FixtureWrapper>
        <Outline
          uiOutline={new UIOutline(outlineXML)}
          onUpdateOutlineCallback={(uiOutline) => {
            console.log("onUpdateOutlineCallback called");
            setOutlineXML(uiOutline._xml);
          }}
        />
      </FixtureWrapper>
    );
  },
};

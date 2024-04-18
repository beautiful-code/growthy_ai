import { FixtureWrapper } from "FixtureWrapper";
import { GButton } from "./GButton";

export default {
  primary: (
    <FixtureWrapper>
      <GButton
        m={2}
        type="primary"
        size="md"
        onClick={() => console.log("Primary button clicked")}
      >
        Primary Button
      </GButton>
    </FixtureWrapper>
  ),
  secondary: (
    <FixtureWrapper>
      <GButton
        type="secondary"
        size="md"
        onClick={() => console.log("Secondary button clicked")}
      >
        Secondary Button
      </GButton>
    </FixtureWrapper>
  ),
  "secondary small": (
    <FixtureWrapper>
      <GButton
        type="secondary"
        size="sm"
        onClick={() => console.log("Secondary button clicked")}
      >
        Secondary Button
      </GButton>
    </FixtureWrapper>
  ),
};

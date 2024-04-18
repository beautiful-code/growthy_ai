import { FixtureWrapper } from "FixtureWrapper";
import { Sidebar } from "common/components/sidebar/Sidebar";

export default {
    "base case": (
        <FixtureWrapper>
            <Sidebar 
                selectedGuildId={""}
            />
        </FixtureWrapper>
    ),
}
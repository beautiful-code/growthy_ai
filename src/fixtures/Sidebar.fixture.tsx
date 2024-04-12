import { Sidebar } from "common/components/sidebar/Sidebar";
import { FixtureWrapper } from "./FixtureWrapper";

export default {
    "base case": (
        <FixtureWrapper>
            <Sidebar 
                selectedGuildId={""}
            />
        </FixtureWrapper>
    ),
}
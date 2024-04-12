import { AddGrowthExercise } from "common/components/AddGrowthExercise";
import { FixtureWrapper } from "./FixtureWrapper";

export default {
    "base case": (
        <FixtureWrapper>
            <AddGrowthExercise createParams={{ type: "user-view", guildId: ""}}/>
        </FixtureWrapper>
    ),
}
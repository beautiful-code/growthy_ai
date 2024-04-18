import { FixtureWrapper } from "FixtureWrapper";
import { AddGrowthExercise } from "common/components/AddGrowthExercise";

export default {
    "base case": (
        <FixtureWrapper>
            <AddGrowthExercise createParams={{ type: "user-view", guildId: ""}}/>
        </FixtureWrapper>
    ),
}
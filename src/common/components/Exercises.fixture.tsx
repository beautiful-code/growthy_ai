import { FixtureWrapper } from "FixtureWrapper";
import { getExercisesPaginatedMock } from "../../mocks/getExercisesPaginatedMock";
import { Exercises } from "common/components/Exercises";

export default {
    "BaseCase": (
        <FixtureWrapper>
            <Exercises
                title="Publications from the last"
                defaultDuration={7}
                queryFunction={getExercisesPaginatedMock}
                type={"published"}
            />
        </FixtureWrapper>
    ),
};

import { Exercise } from "./Exercise";

describe("Exercise", () => {
  it(" should have a name", () => {
    const exercise = new Exercise("Exercise 1");

    expect(exercise.name).toBe("Exercise 1");
  });
});

import { useRecoilState, atom } from "recoil";

const experienceSettingsState = atom({
  key: "experienceSettingsState",
  default: JSON.parse(localStorage.getItem("experienceSettings") || "{}"),
});

export const useExperienceSettingsState = () => {
  const [experienceSettings, setExpereienceSettings] = useRecoilState(
    experienceSettingsState
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSetExperienceSettings = (newExperienceSettings: any) => {
    localStorage.setItem(
      "experienceSettings",
      JSON.stringify(newExperienceSettings)
    );
    setExpereienceSettings({
      ...experienceSettings,
      ...newExperienceSettings,
    });
  };

  return [experienceSettings, handleSetExperienceSettings];
};

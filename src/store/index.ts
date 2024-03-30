import { useRecoilState, atom } from "recoil";
import { TGuild } from "types";

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

const guildState = atom({
  key: "guildState",
  default: JSON.parse(localStorage.getItem("guildState") || "[]"),
});

export const useGuildState = () => {
  const [guilds, setGuilds] = useRecoilState(guildState);

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleSetGuilds = (newGuilds: TGuild[]) => {
    localStorage.setItem(
      "guildState",
      JSON.stringify([...newGuilds])
    );
    setGuilds([...newGuilds]);
  };

  return [guilds, handleSetGuilds];
}
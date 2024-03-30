import { TGuild } from "types";
// @ts-expect-error: Svg import
import GolangIcon from "assets/golangIcon.svg?react";
// @ts-expect-error: Svg import
import ReactIcon from "assets/react.svg?react";

type Props = {
    guild?: TGuild
}

export const GuildIcon: React.FC<Props> = ( {guild} ) => {
    return (() => {
        if (!guild) return <></>;
        switch (guild?.name) {
        case "React":
            return <ReactIcon width={40} height={40} />;
        case "Golang":
            return <GolangIcon width={40} height={40} />;
        default:
            return <></>;
        }
    })()
}
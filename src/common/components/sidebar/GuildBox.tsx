import { HStack, Link } from "@chakra-ui/react";
import { GuildIcon } from "common/components/GuildIcon";
import { useNavigate } from "react-router-dom";
import { TGuild } from "types";

type Props = {
    guild: TGuild, 
    selectedGuildId?: string
}

export const GuildBox: React.FC<Props> = ({guild, selectedGuildId}) => {
    const navigate = useNavigate();
    const handleNavigateGuild = (guildId: string) => {
      navigate(`/guild/${guildId}`);
    } 
  
    return (
        <HStack spacing={4}>
            <GuildIcon guild={guild} />
            <Link
                fontWeight={"bold"}
                fontSize={"lg"}
                _hover={{ textDecoration: "none" }}
                onClick={() => handleNavigateGuild(guild.id)}
                color={selectedGuildId === guild.id ? "blue" : ""}
            >
                {guild.name}
            </Link>
        </HStack>
    )
}
import { HStack, Text } from "@chakra-ui/react"
import { UserAvatar } from "common/components/header/UserAvatar";
import { TGuildUser } from "types";

type Props = {
    guildUser: TGuildUser;
}

export const GuildMembers: React.FC<Props> = ({guildUser}) => {
    return (
        <>
            <Text fontSize="2xl" fontWeight={"normal"}>Members</Text>
            <HStack spacing={4}>
                {guildUser?.user && 
                    <>
                        <UserAvatar avatarUrl={guildUser.user.avatar_url} size="sm"/>
                        <Text fontSize="larger" fontWeight={"normal"}> {guildUser.user.username} - Lead </Text>
                    </>
                }
            </HStack>
        </>
    )
}
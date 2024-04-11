import { Avatar, HStack, Text } from "@chakra-ui/react"
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
                        <Avatar
                            size={"sm"}
                            name={guildUser?.user?.username || ""}
                            src={guildUser.user.avatar_url || ""}
                            bgColor={"#D9D9D9"}
                        />
                        <Text fontSize="large" fontWeight={"normal"}> {guildUser.user.username} - Lead </Text>
                    </>
                }
            </HStack>
        </>
    )
}
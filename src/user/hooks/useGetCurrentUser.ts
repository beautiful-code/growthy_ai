import { getCurrentUserId, getUserById } from "common/utils"
import { useEffect, useState } from "react"
import { TUser } from "types"

export const useGetCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<TUser>({} as TUser)
    useEffect(() => {
        (async () => {
            const userId =  await getCurrentUserId()
            if(userId) {
                const user = await getUserById(userId)
                user && setCurrentUser(user)
            }
        })();
    }, [])
    return currentUser
}
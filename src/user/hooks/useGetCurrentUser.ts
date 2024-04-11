import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TUser } from 'types';
import { getCurrentUser } from "user/queries";

export const useGetCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<TUser>({} as TUser);
    const {data, isLoading} = useQuery({
        queryKey: ["user"], 
        queryFn: () => getCurrentUser(),
    });

    useEffect(() => {
        if(data) {
            setCurrentUser(data as TUser)
        }
    }, [data])

    return {currentUser,  isLoading};
}
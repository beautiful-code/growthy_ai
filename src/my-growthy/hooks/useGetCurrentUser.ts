import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from 'my-growthy/queries';
import { useEffect, useState } from 'react';
import { TUser } from 'types';

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
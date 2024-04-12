import { useQuery } from '@tanstack/react-query';
import { TExerciseFilter, TExercise } from 'types';
import { ExercisesProps } from 'common/components/Exercises';
import { useRef } from 'react';

export const useGetExercisesPaginated = (
    pageInfo: {pageIndex: number, pageSize: number},
    filters: TExerciseFilter = {blogArticle: true, studyExercise: true, til: true}, 
    queryFunction: ExercisesProps["queryFunction"], 
    type: ExercisesProps["type"],
    guildId?: string,
) => {
    const lowerLimit = pageInfo.pageIndex * pageInfo.pageSize;
    const upperLimit = ((pageInfo.pageIndex + 1) * pageInfo.pageSize) - 1;
    const initialDataRef = useRef<TExercise>();
    const queryKeys = ["exercises", lowerLimit, upperLimit, filters.blogArticle, filters.studyExercise, filters.til, guildId, type];
    
    const {data, isLoading, isFetching} = useQuery({
        queryKey: queryKeys, 
        queryFn: () => queryFunction({filters, lowerLimit, upperLimit, guildId}),
        initialData: initialDataRef.current ? {exercises: initialDataRef.current} : undefined, 
    });

    if (data) {
        initialDataRef.current = data.exercises;
    }

    return {exercises: data?.exercises as TExercise[] || [], isLoading, isFetching};
};

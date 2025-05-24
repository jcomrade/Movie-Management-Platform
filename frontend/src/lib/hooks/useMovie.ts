import { useQuery } from "@tanstack/react-query";
import { useFetch } from "./useFetch";


export function useMovie() {

    const { apiAuthGet } = useFetch()

    const { data: userMoviesList, isLoading: isUserMoviesListLoading } = useQuery({
        queryKey: ['userMoviesList'],
        queryFn: async () => {
            try {
                const result = await apiAuthGet(`/api/movie`);
                return result;
            } catch (e) {
                console.error(
                    'Error when fetching all user Movies',
                    e
                );
                return [];
            }
        },
    });


    return {
        userMoviesList,
        isUserMoviesListLoading
    }
}
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "./useFetch";


export function useSelectedMovie(movieID:string) {

    const {apiAuthGet} = useFetch()

    const { data: userSelectedMovie, isLoading: isUserSelectedMovieLoading } = useQuery({
        queryKey: ['userSelectedMovie', movieID],
        queryFn: async () => {
            try {
                const result = await apiAuthGet(`/api/movie/${movieID}`);
                return result;
            } catch (e) {
                console.error(
                    'Error when fetching all user Movies',
                    e
                );
                return null;
            }
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,      
        refetchOnReconnect: false,   
        retry: false,               
        staleTime: Infinity,     
        refetchInterval: false,
    });


    return {
        userSelectedMovie,
        isUserSelectedMovieLoading
    }
}
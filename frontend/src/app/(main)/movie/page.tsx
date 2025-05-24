"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovie } from "@/lib/hooks/useMovie";
import { MovieDetails } from "@/lib/types/movie";
import { useRouter } from "next/navigation";
import { BiPlay } from "react-icons/bi";
export default function Login() {
    const { userMoviesList, isUserMoviesListLoading } = useMovie();
    const router = useRouter();
    console.log("userMoviesList", userMoviesList)
    return (
        <>
            <div className="px-5">
                <button onClick={() => router.push("/movie/create")} className="py-1 px-5 border rounded-md border-gray-500/40 bg-[#E50914] text-white text-xl font-semibold">
                    Create +
                </button>
            </div>
            <div className="grid grid-cols-5 p-5 gap-5">
                {
                    userMoviesList?.movieList?.map((movie: MovieDetails) => {

                        return (
                            <div key={movie.id} className="rounded-lg bg-gradient-to-r from-slate-500 to-slate-800 grid grid-rows-[70%_30%] h-96 text-white">
                                <div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={movie.thumbnail || "https://picsum.photos/200"} className="rounded-t-lg w-full h-full object-cover" alt={"movie.id"}/>
                                </div>
                                <div className="flex flex-col justify-between px-2 pb-2">
                                    <p className="font-semibold text-3xl py-1">{movie.title}</p>
                                    <div className="flex justify-between pt-2 items-center">
                                        <p>Uploaded By: {movie.user.username}</p>
                                        <button onClick={() => router.push(`movie/${movie.id}`)} className="p-1 flex items-center rounded-full bg-[#E50914]">{<BiPlay size={40} />}</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    isUserMoviesListLoading && [...Array(5)].map((_, index) => {
                        return <Skeleton key={index} className="rounded-lg bg-gradient-to-r from-slate-500 to-slate-800 grid grid-rows-[70%_30%] h-96 text-white" />
                    })
                }
            </div>
        </>
    );
}

import Link from "next/link";
import { MovieType, TvType } from "@/types/global";

const poster = "http://image.tmdb.org/t/p/w185";

interface MovieProps {
  item: MovieType | TvType;
  mediaType: "movie" | "tv";
}

export default function Movie({ item, mediaType }: MovieProps) {
  // Movies use "title" and "release_date".
  // TV shows use "name" and "first_air_date".
  // We check which one this item has and use the right field.
  let title = "";
  let date = "";

  if (mediaType === "movie") {
    const movie = item as MovieType;
    title = movie.title;
    date = movie.release_date;
  } else {
    const tv = item as TvType;
    title = tv.name;
    date = tv.first_air_date;
  }

  return (
    <div className="w-60 h-full text-center mb-2">
      <Link href={`/${mediaType}/${item.id}`} className="overflow-hidden">
        <img
          src={item.poster_path ? poster + item.poster_path : "/no_profile.svg"}
          alt={title}
          className="hover:scale-102 mb-3 m-auto w-55 h-76 object-cover cursor-pointer transition-all rounded-md"
        />
      </Link>
      <b>{title}</b>
      <div>{date}</div>
    </div>
  );
}
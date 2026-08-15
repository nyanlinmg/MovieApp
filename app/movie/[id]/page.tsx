import { MovieType} from "@/types/global";
import Link from "next/link";

const image_url = "http://image.tmdb.org/t/p/w1280";
const person_url = "http://image.tmdb.org/t/p/w185";

export default async function MovieDetail({
    params,
}: {
    params: Promise<{id: string}>
}) {
    const {id} = await params;

    return <div>
        <h1>Move Detail</h1>
    </div>
}
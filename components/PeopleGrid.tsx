import Link from "next/link";
import { BackButton } from "./BackButton";

type Person = {
    key: string,
    id: number,
    name: string,
    subtitle: string,
    profile_path: string | null
}

export default function PeopleGrid({
    title,
    people
} : {
    title: string;
    people: Person[]
}) {

    return (
        <div className="px-10 py-8">
            <h1 className="mb-8 text-3xl font-bold">
                {title} <span className="text-gray-400">({people.length})</span>
            </h1>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {people.map((person) => (
                <Link key={person.key} href={`/person/${person.id}`}>
                    <div className="overflow-hidden rounded-lg border-2 border-mist-600">
                        <img
                            src={
                            person.profile_path
                                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                                : "/no_profile.svg"
                            }
                            alt={person.name}
                            className="h-64 md:h-70 lg:h-80 w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="bg-[#111827] p-3">
                            <p className="truncate text-sm font-semibold">{person.name}</p>
                            <p className="truncate text-sm text-muted-foreground">
                            {person.subtitle || "N/A"}
                            </p>
                        </div>
                    </div>
                </Link>
                ))}
            </div>
        </div>
    )
}
import Image from "next/image";
import Biography from "./Biography";
import { BackButton } from "./BackButton";
import { BookOpen } from "lucide-react";

type PersonHeroProps = {
  name: string;
  profilePath: string | null;
  biography: string;
};

export default function PersonHero({ name, profilePath, biography }: PersonHeroProps) {
  return (
    <>
        <div className="relative z-10 pt-4">
            <BackButton />
        </div>
        <section className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="relative aspect-2/3 w-56 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-64">
                {profilePath ? (
                    <img
                    src={`https://image.tmdb.org/t/p/w500${profilePath}`}
                    alt={name}
                    sizes="256px"
                    className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No photo
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h1 className="text-center text-3xl font-bold sm:text-4xl md:text-left">
                    {name}
                </h1>

                <h2 className="mb-2 mt-6 flex items-center gap-3 text-xl font-semibold">
                    Biography <BookOpen size={25} />
                </h2>
                <Biography text={biography} />
            </div>
        </section>
    </>
    );
}
import { PersonalInfoProps } from "@/types/global";

// "1992-03-27" -> "March 27, 1992"
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// age on the "end" date (today if the person is alive)
function getAge(birthday: string, end: Date) {
  const birth = new Date(birthday);
  let age = end.getFullYear() - birth.getFullYear();

  if (
    end.getMonth() < birth.getMonth() ||
    (end.getMonth() === birth.getMonth() && end.getDate() < birth.getDate())
  ) {
    age = age - 1;
  }

  return age;
}

// one label + value
function Item({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-mono font-semibold">{value}</p>
    </div>
  );
}

export default function PersonalInfo({
  department,
  credits,
  gender,
  popularity,
  birthday,
  deathday,
  placeOfBirth,
  homepage,
  alsoKnownAs,
  externalIds,
}: PersonalInfoProps) {
  let genderText = "-";
  if (gender === 1) genderText = "Female";
  if (gender === 2) genderText = "Male";
  if (gender === 3) genderText = "Non-binary";

  let birthdayText = "-";
  if (birthday) {
    const age = getAge(birthday, deathday ? new Date(deathday) : new Date());
    birthdayText = deathday
      ? formatDate(birthday)
      : `${formatDate(birthday)} (${age} years old)`;
  }

  let deathText = "";
  if (deathday && birthday) {
    deathText = `${formatDate(deathday)} (${getAge(birthday, new Date(deathday))} years old)`;
  } else if (deathday) {
    deathText = formatDate(deathday);
  }

  const links: { name: string; url: string }[] = [];

  if (homepage) {
    links.push({ name: "Website", url: homepage });
  }
  if (externalIds.instagram_id) {
    links.push({ name: "Instagram", url: `https://instagram.com/${externalIds.instagram_id}` });
  }
  if (externalIds.twitter_id) {
    links.push({ name: "X", url: `https://x.com/${externalIds.twitter_id}` });
  }
  if (externalIds.facebook_id) {
    links.push({ name: "Facebook", url: `https://facebook.com/${externalIds.facebook_id}` });
  }
  if (externalIds.tiktok_id) {
    links.push({ name: "TikTok", url: `https://tiktok.com/@${externalIds.tiktok_id}` });
  }
  if (externalIds.youtube_id) {
    links.push({ name: "YouTube", url: `https://youtube.com/${externalIds.youtube_id}` });
  }
  if (externalIds.imdb_id) {
    links.push({ name: "IMDb", url: `https://imdb.com/name/${externalIds.imdb_id}` });
  }

  const cardStyle = "rounded-xl border border-mist-600 bg-[#111827] p-6";
  const badgeStyle = "rounded-full border border-mist-600 px-3 py-1 font-mono text-xs";

  return (
    <section>
      <h2 className="mb-6 text-3xl font-bold">Personal Info</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: work info */}
        <div className={cardStyle}>
          <Item label="Known For" value={department || "-"} />
          <Item label="Known Credits" value={credits} />
          <Item label="Gender" value={genderText} />
          <Item label="Popularity" value={popularity.toFixed(1)} />
        </div>

        {/* Card 2: life info */}
        <div className={cardStyle}>
          <Item label="Birthday" value={birthdayText} />
          {deathText && <Item label="Day of Death" value={deathText} />}
          <Item label="Place of Birth" value={placeOfBirth || "-"} />
        </div>

        {/* Card 3: names and links */}
        <div className={cardStyle}>
          <p className="mb-2 text-sm text-muted-foreground">Also Known As</p>
          {alsoKnownAs.length === 0 ? (
            <p className="mb-5 font-mono font-semibold">N/A</p>
          ) : (
            <div className="mb-5 flex flex-wrap gap-2">
              {alsoKnownAs.map((name) => (
                <span key={name} className={badgeStyle}>
                  {name}
                </span>
              ))}
            </div>
          )}

          <p className="mb-2 text-sm text-muted-foreground">Links</p>
          {links.length === 0 ? (
            <p className="font-mono font-semibold">N/A</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${badgeStyle} transition-colors hover:bg-white/10`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
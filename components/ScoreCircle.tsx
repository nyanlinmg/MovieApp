export function ScoreCircle({ score }: { score: number }) {
    const color = score >= 70 ? "#21d07a" : score >= 40 ? "#d2d531" : "#db2360";

    return (
        <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold"
            style={{
                background: `conic-gradient(${color} ${score}%, #204529 ${score}%)`,
            }}
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d1b2a]">
                {score}%
            </div>
        </div>
    );
}
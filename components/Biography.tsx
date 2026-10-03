"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Biography({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) {
    return <p>We don&apos;t have a biography for this person yet.</p>;
  }

  const isLong = text.length > 400;

  return (
    <div>
      <p className={`whitespace-pre-line leading-7 ${!expanded && isLong ? "line-clamp-5" : ""}`}>
        {text}
      </p>

      {isLong && (
        <Button
            variant="link"
            className="px-0 text-cyan-400 cursor-pointer text-sm"
            onClick={() => setExpanded(!expanded)}
            >
            {expanded ? (
                <>
                Show less <ChevronUp className="size-4" />
                </>
            ) : (
                <>
                Read more <ChevronDown className="size-4" />
                </>
            )}
        </Button>
      )}
    </div>
  );
}
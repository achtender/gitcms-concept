import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

const ratios = {
  wide: "aspect-[2/1]",
  video: "aspect-video",
  square: "aspect-square",
} as const;

/** Stable hue so the same entry always gets the same generated artwork. */
function hueFrom(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 360;
  }
  return hash;
}

export function Cover({
  title,
  seed,
  image,
  imageAlt,
  ratio = "video",
  className,
  children,
}: {
  title: string;
  seed?: string;
  image?: string;
  imageAlt?: string;
  ratio?: keyof typeof ratios;
  className?: string;
  children?: ReactNode;
}) {
  const style = { "--cover-hue": hueFrom(seed ?? title) } as CSSProperties;

  return (
    <div
      className={cn(
        "cover-art rounded-md border border-border",
        ratios[ratio],
        className,
      )}
      style={style}
      aria-hidden={image ? undefined : true}
    >
      {image ? (
        <Image
          src={image}
          alt={imageAlt ?? title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          unoptimized
          className="cover-art__image"
        />
      ) : null}
      {children}
    </div>
  );
}

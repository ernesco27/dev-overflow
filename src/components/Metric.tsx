import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  value: number | string;
  textStyles: string;
  imgUrl: string;
  alt: string;
  isAuthor?: boolean;
  href?: string;
  imgStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  isAuthor,
  href,
  imgStyles,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={cn("rounded-full object-contain", imgStyles)}
      />
      <p className={cn("flex items-center gap-1", textStyles)}>
        {value}
        <span
          className={cn(
            "small-regular line-clamp-1",
            isAuthor ? "max-sm:hidden" : ""
          )}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;

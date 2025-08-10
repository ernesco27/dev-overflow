"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

interface Search {
  imgSrc: string;
  otherClasses?: string;
  route: string;
  placeholder: string;
  iconPosition?: "left" | "right";
}

const LocalSearch = ({
  imgSrc,
  otherClasses,
  route,
  placeholder,
  iconPosition = "left",
}: Search) => {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const router = useRouter();

  const [searchQuery, setSeachQuery] = useState(query);

  useEffect(() => {
    const delayDounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        // If searchQuery is empty, we can remove the query parameter}
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDounceFn);
    };
  }, [searchQuery, router, route, searchParams, pathname]);

  return (
    <div className="background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4">
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSeachQuery(e.target.value);
        }}
        className={cn(
          `paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none`,
          otherClasses
        )}
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={15}
          height={15}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;

// timestamp: 29.02

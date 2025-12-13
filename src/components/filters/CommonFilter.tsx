"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formUrlQuery } from "@/lib/url";
import Image from "next/image";

interface Filter {
  name: string;
  value: string;
  svg?: string;
}

interface Props {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
  placeholder?: string;
  imgSrc?: string;
}

const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
  placeholder = "",
  imgSrc = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "country",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 ",
            otherClasses
          )}
          aria-label="filter options"
        >
          <Image
            src={imgSrc}
            alt="search icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.name} value={filter.value.toLowerCase()}>
                <span className="flex-center gap-2">
                  {filter.svg && (
                    <Image
                      src={filter.svg}
                      alt={filter.name}
                      width={24}
                      height={24}
                    />
                  )}
                  {filter.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;

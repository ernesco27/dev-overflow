"use server";

import { cache } from "react";
import handleError from "../handlers/error";
import {
  ActionResponse,
  CountryApiData,
  ErrorResponse,
} from "../../../types/global";

export const getCountries = cache(async function getCountries(): Promise<
  ActionResponse<{ countries: CountryApiData[] }>
> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags",
      {
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`RestCountries API error: ${response.statusText}`);
    }

    const countries = await response.json();

    return {
      success: true,
      data: { countries },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

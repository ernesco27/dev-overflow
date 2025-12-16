"use server";

import handleError from "../handlers/error";
import {
  ActionResponse,
  ErrorResponse,
  JobPosting,
  PaginatedSearchParams,
} from "../../../types/global";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";

export const getJobs = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ jobs: JobPosting[] }>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, country } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  let currentLocation;

  try {
    const location = await fetch(
      "http://ip-api.com/json/?fields=status,message,countryCode",
      {
        next: { revalidate: 86400 },
      }
    );

    if (!location.ok) {
      throw new Error(`Current Location API error: ${location.statusText}`);
    }

    const locResponse = await location.json();

    currentLocation = locResponse.countryCode.toLowerCase();

    const response = await fetch(
      `https://api.openwebninja.com/jsearch/search?query="${query}"&page=${page}&num_pages=1&country=${country || currentLocation}&language=en&date_posted=all&work_from_home=false`,
      {
        headers: {
          "x-api-key": `${process.env.JSEARCH_API_KEY}`,
        },
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error(`Jobs API error: ${response.statusText}`);
    }

    const apiResponse = await response.json();

    const jobs = apiResponse.data;

    // const isNext = totalQuestions > skip + jobs.length;

    return {
      success: true,
      data: { jobs },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

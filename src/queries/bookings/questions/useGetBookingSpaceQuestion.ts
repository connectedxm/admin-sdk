import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, BookingSpaceQuestion } from "@src/interfaces";
import { BOOKING_SPACE_QUESTIONS_QUERY_KEY } from "./useGetBookingSpaceQuestions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string
) => [...BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId), questionId];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestion>>
) => {
  client.setQueryData(BOOKING_SPACE_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetBookingSpaceQuestionProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestion = async ({
  placeId,
  spaceId,
  questionId,
  adminApiParams,
}: GetBookingSpaceQuestionProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestion = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingSpaceQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingSpaceQuestion>>(
    BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestion({ placeId, spaceId, questionId, ...params }),
    {
      ...options,
      enabled:
        !!placeId && !!spaceId && !!questionId && (options?.enabled ?? true),
    }
  );
};

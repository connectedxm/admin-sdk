import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import {
  BookingSpaceQuestionTranslation,
  ConnectedXMResponse,
} from "@src/interfaces";
import { BOOKING_SPACE_QUESTION_QUERY_KEY } from "../useGetBookingSpaceQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string
) => [
  ...BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestionTranslations>>
) => {
  client.setQueryData(
    BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceQuestionTranslationsProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionTranslations = async ({
  placeId,
  spaceId,
  questionId,
  adminApiParams,
}: GetBookingSpaceQuestionTranslationsProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/translations`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionTranslations = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceQuestionTranslations>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceQuestionTranslations>
  >(
    BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY(placeId, spaceId, questionId),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestionTranslations({
        placeId,
        spaceId,
        questionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId && !!spaceId && !!questionId && (options?.enabled ?? true),
    }
  );
};

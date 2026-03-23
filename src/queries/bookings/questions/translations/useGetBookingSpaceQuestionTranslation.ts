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
import { BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetBookingSpaceQuestionTranslations";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string,
  locale: string
) => [
  ...BOOKING_SPACE_QUESTION_TRANSLATIONS_QUERY_KEY(
    placeId,
    spaceId,
    questionId
  ),
  locale,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestionTranslation>>
) => {
  client.setQueryData(
    BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceQuestionTranslationProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionTranslation = async ({
  placeId,
  spaceId,
  questionId,
  locale,
  adminApiParams,
}: GetBookingSpaceQuestionTranslationProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionTranslation = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceQuestionTranslation>
  >(
    BOOKING_SPACE_QUESTION_TRANSLATION_QUERY_KEY(
      placeId,
      spaceId,
      questionId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestionTranslation({
        placeId,
        spaceId,
        questionId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId &&
        !!spaceId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};

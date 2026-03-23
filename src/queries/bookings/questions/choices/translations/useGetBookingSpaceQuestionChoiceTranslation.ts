import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import {
  BookingSpaceQuestionChoiceTranslation,
  ConnectedXMResponse,
} from "@src/interfaces";
import { BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY } from "./useGetBookingSpaceQuestionChoiceTranslations";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string,
  choiceId: string,
  locale: string
) => [
  ...BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
    placeId,
    spaceId,
    questionId,
    choiceId
  ),
  locale,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestionChoiceTranslation>>
) => {
  client.setQueryData(
    BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceQuestionChoiceTranslationProps
  extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionChoiceTranslation = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  locale,
  adminApiParams,
}: GetBookingSpaceQuestionChoiceTranslationProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoiceTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionChoiceTranslation = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  choiceId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceQuestionChoiceTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceQuestionChoiceTranslation>
  >(
    BOOKING_SPACE_QUESTION_CHOICE_TRANSLATION_QUERY_KEY(
      placeId,
      spaceId,
      questionId,
      choiceId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestionChoiceTranslation({
        placeId,
        spaceId,
        questionId,
        choiceId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId &&
        !!spaceId &&
        !!questionId &&
        !!choiceId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    }
  );
};

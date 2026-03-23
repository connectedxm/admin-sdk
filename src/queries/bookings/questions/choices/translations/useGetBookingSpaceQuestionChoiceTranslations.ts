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
import { BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY } from "../useGetBookingSpaceQuestionChoice";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string,
  choiceId: string
) => [
  ...BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY(
    placeId,
    spaceId,
    questionId,
    choiceId
  ),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetBookingSpaceQuestionChoiceTranslations>
  >
) => {
  client.setQueryData(
    BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceQuestionChoiceTranslationsProps
  extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionChoiceTranslations = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  adminApiParams,
}: GetBookingSpaceQuestionChoiceTranslationsProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoiceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}/translations`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionChoiceTranslations = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  choiceId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceQuestionChoiceTranslations>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceQuestionChoiceTranslations>
  >(
    BOOKING_SPACE_QUESTION_CHOICE_TRANSLATIONS_QUERY_KEY(
      placeId,
      spaceId,
      questionId,
      choiceId
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestionChoiceTranslations({
        placeId,
        spaceId,
        questionId,
        choiceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!placeId &&
        !!spaceId &&
        !!questionId &&
        !!choiceId &&
        (options?.enabled ?? true),
    }
  );
};

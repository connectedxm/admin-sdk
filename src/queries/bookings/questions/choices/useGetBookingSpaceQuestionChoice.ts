import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  BookingSpaceQuestionChoice,
} from "@src/interfaces";
import { BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY } from "./useGetBookingSpaceQuestionChoices";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string,
  choiceId: string
) => [
  ...BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(placeId, spaceId, questionId),
  choiceId,
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestionChoice>>
) => {
  client.setQueryData(
    BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceQuestionChoiceProps extends SingleQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionChoice = async ({
  placeId,
  spaceId,
  questionId,
  choiceId,
  adminApiParams,
}: GetBookingSpaceQuestionChoiceProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionChoice = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  choiceId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetBookingSpaceQuestionChoice>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetBookingSpaceQuestionChoice>
  >(
    BOOKING_SPACE_QUESTION_CHOICE_QUERY_KEY(
      placeId,
      spaceId,
      questionId,
      choiceId
    ),
    (params: SingleQueryParams) =>
      GetBookingSpaceQuestionChoice({
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

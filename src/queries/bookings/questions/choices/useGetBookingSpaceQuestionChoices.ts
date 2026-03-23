import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  BookingSpaceQuestionChoice,
} from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { BOOKING_SPACE_QUESTION_QUERY_KEY } from "../useGetBookingSpaceQuestion";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY = (
  placeId: string,
  spaceId: string,
  questionId: string
) => [
  ...BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
  "CHOICES",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTION_CHOICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestionChoices>>
) => {
  client.setQueryData(
    [
      ...BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(""),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetBookingSpaceQuestionChoicesProps extends InfiniteQueryParams {
  placeId: string;
  spaceId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestionChoices = async ({
  placeId,
  spaceId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceQuestionChoicesProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestionChoice[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/choices`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingSpaceQuestionChoices = (
  placeId: string = "",
  spaceId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceQuestionChoices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceQuestionChoices>>
  >(
    BOOKING_SPACE_QUESTION_CHOICES_QUERY_KEY(placeId, spaceId, questionId),
    (queryParams: InfiniteQueryParams) =>
      GetBookingSpaceQuestionChoices({
        ...queryParams,
        placeId,
        spaceId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!placeId && !!spaceId && !!questionId && (options.enabled ?? true),
    }
  );
};

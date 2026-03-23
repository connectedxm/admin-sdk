import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BookingSpaceQuestion } from "@src/interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { BOOKING_SPACE_QUERY_KEY } from "../useGetBookingSpace";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_SPACE_QUESTIONS_QUERY_KEY = (
  placeId: string,
  spaceId: string
) => [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "QUESTIONS"];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_SPACE_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_SPACE_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceQuestions>>,
  search: string = ""
) => {
  client.setQueryData(
    [
      ...BOOKING_SPACE_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(search),
    ],
    {
      pages: [response],
      pageParams: [null],
    }
  );
};

interface GetBookingSpaceQuestionsProps extends InfiniteQueryParams {
  placeId: string;
  spaceId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingSpaceQuestions = async ({
  placeId,
  spaceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceQuestionsProps): Promise<
  ConnectedXMResponse<BookingSpaceQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions`,
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
export const useGetBookingSpaceQuestions = (
  placeId: string = "",
  spaceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceQuestions>>
  >(
    BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    (queryParams: InfiniteQueryParams) =>
      GetBookingSpaceQuestions({
        ...queryParams,
        placeId,
        spaceId,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options.enabled ?? true),
    }
  );
};

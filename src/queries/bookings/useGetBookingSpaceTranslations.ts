import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BOOKING_SPACE_QUERY_KEY } from "./useGetBookingSpace";

/**
 * @category Keys
 * @group Events
 */
export const BOOKING_SPACE_TRANSLATIONS_QUERY_KEY = (
  bookingPlaceId: string,
  bookingSpaceId: string
) => [
  ...BOOKING_SPACE_QUERY_KEY(bookingPlaceId, bookingSpaceId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_BOOKING_SPACE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BOOKING_SPACE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingSpaceTranslations>>
) => {
  client.setQueryData(
    BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingSpaceTranslationsProps extends InfiniteQueryParams {
  bookingPlaceId: string;
  bookingSpaceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetBookingSpaceTranslations = async ({
  bookingPlaceId,
  bookingSpaceId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetBookingSpaceTranslationsProps): Promise<
  ConnectedXMResponse<BookingSpaceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/bookingSpaces/${bookingSpaceId}/translations`,
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
 * @group Events
 */
export const useGetBookingSpaceTranslations = (
  bookingPlaceId: string = "",
  bookingSpaceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingSpaceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingSpaceTranslations>>
  >(
    BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId, bookingSpaceId),
    (params: InfiniteQueryParams) =>
      GetBookingSpaceTranslations({
        bookingPlaceId,
        bookingSpaceId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!bookingPlaceId && !!bookingSpaceId && (options.enabled ?? true),
    },
    "events"
  );
};

import { GetAdminAPI } from "@src/AdminAPI";
import { BookingPlaceTranslation, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { BOOKING_PLACE_QUERY_KEY } from "./useGetBookingPlace";

/**
 * @category Keys
 * @group Events
 */
export const BOOKING_PLACE_TRANSLATIONS_QUERY_KEY = (
  bookingPlaceId: string
) => [...BOOKING_PLACE_QUERY_KEY(bookingPlaceId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_BOOKING_PLACE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BOOKING_PLACE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingPlaceTranslations>>
) => {
  client.setQueryData(
    BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetBookingPlaceTranslationsProps extends InfiniteQueryParams {
  bookingPlaceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetBookingPlaceTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  bookingPlaceId,
  adminApiParams,
}: GetBookingPlaceTranslationsProps): Promise<
  ConnectedXMResponse<BookingPlaceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookingPlaces/${bookingPlaceId}/translations`,
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
export const useGetBookingPlaceTranslations = (
  bookingPlaceId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetBookingPlaceTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetBookingPlaceTranslations>>
  >(
    BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(bookingPlaceId),
    (params: InfiniteQueryParams) =>
      GetBookingPlaceTranslations({
        ...params,
        bookingPlaceId,
      }),
    params,
    {
      ...options,
      enabled: !!bookingPlaceId && (options.enabled ?? true),
    },
    "events"
  );
};

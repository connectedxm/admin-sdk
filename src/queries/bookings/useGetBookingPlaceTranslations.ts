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
export const BOOKING_PLACE_TRANSLATIONS_QUERY_KEY = (placeId: string) => [
  ...BOOKING_PLACE_QUERY_KEY(placeId),
  "TRANSLATIONS",
];

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
  placeId: string;
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
  placeId,
  adminApiParams,
}: GetBookingPlaceTranslationsProps): Promise<
  ConnectedXMResponse<BookingPlaceTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/bookings/places/${placeId}/translations`,
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
  placeId: string = "",
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
    BOOKING_PLACE_TRANSLATIONS_QUERY_KEY(placeId),
    (params: InfiniteQueryParams) =>
      GetBookingPlaceTranslations({
        ...params,
        placeId,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && (options.enabled ?? true),
    }
  );
};

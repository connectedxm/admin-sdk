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
  placeId: string,
  spaceId: string
) => [...BOOKING_SPACE_QUERY_KEY(placeId, spaceId), "TRANSLATIONS"];

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
  placeId: string;
  spaceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetBookingSpaceTranslations = async ({
  placeId,
  spaceId,
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
    `/bookings/places/${placeId}/spaces/${spaceId}/translations`,
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
  placeId: string = "",
  spaceId: string = "",
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
    BOOKING_SPACE_TRANSLATIONS_QUERY_KEY(placeId, spaceId),
    (params: InfiniteQueryParams) =>
      GetBookingSpaceTranslations({
        placeId,
        spaceId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!placeId && !!spaceId && (options.enabled ?? true),
    },
    "bookings"
  );
};

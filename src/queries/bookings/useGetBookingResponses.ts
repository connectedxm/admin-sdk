import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import {
  BaseBookingQuestionResponse,
  ConnectedXMResponse,
} from "@src/interfaces";
import { BOOKING_QUERY_KEY } from "./useGetBooking";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Bookings
 */
export const BOOKING_RESPONSES_QUERY_KEY = (bookingId: string) => [
  ...BOOKING_QUERY_KEY(bookingId),
  "RESPONSES",
];

/**
 * @category Setters
 * @group Bookings
 */
export const SET_BOOKING_RESPONSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BOOKING_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBookingResponses>>
) => {
  client.setQueryData(BOOKING_RESPONSES_QUERY_KEY(...keyParams), response);
};

interface GetBookingResponsesProps extends SingleQueryParams {
  bookingId: string;
}

/**
 * @category Queries
 * @group Bookings
 */
export const GetBookingResponses = async ({
  bookingId,
  adminApiParams,
}: GetBookingResponsesProps): Promise<
  ConnectedXMResponse<BaseBookingQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/bookings/${bookingId}/responses`);
  return data;
};

/**
 * @category Hooks
 * @group Bookings
 */
export const useGetBookingResponses = (
  bookingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingResponses>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetBookingResponses>>(
    BOOKING_RESPONSES_QUERY_KEY(bookingId),
    (params: SingleQueryParams) =>
      GetBookingResponses({ bookingId, ...params }),
    {
      ...options,
      enabled: !!bookingId && (options?.enabled ?? true),
    }
  );
};

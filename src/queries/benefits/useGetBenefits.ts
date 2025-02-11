import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Benefit } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * Retrieves a list of benefits, optionally filtered by a specific event ID.
 * This function is designed to be used in applications where a comprehensive list of benefits is required,
 * with the ability to filter results based on an event. It supports infinite scrolling through pagination.
 * @name GetBenefits
 * @param {string} [eventId] (query) The id of the event to filter benefits
 * @version 1.3
 **/

export const BENEFITS_QUERY_KEY = (eventId?: string) => {
  const keys = ["BENEFITS"];
  if (eventId) keys.push(eventId);
  return keys;
};

export const SET_BENEFITS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof BENEFITS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefits>>
) => {
  client.setQueryData(BENEFITS_QUERY_KEY(...keyParams), response);
};

interface GetBenefitsProps extends InfiniteQueryParams {
  eventId?: string;
}

export const GetBenefits = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  adminApiParams,
}: GetBenefitsProps): Promise<ConnectedXMResponse<Benefit[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/benefits`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
    },
  });
  return data;
};

export const useGetBenefits = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBenefits>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBenefits>>>(
    BENEFITS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetBenefits({ ...params, eventId }),
    params,
    options,
    "benefits"
  );
};

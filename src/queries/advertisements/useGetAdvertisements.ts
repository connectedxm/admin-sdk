import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Advertisement } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of advertisements.
 * This function fetches advertisements with optional filtering by search term.
 * It is designed to be used in applications where a list of advertisements is required.
 * @name GetAdvertisements
 * @param {string} [search] - Optional search term to filter advertisements
 * @version 1.2
 **/

export const ADVERTISEMENTS_QUERY_KEY = () => ["ADVERTISEMENTS"];

export const SET_ADVERTISEMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ADVERTISEMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisements>>
) => {
  client.setQueryData(ADVERTISEMENTS_QUERY_KEY(...keyParams), response);
};

interface GetAdvertisementsProps extends InfiniteQueryParams {}

export const GetAdvertisements = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAdvertisementsProps): Promise<ConnectedXMResponse<Advertisement[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/advertisements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAdvertisements = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAdvertisements>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAdvertisements>>
  >(
    ADVERTISEMENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetAdvertisements(params),
    params,
    options,
    "advertisements"
  );
};
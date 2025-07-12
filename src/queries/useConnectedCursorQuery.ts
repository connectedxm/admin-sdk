import { ConnectedXMResponse, PermissionDomain } from "../interfaces";
import {
  InfiniteData,
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { AxiosError } from "axios";
import { AdminApiParams } from "@src/AdminAPI";
import usePermission from "@src/utilities/usePermission";
import { GetBaseInfiniteQueryKeys } from "./useConnectedInfiniteQuery";

export interface CursorQueryParams {
  adminApiParams: AdminApiParams;
  cursor: string | number | null;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  queryClient?: QueryClient;
}

export interface CursorQueryOptions<
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
> extends Omit<
    UseInfiniteQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<null>>,
      InfiniteData<TQueryData, string | number | null>,
      QueryKey,
      string | number | null
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > {
  shouldRedirect?: boolean;
}

export const useConnectedCursorQuery = <
  TQueryData extends ConnectedXMResponse<any> = ConnectedXMResponse<unknown>
>(
  queryKeys: QueryKey,
  queryFn: (params: CursorQueryParams) => Promise<TQueryData>,
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {},
  options: CursorQueryOptions<TQueryData> = {
    shouldRedirect: false,
  },
  domain?: PermissionDomain | PermissionDomain[]
) => {
  if (typeof params.pageSize === "undefined") params.pageSize = 25;

  const {
    onModuleForbidden,
    onNotAuthorized,
    onNotFound,
    apiUrl,
    getToken,
    organizationId,
    getExecuteAs,
    queryClient,
  } = useConnectedXM();

  const { allowed } = usePermission(domain, domain ? "read" : undefined);

  const getNextPageParam = (lastPage: TQueryData): string | number | null => {
    if (lastPage.cursor) {
      return lastPage.cursor;
    }
    return null;
  };

  // prettier-ignore
  return useInfiniteQuery<TQueryData, AxiosError<ConnectedXMResponse<null>>, InfiniteData<TQueryData, string | number | null>, QueryKey, string | number | null>({
    staleTime: 60 * 1000, // 60 Seconds
    retry: (failureCount, error) => {
      // RESOURCE NOT FOUND
      if (error.response?.status === 404) {
        if (onNotFound) onNotFound(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // MODULE FORBIDDEN FOR USER
      if (error.response?.status === 403 ||
        error.response?.status === 460 ||
        error.response?.status === 461) {
        if (onModuleForbidden) onModuleForbidden(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // TOKEN IS POSSIBLY EXPIRED TRIGGER A REFRESH
      if (error.response?.status === 401) {
        if (onNotAuthorized) onNotAuthorized(error, queryKeys, options.shouldRedirect || false);
        return false;
      }

      // DEFAULT
      if (failureCount < 3) return true;
      return false;
    },
    ...options,
    queryKey: [
      ...queryKeys,
      ...GetBaseInfiniteQueryKeys(params?.search),
    ],
    queryFn: ({ pageParam }) =>
      queryFn({ 
        ...params, 
        pageSize: params.pageSize || 25, 
        cursor: pageParam,
        queryClient, 
        adminApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
        } 
      }),
    initialPageParam: null,
    getNextPageParam,
    enabled: (!domain || allowed) && options.enabled,
  });
};

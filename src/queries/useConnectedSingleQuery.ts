import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useConnectedXM } from "../hooks";
import { AxiosError } from "axios";
import { ConnectedXMResponse } from "..";
import { AdminApiParams } from "@src/AdminAPI";

export interface SingleQueryParams {
  adminApiParams: AdminApiParams;
}

export interface SingleQueryOptions<TQueryData = unknown>
  extends Omit<
    UseQueryOptions<
      TQueryData,
      AxiosError<ConnectedXMResponse<any>>,
      Awaited<TQueryData>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  > {
  shouldRedirect?: boolean;
}

export const useConnectedSingleQuery = <TQueryData = unknown>(
  queryKeys: QueryKey,
  queryFn: (params: SingleQueryParams) => TQueryData,
  options: SingleQueryOptions<TQueryData> = {}
) => {
  const {
    onModuleForbidden,
    onNotAuthorized,
    onNotFound,
    apiUrl,
    organizationId,
    getToken,
    getExecuteAs,
  } = useConnectedXM();

  // prettier-ignore
  return useQuery<
    TQueryData,
    AxiosError<ConnectedXMResponse<any>>,
    Awaited<TQueryData>,
    QueryKey
  >({
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
    queryKey: [...queryKeys],
    queryFn: () =>
      queryFn({
        adminApiParams: {
          apiUrl,
          organizationId,
          getToken,
          getExecuteAs,
        },
      }),
  });
};

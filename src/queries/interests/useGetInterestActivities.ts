import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INTEREST_QUERY_KEY } from "./useGetInterest";

export const INTEREST_ACTIVITIES_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "ACTIVITIES",
];

export const SET_INTEREST_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestActivities>>
) => {
  client.setQueryData(INTEREST_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetInterestActivitiesProps extends InfiniteQueryParams {
  interestId: string;
}

export const GetInterestActivities = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetInterestActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetInterestActivities = (interestId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestActivities>>
  >(
    INTEREST_ACTIVITIES_QUERY_KEY(interestId),
    (params: any) => GetInterestActivities(params),
    {
      interestId,
    },
    {
      enabled: !!interestId,
    }
  );
};

export default useGetInterestActivities;

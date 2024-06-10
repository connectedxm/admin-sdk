import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Interest, Like } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_INTERESTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "INTERESTS",
];

export const SET_ACTIVITY_INTEREST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityInterests>>
) => {
  client.setQueryData(ACTIVITY_INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetActivityInterestsProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityInterests = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetActivityInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetActivityInterests = (activityId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityInterests>>
  >(
    ACTIVITY_INTERESTS_QUERY_KEY(activityId),
    (params: any) => GetActivityInterests(params),
    {
      activityId,
    },
    {
      enabled: !!activityId,
    }
  );
};

export default useGetActivityInterests;

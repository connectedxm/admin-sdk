import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Benefit } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

export const BENEFITS_QUERY_KEY = (eventId?: string) => {
  let keys = ["BENEFITS"];
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

const useGetBenefits = (eventId?: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBenefits>>>(
    BENEFITS_QUERY_KEY(eventId),
    (params: any) => GetBenefits({ ...params, eventId }),
    {},
    {}
  );
};

export default useGetBenefits;

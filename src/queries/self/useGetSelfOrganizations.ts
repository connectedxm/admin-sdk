import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Organization } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryClient } from "@tanstack/react-query";

export const SELF_ORGANIZATIONS_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "ORGANIZATIONS",
];

export const SET_SELF_ORGANIZATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_ORGANIZATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfOrganizations>>
) => {
  client.setQueryData(SELF_ORGANIZATIONS_QUERY_KEY(...keyParams), response);
};

interface GetSelfOrganizationsProps extends InfiniteQueryParams {}

export const GetSelfOrganizations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetSelfOrganizationsProps): Promise<ConnectedXMResponse<Organization[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self/organizations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfOrganizations = () => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfOrganizations>>
  >(
    SELF_ORGANIZATIONS_QUERY_KEY(),
    (params: any) => GetSelfOrganizations(params),
    {},
    {}
  );
};

export default useGetSelfOrganizations;

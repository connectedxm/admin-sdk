import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { User } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export const SELF_QUERY_KEY = () => ["SELF"];

export const SET_SELF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelf>>
) => {
  client.setQueryData(SELF_QUERY_KEY(...keyParams), response);
};

interface GetSelfProps {}

export const GetSelf = async ({}: GetSelfProps): Promise<
  ConnectedXMResponse<User>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/self`);
  return data;
};

const useGetSelf = () => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelf>>(
    SELF_QUERY_KEY(),
    () => GetSelf({}),
    {}
  );
};

export default useGetSelf;

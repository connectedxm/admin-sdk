import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

export const STREAM_INPUTS_QUERY_KEY = () => ["STREAMS"];

export const SET_STREAM_INPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputs>>
) => {
  client.setQueryData(STREAM_INPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputsParams extends InfiniteQueryParams {}

export const GetStreamInputs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetStreamInputsParams): Promise<ConnectedXMResponse<StreamInput[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetStreamInputs = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetStreamInputs>>>(
    STREAM_INPUTS_QUERY_KEY(),
    (params: any) => GetStreamInputs(params),
    {},
    {}
  );
};

export default useGetStreamInputs;

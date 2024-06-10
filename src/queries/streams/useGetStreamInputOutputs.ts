import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInputOutput } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { STREAM_QUERY_KEY } from "./useGetStreamInput";

export const STREAM_INPUT_OUTPUTS_QUERY_KEY = (streamId: string) => [
  ...STREAM_QUERY_KEY(streamId),
  "OUTPUTS",
];

export const SET_STREAM_INPUT_OUTPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUT_OUTPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputOutputs>>
) => {
  client.setQueryData(STREAM_INPUT_OUTPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputOutputsParams extends InfiniteQueryParams {
  streamId: string;
}

export const GetStreamInputOutputs = async ({
  streamId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetStreamInputOutputsParams): Promise<
  ConnectedXMResponse<StreamInputOutput[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/outputs`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetStreamInputOutputs = (streamId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetStreamInputOutputs>>
  >(
    STREAM_INPUT_OUTPUTS_QUERY_KEY(streamId),
    (params: any) => GetStreamInputOutputs({ ...params, streamId }),
    {},
    {}
  );
};

export default useGetStreamInputOutputs;

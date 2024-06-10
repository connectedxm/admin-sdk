import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY } from "./useGetStreamInputs";
import { QueryClient } from "@tanstack/react-query";

export const STREAM_QUERY_KEY = (streamId: string) => [
  ...STREAM_INPUTS_QUERY_KEY(),
  streamId,
];

export const SET_STREAM_INPUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInput>>
) => {
  client.setQueryData(STREAM_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputParams {
  streamId: string;
}

export const GetStreamInput = async ({
  streamId,
}: GetStreamInputParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}`);

  return data;
};

const useGetStreamInput = (streamId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamInput>>(
    STREAM_QUERY_KEY(streamId),
    () => GetStreamInput({ streamId }),
    {
      enabled: !!streamId,
    }
  );
};

export default useGetStreamInput;

import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput, StreamInputOutput } from "@src/interfaces";
import { STREAM_INPUT_OUTPUTS_QUERY_KEY } from "./useGetStreamInputOutputs";
import { QueryClient } from "@tanstack/react-query";

export const STREAM_INPUT_OUTPUT_QUERY_KEY = (
  streamId: string,
  output: string
) => [...STREAM_INPUT_OUTPUTS_QUERY_KEY(streamId), output];

export const SET_STREAM_INPUT_OUTPUT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUT_OUTPUT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputOutput>>
) => {
  client.setQueryData(STREAM_INPUT_OUTPUT_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputOutputParams {
  streamId: string;
  output: string;
}

export const GetStreamInputOutput = async ({
  streamId,
  output,
}: GetStreamInputOutputParams): Promise<
  ConnectedXMResponse<StreamInputOutput>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/outputs/${output}`);

  return data;
};

const useGetStreamInputOutput = (streamId: string, output: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamInputOutput>>((
    STREAM_INPUT_OUTPUT_QUERY_KEY(streamId, output),
    () => GetStreamInputOutput({ streamId, output }),
    {
      enabled: !!streamId,
    }
  );
};

export default useGetStreamInputOutput;

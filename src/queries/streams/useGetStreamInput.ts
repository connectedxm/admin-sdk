import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { STREAM_INPUTS_QUERY_KEY } from "./useGetStreamInputs";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches stream input data for a specific stream by its ID.
 * This function is designed to retrieve detailed information about a stream input, which can be used in applications that require stream data.
 * It utilizes a connected single query to ensure efficient data retrieval and management.
 * @name GetStreamInput
 * @param {string} streamId (path) The ID of the stream
 * @version 1.3
 **/

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

interface GetStreamInputParams extends SingleQueryParams {
  streamId: string;
}

export const GetStreamInput = async ({
  streamId,
  adminApiParams,
}: GetStreamInputParams): Promise<ConnectedXMResponse<StreamInput>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}`);

  return data;
};

export const useGetStreamInput = (
  streamId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetStreamInput>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetStreamInput>>(
    STREAM_QUERY_KEY(streamId),
    (params) => GetStreamInput({ streamId, ...params }),
    {
      ...options,
      enabled: !!streamId && (options?.enabled ?? true),
    },
    "events"
  );
};
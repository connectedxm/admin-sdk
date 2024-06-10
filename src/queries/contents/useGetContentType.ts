import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { ContentType } from "@src/interfaces";
import { CONTENT_TYPES_QUERY_KEY } from "./useGetContentTypes";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPE_QUERY_KEY = (contentTypeId: string) => [
  ...CONTENT_TYPES_QUERY_KEY(),
  contentTypeId,
];

export const SET_CONTENT_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentType>>
) => {
  client.setQueryData(CONTENT_TYPE_QUERY_KEY(...keyParams), response);
};

interface GetContentTypeProps {
  contentTypeId: string;
}

export const GetContentType = async ({
  contentTypeId,
}: GetContentTypeProps): Promise<ConnectedXMResponse<ContentType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contentTypes/${contentTypeId}`);
  return data;
};

const useGetContentType = (contentTypeId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentType>>(
    CONTENT_TYPE_QUERY_KEY(contentTypeId),
    () => GetContentType({ contentTypeId }),
    {
      enabled: !!contentTypeId,
    }
  );
};

export default useGetContentType;

import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Content } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENTS_QUERY_KEY } from "./useGetContentTypeContents";

export const CONTENT_TYPE_CONTENT_QUERY_KEY = (
  contentTypeId: string,
  contentId: string
) => [...CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId), contentId];

export const SET_CONTENT_TYPE_CONTENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContent>>
) => {
  client.setQueryData(CONTENT_TYPE_CONTENT_QUERY_KEY(...keyParams), response);
};

interface GetContentProps {
  contentId: string;
}

export const GetContent = async ({
  contentId,
}: GetContentProps): Promise<ConnectedXMResponse<Content>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}`);
  return data;
};

const useGetContent = (contentTypeId: string, contentId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContent>>(
    CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId),
    () => GetContent({ contentId }),
    {
      enabled: !!contentId,
    }
  );
};

export default useGetContent;

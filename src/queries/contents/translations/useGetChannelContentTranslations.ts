import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ContentTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { CHANNEL_CONTENT_QUERY_KEY } from "../useGetChannelContent";

export const CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "TRANSLATIONS"];

export const SET_CHANNEL_CONTENT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentTranslations>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentTranslationsProps extends InfiniteQueryParams {
  contentId: string;
}

export const GetChannelContentTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
  adminApiParams,
}: GetChannelContentTranslationsProps): Promise<
  ConnectedXMResponse<ContentTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetChannelContentTranslations = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentTranslations>>
  >(
    CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentTranslations({
        ...params,
        contentId,
      }),
    params,
    {
      ...options,
      enabled: !!contentId,
    }
  );
};

export default useGetChannelContentTranslations;

import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ContentTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { CHANNEL_CONTENT_QUERY_KEY } from "../useGetChannelContent";

export const CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "TRANSLATIONS"];

export const SET_CHANNEL_TRANSLATIONS_QUERY_DATA = (
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
  channelId: string,
  contentId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentTranslations>>
  >(
    CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
    (params: any) => GetChannelContentTranslations(params),
    {
      contentId,
    },
    {
      enabled: !!contentId,
    }
  );
};

export default useGetChannelContentTranslations;

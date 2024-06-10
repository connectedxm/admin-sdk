import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ContentTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { CONTENT_TYPE_CONTENT_QUERY_KEY } from "../useGetContentTypeContent";

export const CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY = (
  contentTypeId: string,
  contentId: string
) => [
  ...CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId),
  "TRANSLATIONS",
];

export const SET_CONTENT_TYPE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeContentTranslations>>
) => {
  client.setQueryData(
    CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeContentTranslationsProps extends InfiniteQueryParams {
  contentId: string;
}

export const GetContentTypeContentTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
}: GetContentTypeContentTranslationsProps): Promise<
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

const useGetContentTypeContentTranslations = (
  contentTypeId: string,
  contentId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeContentTranslations>>
  >(
    CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(contentTypeId, contentId),
    (params: any) => GetContentTypeContentTranslations(params),
    {
      contentId,
    },
    {
      enabled: !!contentId,
    }
  );
};

export default useGetContentTypeContentTranslations;

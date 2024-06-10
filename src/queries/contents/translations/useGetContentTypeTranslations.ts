import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ContentTypeTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { CONTENT_TYPE_QUERY_KEY } from "../useGetContentType";

export const CONTENT_TYPE_TRANSLATIONS_QUERY_KEY = (contentTypeId: string) => [
  ...CONTENT_TYPE_QUERY_KEY(contentTypeId),
  "TRANSLATIONS",
];

export const SET_CONTENT_TYPE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CONTENT_TYPE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeTranslations>>
) => {
  client.setQueryData(
    CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeTranslationsProps extends InfiniteQueryParams {
  contentTypeId: string;
}

export const GetContentTypeTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentTypeId,
}: GetContentTypeTranslationsProps): Promise<
  ConnectedXMResponse<ContentTypeTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contentTypes/${contentTypeId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetContentTypeTranslations = (contentTypeId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeTranslations>>
  >(
    CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId),
    (params: any) => GetContentTypeTranslations(params),
    {
      contentTypeId,
    },
    {
      enabled: !!contentTypeId,
    }
  );
};

export default useGetContentTypeTranslations;

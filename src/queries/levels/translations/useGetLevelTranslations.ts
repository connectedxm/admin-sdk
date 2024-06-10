import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevelTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { LEVEL_QUERY_KEY } from "../useGetLevel";

export const LEVEL_TRANSLATIONS_QUERY_KEY = (levelId: string) => [
  ...LEVEL_QUERY_KEY(levelId),
  "TRANSLATIONS",
];

export const SET_LEVEL_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof LEVEL_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelTranslations>>
) => {
  client.setQueryData(LEVEL_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetLevelTranslationsProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevelTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  levelId,
}: GetLevelTranslationsProps): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/levels/${levelId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetLevelTranslations = (levelId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLevelTranslations>>
  >(
    LEVEL_TRANSLATIONS_QUERY_KEY(levelId),
    (params: any) => GetLevelTranslations(params),
    {
      levelId,
    },
    {
      enabled: !!levelId,
    }
  );
};

export default useGetLevelTranslations;

import { ConnectedXMResponse } from "@src/interfaces";
import { SponsorshipLevelTranslation } from "@src/interfaces";
import { LEVEL_TRANSLATIONS_QUERY_KEY } from "./useGetLevelTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

export const LEVEL_TRANSLATION_QUERY_KEY = (
  levelId: string,
  locale: string
) => [...LEVEL_TRANSLATIONS_QUERY_KEY(levelId), locale];

export const SET_LEVEL_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof LEVEL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelTranslation>>
) => {
  client.setQueryData(LEVEL_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetLevelTranslationProps extends SingleQueryParams {
  levelId: string;
  locale: string;
}

export const GetLevelTranslation = async ({
  levelId,
  locale,
  adminApiParams,
}: GetLevelTranslationProps): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/levels/${levelId}/translations/${locale}`
  );
  return data;
};

const useGetLevelTranslation = (
  levelId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLevelTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevelTranslation>>(
    LEVEL_TRANSLATION_QUERY_KEY(levelId, locale),
    (params) =>
      GetLevelTranslation({
        ...params,
        levelId,
        locale,
      }),
    {
      ...options,
      enabled: !!levelId && !!locale && (options.enabled ?? true),
    }
  );
};

export default useGetLevelTranslation;

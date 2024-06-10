import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation, SponsorshipLevelTranslation } from "@src/interfaces";
import { LEVEL_TRANSLATIONS_QUERY_KEY } from "./useGetLevelTranslations";

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

interface GetLevelTranslationProps {
  levelId: string;
  locale: string;
}

export const GetLevelTranslation = async ({
  levelId,
  locale,
}: GetLevelTranslationProps): Promise<
  ConnectedXMResponse<SponsorshipLevelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/levels/${levelId}/translations/${locale}`
  );
  return data;
};

const useGetLevelTranslation = (levelId: string, locale: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevelTranslation>>((
    LEVEL_TRANSLATION_QUERY_KEY(levelId, locale),
    () =>
      GetLevelTranslation({
        levelId,
        locale,
      }),
    {
      enabled: !!levelId && !!locale,
    }
  );
};

export default useGetLevelTranslation;

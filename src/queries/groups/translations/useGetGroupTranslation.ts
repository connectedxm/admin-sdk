import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation } from "@src/interfaces";
import { GROUP_TRANSLATIONS_QUERY_KEY } from "./useGetGroupTranslations";

export const GROUP_TRANSLATION_QUERY_KEY = (
  groupId: string,
  locale: string
) => [...GROUP_TRANSLATIONS_QUERY_KEY(groupId), locale];

export const SET_GROUP_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof GROUP_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupTranslation>>
) => {
  client.setQueryData(GROUP_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetGroupTranslationProps {
  groupId: string;
  locale: string;
}

export const GetGroupTranslation = async ({
  groupId,
  locale,
}: GetGroupTranslationProps): Promise<
  ConnectedXMResponse<GroupTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/groups/${groupId}/translations/${locale}`
  );
  return data;
};

const useGetGroupTranslation = (groupId: string, locale: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupTranslation>>((
    GROUP_TRANSLATION_QUERY_KEY(groupId, locale),
    () =>
      GetGroupTranslation({
        groupId,
        locale,
      }),
    {
      enabled: !!groupId && !!locale,
    }
  );
};

export default useGetGroupTranslation;

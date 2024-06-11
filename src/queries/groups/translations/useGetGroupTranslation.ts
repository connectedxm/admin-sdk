import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation } from "@src/interfaces";
import { GROUP_TRANSLATIONS_QUERY_KEY } from "./useGetGroupTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

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

interface GetGroupTranslationProps extends SingleQueryParams {
  groupId: string;
  locale: string;
}

export const GetGroupTranslation = async ({
  groupId,
  locale,
  adminApiParams,
}: GetGroupTranslationProps): Promise<
  ConnectedXMResponse<GroupTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/groups/${groupId}/translations/${locale}`
  );
  return data;
};

const useGetGroupTranslation = (
  groupId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupTranslation>>(
    GROUP_TRANSLATION_QUERY_KEY(groupId, locale),
    (params) =>
      GetGroupTranslation({
        ...params,
        groupId,
        locale,
      }),
    {
      ...options,
      enabled: !!groupId && !!locale && (options.enabled ?? true),
    }
  );
};

export default useGetGroupTranslation;

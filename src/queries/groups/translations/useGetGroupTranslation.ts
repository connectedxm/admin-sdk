import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation } from "@src/interfaces";
import { GROUP_TRANSLATIONS_QUERY_KEY } from "./useGetGroupTranslations";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Groups
 */
export const GROUP_TRANSLATION_QUERY_KEY = (
  groupId: string,
  locale: string
) => [...GROUP_TRANSLATIONS_QUERY_KEY(groupId), locale];

/**
 * @category Setters
 * @group Groups
 */
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

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupTranslation = async ({
  groupId,
  locale,
  adminApiParams,
}: GetGroupTranslationProps): Promise<
  ConnectedXMResponse<GroupTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/groups/${groupId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupTranslation = (
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
      enabled:
        !!groupId && !!locale && locale !== "en" && (options.enabled ?? true),
    }
  );
};

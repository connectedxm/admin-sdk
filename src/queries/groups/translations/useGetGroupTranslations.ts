import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "../useGetGroup";

/**
 * Retrieves translations for a specific group by its ID.
 * This function is used to fetch a list of translations associated with a particular group within an application.
 * It supports infinite scrolling and can be used in scenarios where group translation data is required.
 * @name GetGroupTranslations
 * @param {string} groupId (path) - The ID of the group
 * @version 1.3
 **/

/**
 * @category Keys
 * @group Groups
 */
export const GROUP_TRANSLATIONS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof GROUP_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupTranslations>>
) => {
  client.setQueryData(GROUP_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetGroupTranslationsProps extends InfiniteQueryParams {
  groupId: string;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  adminApiParams,
}: GetGroupTranslationsProps): Promise<
  ConnectedXMResponse<GroupTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupTranslations = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupTranslations>>
  >(
    GROUP_TRANSLATIONS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetGroupTranslations({
        ...params,
        groupId,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};
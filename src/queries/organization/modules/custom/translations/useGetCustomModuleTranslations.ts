import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomModuleTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CUSTOM_MODULES_QUERY_KEY } from "../useGetCustomModules";

/**
 * @category Keys
 * @group Organization
 */
export const CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY = (moduleId: string) => [
  ...CUSTOM_MODULES_QUERY_KEY(),
  moduleId,
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_CUSTOM_MODULE_TRANSLATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomModuleTranslations>>
) => {
  client.setQueryData(
    CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetCustomModuleTranslationsProps extends InfiniteQueryParams {
  moduleId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetCustomModuleTranslations = async ({
  moduleId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetCustomModuleTranslationsProps): Promise<
  ConnectedXMResponse<CustomModuleTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/custom/${moduleId}/translations`,
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

/**
 * @category Hooks
 * @group Organization
 */
export const useGetCustomModuleTranslations = (
  moduleId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCustomModuleTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCustomModuleTranslations>>
  >(
    CUSTOM_MODULE_TRANSLATIONS_QUERY_KEY(moduleId),
    (params: InfiniteQueryParams) =>
      GetCustomModuleTranslations({ moduleId, ...params }),
    params,
    options
  );
};

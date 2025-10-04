import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CustomModule } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CUSTOM_MODULES_QUERY_KEY } from "./useGetCustomModules";

/**
 * @category Keys
 * @group Organization
 */
export const CUSTOM_MODULE_QUERY_KEY = (moduleId: string) => [
  ...CUSTOM_MODULES_QUERY_KEY(),
  moduleId,
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_CUSTOM_MODULE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_MODULE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomModule>>
) => {
  client.setQueryData(CUSTOM_MODULE_QUERY_KEY(...keyParams), response);
};

interface GetCustomModuleProps extends SingleQueryParams {
  moduleId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetCustomModule = async ({
  moduleId = "",
  adminApiParams,
}: GetCustomModuleProps): Promise<ConnectedXMResponse<CustomModule>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/organization/modules/custom/${moduleId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetCustomModule = (
  moduleId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetCustomModule>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetCustomModule>>(
    CUSTOM_MODULE_QUERY_KEY(moduleId),
    (params: SingleQueryParams) =>
      GetCustomModule({ moduleId: moduleId || "unknown", ...params }),
    {
      ...options,
      enabled: !!moduleId && (options?.enabled ?? true),
    }
  );
};

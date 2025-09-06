import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { TAX_INTEGRATION_QUERY_KEY } from "./useGetTaxIntegration";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Keys
 * @group Tax Integrations
 */
export const ENTITY_USE_CODES_QUERY_KEY = (type: string, search?: string) => [
  ...TAX_INTEGRATION_QUERY_KEY(type),
  "ENTITY_USE_CODES",
  search,
];

/**
 * @category Setters
 * @group Tax Integrations
 */
export const SET_ENTITY_USE_CODES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ENTITY_USE_CODES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEntityUseCodes>>
) => {
  client.setQueryData(ENTITY_USE_CODES_QUERY_KEY(...keyParams), response);
};

interface GetEntityUseCodesProps extends SingleQueryParams {
  type: string;
  search?: string;
}

/**
 * @category Queries
 * @group Tax Integrations
 */
export const GetEntityUseCodes = async ({
  type,
  search,
  adminApiParams,
}: GetEntityUseCodesProps): Promise<ConnectedXMResponse<any[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<any[]>>(
    `/organization/tax/${type}/entity-use-codes`,
    {
      params: {
        search,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Tax Integrations
 */
export const useGetEntityUseCodes = (
  type: string = "",
  search?: string,
  options: SingleQueryOptions<ReturnType<typeof GetEntityUseCodes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEntityUseCodes>>(
    ENTITY_USE_CODES_QUERY_KEY(type, search),
    (params: SingleQueryParams) =>
      GetEntityUseCodes({
        type,
        search,
        ...params,
      }),
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    },
    "org"
  );
};

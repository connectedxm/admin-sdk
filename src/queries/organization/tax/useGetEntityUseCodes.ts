import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { TAX_INTEGRATION_QUERY_KEY } from "./useGetTaxIntegration";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, EntityUseCode } from "@src/interfaces";

/**
 * @category Keys
 * @group Tax Integrations
 */
export const ENTITY_USE_CODES_QUERY_KEY = (type: string) => [
  ...TAX_INTEGRATION_QUERY_KEY(type),
  "ENTITY_USE_CODES",
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
}

/**
 * @category Queries
 * @group Tax Integrations
 */
export const GetEntityUseCodes = async ({
  type,
  adminApiParams,
}: GetEntityUseCodesProps): Promise<ConnectedXMResponse<EntityUseCode[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<EntityUseCode[]>>(
    `/organization/tax/${type}/entity-use-codes`
  );
  return data;
};

/**
 * @category Hooks
 * @group Tax Integrations
 */
export const useGetEntityUseCodes = (
  type: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEntityUseCodes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEntityUseCodes>>(
    ENTITY_USE_CODES_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetEntityUseCodes({
        type,
        ...params,
      }),
    {
      ...options,
      enabled: !!type && (options.enabled ?? true),
    },
    "org"
  );
};

import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { TAX_INTEGRATION_QUERY_KEY } from "./useGetTaxIntegration";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, TaxCode } from "@src/interfaces";

/**
 * @category Keys
 * @group Tax Integrations
 */
export const TAX_CODES_QUERY_KEY = (type: string) => [
  ...TAX_INTEGRATION_QUERY_KEY(type),
  "TAX_CODES",
];

/**
 * @category Setters
 * @group Tax Integrations
 */
export const SET_TAX_CODES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof TAX_CODES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetTaxCodes>>
) => {
  client.setQueryData(TAX_CODES_QUERY_KEY(...keyParams), response);
};

interface GetTaxCodesProps extends SingleQueryParams {
  type: string;
}

/**
 * @category Queries
 * @group Tax Integrations
 */
export const GetTaxCodes = async ({
  type,
  adminApiParams,
}: GetTaxCodesProps): Promise<ConnectedXMResponse<TaxCode[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<TaxCode[]>>(
    `/organization/tax/${type}/tax-codes`
  );
  return data;
};

/**
 * @category Hooks
 * @group Tax Integrations
 */
export const useGetTaxCodes = (
  type: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetTaxCodes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetTaxCodes>>(
    TAX_CODES_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetTaxCodes({
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

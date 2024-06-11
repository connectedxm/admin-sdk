import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Invoice } from "@src/interfaces";
import { INVOICES_QUERY_KEY } from "./useGetInvoices";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Invoices
 */
export const INVOICE_QUERY_KEY = (invoiceId: string) => [
  ...INVOICES_QUERY_KEY(),
  invoiceId,
];

/**
 * @category Setters
 * @group Invoices
 */
export const SET_INVOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoice>>
) => {
  client.setQueryData(INVOICE_QUERY_KEY(...keyParams), response);
};

interface GetInvoiceProps extends SingleQueryParams {
  invoiceId: string;
}

/**
 * @category Queries
 * @group Invoices
 */
export const GetInvoice = async ({
  invoiceId,
  adminApiParams,
}: GetInvoiceProps): Promise<ConnectedXMResponse<Invoice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices/${invoiceId}`);
  return data;
};
/**
 * @category Hooks
 * @group Invoices
 */
export const useGetInvoice = (
  invoiceId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInvoice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoice>>(
    INVOICE_QUERY_KEY(invoiceId),
    (params) => GetInvoice({ invoiceId, ...params }),
    {
      ...options,
      enabled: !!invoiceId,
    }
  );
};

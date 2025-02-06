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
 * Endpoint to retrieve detailed information about a specific invoice by its ID.
 * This function is designed to fetch invoice data, which can be used in applications
 * that require access to invoice details for display or processing purposes.
 * @name GetInvoice
 * @param {string} invoiceId (path) - The ID of the invoice
 * @version 1.3
 **/

export const INVOICE_QUERY_KEY = (invoiceId: string) => [
  ...INVOICES_QUERY_KEY(),
  invoiceId,
];

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

export const GetInvoice = async ({
  invoiceId,
  adminApiParams,
}: GetInvoiceProps): Promise<ConnectedXMResponse<Invoice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/invoices/${invoiceId}`);
  return data;
};

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
    },
    "invoices"
  );
};
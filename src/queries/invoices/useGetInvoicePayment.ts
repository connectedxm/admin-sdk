import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { Payment } from "@src/interfaces";
import { INVOICE_PAYMENTS_QUERY_KEY } from "./useGetInvoicePayments";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a specific payment associated with a given invoice.
 * This function is designed to retrieve detailed information about a particular payment linked to an invoice.
 * It is useful in scenarios where precise payment details are required for an invoice.
 * @name GetInvoicePayment
 * @param {string} invoiceId (path) The ID of the invoice
 * @param {string} paymentId (path) The ID of the payment
 * @version 1.3
 **/

export const INVOICE_PAYMENT_QUERY_KEY = (
  invoiceId: string,
  paymentId: string
) => [...INVOICE_PAYMENTS_QUERY_KEY(invoiceId), paymentId];

export const SET_INVOICE_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoicePayment>>
) => {
  client.setQueryData(INVOICE_PAYMENT_QUERY_KEY(...keyParams), response);
};

interface GetInvoicePaymentProps extends SingleQueryParams {
  invoiceId: string;
  paymentId: string;
}

export const GetInvoicePayment = async ({
  invoiceId,
  paymentId,
  adminApiParams,
}: GetInvoicePaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/invoices/${invoiceId}/payments/${paymentId}`
  );
  return data;
};

export const useGetInvoicePayment = (
  invoiceId: string = "",
  paymentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetInvoicePayment>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoicePayment>>(
    INVOICE_PAYMENT_QUERY_KEY(invoiceId, paymentId),
    (params: SingleQueryParams) =>
      GetInvoicePayment({ invoiceId, paymentId, ...params }),
    {
      ...options,
      enabled: !!invoiceId && !!paymentId,
    },
    "invoices"
  );
};

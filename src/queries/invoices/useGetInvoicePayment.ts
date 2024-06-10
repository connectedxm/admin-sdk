import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { Payment } from "@src/interfaces";
import { INVOICE_PAYMENTS_QUERY_KEY } from "./useGetInvoicePayments";

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

interface GetInvoicePaymentProps {
  invoiceId: string;
  paymentId: string;
}

export const GetInvoicePayment = async ({
  invoiceId,
  paymentId,
}: GetInvoicePaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/invoices/${invoiceId}/payments/${paymentId}`
  );
  return data;
};

const useGetInvoicePayment = (invoiceId: string, paymentId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoicePayment>>(
    INVOICE_PAYMENT_QUERY_KEY(invoiceId, paymentId),
    () => GetInvoicePayment({ invoiceId, paymentId }),
    {
      enabled: !!invoiceId && !!paymentId,
    }
  );
};

export default useGetInvoicePayment;

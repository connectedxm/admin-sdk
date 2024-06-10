import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { INVOICE_QUERY_KEY } from "./useGetInvoice";
import { InvoiceLineItem } from "@src/interfaces";
import { INVOICE_LINE_ITEMS_QUERY_KEY } from "./useGetInvoiceLineItems";

export const INVOICE_LINE_ITEM_QUERY_KEY = (
  invoiceId: string,
  lineItemId: string
) => [...INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId), lineItemId];

export const SET_INVOICE_LINE_ITEM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INVOICE_LINE_ITEM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInvoiceLineItem>>
) => {
  client.setQueryData(INVOICE_LINE_ITEM_QUERY_KEY(...keyParams), response);
};

interface GetInvoiceLineItemProps {
  invoiceId: string;
  lineItemId: string;
}

export const GetInvoiceLineItem = async ({
  invoiceId,
  lineItemId,
}: GetInvoiceLineItemProps): Promise<ConnectedXMResponse<InvoiceLineItem>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/invoices/${invoiceId}/items/${lineItemId}`
  );
  return data;
};

const useGetInvoiceLineItem = (invoiceId: string, lineItemId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetInvoiceLineItem>>((
    INVOICE_LINE_ITEM_QUERY_KEY(invoiceId, lineItemId),
    () => GetInvoiceLineItem({ invoiceId, lineItemId }),
    {
      enabled: !!invoiceId && !!lineItemId,
    }
  );
};

export default useGetInvoiceLineItem;

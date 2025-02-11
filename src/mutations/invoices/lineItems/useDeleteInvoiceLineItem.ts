import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  INVOICE_QUERY_KEY,
  INVOICE_LINE_ITEMS_QUERY_KEY,
  INVOICE_LINE_ITEM_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a specific line item from an invoice.
 * This function allows the removal of a line item from a specified invoice using the invoice ID and line item ID.
 * It is designed to be used in applications where invoice management and item removal are required.
 * @name DeleteInvoiceLineItem
 * @param {string} invoiceId (path) The id of the invoice
 * @param {string} lineItemId (path) The id of the line item
 * @version 1.3
 **/

export interface DeleteInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  lineItemId: string;
}

export const DeleteInvoiceLineItem = async ({
  invoiceId,
  lineItemId,
  adminApiParams,
  queryClient,
}: DeleteInvoiceLineItemParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/invoices/${invoiceId}/items/${lineItemId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEY(invoiceId) });
    queryClient.invalidateQueries({
      queryKey: INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId),
    });
    queryClient.removeQueries({
      queryKey: INVOICE_LINE_ITEM_QUERY_KEY(invoiceId, lineItemId),
    });
  }
  return data;
};

export const useDeleteInvoiceLineItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteInvoiceLineItem>>,
      Omit<DeleteInvoiceLineItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteInvoiceLineItemParams,
    Awaited<ReturnType<typeof DeleteInvoiceLineItem>>
  >(DeleteInvoiceLineItem, options, {
    domain: "invoices",
    type: "update",
  });
};

import { GetAdminAPI } from "@src/AdminAPI";
import { InvoiceLineItem, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { InvoiceLineItemUpdateInputs } from "@src/params";
import {
  SET_INVOICE_LINE_ITEM_QUERY_DATA,
  INVOICE_QUERY_KEY,
  INVOICE_LINE_ITEMS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to update a specific invoice line item within an invoice.
 * This function allows users to modify details of a line item associated with a given invoice.
 * It is designed to be used in applications where invoice management and updates are required.
 * @name UpdateInvoiceLineItem
 * @param {string} invoiceId (path) The id of the invoice
 * @param {string} lineItemId (path) The id of the line item
 * @param {InvoiceLineItemUpdateInputs} invoiceLineItem (body) The invoice line item update inputs
 * @version 1.3
 **/

export interface UpdateInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  lineItemId: string;
  invoiceLineItem: InvoiceLineItemUpdateInputs;
}

export const UpdateInvoiceLineItem = async ({
  invoiceId,
  lineItemId,
  invoiceLineItem,
  adminApiParams,
  queryClient,
}: UpdateInvoiceLineItemParams): Promise<
  ConnectedXMResponse<InvoiceLineItem>
> => {
  if (!invoiceId) throw new Error("Invoice ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<InvoiceLineItem>>(
    `/invoices/${invoiceId}/items/${lineItemId}`,
    {
      ...invoiceLineItem,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_INVOICE_LINE_ITEM_QUERY_DATA(
      queryClient,
      [invoiceId, lineItemId || data.data?.id],
      data
    );
    queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEY(invoiceId) });
    queryClient.invalidateQueries({
      queryKey: INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId),
    });
  }
  return data;
};

export const useUpdateInvoiceLineItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateInvoiceLineItem>>,
      Omit<UpdateInvoiceLineItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateInvoiceLineItemParams,
    Awaited<ReturnType<typeof UpdateInvoiceLineItem>>
  >(UpdateInvoiceLineItem, options, {
    domain: "invoices",
    type: "update",
  });
};

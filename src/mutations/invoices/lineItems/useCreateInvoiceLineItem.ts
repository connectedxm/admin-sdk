import { GetAdminAPI } from "@src/AdminAPI";
import { InvoiceLineItem, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { InvoiceLineItemCreateInputs } from "@src/params";
import {
  SET_INVOICE_LINE_ITEM_QUERY_DATA,
  INVOICE_LINE_ITEMS_QUERY_KEY,
  INVOICE_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to create a new invoice line item.
 * This function allows the creation of a new line item for a specified invoice.
 * It is designed to be used in applications where invoice management is required.
 * @name CreateInvoiceLineItem
 * @param {string} invoiceId (path) The id of the invoice
 * @param {InvoiceLineItemCreateInputs} invoiceLineItem (body) The details of the invoice line item to create
 * @version 1.3
 **/

export interface CreateInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  invoiceLineItem: InvoiceLineItemCreateInputs;
}

export const CreateInvoiceLineItem = async ({
  invoiceId,
  invoiceLineItem,
  adminApiParams,
  queryClient,
}: CreateInvoiceLineItemParams): Promise<
  ConnectedXMResponse<InvoiceLineItem>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<InvoiceLineItem>>(
    `/invoices/${invoiceId}/items`,
    invoiceLineItem
  );
  if (queryClient && data.status === "ok") {
    SET_INVOICE_LINE_ITEM_QUERY_DATA(
      queryClient,
      [invoiceId, data.data.id],
      data
    );
    queryClient.invalidateQueries({
      queryKey: INVOICE_LINE_ITEMS_QUERY_KEY(invoiceId),
    });
    queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEY(invoiceId) });
  }
  return data;
};

export const useCreateInvoiceLineItem = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateInvoiceLineItem>>,
      Omit<CreateInvoiceLineItemParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateInvoiceLineItemParams,
    Awaited<ReturnType<typeof CreateInvoiceLineItem>>
  >(CreateInvoiceLineItem, options, {
    domain: "invoices",
    type: "update",
  });
};

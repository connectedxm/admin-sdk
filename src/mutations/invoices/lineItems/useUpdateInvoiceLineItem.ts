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
 * @category Params
 * @group Invoices-LineItems
 */
export interface UpdateInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  lineItemId: string;
  invoiceLineItem: InvoiceLineItemUpdateInputs;
}

/**
 * @category Methods
 * @group Invoices-LineItems
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<InvoiceLineItem>>(
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

/**
 * @category Mutations
 * @group Invoices-LineItems
 */
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
  >(UpdateInvoiceLineItem, options);
};

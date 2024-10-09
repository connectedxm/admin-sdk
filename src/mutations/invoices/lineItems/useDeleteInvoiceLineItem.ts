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
 * @category Params
 * @group Invoices-LineItems
 */
export interface DeleteInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  lineItemId: string;
}

/**
 * @category Methods
 * @group Invoices-LineItems
 */
export const DeleteInvoiceLineItem = async ({
  invoiceId,
  lineItemId,
  adminApiParams,
  queryClient,
}: DeleteInvoiceLineItemParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
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

/**
 * @category Mutations
 * @group Invoices-LineItems
 */
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

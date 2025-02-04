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
 * @category Params
 * @group Invoices-LineItems
 */
export interface CreateInvoiceLineItemParams extends MutationParams {
  invoiceId: string;
  invoiceLineItem: InvoiceLineItemCreateInputs;
}

/**
 * @category Methods
 * @group Invoices-LineItems
 */
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

/**
 * @category Mutations
 * @group Invoices-LineItems
 */
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

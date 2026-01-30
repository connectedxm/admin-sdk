import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { Invoice, ConnectedXMResponse } from "@src/interfaces";
import { SET_INVOICE_QUERY_DATA, INVOICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Invoices
 */
export interface SendInvoiceParams extends MutationParams {
  invoiceId: string;
}

/**
 * @category Methods
 * @group Invoices
 */
export const SendInvoice = async ({
  invoiceId,
  adminApiParams,
  queryClient,
}: SendInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  if (!invoiceId) throw new Error("Invoice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Invoice>>(
    `/invoices/${invoiceId}/send`
  );
  if (queryClient && data.status === "ok") {
    SET_INVOICE_QUERY_DATA(queryClient, [invoiceId || data.data?.id], data);
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Invoices
 */
export const useSendInvoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof SendInvoice>>,
      Omit<SendInvoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SendInvoiceParams,
    Awaited<ReturnType<typeof SendInvoice>>
  >(SendInvoice, options);
};

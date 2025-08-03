import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Invoice, ConnectedXMResponse } from "@src/interfaces";
import { SET_INVOICE_QUERY_DATA, INVOICES_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Invoices
 */
export interface VoidInvoiceParams extends MutationParams {
  invoiceId: string;
}

/**
 * @category Methods
 * @group Invoices
 */
export const VoidInvoice = async ({
  invoiceId,
  adminApiParams,
  queryClient,
}: VoidInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  if (!invoiceId) throw new Error("Invoice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Invoice>>(
    `/invoices/${invoiceId}/void`
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
export const useVoidInvoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof VoidInvoice>>,
      Omit<VoidInvoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    VoidInvoiceParams,
    Awaited<ReturnType<typeof VoidInvoice>>
  >(VoidInvoice, options, {
    domain: "invoices",
    type: "update",
  });
};

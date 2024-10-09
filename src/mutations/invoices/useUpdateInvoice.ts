import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Invoice, ConnectedXMResponse } from "@src/interfaces";
import { SET_INVOICE_QUERY_DATA, INVOICES_QUERY_KEY } from "@src/queries";
import { InvoiceUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Invoices
 */
export interface UpdateInvoiceParams extends MutationParams {
  invoiceId: string;
  invoice: InvoiceUpdateInputs;
}

/**
 * @category Methods
 * @group Invoices
 */
export const UpdateInvoice = async ({
  invoiceId,
  invoice,
  adminApiParams,
  queryClient,
}: UpdateInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  if (!invoiceId) throw new Error("Invoice ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Invoice>>(
    `/invoices/${invoiceId}`,
    {
      ...invoice,
      id: undefined,
      image: undefined,
      manager: undefined,
      event: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
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
export const useUpdateInvoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateInvoice>>,
      Omit<UpdateInvoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateInvoiceParams,
    Awaited<ReturnType<typeof UpdateInvoice>>
  >(UpdateInvoice, options, {
    domain: "invoices",
    type: "update",
  });
};

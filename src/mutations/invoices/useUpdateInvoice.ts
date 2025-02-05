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
 * Endpoint to update an existing invoice with new data.
 * This function allows users to modify the details of a specific invoice identified by its ID.
 * It ensures that only the necessary fields are updated while maintaining the integrity of the invoice data.
 * @name UpdateInvoice
 * @param {string} invoiceId - The ID of the invoice to be updated
 * @param {InvoiceUpdateInputs} invoice - The invoice data to update
 * @version 1.2
 **/
export interface UpdateInvoiceParams extends MutationParams {
  invoiceId: string;
  invoice: InvoiceUpdateInputs;
}

export const UpdateInvoice = async ({
  invoiceId,
  invoice,
  adminApiParams,
  queryClient,
}: UpdateInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  if (!invoiceId) throw new Error("Invoice ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Invoice>>(
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
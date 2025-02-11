import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INVOICES_QUERY_KEY, INVOICE_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific invoice by its ID.
 * This function allows for the removal of an invoice from the system, ensuring that all related queries are invalidated and removed.
 * It is designed to be used in applications where invoice management is required.
 * @name DeleteInvoice
 * @param {string} invoiceId (path) The ID of the invoice to be deleted
 * @version 1.3
 **/

export interface DeleteInvoiceParams extends MutationParams {
  invoiceId: string;
}

export const DeleteInvoice = async ({
  invoiceId,
  adminApiParams,
  queryClient,
}: DeleteInvoiceParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/invoices/${invoiceId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: INVOICE_QUERY_KEY(invoiceId) });
  }
  return data;
};

export const useDeleteInvoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteInvoice>>,
      Omit<DeleteInvoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteInvoiceParams,
    Awaited<ReturnType<typeof DeleteInvoice>>
  >(DeleteInvoice, options, {
    domain: "invoices",
    type: "del",
  });
};

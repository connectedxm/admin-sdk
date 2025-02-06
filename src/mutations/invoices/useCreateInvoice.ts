import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Invoice, ConnectedXMResponse } from "@src/interfaces";
import { SET_INVOICE_QUERY_DATA, INVOICES_QUERY_KEY } from "@src/queries";
import { InvoiceCreateInputs } from "@src/params";

/**
 * Endpoint to create a new invoice within the system.
 * This function allows users to submit data for a new invoice, which will be processed and stored.
 * It is designed to be used in applications where invoice management is required.
 * @name CreateInvoice
 * @param {InvoiceCreateInputs} invoice (body) - The data for the invoice to be created
 * @version 1.3
**/

export interface CreateInvoiceParams extends MutationParams {
  invoice: InvoiceCreateInputs;
}

export const CreateInvoice = async ({
  invoice,
  adminApiParams,
  queryClient,
}: CreateInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Invoice>>(
    `/invoices`,
    invoice
  );
  if (queryClient && data.status === "ok") {
    SET_INVOICE_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY() });
  }
  return data;
};

export const useCreateInvoice = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateInvoice>>,
      Omit<CreateInvoiceParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateInvoiceParams,
    Awaited<ReturnType<typeof CreateInvoice>>
  >(CreateInvoice, options, {
    domain: "invoices",
    type: "create",
  });
};
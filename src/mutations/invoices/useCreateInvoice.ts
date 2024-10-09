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
 * @category Params
 * @group Invoices
 */
export interface CreateInvoiceParams extends MutationParams {
  invoice: InvoiceCreateInputs;
}

/**
 * @category Methods
 * @group Invoices
 */
export const CreateInvoice = async ({
  invoice,
  adminApiParams,
  queryClient,
}: CreateInvoiceParams): Promise<ConnectedXMResponse<Invoice>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Invoice>>(
    `/invoices`,
    invoice
  );
  if (queryClient && data.status === "ok") {
    SET_INVOICE_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Invoices
 */
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

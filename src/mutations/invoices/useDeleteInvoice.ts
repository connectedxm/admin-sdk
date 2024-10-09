import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { INVOICES_QUERY_KEY, INVOICE_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Invoices
 */
export interface DeleteInvoiceParams extends MutationParams {
  invoiceId: string;
}

/**
 * @category Methods
 * @group Invoices
 */
export const DeleteInvoice = async ({
  invoiceId,
  adminApiParams,
  queryClient,
}: DeleteInvoiceParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/invoices/${invoiceId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: INVOICE_QUERY_KEY(invoiceId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Invoices
 */
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

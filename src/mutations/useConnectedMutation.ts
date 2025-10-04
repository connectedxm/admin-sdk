import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ConnectedXMResponse, useConnectedXM } from "..";
import { AdminApiParams } from "@src/AdminAPI";

export interface MutationParams {
  adminApiParams: AdminApiParams;
  queryClient?: QueryClient;
}

export interface ConnectedXMMutationOptions<TResponseData, TMutationParams>
  extends UseMutationOptions<
    TResponseData,
    AxiosError<TResponseData>,
    TMutationParams
  > {}

export const useConnectedMutation = <
  TMutationParams extends MutationParams,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: (params: TMutationParams) => Promise<TResponseData>,
  options?: Omit<
    ConnectedXMMutationOptions<
      TResponseData,
      Omit<TMutationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  >
) => {
  const { apiUrl, getToken, organizationId, getExecuteAs, onMutationError } =
    useConnectedXM();
  const queryClient = useQueryClient();

  return useMutation<
    TResponseData,
    AxiosError<TResponseData>,
    Omit<TMutationParams, "queryClient" | "adminApiParams">
  >({
    mutationFn: (data) => {
      return mutation({
        queryClient,
        adminApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
        },
        ...data,
      } as TMutationParams);
    },
    ...options,
    onError: (error, variables, onMutateResult, context) => {
      if (onMutationError) onMutationError(error, variables, context);
      if (options?.onError)
        options.onError(error, variables, onMutateResult, context);
    },
  });
};

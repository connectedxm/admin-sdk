import {
  MutationFunction,
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ConnectedXMResponse, useConnectedXM } from "..";
import { ClientApiParams } from "@src/ClientAPI";

export interface MutationParams {
  clientApiParams: ClientApiParams;
  queryClient?: QueryClient;
}

export interface MutationOptions<TResponseData, TMutationParams>
  extends UseMutationOptions<
    TResponseData,
    AxiosError<TResponseData>,
    TMutationParams
  > {}

export const useConnectedMutation = <
  TMutationParams extends MutationParams,
  TResponseData extends ConnectedXMResponse<any>
>(
  mutation: MutationFunction<TResponseData, TMutationParams>,
  options?: Omit<
    MutationOptions<
      TResponseData,
      Omit<TMutationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  >
) => {
  const {
    locale,
    apiUrl,
    getToken,
    organizationId,
    getExecuteAs,
    onMutationError,
  } = useConnectedXM();
  const queryClient = useQueryClient();

  return useMutation<
    TResponseData,
    AxiosError<TResponseData>,
    Omit<TMutationParams, "queryClient" | "clientApiParams">
  >({
    mutationFn: (data) =>
      mutation({
        queryClient,
        clientApiParams: {
          apiUrl,
          getToken,
          organizationId,
          getExecuteAs,
          locale,
        },
        ...data,
      } as TMutationParams),
    ...options,
    onError: (error, variables, context) => {
      if (onMutationError) onMutationError(error, variables, context);
      if (options?.onError) options.onError(error, variables, context);
    },
  });
};

export default useConnectedMutation;

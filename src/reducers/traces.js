// @flow
type Endpoint = {
  serviceName: string,
  ipv4: string
};

type Annotations = {
  timestamp: number,
  value: string,
  endpoint: Endpoint
};

type BinaryAnnotations = {
  key: string,
  value: string,
  endpoint: Endpoint
};

type Trace = {
  traceId: string,
  id: string,
  name: string,
  timestamp: number,
  duration: number,
  annotations: Annotations[],
  binaryAnnotations: BinaryAnnotations[],
  parentId: string,
  loading: boolean,
  error: Error
};

type Action = {
  +type: string,
  payload: Trace
};

type State = { [string]: Trace, loading: boolean };

const reducer = (state: State = { loading: false }, action: Action): State => {
  switch (action.type) {
    case "GET_TRACE_PENDING":
      return {
        loading: true
      };
    case "GET_TRACE_FULFILLED":
      return {
        [action.payload[0].traceId]: action.payload,
        loading: false
      };
    default:
  }

  return state;
};

export default reducer;

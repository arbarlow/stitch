import { createAction } from "redux-actions";
const baseURL = "//localhost:9411/api/v1";

export const getTrace = createAction("GET_TRACE", id =>
  fetch(baseURL + "/trace/" + id).then(r => r.json())
);

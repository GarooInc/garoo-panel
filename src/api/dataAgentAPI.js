import { dataAgentInstance } from "./axios.js";

export const askAgent = () => dataAgentInstance.get(`ask-agent`);


//* Logout en el Backend
// export const logoutRequest = () => axios.post('/auth/logout');

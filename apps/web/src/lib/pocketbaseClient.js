import Pocketbase from 'pocketbase';

const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || "http://localhost:8090";

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };

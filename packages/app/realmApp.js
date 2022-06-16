import Realm from "realm";
import { appId } from './realm.json';


// Invokes the shared instance of the Realm app.
export const app = new Realm.App({ id: appId });

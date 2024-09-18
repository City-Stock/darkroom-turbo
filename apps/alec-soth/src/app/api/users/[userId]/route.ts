import { createUser } from "../(methods)/createUser";
import { getUser } from "./(methods)/getUser";
import { updateUser } from "./(methods)/updateUser";
import { deleteUser } from "./(methods)/deleteUser";

export {
  updateUser as PATCH,
  getUser as GET,
  createUser as POST,
  deleteUser as DELETE,
};

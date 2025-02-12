import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";

export function AddUserButton() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <>
      {showAddUserModal && (
        <AddUserDialog
          user={undefined}
          onClose={() => setShowAddUserModal(false)}
        />
      )}
      <Button type="button" onClick={() => setShowAddUserModal(true)}>
        <PlusIcon />
        Add User
      </Button>
    </>
  );
}

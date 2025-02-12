import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import AddUserDialog from "./AddUserDialog";

export function AddUserButton() {
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setShowAddUserModal(true)}>
        <Flex gap="3" align="center">
          <PlusIcon />
          <span>Add user</span>
        </Flex>
      </Button>
      <AddUserDialog
        open={showAddUserModal}
        user={undefined}
        onOpenChange={setShowAddUserModal}
      />
    </>
  );
}

import { Button } from "@radix-ui/themes";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import AddRoleDialog from "./AddRoleDialog";

export default function AddRoleButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setShowModal(true)}>
        <PlusIcon />
        Add role
      </Button>
      <AddRoleDialog open={showModal} onOpenChange={setShowModal} />
    </>
  );
}

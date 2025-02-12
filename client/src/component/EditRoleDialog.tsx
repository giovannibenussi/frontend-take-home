import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { RoleType, updateRole } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LoadingSR } from "./LoadingSR";

export function EditRoleDialog({
  role,
  onClose,
}: {
  role: RoleType;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);

  const { data, mutate, status } = useMutation({
    mutationFn: () => updateRole(role.id, { description, name }),
    onSuccess: (data) => {
      if (!data.success) {
        return;
      }

      onClose();
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return (
    <Dialog.Root open onOpenChange={() => onClose()}>
      <Dialog.Content maxWidth="485px">
        <Dialog.Title mt="1">Edit {role.name} role</Dialog.Title>

        <Flex gap="3" mt="4" direction="column">
          <label className="flex flex-col gap-1">
            <Text weight="bold">Name</Text>
            <TextField.Root
              placeholder="Name of the role"
              defaultValue={role.name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <Text weight="bold">Description</Text>
            <TextArea
              placeholder="Description of the role"
              defaultValue={role.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </Flex>

        {data?.message && (
          <Text size="2" color="red">
            {data?.message}
          </Text>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={status === "pending"}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            variant="surface"
            onClick={() => mutate()}
            loading={status === "pending"}
          >
            Save changes
          </Button>
          <LoadingSR loading={status === "pending"} />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

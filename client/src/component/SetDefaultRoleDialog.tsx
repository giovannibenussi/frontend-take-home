import { Button, Dialog, Flex, Strong } from "@radix-ui/themes";
import { RoleType, updateRole } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingSR } from "./LoadingSR";

export function SetDefaultRoleDialog({
  open,
  role,
  onOpenChange,
}: {
  open: boolean;
  role: RoleType;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: () => updateRole(role.id, { isDefault: true }),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="485px">
        <Dialog.Title mt="1">Set role as default</Dialog.Title>
        <Dialog.Description size="2" mb="3">
          Are you sure? The role <Strong>{role.name}</Strong> will be set by
          default when creating new users unless specified otherwise.
        </Dialog.Description>

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
            Set as default
          </Button>
          <LoadingSR loading={status === "pending"} />
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

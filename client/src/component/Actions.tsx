import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";

export function Actions({
  actions,
  label,
  onValueChange,
}: {
  actions: Array<{ label: string; action: string; disabled?: boolean }>;
  label: string;
  onValueChange: (action: string) => void;
}) {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="ghost" radius="full" color="gray">
            <span className="sr-only">{label}</span>
            <DotsHorizontalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="bottom" align="end">
          {actions.map((action) => (
            <DropdownMenu.Item
              key={action.label}
              onClick={() => !action.disabled && onValueChange(action.action)}
              disabled={action.disabled}
              className="!pr-11 !pl-2 -mt-[2px]"
            >
              {action.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

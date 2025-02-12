import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";

export function ErrorCallout({ content }: { content: string }) {
  return (
    <Callout.Root color="red">
      <Callout.Icon>
        <CrossCircledIcon />
      </Callout.Icon>
      <Callout.Text>{content}</Callout.Text>
    </Callout.Root>
  );
}

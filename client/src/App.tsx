import { Tabs } from "@radix-ui/themes";
import { Users } from "./component/Users";
import { Roles } from "./component/Roles";

function App() {
  return (
    <div className="w-full max-w-[850px] mx-auto">
      <Tabs.Root defaultValue="users" className="flex flex-col gap-6">
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users">
          <Users />
        </Tabs.Content>

        <Tabs.Content value="roles">
          <Roles />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

export default App;

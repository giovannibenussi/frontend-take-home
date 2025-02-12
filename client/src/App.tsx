import { Tabs, Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Users } from "./component/Users";
import { Roles } from "./component/Roles";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme grayColor="gray" accentColor="iris" panelBackground="translucent">
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
      </Theme>
    </QueryClientProvider>
  );
}

export default App;

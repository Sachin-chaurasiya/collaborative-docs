import { useOthers, useSelf } from '@liveblocks/react/suspense';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className="flex py-[0.75rem]">
      {users.map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} name={info.name} color={info.color} />
        );
      })}

      {currentUser && (
        <div className="relative ml-8 first:ml-0">
          <Avatar color={currentUser.info.color} name={currentUser.info.name} />
        </div>
      )}
    </div>
  );
}

export function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex place-content-center relative border-4 border-white rounded-full w-[42px] h-[42px] bg-[#9ca3af] ml-[-0.75rem]">
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white"
              style={{ background: color }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

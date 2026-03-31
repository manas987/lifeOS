import type { DragEndEvent } from "@dnd-kit/core";

export type Tasktype = {
  id: number;
  title: string;
  completed: boolean;
  duedate?: string;
  project?: string;
};

export type TaskProps = {
  title: string;
  duedate?: string;
  projectname?: string;
  showProject?: boolean;
  completed?: boolean;
  onClick?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  isediting?: boolean;
  onDelete?: () => void;
  id: number;
  openedit?: () => void;
  edit?: (newtitle: string, newduedate: string | undefined) => void;
};

export type SideBarProps = {
  addtask: (title: string, duedate?: Date, currentlyon?: string) => void;
  addproj: (title: string) => void;
  deleteproj: (title: string) => void;
  editproj: (newtitle: string, oldtitle: string) => void;
  projlist: string[];
  currentlyon: string | undefined;
};

export type TasksContextType = {
  edittask: (id: number, newtitle: string, newduedate?: Date) => void;
  open: number | null;
  setOpen: (id: number | null) => void;
  editingid: number | null;
  seteditingid: (id: number | null) => void;
  deleteundo: Tasktype | null;
  setdeleteundo: (task: Tasktype | null) => void;
  taskslist: Tasktype[];
  settasks: (tasks: Tasktype[] | ((prev: Tasktype[]) => Tasktype[])) => void;
  addtask: (title: string, duedate?: Date, projname?: string) => void;
  toggletask: (id: number) => void;
  deleteTask: (id: number) => void;
  undodelete: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
  HandelReorder: (event: DragEndEvent) => void;
  sensors: ReturnType<typeof import("@dnd-kit/core").useSensors>;
  projlist: string[];
  addproj: (newproj: string) => void;
  deleteproj: (delproj: string) => void;
  editproj: (newprojname: string, oldprojname: string) => void;
};

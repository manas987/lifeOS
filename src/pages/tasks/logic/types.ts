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
  addtask: (title: string, duedate?: Date) => void;
};

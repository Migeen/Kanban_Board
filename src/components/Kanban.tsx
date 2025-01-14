import { useMemo, useState } from "react"
import PlusIcons from "../icons/PlusIcons"
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Task } from "../types";

const Kanban = () => {

    const [columns, setColumns] = useState<Column[]>([]);
    const columnId = useMemo(() => columns.map((col) => col.id),
        [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3 // 3px
        }
    }))

    function createNewColumn() {
        const columnToAdd = {
            id: generateId(),
            title: `Column ${columns.length}`
        }

        setColumns([...columns, columnToAdd]);
    }

    function generateId() {
        //  Generate a random number from 1 to 10000
        return Math.floor(Math.random() * 10001);
    }

    function deleteColumn(id: Id) {
        const filteredColumn = columns.filter((col) => col.id !== id);
        setColumns(filteredColumn);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return { ...col, title };
        });
        setColumns(newColumns);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id){
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    }
    
    function updateTask(id: Id, content: string){
        const newTasks = tasks.map((task) => {
         if  ( task.id !== id) return task;
         return {...task, content};
        });
        setTasks(newTasks);
    }


    function onDragStart(event: DragStartEvent) {
        console.log("Drag Start", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }


    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;
        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(
                col => col.id === activeColumnId
            );

            const overColumnIndex = columns.findIndex(
                col => col.id === overColumnId
            );

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    return (
        <div className="
        m-auto
        flex
        min-h-screen
        w-full
        justify-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        "
        >
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}>
                <div className="m-auto flex gap-2">
                    <div className="flex gap-4">
                        <SortableContext items={columnId}>
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === col.id)}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    />
                            ))
                            }
                        </SortableContext>
                    </div>
                    <button className="h-[60px] 
        w-[350px]
        min-w-[350px]
        cursor-pointer
        rounded-lg
        bg-mainBackgroundColor
        border-2
        border-columnBackgroundColor
        p-4
        ring-rose-500
        hover:ring-2
        flex
        gap-2
        "
                        onClick={() => createNewColumn()}
                    >
                        <PlusIcons />Add Column
                    </button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && <ColumnContainer
                        column={activeColumn}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask} 
                        tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        
                    />}
                </DragOverlay>,
                    document.body)}
            </DndContext>
        </div>
    )
}

export default Kanban
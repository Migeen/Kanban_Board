import { useState } from "react"
import PlusIcons from "../icons/PlusIcons"
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";

const Kanban = () => {

    const [columns, setColumns] = useState<Column[]>([]);
    console.log(columns);

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
            <div className="m-auto flex gap-2">
                <div className="flex gap-2">
                    {columns.map((col) => (
                        <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}/>
                    ))
                    }
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
        </div>
    )
}

export default Kanban
import { createContext, useContext } from "react";

export const TasksContext = createContext();
// TaskContext nos facilita el acceso a los datos del Provider, en este caso solo con importar useTasks ya disponemos de {}
export const useTasks = () => {
    const context = useContext(TasksContext)
    if (!context) throw new Error("useTasks must be used within an TasksProvider")
    return context
}

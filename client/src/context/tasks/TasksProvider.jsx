import { useState, useEffect } from 'react'

import { TasksContext } from './TasksContext'
import {
    createTaskRequest,
    getTasksRequest,
    deleteTaskRequest,
    getTaskRequest,
    updateTaskRequest

} from '../../api/tasks.routes'

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])

    const getTasks = async () => {
        try {
            const res = await getTasksRequest()
            setTasks(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const createTask = async (task) => {
        try {
            const res = await createTaskRequest(task)
            // AÑADIR LA TAREA AL setTasks PARA PODER VER UNA LISTA MIENTRAS SE AÑADEN NUEVAS TAREAS
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTask = async (id) => {
        try {
            const res = await deleteTaskRequest(id)
            res.request.status === 204 && setTasks(tasks.filter(task => task._id != id))
        } catch (error) {
            console.log(error)
        }
    }

    const getTask = async (id) => {
        try {
            const res = await getTaskRequest(id)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const updateTask = async (id, task) => {
        try {
            const res = await updateTaskRequest(id, task)
            // console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <TasksContext.Provider value={{ tasks, setTasks, createTask, getTasks, deleteTask, getTask, updateTask }}>
            {children}
        </TasksContext.Provider>
    )
}

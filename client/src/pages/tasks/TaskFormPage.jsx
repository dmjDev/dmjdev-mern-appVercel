import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import { useTasks } from "../../context/tasks/TasksContext"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'; // Es importante añadir el .js en algunos entornos ESM
// Activar el plugin
dayjs.extend(utc);

const TaskFormPage = () => {
    const { tasks, getTasks, setTasks, createTask, getTask, updateTask } = useTasks()
    const { register, handleSubmit, setFocus, setValue, formState: { errors } } = useForm()
    const formularioRef = useRef(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getTasks()
    }, [])

    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                const task = await getTask(params.id)
                setValue('title', task.title)
                setValue('description', task.description)
                setValue('date', dayjs.utc(task.date).format('YYYY-MM-DD'))
            } else {
                const hoy = new Date()
                const year = hoy.getFullYear()
                const month = String(hoy.getMonth() + 1).padStart(2, '0')
                const day = String(hoy.getDate()).padStart(2, '0')
                setValue('date', `${year}-${month}-${day}`)
                setValue('title', '')
                setValue('description', '')
            }
        }
        loadTask()
    }, [params])

    const clearFrom = () => {
        formularioRef.current.reset()
        const hoy = new Date()
        const year = hoy.getFullYear()
        const month = String(hoy.getMonth() + 1).padStart(2, '0')
        const day = String(hoy.getDate()).padStart(2, '0')
        setValue('date', `${year}-${month}-${day}`)
        setFocus("title")
    }

    const onSubmit = handleSubmit(async (data) => {
        let taskDate = undefined
        data.date != '' && (taskDate = data.date)
        if (params.id) {
            await setTasks([])
            await updateTask(params.id, {
                ...data,
                date: dayjs.utc(taskDate).toISOString()
            })

            navigate('/tasks')
        } else {
            await setTasks([])
            await createTask({
                ...data,
                date: dayjs.utc(taskDate).toISOString()
            })

            clearFrom()
        }
        getTasks()
    })

    const jsxml =
        <div className="containerTasks">
            <div className="tasksList">
                {tasks.length === 0 ? (
                    <p>Empty tasks box</p>
                ) : (
                    [...tasks].reverse().map((task, index) => (
                        <p key={task.id || index}>
                            {`${task.title} - ${tasks.length - index}`}
                        </p>
                    ))
                )}
            </div>
            <div className="taskForm">
                <h1 className="taskFormTitle"><p>{params.id ? 'Edit task' : 'Add task'}</p><button onClick={clearFrom} className="circleButton">Clear</button></h1>
                <form onSubmit={onSubmit} ref={formularioRef} noValidate>
                    <div className="input-container">
                        <input
                            type="text"
                            id="title"
                            placeholder="The task title"
                            autoFocus
                            className='inputForm'
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} 
                            {...register('title', { required: true })}
                        />
                        <label htmlFor="title">The task title{errors.title && (<span className='input-error'> : Title is required</span>)}</label>
                    </div>
                    <div className="input-container">
                        <textarea
                            id="desciption"
                            cols="30"
                            rows="10"
                            placeholder="Describe the task"
                            className='inputForm'
                            {...register('description', { required: false })}
                        ></textarea>
                        <label htmlFor="description">Describe the task</label>
                    </div>
                    <div className="input-container">
                        <input
                            type="date"
                            className='inputForm'
                            {...register('date')}
                        />
                        <label htmlFor="date">The task Date</label>
                    </div>
                    <button
                        type="submit"
                        className='formButton'
                    >Save Task</button>
                </form>
            </div>
        </div>

    return jsxml
}

export default TaskFormPage

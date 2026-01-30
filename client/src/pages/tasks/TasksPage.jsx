import { useEffect } from "react"

import { useTasks } from "../../context/tasks/TasksContext"
import CardComponent_sm from '../../components/CardComponent_sm'

const TasksPage = () => {
    const { getTasks, tasks } = useTasks()

    useEffect(() => {
        getTasks()
    }, [])

    const jsxml =
        <div className="tasksPageStyle">
            {
                tasks.map(task => (
                    <CardComponent_sm itemCard={task} key={task._id} />
                ))
            }
        </div>

    return jsxml
}

export default TasksPage

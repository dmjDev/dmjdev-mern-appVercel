import { Link } from 'react-router-dom'

import { TextComponent } from "./TextComponent"
import { useTasks } from "../context/tasks/TasksContext"

const CardComponent_sm = ({ itemCard }) => {
    const { deleteTask: deleteItemCard } = useTasks()
    const linkEdit = 'tasks'

    const delProced = () => {
        const del = confirm(`Are you sure you want to delete this item? This action cannot be undone. \n ${itemCard.title}`)
        del && deleteItemCard(itemCard._id)
    }

    const jsxml = 
        <div className="containerCard">
            <div className="containerButtonCard">
                <a onClick={() => {
                    delProced()
                }} className="linkStyle-lg group">
                    Delete
                    <span className="decoLinkStyle"></span>
                </a><p className="text-sm">●</p>
                <Link to={`/${linkEdit}/${itemCard._id}`} className="linkStyle-lg group" title='Edit item'>
                    Edit
                    <span className="decoLinkStyle"></span>
                </Link>
            </div>
            <h1 className="cardTitle">{itemCard.title}</h1>
            <p className="cardDate">{new Date(itemCard.date).toLocaleDateString()}</p>
            <TextComponent text={itemCard.description} />
        </div>

    return jsxml
}

export default CardComponent_sm

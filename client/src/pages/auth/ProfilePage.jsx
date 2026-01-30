import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { FaPencilAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa"
import { RiLockPasswordFill } from "react-icons/ri"
import { TbPointFilled } from "react-icons/tb"
import { MdHomeWork, MdPhotoCamera } from "react-icons/md"

import { useAuth } from "../../context/auth/AuthContext"
import ModalUploadForm from '../../components/ModalUploadForm'
import ImageUploadForm from "../../components/ImageUploadForm"
import ProtectedImage from '../../components/ProtectedImage'
import PassUploadForm from '../../components/PassUploadForm'

const ProfilePage = () => {
    const [dataUser, setDataUser] = useState(null)
    const [modal, setModal] = useState(null)
    const [modalImg, setModalImg] = useState(false)
    const [modalPass, setModalPass] = useState(false)
    const [userStrRol, setUserStrRol] = useState(null)
    const { getUser, updateUser, loading, errors: profileErrors, imgAvatar, setImgAvatar, responseOkUser } = useAuth()
    const params = useParams()

    useEffect(() => {
        async function loadUser() {
            // Extraemos la información GET del id de usuario mediante useParams(), enviado desde Route en App.js
            if (params.id) {
                const res = await getUser(params.id)
                setDataUser(res.user)
                setUserStrRol(res.rol.rolName)

                // Definimos la url de imgAvatar
                const timestamp = Date.now()
                setImgAvatar(`${params.id}.jpg?${timestamp}`)   // cambio de estado de imgAvatar mediante ProtectedImage
            }
        }
        loadUser()
    }, [params])

    // Abre cada una de las ventanas que permiten modificar los datos de usuario y añade a MODAL de que input se trata para montarlo, es decir si se ha hecho clic sobre email, username, phone, ... todos los datos necesarios para que en la ventana se muestre el campo a modificar
    const openModal = (field, fieldText) => {
        setModal({ field, value: dataUser[field], text: fieldText })
    }
    // Modifica el dato introducido en la ventana MODAL anterior en la lista de datos de usuario DATAUSER cargada en el useEffect inicial
    const saveField = (field, value) => {
        setDataUser((prev) => ({ ...prev, [field]: value }))
    }
    // PUT de la información de DATAUSER al router del BACKEND auth.routes con dirección de enlace '/profile/:id' a traves de updateUser
    const saveDataUser = () => {
        updateUser(dataUser)
    }

    const openModalImg = () => {
        setModalImg(true)
    }
    const openModalPass = () => {
        setModalPass(true)
    }

    const jsxml =
        <div className="profile-container">
            {dataUser && (
                <div className="profile-card">
                    <div className="profile-header">
                        <div>
                            <ProtectedImage
                                filename={imgAvatar}
                                alt="User Profile"
                                className="profile-avatar"
                            />
                            <button onClick={() => openModalImg(dataUser._id)} className="profile-edit-btn">
                                <MdPhotoCamera />
                            </button>
                        </div>
                        <div>
                            <div className="flex w-full" title="Username">
                                <h1 className="profile-title">{dataUser.username}<sup className="font-extralight text-sm">{userStrRol}</sup></h1>
                                <button onClick={() => openModal("username", "Username")} className="profile-edit-btn">
                                    <FaPencilAlt />
                                </button>
                            </div>
                            <p className="profile-subtitle">{new Date(dataUser.createdAt).toLocaleDateString()}</p>
                            {
                                // Si modalImg y modalPass son FALSE, muestra errors de AUTHCONTEXT renombrados aquí como profileErrors, map porque puede ser una array de varios errores
                                !modalImg && !modalPass &&
                                profileErrors?.map((error, i) => (
                                    <div className='authErrors' key={i}>
                                        {error}
                                    </div>
                                ))
                            }
                            {
                                // Mostramos si ha habido éxito en la gestión de los datos
                                responseOkUser &&
                                <div className='authErrors' style={{ backgroundColor: "green" }}>
                                    {responseOkUser}
                                </div>
                            }
                        </div>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field" title="Name & Surname">
                            <div className="profile-field-left">
                                <FaUser />
                                <span>{dataUser.fullName}</span>
                            </div>
                            <button onClick={() => openModal("fullName", "Name & Surname")} className="profile-edit-btn">
                                <FaPencilAlt />
                            </button>
                        </div>


                        <div className="profile-field" title="Email address">
                            <div className="profile-field-left">
                                <FaEnvelope />
                                <span>{dataUser.email}</span>
                            </div>
                            <button onClick={() => openModal("email", "Email address")} className="profile-edit-btn">
                                <FaPencilAlt />
                            </button>
                        </div>

                        <div className="profile-field" title="Phone number">
                            <div className="profile-field-left">
                                <FaPhone />
                                <span>{dataUser.phone}</span>
                            </div>
                            <button onClick={() => openModal("phone", "Phone number")} className="profile-edit-btn">
                                <FaPencilAlt />
                            </button>
                        </div>

                        <div className="profile-field" title="Company name">
                            <div className="profile-field-left">
                                <MdHomeWork />
                                <span>{dataUser.company}</span>
                            </div>
                            <button onClick={() => openModal("company", "Company name")} className="profile-edit-btn">
                                <FaPencilAlt />
                            </button>
                        </div>
                        <button type='button' className='formButton' onClick={saveDataUser}>Save</button>

                        <hr />
                        <div className="profile-field" title="Password">
                            <div className="profile-field-left">
                                <RiLockPasswordFill />
                                <span className="flex flex-nowrap">{[...Array(12)].map((_, i) => (<TbPointFilled key={i} />))}</span>
                            </div>
                            <button onClick={() => openModalPass()} className="profile-edit-btn">
                                <FaPencilAlt />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modal && (
                <ModalUploadForm
                    field={modal.field}
                    value={modal.value}
                    text={modal.text}
                    onSave={(val) => saveField(modal.field, val)}
                    onClose={() => setModal(null)}
                />
            )}
            {modalImg && (
                <ImageUploadForm
                    userId={dataUser._id}
                    onClose={() => setModalImg(false)}
                />
            )}
            {modalPass && (
                <PassUploadForm
                    userId={dataUser._id}
                    password={dataUser.password}
                    onClose={() => setModalPass(false)}
                />
            )}
        </div>

    const jsxmlLoading =
        <div className="containerLoad">
            <div className="subContainerLoad">
                <h1 className="loadText">Loading...</h1>
            </div>
        </div>

    if (loading) {
        return jsxmlLoading
    }

    return jsxml
}

export default ProfilePage
